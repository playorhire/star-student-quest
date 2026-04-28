import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { GraduationCap, Plus, Trash2, Pencil, Loader2, X, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export const Route = createFileRoute("/_authenticated/school-admin/students")({
  component: SchoolAdminStudents,
});

function SchoolAdminStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", roll_number: "", class_id: "", avatar_emoji: "🎓", section: "A" });
  const [submitting, setSubmitting] = useState(false);

  // Credentials dialog state
  const [credStudent, setCredStudent] = useState<any>(null);
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    if (user?.schoolId) loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    setError(null);
    const [sRes, cRes] = await Promise.all([
      (supabase as any).from("students").select("id, user_id, name, email, roll_number, total_points, classes(name), avatar_emoji, class_id, section").eq("school_id", user!.schoolId).order("name"),
      (supabase as any).from("classes").select("id, name").eq("school_id", user!.schoolId).order("name"),
    ]);
    if (sRes.error) { setError(sRes.error.message + " (" + sRes.error.code + ")"); toast.error(sRes.error.message); }
    else setStudents(sRes.data || []);
    setClasses(cRes.data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", email: "", password: "", roll_number: "", class_id: "", avatar_emoji: "🎓", section: "A" });
    setShowForm(true);
  }

  function openEdit(s: any) {
    setEditing(s);
    setForm({
      name: s.name || "",
      email: s.email || "",
      password: "",
      roll_number: s.roll_number || "",
      class_id: s.class_id || "",
      avatar_emoji: s.avatar_emoji || "🎓",
      section: s.section || "A",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.roll_number.trim() || !form.class_id) { toast.error("Name, roll number, and class are required"); return; }
    if (!editing && form.email.trim() && !form.password) { toast.error("Password is required when email is provided"); return; }
    if (form.password && form.password.length < 6) { toast.error("Password must be 6+ chars"); return; }
    setSubmitting(true);

    const payload: any = {
      name: form.name.trim(),
      email: form.email.trim() || null,
      roll_number: form.roll_number.trim(),
      class_id: form.class_id,
      avatar_emoji: form.avatar_emoji,
      section: form.section,
      school_id: user!.schoolId,
    };

    if (editing) {
      // Update email/password via edge function if provided
      if (form.email.trim() !== (editing.email || "") || form.password) {
        const updatePayload: any = {
          targetUserId: editing.user_id,
          email: form.email.trim() || undefined,
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
      const { error: err } = await (supabase as any).from("students").update(payload).eq("id", editing.id);
      if (err) toast.error(err.message);
      else toast.success("Student updated");
    } else {
      // Create auth user via edge function (handles students table insert)
      if (form.email.trim() && form.password) {
        const res = await supabase.functions.invoke("create-user", {
          body: {
            email: form.email.trim(),
            password: form.password,
            role: "student",
            tenant_role: "student",
            school_id: user!.schoolId,
            branch_id: null,
            meta: {
              name: form.name.trim(),
              rollNumber: form.roll_number.trim(),
              classId: form.class_id,
              section: form.section,
              avatar_emoji: form.avatar_emoji,
            },
          },
        });
        if (res.error || res.data?.error) {
          toast.error(res.data?.error || res.error?.message || "Failed to create account");
          setSubmitting(false);
          return;
        }
        toast.success("Student created");
      } else {
        // Create student without auth account
        const { error: err } = await (supabase as any).from("students").insert({ ...payload, total_points: 0, qr_code: crypto.randomUUID() });
        if (err) toast.error(err.message);
        else toast.success("Student created");
      }
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
    else { toast.success("Student deleted"); loadData(); }
  }

  async function handleResetPassword() {
    if (!credStudent?.email) {
      toast.error("No email found for this student");
      return;
    }
    setResettingPassword(true);
    const { error } = await supabase.auth.resetPasswordForEmail(credStudent.email, {
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
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Students</h1>
          <p className="text-sm text-muted-foreground">All students in your school</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add Student</Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {showForm && (
        <Card><CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{editing ? "Edit Student" : "New Student"}</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label>Avatar Emoji</Label>
              <div className="flex items-center gap-3">
                <Input value={form.avatar_emoji} onChange={e => setForm(f => ({ ...f, avatar_emoji: e.target.value }))} className="w-16 text-center text-lg px-0" maxLength={4} />
                <span className="text-sm text-muted-foreground">Choose an emoji for this student</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-name">Full Name *</Label>
              <Input id="student-name" placeholder="Enter student's full name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-email">Email (optional for login)</Label>
              <Input id="student-email" type="email" placeholder="student@school.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              <p className="text-xs text-muted-foreground">Provide email to enable login access</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-password">
                {editing ? "New Password (optional)" : "Password"}
              </Label>
              <Input id="student-password" type="password" placeholder={editing ? "Leave blank to keep current password" : "Minimum 6 characters"} minLength={6} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <p className="text-xs text-muted-foreground">
                {editing ? "Only enter a new password if you want to change it" : "Required if email is provided for login access"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="student-roll">Roll Number *</Label>
                <Input id="student-roll" placeholder="e.g. 12345" required value={form.roll_number} onChange={e => setForm(f => ({ ...f, roll_number: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-section">Section</Label>
                <Input id="student-section" placeholder="e.g. A" value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-class">Class *</Label>
              <select id="student-class" required value={form.class_id} onChange={e => setForm(f => ({ ...f, class_id: e.target.value }))} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting} className="flex-1">{submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}{editing ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </CardContent></Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No students found. Click Add Student to create one.</div>
      ) : (
        <div className="grid gap-3">
          {students.map(s => (
            <Card key={s.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-2xl">{s.avatar_emoji || "🎓"}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.classes?.name} • Roll #{s.roll_number} • Section {s.section}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-primary">{s.total_points ?? 0}</div>
                  <div className="text-[10px] text-muted-foreground">pts</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setCredStudent(s)} title="Manage credentials"><KeyRound className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Credentials Dialog */}
      <Dialog
        open={!!credStudent}
        onOpenChange={(open) => !open && setCredStudent(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Credentials</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <div className="font-medium">{credStudent?.name}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <div className="font-medium font-mono text-sm">{credStudent?.email || "—"}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Auth User ID</Label>
              <div className="font-mono text-xs bg-muted rounded px-2 py-1 break-all">
                {credStudent?.user_id || "No auth account linked"}
              </div>
            </div>
            <div className="pt-2 border-t">
              <Button
                onClick={handleResetPassword}
                disabled={resettingPassword || !credStudent?.email}
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
    </div>
  );
}
