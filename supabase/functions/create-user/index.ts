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

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller } } = await supabase.auth.getUser(token);
    if (!caller) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: roleCheck } = await supabase.from("user_roles").select("role").eq("user_id", caller.id).eq("role", "admin").single();
    if (!roleCheck) return new Response(JSON.stringify({ error: "Admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { email, password, role, meta } = await req.json();

    // Create auth user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) throw createError;

    const userId = newUser.user.id;

    // Assign role
    await supabase.from("user_roles").insert({ user_id: userId, role });

    // Link to teacher/student record if applicable
    if (role === "teacher" && meta?.teacherId) {
      await supabase.from("teachers").update({ user_id: userId }).eq("id", meta.teacherId);
    } else if (role === "student" && meta?.studentId) {
      await supabase.from("students").update({ user_id: userId }).eq("id", meta.studentId);
    } else if (role === "teacher") {
      await supabase.from("teachers").insert({ name: meta?.name || email, email, user_id: userId });
    } else if (role === "student") {
      // student record created separately
    }

    return new Response(JSON.stringify({ userId }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
