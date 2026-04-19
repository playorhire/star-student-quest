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
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const { targetUserId, email, password, selfUpdate } = body;

    // If not selfUpdate, require admin role
    if (!selfUpdate) {
      const { data: roleCheck } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", caller.id)
        .eq("role", "admin")
        .single();
      if (!roleCheck) {
        return new Response(JSON.stringify({ error: "Admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    const userIdToUpdate = selfUpdate ? caller.id : targetUserId;
    if (!userIdToUpdate) {
      return new Response(JSON.stringify({ error: "Missing target user id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const updates: Record<string, any> = {};
    if (email) updates.email = email;
    if (password) updates.password = password;

    if (Object.keys(updates).length === 0) {
      return new Response(JSON.stringify({ error: "Nothing to update" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { error } = await supabase.auth.admin.updateUserById(userIdToUpdate, updates);
    if (error) throw error;

    // Mirror email to profile tables when applicable (both admin-led and self-updates)
    if (email) {
      await supabase.from("teachers").update({ email }).eq("user_id", userIdToUpdate);
      await supabase.from("parents").update({ email }).eq("user_id", userIdToUpdate);
    }

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
