import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { GraduationCap, Search, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/super-admin/students")({
  component: SuperAdminStudents,
});

function SuperAdminStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  useEffect(() => {
    if (user?.role === "super_admin") {
      loadData();
    }
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const [studentsRes, schoolsRes] = await Promise.all([
        (supabase as any)
          .from("students")
          .select("id, name, email, roll_number, section, total_points, avatar_emoji, class_id, school_id, schools(name), classes(name)")
          .order("name"),
        (supabase as any).from("schools").select("id, name").order("name"),
      ]);

      if (studentsRes.error) {
        throw studentsRes.error;
      }
      if (schoolsRes.error) {
        throw schoolsRes.error;
      }

      setStudents(studentsRes.data || []);
      setSchools(schoolsRes.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  const filtered = students.filter((student) => {
    const searchLower = search.trim().toLowerCase();
    if (selectedSchool && student.school_id !== selectedSchool) return false;
    if (!searchLower) return true;
    return [student.name, student.email, student.roll_number, student.section, student.schools?.name, student.classes?.name]
      .filter(Boolean)
      .some((value) => value.toString().toLowerCase().includes(searchLower));
  });

  const studentCountsBySchool = schools.map((school) => ({
    ...school,
    count: students.filter((student) => student.school_id === school.id).length,
  }));

  if (!user || user.role !== "super_admin") {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold">Access Denied</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Students</h1>
          <p className="text-sm text-muted-foreground">All students across every school</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <Card className="border border-border bg-card">
        <CardContent className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students, school, class, roll number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent px-0 py-0 focus-visible:ring-0"
            />
          </div>
          <div>
            <Label className="text-xs">Filter by school</Label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All schools</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border bg-card">
        <CardContent className="grid gap-3 md:grid-cols-3">
          {studentCountsBySchool.map((school) => (
            <div key={school.id} className="rounded-2xl border border-input bg-background p-4">
              <div className="text-sm text-muted-foreground">{school.name}</div>
              <div className="mt-2 text-2xl font-bold">{school.count}</div>
              <div className="text-xs text-muted-foreground">students</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.map((student) => (
          <Card key={student.id} className="border border-border shadow-sm">
            <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl">
                  {student.avatar_emoji || "🎓"}
                </div>
                <div>
                  <div className="text-base font-semibold text-foreground">{student.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {student.email || "No email"} • Roll #{student.roll_number} • Section {student.section || "A"}
                  </div>
                </div>
              </div>
              <div className="grid gap-2 text-sm text-right md:text-left md:grid-cols-3">
                <div>
                  <div className="text-muted-foreground text-xs">School</div>
                  <div>{student.schools?.name || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Class</div>
                  <div>{student.classes?.name || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Points</div>
                  <div className="font-semibold">{student.total_points ?? 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-muted/50 bg-muted/10 p-6 text-center text-sm text-muted-foreground">
            No students found for the current search or filter.
          </div>
        )}
      </div>
    </div>
  );
}
