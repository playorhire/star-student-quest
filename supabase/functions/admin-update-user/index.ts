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

type RoleRow = {
  role: string;
  tenant_role: TenantRole | null;
  school_id: string | null;
  branch_id: string | null;
};

const MANAGEMENT_RULES: Record<TenantRole, TenantRole[]> = {
  super_admin: ["school_admin"],
  school_admin: ["branch_admin", "teacher"],
  branch_admin: ["teacher", "student", "parent"],
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing or invalid authorization token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller } } = await supabase.auth.getUser(token);
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const { targetUserId, email, password, selfUpdate, deleteUser, name } = body;

    const { data: callerRoleData } = await supabase
      .from("user_roles")
      .select("role, tenant_role, school_id, branch_id")
      .eq("user_id", caller.id)
      .eq("is_primary", true)
      .single();

    const callerRole = ((callerRoleData?.tenant_role || (callerRoleData?.role === "admin" ? "super_admin" : callerRoleData?.role)) as TenantRole | undefined);

    if (!selfUpdate) {
      if (!callerRole) {
        return new Response(JSON.stringify({ error: "Unauthorized role" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const userIdToCheck = targetUserId;
      if (!userIdToCheck) {
        return new Response(JSON.stringify({ error: "Missing target user id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: targetRoleData } = await supabase
        .from("user_roles")
        .select("role, tenant_role, school_id, branch_id")
        .eq("user_id", userIdToCheck)
        .eq("is_primary", true)
        .single();

      const targetRole = ((targetRoleData?.tenant_role || (targetRoleData?.role === "admin" ? "super_admin" : targetRoleData?.role)) as TenantRole | undefined);

      if (!targetRole) {
        return new Response(JSON.stringify({ error: "Target user role not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const allowedTargets = MANAGEMENT_RULES[callerRole] || [];
      if (!allowedTargets.includes(targetRole)) {
        return new Response(JSON.stringify({ error: `${callerRole} cannot manage ${targetRole} users` }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const callerScope = callerRoleData as RoleRow;
      const targetScope = targetRoleData as RoleRow;

      if (callerRole === "school_admin" && callerScope.school_id !== targetScope.school_id) {
        return new Response(JSON.stringify({ error: "Schooladmin can only manage users in their school" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (callerRole === "branch_admin" && (
        callerScope.school_id !== targetScope.school_id ||
        callerScope.branch_id !== targetScope.branch_id
      )) {
        // Parents are not branch-scoped in user_roles. Allow if they have a
        // linked student in the branch admin's branch.
        if (targetRole === "parent") {
          const { data: linkedInBranch } = await supabase
            .from("parent_student_links")
            .select("student_id, students!inner(branch_id)")
            .eq("parent_user_id", userIdToCheck)
            .eq("students.branch_id", callerScope.branch_id)
            .limit(1);
          if (!linkedInBranch || linkedInBranch.length === 0) {
            return new Response(JSON.stringify({ error: "Branch admin can only manage parents linked to students in their branch" }), {
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        } else {
          return new Response(JSON.stringify({ error: "Branch admin can only manage users in their branch" }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    }

    const userIdToUpdate = selfUpdate ? caller.id : targetUserId;
    if (!userIdToUpdate) {
      return new Response(JSON.stringify({ error: "Missing target user id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Handle delete user
    if (deleteUser) {
      const { error } = await supabase.auth.admin.deleteUser(userIdToUpdate);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const updates: Record<string, any> = {};
    if (email) updates.email = email;
    if (password) updates.password = password;

    // Update auth user if email/password changed
    if (Object.keys(updates).length > 0) {
      const { error } = await supabase.auth.admin.updateUserById(userIdToUpdate, updates);
      if (error) throw error;
    }

    // Mirror email/name to user_roles and profile tables when applicable
    if (email || name) {
      const roleUpdates: Record<string, any> = {};
      if (email) roleUpdates.email = email;
      if (name) roleUpdates.name = name;
      await supabase.from("user_roles").update(roleUpdates).eq("user_id", userIdToUpdate);
    }

    // Ensure role is set to "admin" for super_admin, school_admin, and branch_admin users
    const { data: targetRoleDataCheck } = await supabase
      .from("user_roles")
      .select("tenant_role")
      .eq("user_id", userIdToUpdate)
      .eq("is_primary", true)
      .single();

    if (targetRoleDataCheck?.tenant_role) {
      const normalizedRole = BASE_ROLE_BY_TENANT_ROLE[targetRoleDataCheck.tenant_role as TenantRole];
      if (normalizedRole) {
        await supabase.from("user_roles").update({ role: normalizedRole }).eq("user_id", userIdToUpdate);
      }
    }

    if (email) {
      await supabase.from("teachers").update({ email }).eq("user_id", userIdToUpdate);
      await supabase.from("parents").update({ email }).eq("user_id", userIdToUpdate);
      await supabase.from("students").update({ email }).eq("user_id", userIdToUpdate);
    }

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
