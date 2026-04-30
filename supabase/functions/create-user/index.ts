import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type TenantRole =
  | "super_admin"
  | "school_admin"
  | "branch_admin"
  | "teacher"
  | "student"
  | "parent";

type UserRoleRow = {
  role: string;
  tenant_role: TenantRole | null;
  school_id: string | null;
  branch_id: string | null;
};

const CREATION_RULES: Record<TenantRole, TenantRole[]> = {
  super_admin: ["school_admin"],
  school_admin: ["branch_admin", "teacher"],
  branch_admin: ["teacher", "student"],
  teacher: [],
  student: [],
  parent: [],
};

const BASE_ROLE_BY_TENANT_ROLE: Record<TenantRole, string> = {
  super_admin: "admin",
  school_admin: "admin",
  branch_admin: "admin",
  teacher: "teacher",
  student: "student",
  parent: "parent",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller } } = await supabase.auth.getUser(token);
    if (!caller) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const {
      email,
      password,
      role,
      tenant_role,
      school_id: inputSchoolId,
      branch_id,
      is_primary,
      meta,
      skip_domain_insert,
      teacher_id,
      student_id,
    } = await req.json();

    let school_id = inputSchoolId;

    const requestedTenantRole = (tenant_role || role) as TenantRole | undefined;

    if (!email || !password || !requestedTenantRole) {
      return new Response(JSON.stringify({ error: "email, password, and role/tenant_role are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedRole = BASE_ROLE_BY_TENANT_ROLE[requestedTenantRole];

    const { data: roleCheck } = await supabase
      .from("user_roles")
      .select("role, tenant_role, school_id, branch_id")
      .eq("user_id", userId)
      .eq("is_primary", true)
      .single();

    if (!roleCheck) return new Response(JSON.stringify({ error: "User role not found" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    let resolvedTenantRole = roleCheck.tenant_role;
    // Handle legacy records where school_admin/branch_admin got incorrectly migrated to 'student'
    if (!resolvedTenantRole || resolvedTenantRole === "student") {
      if (roleCheck.role === "school_admin") resolvedTenantRole = "school_admin";
      else if (roleCheck.role === "branch_admin") resolvedTenantRole = "branch_admin";
      else if (roleCheck.role === "admin") resolvedTenantRole = "super_admin";
      else if (roleCheck.role === "teacher") resolvedTenantRole = "teacher";
      else if (roleCheck.role === "parent") resolvedTenantRole = "parent";
      else resolvedTenantRole = "student";
    }
    const callerRole = resolvedTenantRole as TenantRole;
    const allowedTargets = CREATION_RULES[callerRole] || [];

    if (!allowedTargets.includes(requestedTenantRole)) {
      return new Response(JSON.stringify({ error: `${callerRole} cannot create ${requestedTenantRole} users` }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerScope = roleCheck as UserRoleRow;

    if (callerRole === "super_admin") {
      if (requestedTenantRole !== "school_admin") {
        return new Response(JSON.stringify({ error: "Superadmin can only create schooladmin users" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!school_id) {
        return new Response(JSON.stringify({ error: "school_id is required for schooladmin users" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    if (callerRole === "school_admin") {
      if (!callerScope.school_id || school_id !== callerScope.school_id) {
        return new Response(JSON.stringify({ error: "Schooladmin can only create users inside their assigned school" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!["branch_admin", "teacher"].includes(requestedTenantRole)) {
        return new Response(JSON.stringify({ error: "Schooladmin can only create branchadmin or teacher users" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!branch_id) {
        return new Response(JSON.stringify({ error: "branch_id is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: branch, error: branchError } = await supabase
        .from("branches")
        .select("id, school_id")
        .eq("id", branch_id)
        .single();
      if (branchError || !branch) {
        return new Response(JSON.stringify({ error: "Invalid branch_id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (branch.school_id !== callerScope.school_id) {
        return new Response(JSON.stringify({ error: "Branch does not belong to your school" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Override school_id with caller's school_id
      school_id = callerScope.school_id;
    }

    if (callerRole === "branch_admin") {
      if (!callerScope.school_id || !callerScope.branch_id) {
        return new Response(JSON.stringify({ error: "Branchadmin scope is not configured" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!["teacher", "student"].includes(requestedTenantRole)) {
        return new Response(JSON.stringify({ error: "Branchadmin can only create teacher or student users" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (school_id !== callerScope.school_id || branch_id !== callerScope.branch_id) {
        return new Response(JSON.stringify({ error: "Branchadmin can only create users inside their assigned branch" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) throw createError;

    const userId = newUser.user.id;

    // Build user_roles insert with multi-tenant fields
    const displayName = meta?.name || email;
    const roleInsert: Record<string, any> = {
      user_id: userId,
      role: normalizedRole,
      email,
      name: displayName,
      tenant_role: requestedTenantRole,
    };
    if (school_id !== undefined) roleInsert.school_id = school_id;
    if (branch_id !== undefined) roleInsert.branch_id = branch_id;
    if (is_primary !== undefined) roleInsert.is_primary = is_primary;

    const { error: roleInsertError } = await supabase.from("user_roles").insert(roleInsert);
    if (roleInsertError) {
      throw new Error(`Failed to insert user_roles: ${roleInsertError.message}`);
    }

    // Handle domain-specific table inserts for teacher and student roles
    console.log("Domain insert check:", { skip_domain_insert, normalizedRole, teacher_id, student_id, userId });
    if (skip_domain_insert && normalizedRole === "teacher" && teacher_id) {
      // Teacher record already created by form, no update needed
      console.log(`Teacher ${teacher_id} already created by form`);
    } else if (skip_domain_insert && normalizedRole === "student" && student_id) {
      // Update existing student record with auth user_id (form already created the record)
      console.log(`Updating student ${student_id} with user_id ${userId}`);
      const { data: studentUpdateData, error: studentUpdateError } = await supabase.from("students").update({
        user_id: userId,
      }).eq("id", student_id).select();
      console.log("Student update result:", { data: studentUpdateData, error: studentUpdateError });
      if (studentUpdateError) {
        console.error("Student update error:", studentUpdateError);
        throw new Error(`Failed to update student user_id: ${studentUpdateError.message}`);
      }
      console.log("Student updated successfully");
    } else if (!skip_domain_insert) {
      if (normalizedRole === "teacher") {
        const { error: teacherError } = await supabase.from("teachers").insert({
          name: meta?.name || email,
          email,
          school_id: school_id || null,
          branch_id: branch_id || null,
          avatar_emoji: meta?.avatar_emoji || "👨‍🏫",
        });
        if (teacherError) {
          throw new Error(`Failed to insert teacher: ${teacherError.message}`);
        }
      } else if (normalizedRole === "student") {
      if (!meta?.rollNumber || !meta?.classId) {
        throw new Error("Student creation requires meta.studentId or both meta.rollNumber and meta.classId");
      }
      await supabase.from("students").insert({
        name: meta?.name || email,
        email,
        user_id: userId,
        school_id: school_id || null,
        branch_id: branch_id || null,
        roll_number: meta.rollNumber,
        class_id: meta.classId,
        section: meta.section || "A",
        total_points: 0,
        qr_code: crypto.randomUUID(),
        avatar_emoji: meta?.avatar_emoji || "🎓",
      });
    } else if (normalizedRole === "parent") {
      await supabase.from("parents").insert({
        user_id: userId,
        name: meta?.name || email,
        email,
        phone: meta?.phone || null,
      });
      const studentIds = Array.isArray(meta?.studentIds)
        ? meta.studentIds
        : meta?.studentId
          ? [meta.studentId]
          : [];
      const uniqueStudentIds = [...new Set(studentIds.filter(Boolean))];
      if (uniqueStudentIds.length > 0) {
        await supabase.from("parent_student_links").insert(
        uniqueStudentIds.map((studentId: any) => ({
            parent_user_id: userId,
            student_id: studentId,
          }))
        );
      }
    }
    }

    return new Response(JSON.stringify({ userId }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

});
