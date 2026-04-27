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

    const { data: roleCheck } = await supabase
      .from("user_roles")
      .select("role, tenant_role, school_id, branch_id")
      .eq("user_id", caller.id)
      .eq("is_primary", true)
      .single();

    const callerRole = ((roleCheck?.tenant_role || (roleCheck?.role === "admin" ? "super_admin" : roleCheck?.role)) as TenantRole | undefined);
    if (!callerRole || !["super_admin", "school_admin", "branch_admin"].includes(callerRole)) {
      return new Response(JSON.stringify({ error: "Admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let query = supabase
      .from("user_roles")
      .select("id:user_id, user_id, email, name, role, tenant_role, school_id, branch_id")
      .eq("is_primary", true);

    if (callerRole === "super_admin") {
      query = query.eq("tenant_role", "school_admin");
    } else if (callerRole === "school_admin") {
      query = query
        .eq("school_id", roleCheck.school_id)
        .in("tenant_role", ["branch_admin", "teacher"]);
    } else if (callerRole === "branch_admin") {
      query = query
        .eq("school_id", roleCheck.school_id)
        .eq("branch_id", roleCheck.branch_id)
        .eq("tenant_role", "student");
    }

    const { data: userList, error } = await query.order("name");
    if (error) throw error;

    return new Response(JSON.stringify({ users: userList }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
