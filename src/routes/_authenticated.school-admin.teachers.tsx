import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Users, Plus, Trash2, Pencil, Loader2, X, BookOpen, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export const Route = createFileRoute("/_authenticated/school-admin/teachers")({
  component: SchoolAdminTeachers,
});

interface AssignmentRow {
  id: string;
  class_id: string;
  subject_id: string;
  section: string | null;
  classes?: { name: string } | null;
  subjects?: { name: string } | null;
}

interface TeacherRow {
  id: string;
  name: string;
  email: string;
  avatar_emoji: string | null;
  branch_id: string | null;
  branches?: { name: string } | null;
  teacher_assignments?: AssignmentRow[];
}

interface BranchRow {
  id: string;
  name: string;
}

interface ClassRow {
  id: string;
  name: string;
}

interface SubjectRow {
  id: string;
  name: string;
  class_id: string;
}

function SchoolAdminTeachers() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [branches, setBranches] = useState<BranchRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Teacher form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TeacherRow | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    avatar_emoji: "👨‍🏫",
    branch_id: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Assignment dialog state
  const [assignTeacher, setAssignTeacher] = useState<TeacherRow | null>(null);
  const [assignClassId, setAssignClassId] = useState("");
  const [assignSubjectId, setAssignSubjectId] = useState("");
  const [assignSection, setAssignSection] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (user?.schoolId) loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    setError(null);

    const [tRes, bRes, cRes, sRes] = await Promise.all([
      (supabase as any)
        .from("teachers")
        .select(
          "id, name, email, avatar_emoji, branch_id, branches(name), teacher_assignments(id, class_id, subject_id, section, classes(name), subjects(name))"
        )
        .eq("school_id", user!.schoolId)
        .order("name"),
      (supabase as any)
        .from("branches")
        .select("id, name")
        .eq("school_id", user!.schoolId)
        .order("name"),
      (supabase as any)
        .from("classes")
        .select("id, name")
        .eq("school_id", user!.schoolId)
        .order("name"),
      (supabase as any)
        .from("subjects")
        .select("id, name, class_id")
        .eq("school_id", user!.schoolId)
        .order("name"),
    ]);

    if (tRes.error) {
      setError(`${tRes.error.message} (${tRes.error.code})`);
      toast.error(tRes.error.message);
    } else {
      setTeachers(tRes.data || []);
    }
    setBranches(bRes.data || []);
    setClasses(cRes.data || []);
    setSubjects(sRes.data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", email: "", avatar_emoji: "👨‍🏫", branch_id: "" });
    setShowForm(true);
  }

  function openEdit(t: TeacherRow) {
    setEditing(t);
    setForm({
      name: t.name || "",
      email: t.email || "",
      avatar_emoji: t.avatar_emoji || "👨‍🏫",
      branch_id: t.branch_id || "",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email required");
      return;
    }
    setSubmitting(true);

    const payload: any = {
      name: form.name.trim(),
      email: form.email.trim(),
      avatar_emoji: form.avatar_emoji,
      school_id: user!.schoolId,
      branch_id: form.branch_id || null,
    };

    if (editing) {
      const { error: err } = await (supabase as any)
        .from("teachers")
        .update(payload)
        .eq("id", editing.id);
      if (err) toast.error(err.message);
      else toast.success("Teacher updated");
    } else {
      const { error: err } = await (supabase as any)
        .from("teachers")
        .insert(payload);
      if (err) toast.error(err.message);
      else toast.success("Teacher created");
    }

    setShowForm(false);
    setEditing(null);
    setSubmitting(false);
    loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this teacher? All assignments will also be removed."))
      return;
    const { error: err } = await (supabase as any)
      .from("teachers")
      .delete()
      .eq("id", id);
    if (err) toast.error(err.message);
    else {
      toast.success("Teacher deleted");
      loadData();
    }
  }

  function openAssign(t: TeacherRow) {
    setAssignTeacher(t);
    setAssignClassId("");
    setAssignSubjectId("");
    setAssignSection("");
  }

  async function handleAssign() {
    if (!assignTeacher || !assignClassId || !assignSubjectId) return;
    setAssigning(true);

    const payload = {
      teacher_id: assignTeacher.id,
      class_id: assignClassId,
      subject_id: assignSubjectId,
      section: assignSection || null,
      school_id: user!.schoolId,
    };

    const { error: err } = await (supabase as any)
      .from("teacher_assignments")
      .insert(payload);

    if (err) toast.error(err.message);
    else {
      toast.success("Assignment added");
      setAssignTeacher(null);
      loadData();
    }
    setAssigning(false);
  }

  async function handleRemoveAssignment(assignmentId: string) {
    if (!confirm("Remove this assignment?")) return;
    const { error: err } = await (supabase as any)
      .from("teacher_assignments")
      .delete()
      .eq("id", assignmentId);
    if (err) toast.error(err.message);
    else {
      toast.success("Assignment removed");
      loadData();
    }
  }

  const allowedRoles = ["school_admin", "admin", "super_admin"];
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
          <h1 className="text-2xl font-black">Teachers</h1>
          <p className="text-sm text-muted-foreground">
            Manage teachers and their class assignments
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Add Teacher
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
              <h3 className="font-bold">
                {editing ? "Edit Teacher" : "New Teacher"}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
                <Input
                  value={form.avatar_emoji}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, avatar_emoji: e.target.value }))
                  }
                  className="w-16 text-center text-lg px-0"
                  maxLength={4}
                />
                <Input
                  placeholder="Full Name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <Input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
              <div>
                <Label className="text-xs">Branch</Label>
                <select
                  value={form.branch_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, branch_id: e.target.value }))
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select Branch (optional)</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : null}
                  {editing ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No teachers found. Click Add Teacher to create one.
        </div>
      ) : (
        <div className="grid gap-3">
          {teachers.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl shrink-0">
                    {t.avatar_emoji || "👨‍🏫"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{t.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {t.email}
                        </div>
                        {t.branch_id && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {t.branches?.name || "Branch"}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(t)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(t.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Assignments */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          Class Assignments
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => openAssign(t)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                      </div>

                      {(t.teacher_assignments?.length ?? 0) === 0 ? (
                        <div className="text-xs text-muted-foreground italic">
                          No class assignments yet.
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {t.teacher_assignments?.map((a) => (
                            <Badge
                              key={a.id}
                              variant="secondary"
                              className="flex items-center gap-1 pr-1"
                            >
                              <span className="text-[10px]">
                                {a.classes?.name || "Class"}
                                {a.section ? ` (${a.section})` : ""}
                                {" "}• {a.subjects?.name || "Subject"}
                              </span>
                              <button
                                onClick={() => handleRemoveAssignment(a.id)}
                                className="ml-1 rounded-full hover:bg-destructive/20 p-0.5 text-destructive"
                                title="Remove assignment"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Assignment Dialog */}
      <Dialog
        open={!!assignTeacher}
        onOpenChange={(open) => !open && setAssignTeacher(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Class & Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Assign a class, section, and subject for{" "}
              <strong>{assignTeacher?.name}</strong>.
            </p>

            <div>
              <Label className="text-xs">Class</Label>
              <select
                value={assignClassId}
                onChange={(e) => {
                  setAssignClassId(e.target.value);
                  setAssignSubjectId("");
                }}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Section</Label>
                <Input
                  placeholder="e.g. A"
                  value={assignSection}
                  onChange={(e) => setAssignSection(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Subject</Label>
                <select
                  value={assignSubjectId}
                  onChange={(e) => setAssignSubjectId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  disabled={!assignClassId}
                >
                  <option value="">Select subject</option>
                  {subjects
                    .filter((s) => s.class_id === assignClassId)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <Button
              onClick={handleAssign}
              className="w-full"
              disabled={!assignClassId || !assignSubjectId || assigning}
            >
              {assigning ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Assign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
