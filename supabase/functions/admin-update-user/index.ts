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

    if (email) {
      await supabase.from("teachers").update({ email }).eq("user_id", userIdToUpdate);
      await supabase.from("parents").update({ email }).eq("user_id", userIdToUpdate);
    }

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
