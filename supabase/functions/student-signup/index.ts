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

    const text = await req.text();
    let payload: Record<string, unknown> = {};
    try {
      if (text) {
        payload = JSON.parse(text);
      }
    } catch {
      payload = {};
    }

    const name = (payload?.name || payload?.full_name || "").toString().trim();
    const email = (payload?.email || payload?.email_address || "").toString().trim().toLowerCase();
    const phone = (payload?.phone || payload?.mobile || payload?.mobile_number || "").toString().trim();
    const registrationMethod = (payload?.registration_method || payload?.registrationMethod || (phone ? "phone" : "email")).toString().toLowerCase();
    const password = (payload?.password || payload?.pass || "").toString();
    const schoolId = (payload?.school_id || payload?.schoolId || "").toString().trim();
    const schoolName = (payload?.school_name || payload?.school || payload?.schoolName || "").toString().trim();
    const schoolAddress = (payload?.school_address || payload?.address || "").toString().trim();
    const branchId = (payload?.branch_id || payload?.branchId || "").toString().trim();
    const branchName = (payload?.branch_name || payload?.branch || payload?.branchName || "").toString().trim();
    const classId = (payload?.class_id || payload?.classId || "").toString().trim();
    const className = (payload?.class_name || payload?.class || payload?.className || "").toString().trim();
    const customSchoolRequested = (payload?.create_custom_school || payload?.createCustomSchool || "false").toString().toLowerCase() === "true";
    const rollNumber = (payload?.roll_number || payload?.rollNumber || "").toString().trim();
    const section = (payload?.section || "A").toString().trim() || "A";

    if (!name || !password || !rollNumber || (registrationMethod !== "email" && registrationMethod !== "phone") || (registrationMethod === "email" ? !email : !phone)) {
      return new Response(JSON.stringify({ error: "Please complete all required fields." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!customSchoolRequested && (!schoolId || !branchId || !classId)) {
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

    if (registrationMethod === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Please enter a valid email address." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (registrationMethod === "phone" && !/^\+[1-9]\d{7,14}$/.test(phone)) {
      return new Response(JSON.stringify({ error: "Enter a mobile number with country code, for example +923001234567." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let school: { id: string; name: string } | null = null;
    let branchRow: { id: string; school_id: string } | null = null;
    let classRow: { id: string; branch_id: string | null } | null = null;

    if (customSchoolRequested) {
      if (!schoolName || !branchName || !className) {
        return new Response(JSON.stringify({ error: "Please provide a school name, branch name, and class name." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: existingSchool, error: schoolLookupError } = await supabase
        .from("schools")
        .select("id, name")
        .ilike("name", schoolName)
        .maybeSingle();

      if (schoolLookupError) {
        throw schoolLookupError;
      }

      if (existingSchool) {
        school = existingSchool;
      } else {
        const { data: createdSchool, error: schoolInsertError } = await supabase
          .from("schools")
          .insert({ name: schoolName, address: schoolAddress || null })
          .select("id, name")
          .single();

        if (schoolInsertError) {
          throw schoolInsertError;
        }
        school = createdSchool;
      }

      if (!school) {
        return new Response(JSON.stringify({ error: "We couldn't create the school record for your signup." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: existingBranch, error: branchLookupError } = await supabase
        .from("branches")
        .select("id, school_id")
        .eq("school_id", school.id)
        .ilike("name", branchName)
        .maybeSingle();

      if (branchLookupError) {
        throw branchLookupError;
      }

      if (existingBranch) {
        branchRow = existingBranch;
      } else {
        const { data: createdBranch, error: branchInsertError } = await supabase
          .from("branches")
          .insert({ name: branchName, school_id: school.id })
          .select("id, school_id")
          .single();

        if (branchInsertError) {
          throw branchInsertError;
        }
        branchRow = createdBranch;
      }

      if (!branchRow) {
        return new Response(JSON.stringify({ error: "We couldn't create the branch record for your signup." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: existingClass, error: classLookupError } = await supabase
        .from("classes")
        .select("id, branch_id")
        .eq("school_id", school.id)
        .eq("branch_id", branchRow.id)
        .ilike("name", className)
        .maybeSingle();

      if (classLookupError) {
        throw classLookupError;
      }

      if (existingClass) {
        classRow = existingClass;
      } else {
        const { data: createdClass, error: classInsertError } = await supabase
          .from("classes")
          .insert({ name: className, school_id: school.id, branch_id: branchRow.id })
          .select("id, branch_id")
          .single();

        if (classInsertError) {
          throw classInsertError;
        }
        classRow = createdClass;
      }
    } else {
      const schoolQuery = supabase.from("schools").select("id, name");
      const { data: schoolData, error: schoolError } = await (schoolId
        ? schoolQuery.eq("id", schoolId).maybeSingle()
        : schoolQuery.ilike("name", schoolName).maybeSingle());

      if (schoolError) {
        throw schoolError;
      }
      if (!schoolData) {
        return new Response(JSON.stringify({ error: "We couldn't find that school. Please ask your school admin to confirm the school name." }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      school = schoolData;

      const { data: branchLookupData, error: branchLookupError } = await supabase
        .from("branches")
        .select("id, school_id")
        .eq("id", branchId)
        .maybeSingle();

      if (branchLookupError) {
        throw branchLookupError;
      }
      if (!school) {
        return new Response(JSON.stringify({ error: "We couldn't resolve the selected school." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!branchLookupData || branchLookupData.school_id !== school.id) {
        return new Response(JSON.stringify({ error: "We couldn't find that branch for your school. Please ask your school admin to confirm the branch name." }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      branchRow = branchLookupData;

      if (!school) {
        return new Response(JSON.stringify({ error: "We couldn't resolve the selected school." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      let classQuery = supabase
        .from("classes")
        .select("id, branch_id")
        .eq("school_id", school.id);

      if (classId) {
        classQuery = classQuery.eq("id", classId);
      } else {
        classQuery = classQuery.ilike("name", className);
      }

      const { data: classLookupData, error: classError } = await classQuery.maybeSingle();

      if (classError) {
        throw classError;
      }
      if (!classLookupData) {
        return new Response(JSON.stringify({ error: "We couldn't find that class for your school. Please ask your school admin to confirm the class name." }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!branchRow) {
        return new Response(JSON.stringify({ error: "We couldn't resolve the selected branch." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (classLookupData.branch_id && classLookupData.branch_id !== branchRow.id) {
        return new Response(JSON.stringify({ error: "The selected class does not belong to the selected branch." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      classRow = classLookupData;
    }

    if (!school || !branchRow || !classRow) {
      return new Response(JSON.stringify({ error: "We couldn't complete the school setup for your signup." }), {
        status: 400,
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

    const authUser = registrationMethod === "phone"
      ? { phone, password, phone_confirm: true }
      : { email, password, email_confirm: true };
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser(authUser);

    if (createError) {
      throw createError;
    }

    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: newUser.user.id,
      role: "student",
      tenant_role: "student",
      school_id: school.id,
      branch_id: branchRow.id,
      email: email || null,
      name,
      is_primary: true,
    });

    if (roleError) {
      throw roleError;
    }

    const { data: student, error: studentInsertError } = await supabase.from("students").insert({
      name,
      email: email || null,
      user_id: newUser.user.id,
      school_id: school.id,
      branch_id: branchRow.id,
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
