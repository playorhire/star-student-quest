import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    // Allow admins (role='admin' covers old admin, school_admin, super_admin) or explicit super_admin
    const { data: roleCheck } = await supabase
      .from("user_roles")
      .select("role,tenant_role")
      .eq("user_id", caller.id)
      .or("role.eq.admin,tenant_role.eq.super_admin")
      .maybeSingle();
    if (!roleCheck) return new Response(JSON.stringify({ error: "Admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { email, password, role, tenant_role, school_id, branch_id, is_primary, meta } = await req.json();

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) throw createError;

    const userId = newUser.user.id;

    // Build user_roles insert with multi-tenant fields
    const roleInsert: Record<string, any> = { user_id: userId, role };
    if (tenant_role !== undefined) roleInsert.tenant_role = tenant_role;
    if (school_id !== undefined) roleInsert.school_id = school_id;
    if (branch_id !== undefined) roleInsert.branch_id = branch_id;
    if (is_primary !== undefined) roleInsert.is_primary = is_primary;
    await supabase.from("user_roles").insert(roleInsert);

    if (role === "teacher" && meta?.teacherId) {
      await supabase.from("teachers").update({ user_id: userId }).eq("id", meta.teacherId);
    } else if (role === "student" && meta?.studentId) {
      await supabase.from("students").update({ user_id: userId }).eq("id", meta.studentId);
    } else if (role === "teacher") {
      await supabase.from("teachers").insert({ name: meta?.name || email, email, user_id: userId, school_id: school_id || null });
    } else if (role === "parent") {
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
          uniqueStudentIds.map((studentId: string) => ({
            parent_user_id: userId,
            student_id: studentId,
          }))
        );
      }
    }

    return new Response(JSON.stringify({ userId }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
