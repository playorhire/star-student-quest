import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { email, password, school_name, contact_person, city } = await req.json();

    if (!email || !password || !school_name || !contact_person || !city) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 8 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create school
    const { data: school, error: schoolError } = await supabase
      .from("schools")
      .insert({ name: school_name, city })
      .select()
      .single();
    if (schoolError) throw schoolError;

    // Create auth user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) {
      // rollback school
      await supabase.from("schools").delete().eq("id", school.id);
      throw createError;
    }

    const userId = newUser.user.id;

    // Insert user_role as school_admin
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: userId,
      role: "school_admin",
      tenant_role: "school_admin",
      school_id: school.id,
      email,
      name: contact_person,
      is_primary: true,
    });
    if (roleError) {
      await supabase.auth.admin.deleteUser(userId);
      await supabase.from("schools").delete().eq("id", school.id);
      throw roleError;
    }

    return new Response(
      JSON.stringify({ success: true, school_id: school.id, user_id: userId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});