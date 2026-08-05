import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { GraduationCap, Search, RefreshCw, Upload, Download, CheckCircle } from "lucide-react";
import Papa from "papaparse";

export const Route = createFileRoute("/_authenticated/super-admin/students")({
  component: SuperAdminStudents,
});

function SuperAdminStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [csvResult, setCsvResult] = useState<{ count: number; failed: number } | null>(null);
  const [csvError, setCsvError] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.role === "super_admin") {
      loadData();
    }
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const [studentsRes, schoolsRes, classesRes] = await Promise.all([
        (supabase as any)
          .from("students")
          .select("id, name, email, roll_number, section, total_points, avatar_emoji, class_id, school_id, schools(name), classes(name)")
          .order("name"),
        (supabase as any).from("schools").select("id, name").order("name"),
        (supabase as any).from("classes").select("id, name, school_id").order("name"),
      ]);

      if (studentsRes.error) {
        throw studentsRes.error;
      }
      if (schoolsRes.error) {
        throw schoolsRes.error;
      }
      if (classesRes.error) {
        throw classesRes.error;
      }

      setStudents(studentsRes.data || []);
      setSchools(schoolsRes.data || []);
      setClasses(classesRes.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  function createCsvTemplate() {
    const template = [
      ["school", "name", "roll_number", "class", "section", "email", "password"],
      ["Example School", "Jane Doe", "101", "Grade 1", "A", "jane@example.com", "secret123"],
    ]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvError("");
    setCsvResult(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        let count = 0;
        let failed = 0;
        const errors: string[] = [];

        for (const row of results.data as Record<string, string>[]) {
          const name = (row.name || row.Name || "").trim();
          const rollNumber = (row.roll_number || row.roll || row.Roll || "").trim();
          const classValue = (row.class || row.Class || row["class_name"] || row["Class Name"] || "").trim();
          const section = (row.section || row.Section || "A").trim() || "A";
          const email = (row.email || row.Email || "").trim();
          const password = (row.password || row.Password || "").trim();
          let schoolId = selectedSchool;

          if (!schoolId) {
            const schoolValue = (row.school || row.School || row.school_name || row["School Name"] || "").trim();
            const schoolMatch = schools.find((s) => s.id === schoolValue || s.name === schoolValue);
            if (schoolMatch) {
              schoolId = schoolMatch.id;
            }
          }

          if (!name || !rollNumber || !classValue || !schoolId) {
            failed += 1;
            continue;
          }

          const classMatch = classes.find((cl) => cl.school_id === schoolId && (cl.id === classValue || cl.name === classValue));
          if (!classMatch) {
            failed += 1;
            continue;
          }

          try {
            const { data: studentData, error: studentError } = await (supabase as any)
              .from("students")
              .insert({
                name,
                roll_number: rollNumber,
                class_id: classMatch.id,
                section,
                school_id: schoolId,
                total_points: 0,
              } as any)
              .select("id")
              .single();

            if (studentError) {
              failed += 1;
              errors.push(studentError.message || "Failed to insert student");
              continue;
            }

            if (email && password) {
              const response = await supabase.functions.invoke("create-user", {
                body: {
                  email,
                  password,
                  role: "student",
                  tenant_role: "student",
                  school_id: schoolId,
                  class_id: classMatch.id,
                  student_id: studentData.id,
                  meta: { name, rollNumber, section, classId: classMatch.id },
                },
              });

              if (response.error || response.data?.error) {
                errors.push(response.data?.error || response.error?.message || "Failed to create auth user");
              } else if (response.data?.userId) {
                await (supabase as any)
                  .from("students")
                  .update({ user_id: response.data.userId })
                  .eq("id", studentData.id);
              }
            }

            count += 1;
          } catch (err: any) {
            failed += 1;
            errors.push(err.message || "Unknown import error");
          }
        }

        if (errors.length) {
          setCsvError(errors.slice(0, 3).join("; ") + (errors.length > 3 ? ` (+${errors.length - 3} more errors)` : ""));
        }

        setCsvResult({ count, failed });
        loadData();
        setTimeout(() => setCsvResult(null), 4000);
      },
    });

    if (fileRef.current) {
      fileRef.current.value = "";
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
        <CardContent className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="space-y-1">
            <div className="font-bold text-sm text-card-foreground">Import students from CSV</div>
            <p className="text-[11px] text-muted-foreground">Required columns: school, name, roll_number, class. Optional: section, email, password.</p>
            <p className="text-[11px] text-muted-foreground">School may be either school ID or school name.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={createCsvTemplate}>
              <Download className="h-4 w-4 mr-1" /> Download Template
            </Button>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} className="hidden" />
            <Button variant="default" size="sm" className="rounded-xl" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4 mr-1" /> Upload CSV
            </Button>
          </div>
          {(csvResult || csvError) && (
            <div className="col-span-full rounded-2xl border border-input bg-background p-3 text-sm text-muted-foreground">
              {csvResult && <span className="mr-3 text-foreground">Imported {csvResult.count} students.</span>}
              {csvResult?.failed ? <span className="text-destructive">Failed: {csvResult.failed}</span> : null}
              {csvError ? <div className="text-destructive mt-2">{csvError}</div> : null}
            </div>
          )}
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
