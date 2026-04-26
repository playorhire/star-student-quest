import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { GraduationCap, Plus, Trash2, Pencil, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export const Route = createFileRoute("/_authenticated/teacher/students")({
  component: TeacherStudents,
});

function TeacherStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", roll_number: "", class_id: "", avatar_emoji: "🎓", section: "A" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.schoolId) loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    setError(null);

    // Get teacher record for current user
    const { data: teacher } = await supabase
      .from("teachers")
      .select("id")
      .eq("user_id", user!.id)
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

    const [sRes, cRes] = await Promise.all([
      (supabase as any)
        .from("students")
        .select("id, name, roll_number, total_points, classes(name), avatar_emoji, class_id, section")
        .eq("school_id", user!.schoolId)
        .order("name"),
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

  function openCreate() {
    setEditing(null);
    setForm({ name: "", roll_number: "", class_id: "", avatar_emoji: "🎓", section: "A" });
    setShowForm(true);
  }

  function openEdit(s: any) {
    setEditing(s);
    setForm({
      name: s.name || "",
      roll_number: s.roll_number || "",
      class_id: s.class_id || "",
      avatar_emoji: s.avatar_emoji || "🎓",
      section: s.section || "A",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.roll_number.trim() || !form.class_id) {
      toast.error("Name, roll number, and class are required");
      return;
    }
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      roll_number: form.roll_number.trim(),
      class_id: form.class_id,
      avatar_emoji: form.avatar_emoji,
      section: form.section,
      school_id: user!.schoolId,
    };

    if (editing) {
      const { error: err } = await (supabase as any).from("students").update(payload).eq("id", editing.id);
      if (err) toast.error(err.message);
      else toast.success("Student updated");
    } else {
      const { error: err } = await (supabase as any)
        .from("students")
        .insert({ ...payload, total_points: 0, qr_code: crypto.randomUUID() });
      if (err) toast.error(err.message);
      else toast.success("Student created");
    }

    setShowForm(false);
    setEditing(null);
    setSubmitting(false);
    loadData();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Students</h1>
          <p className="text-sm text-muted-foreground">Students in your classes</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Add Student
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {showForm && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{editing ? "Edit Student" : "New Student"}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
                <Input
                  value={form.avatar_emoji}
                  onChange={(e) => setForm((f) => ({ ...f, avatar_emoji: e.target.value }))}
                  className="w-16 text-center text-lg px-0"
                  maxLength={4}
                />
                <Input
                  placeholder="Full Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Roll Number"
                  required
                  value={form.roll_number}
                  onChange={(e) => setForm((f) => ({ ...f, roll_number: e.target.value }))}
                />
                <Input
                  placeholder="Section"
                  value={form.section}
                  onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                />
              </div>
              <select
                required
                value={form.class_id}
                onChange={(e) => setForm((f) => ({ ...f, class_id: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                  {editing ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No students found. Click Add Student to create one.
        </div>
      ) : (
        <div className="grid gap-3">
          {students.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-2xl">{s.avatar_emoji || "🎓"}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.classes?.name} • Roll #{s.roll_number} • Section {s.section}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-primary">{s.total_points ?? 0}</div>
                  <div className="text-[10px] text-muted-foreground">pts</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
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
