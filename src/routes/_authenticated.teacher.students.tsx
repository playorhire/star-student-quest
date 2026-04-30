import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export const Route = createFileRoute("/_authenticated/teacher/students")({
  component: TeacherStudents,
});

function TeacherStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.schoolId) loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    setError(null);

    // Get teacher record for current user
    const { data: teacher } = await (supabase as any)
      .from("teachers")
      .select("id, branch_id")

      .maybeSingle();

    let assignedClassIds: string[] = [];
    if (teacher) {
      const { data: assignments } = await supabase
        .from("teacher_assignments")
        .select("class_id")
        .eq("teacher_id", teacher.id);
      assignedClassIds = (assignments || []).map((a: any) => a.class_id);
    }

    // Load classes this teacher is assigned to (or all school classes if no assignments)
    const classQuery = (supabase as any)
      .from("classes")
      .select("id, name")
      .eq("school_id", user!.schoolId)
      .order("name");

    if (assignedClassIds.length > 0) {
      classQuery.in("id", assignedClassIds);
    }

    const studentQuery = (supabase as any)
      .from("students")
      .select("id, name, roll_number, total_points, classes(name), avatar_emoji, class_id, section, email")
      .eq("school_id", user!.schoolId)
      .order("name");
    
    if (teacher?.branch_id) {
      studentQuery.eq("branch_id", teacher.branch_id);
    }

    const [sRes, cRes] = await Promise.all([
         (supabase as any)
        .from("students")
        .select("id, name, roll_number, total_points, classes(name), avatar_emoji, class_id, section, user_id, email")
        .eq("branch_id", user!.branchId)
        .order("name"),
      studentQuery,
      classQuery,
    ]);

    if (sRes.error) {
      setError(sRes.error.message + " (" + sRes.error.code + ")");
      toast.error(sRes.error.message);
    } else {
      // Filter students to only those in assigned classes (if teacher has assignments)
      let studentData = sRes.data || [];
      if (assignedClassIds.length > 0) {
        studentData = studentData.filter((s: any) => assignedClassIds.includes(s.class_id));
      }
      setStudents(studentData);
    }
    setClasses(cRes.data || []);
    setLoading(false);
  }


  async function handleDelete(id: string) {
    if (!confirm("Delete this student?")) return;
    const { error: err } = await (supabase as any).from("students").delete().eq("id", id);
    if (err) toast.error(err.message);
    else {
      toast.success("Student deleted");
      loadData();
    }
  }

  const allowedRoles = ["teacher", "school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold">Access Denied</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Students</h1>
        <p className="text-sm text-muted-foreground">Students in your classes</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No students found in your assigned classes.
        </div>
      ) : (
        <div className="grid gap-3">
          {students.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-2xl">{s.avatar_emoji || "🎓"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{s.name}</div>

                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.classes?.name} • Roll #{s.roll_number} • Section {s.section}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-primary">{s.total_points ?? 0}</div>
                  <div className="text-[10px] text-muted-foreground">pts</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(s.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
