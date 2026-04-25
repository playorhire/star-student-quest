import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/school-admin/teachers" as any)({
  component: SchoolAdminTeachers,
});

function SchoolAdminTeachers() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.schoolId) loadTeachers();
  }, [user]);

  async function loadTeachers() {
    setLoading(true);
    setError(null);
    const { data, error: err } = await (supabase as any)
      .from("teachers")
      .select("id, name, email, avatar_emoji")
      .eq("school_id", user!.schoolId)
      .order("name");
    if (err) {
      setError(`${err.message} (${err.code})`);
      toast.error(err.message);
    } else {
      setTeachers(data || []);
    }
    setLoading(false);
  }

  const allowedRoles = ["school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Teachers</h1>
        <p className="text-sm text-muted-foreground">All teachers in your school</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          <strong>Error:</strong> {error}
          <div className="mt-1 text-xs opacity-80">
            {error.includes("400") && "The 'school_id' column is likely missing from the 'teachers' table. Run the SQL fix in Supabase SQL Editor."}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No teachers found</div>
      ) : (
        <div className="grid gap-3">
          {teachers.map(t => (
            <Card key={t.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-2xl">{t.avatar_emoji || "👨‍🏫"}</div>
                <div className="flex-1">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.email}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
