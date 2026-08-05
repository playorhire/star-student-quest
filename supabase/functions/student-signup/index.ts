import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin") || "*";
  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const payload = await req.json();
    const name = (payload?.name || "").toString().trim();
    const email = (payload?.email || "").toString().trim().toLowerCase();
    const password = (payload?.password || "").toString();
    const schoolName = (payload?.school_name || "").toString().trim();
    const className = (payload?.class_name || "").toString().trim();
    const rollNumber = (payload?.roll_number || "").toString().trim();
    const section = (payload?.section || "A").toString().trim() || "A";

    if (!name || !email || !password || !schoolName || !className || !rollNumber) {
      return new Response(JSON.stringify({ error: "Please complete all required fields." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ error: "Password must be at least 8 characters." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: school, error: schoolError } = await supabase
      .from("schools")
      .select("id, name")
      .ilike("name", schoolName)
      .maybeSingle();

    if (schoolError) {
      throw schoolError;
    }
    if (!school) {
      return new Response(JSON.stringify({ error: "We couldn't find that school. Please ask your school admin to confirm the school name." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: existingStudent, error: studentLookupError } = await supabase
      .from("students")
      .select("id")
      .eq("school_id", school.id)
      .eq("roll_number", rollNumber)
      .maybeSingle();

    if (studentLookupError) {
      throw studentLookupError;
    }
    if (existingStudent) {
      return new Response(JSON.stringify({ error: "A student with that roll number already exists for this school." }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: classRow, error: classError } = await supabase
      .from("classes")
      .select("id, branch_id")
      .eq("school_id", school.id)
      .ilike("name", className)
      .maybeSingle();

    if (classError) {
      throw classError;
    }
    if (!classRow) {
      return new Response(JSON.stringify({ error: "We couldn't find that class for your school. Please ask your school admin to confirm the class name." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      throw createError;
    }

    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: newUser.user.id,
      role: "student",
      tenant_role: "student",
      school_id: school.id,
      branch_id: classRow.branch_id || null,
      email,
      name,
      is_primary: true,
    });

    if (roleError) {
      throw roleError;
    }

    const { data: student, error: studentInsertError } = await supabase.from("students").insert({
      name,
      email,
      user_id: newUser.user.id,
      school_id: school.id,
      branch_id: classRow.branch_id || null,
      class_id: classRow.id,
      roll_number: rollNumber,
      section,
      avatar_emoji: "🎓",
      total_points: 0,
      qr_code: crypto.randomUUID(),
    }).select("id").single();

    if (studentInsertError) {
      throw studentInsertError;
    }

    return new Response(JSON.stringify({ ok: true, userId: newUser.user.id, studentId: student?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("student-signup failed", error);
    return new Response(JSON.stringify({ error: error?.message || "Student signup failed." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
