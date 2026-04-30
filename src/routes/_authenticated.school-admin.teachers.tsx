import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Users, Plus, Trash2, Pencil, Loader2, X, BookOpen, MapPin, KeyRound } from "lucide-react";
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
  user_id: string | null;
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
  branches?: { name: string } | null;
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
    password: "",
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

  // Credentials dialog state
  const [credTeacher, setCredTeacher] = useState<TeacherRow | null>(null);
  const [resettingPassword, setResettingPassword] = useState(false);
  const isSubmittingRef = useRef(false);

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
          "id, user_id, name, email, avatar_emoji, branch_id, branches(name), teacher_assignments(id, class_id, subject_id, section, classes(name), subjects(name))"
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
        .select("id, name, branches(name)")
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
    setForm({ name: "", email: "", password: "", avatar_emoji: "👨‍🏫", branch_id: "" });
    setShowForm(true);
  }

  function openEdit(t: TeacherRow) {
    setEditing(t);
    setForm({
      name: t.name || "",
      email: t.email || "",
      password: "",
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
    if (!editing && form.password && form.password.length < 6) {
      toast.error("Password must be 6+ chars");
      return;
    }
    if (editing && form.password && form.password.length < 6) {
      toast.error("Password must be 6+ chars");
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
      // Update email/password via edge function if provided
      if (form.email.trim() !== editing.email || form.password) {
        const updatePayload: any = {
          targetUserId: editing.user_id,
          email: form.email.trim(),
          password: form.password || undefined,
        };
        const res = await supabase.functions.invoke("admin-update-user", {
          body: updatePayload,
        });
        if (res.error || res.data?.error) {
          toast.error(res.data?.error || res.error?.message || "Failed to update credentials");
          setSubmitting(false);
          return;
        }
      }
      const { error: err } = await (supabase as any)
        .from("teachers")
        .update(payload)
        .eq("id", editing.id);
      if (err) toast.error(err.message);
      else toast.success("Teacher updated");
    } else {
      // Check if teacher with this email already exists
      const { data: existingTeacher } = await (supabase as any)
        .from("teachers")
        .select("id")
        .eq("email", form.email.trim())
        .eq("school_id", user!.schoolId)
        .maybeSingle();
      
      if (existingTeacher) {
        toast.error("A teacher with this email already exists in your school");
        setSubmitting(false);
        return;
      }

      // Step 1: Insert teacher record into teachers table
      const { data: newTeacher, error: teacherInsertError } = await (supabase as any)
        .from("teachers")
        .insert(payload)
        .select()
        .single();

      if (teacherInsertError) {
        if (teacherInsertError.code === '23505') {
          toast.error("A teacher with this email already exists in your school");
        } else {
          toast.error(teacherInsertError.message);
        }
        setSubmitting(false);
        return;
      }

      // Step 2: If password provided, create auth user via edge function (edge function updates user_id)
      if (form.password) {
        const res = await supabase.functions.invoke("create-user", {
          body: {
            email: form.email.trim(),
            password: form.password,
            role: "teacher",
            tenant_role: "teacher",
            school_id: user!.schoolId,
            branch_id: form.branch_id || null,
            skip_domain_insert: true,
            teacher_id: newTeacher.id,
            meta: {
              name: form.name.trim(),
              avatar_emoji: form.avatar_emoji,
            },
          },
        });
        console.log("Edge function response:", res);
        if (res.error || res.data?.error) {
          // Clean up the teacher record if auth user creation failed
          await (supabase as any).from("teachers").delete().eq("id", newTeacher.id);
          toast.error(res.data?.error || res.error?.message || "Failed to create auth account");
          setSubmitting(false);
          isSubmittingRef.current = false;
          return;
        }
        
        // Verify user_id was updated
        const { data: updatedTeacher } = await (supabase as any)
          .from("teachers")
          .select("user_id")
          .eq("id", newTeacher.id)
          .single();
        console.log("Teacher after edge function:", updatedTeacher);
        if (!updatedTeacher?.user_id) {
          console.error("user_id not set after edge function call");
          await (supabase as any).from("teachers").delete().eq("id", newTeacher.id);
          toast.error("Failed to link auth user to teacher record");
          setSubmitting(false);
          isSubmittingRef.current = false;
          return;
        }
      }

      toast.success("Teacher created");
    }

    setShowForm(false);
    setEditing(null);
    setSubmitting(false);
    isSubmittingRef.current = false;
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

  async function handleResetPassword() {
    if (!credTeacher?.email) {
      toast.error("No email found for this teacher");
      return;
    }
    setResettingPassword(true);
    const { error } = await supabase.auth.resetPasswordForEmail(credTeacher.email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) {
      toast.error(`Reset failed: ${error.message}`);
    } else {
      toast.success("Password reset email sent (if email service is configured)");
    }
    setResettingPassword(false);
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <Label>Avatar Emoji</Label>
                <div className="flex items-center gap-3">
                  <Input
                    value={form.avatar_emoji}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, avatar_emoji: e.target.value }))
                    }
                    className="w-16 text-center text-lg px-0"
                    maxLength={4}
                  />
                  <span className="text-sm text-muted-foreground">Choose an emoji for this teacher</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher-name">Full Name *</Label>
                <Input
                  id="teacher-name"
                  placeholder="Enter teacher's full name"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher-email">Email *</Label>
                <Input
                  id="teacher-email"
                  type="email"
                  placeholder="teacher@school.com"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher-password">
                  {editing ? "New Password (optional)" : "Password *"}
                </Label>
                <Input
                  id="teacher-password"
                  type="password"
                  placeholder={editing ? "Leave blank to keep current password" : "Minimum 6 characters"}
                  minLength={6}
                  required={!editing}
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {editing ? "Only enter a new password if you want to change it" : "Required for login access"}
                </p>
              </div>
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
                        <div className="text-xs text-muted-foreground font-mono truncate">
                          Auth: {t.user_id || "Not linked"}
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
                          onClick={() => setCredTeacher(t)}
                          title="Manage credentials"
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
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

      {/* Credentials Dialog */}
      <Dialog
        open={!!credTeacher}
        onOpenChange={(open) => !open && setCredTeacher(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teacher Credentials</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <div className="font-medium">{credTeacher?.name}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <div className="font-medium font-mono text-sm">{credTeacher?.email || "—"}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Auth User ID</Label>
              <div className="font-mono text-xs bg-muted rounded px-2 py-1 break-all">
                {credTeacher?.user_id || "No auth account linked"}
              </div>
            </div>
            <div className="pt-2 border-t">
              <Button
                onClick={handleResetPassword}
                disabled={resettingPassword || !credTeacher?.email}
                className="w-full"
                variant="outline"
              >
                {resettingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <KeyRound className="h-4 w-4 mr-1" />
                )}
                Send Password Reset Email
              </Button>
              <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                Requires email service configured in Supabase. If disabled, reset password via Supabase Dashboard → Authentication → Users.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                    {c.name} {c.branches?.name ? `(${c.branches.name})` : ""}
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
