import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req) => {
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

    const schoolId = (payload?.school_id || "").toString().trim();
    const action = (payload?.action || "classes").toString().trim().toLowerCase();

    if (schoolId) {
      if (action === "branches") {
        const { data: branches, error } = await supabase
          .from("branches")
          .select("id, name")
          .eq("school_id", schoolId)
          .order("name");

        if (error) {
          throw error;
        }

        return new Response(JSON.stringify({ branches }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: classes, error } = await supabase
        .from("classes")
        .select("id, name")
        .eq("school_id", schoolId)
        .order("name");

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify({ classes }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: schools, error } = await supabase.from("schools").select("id, name").order("name");
    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ schools }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("public-school-data failed", error);
    return new Response(JSON.stringify({ error: error?.message || "Failed to load school data." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
