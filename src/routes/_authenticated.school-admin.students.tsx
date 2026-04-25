import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/school-admin/students" as any)({
  component: SchoolAdminStudents,
});

function SchoolAdminStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.schoolId) loadStudents();
  }, [user]);

  async function loadStudents() {
    setLoading(true);
    setError(null);
    const { data, error: err } = await (supabase as any)
      .from("students")
      .select("id, name, email, roll_number, total_points, classes(name), avatar_emoji")
      .eq("school_id", user!.schoolId)
      .order("name");
    if (err) {
      setError(`${err.message} (${err.code})`);
      toast.error(err.message);
    } else {
      setStudents(data || []);
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
        <h1 className="text-2xl font-black">Students</h1>
        <p className="text-sm text-muted-foreground">All students in your school</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No students found</div>
      ) : (
        <div className="grid gap-3">
          {students.map(s => (
            <Card key={s.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-2xl">{s.avatar_emoji || "🎓"}</div>
                <div className="flex-1">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.email} • {s.classes?.name} • Roll #{s.roll_number}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-primary">{s.total_points ?? 0}</div>
                  <div className="text-[10px] text-muted-foreground">pts</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
