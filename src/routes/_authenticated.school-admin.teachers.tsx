import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Users, Plus, Trash2, Pencil, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export const Route = createFileRoute("/_authenticated/school-admin/teachers")({
  component: SchoolAdminTeachers,
});

function SchoolAdminTeachers() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", avatar_emoji: "👨‍🏫" });
  const [submitting, setSubmitting] = useState(false);

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

  function openCreate() {
    setEditing(null);
    setForm({ name: "", email: "", avatar_emoji: "👨‍🏫" });
    setShowForm(true);
  }

  function openEdit(t: any) {
    setEditing(t);
    setForm({ name: t.name || "", email: t.email || "", avatar_emoji: t.avatar_emoji || "👨‍🏫" });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { toast.error("Name and email required"); return; }
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      avatar_emoji: form.avatar_emoji,
      school_id: user!.schoolId,
    };

    if (editing) {
      const { error: err } = await (supabase as any).from("teachers").update(payload).eq("id", editing.id);
      if (err) toast.error(err.message);
      else toast.success("Teacher updated");
    } else {
      const { error: err } = await (supabase as any).from("teachers").insert(payload);
      if (err) toast.error(err.message);
      else toast.success("Teacher created");
    }

    setShowForm(false);
    setEditing(null);
    setSubmitting(false);
    loadTeachers();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this teacher?")) return;
    const { error: err } = await (supabase as any).from("teachers").delete().eq("id", id);
    if (err) toast.error(err.message);
    else { toast.success("Teacher deleted"); loadTeachers(); }
  }

  const allowedRoles = ["school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Teachers</h1>
          <p className="text-sm text-muted-foreground">All teachers in your school</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add Teacher</Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          <strong>Error:</strong> {error}
          <div className="mt-1 text-xs opacity-80">
            {error.includes("400") && "The 'school_id' column is likely missing from the 'teachers' table. Run the SQL fix in Supabase SQL Editor."}
          </div>
        </div>
      )}

      {showForm && (
        <Card><CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{editing ? "Edit Teacher" : "New Teacher"}</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
              <Input value={form.avatar_emoji} onChange={e => setForm(f => ({ ...f, avatar_emoji: e.target.value }))} className="w-16 text-center text-lg px-0" maxLength={4} />
              <Input placeholder="Full Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <Input type="email" placeholder="Email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting} className="flex-1">{submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}{editing ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </CardContent></Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No teachers found. Click Add Teacher to create one.</div>
      ) : (
        <div className="grid gap-3">
          {teachers.map(t => (
            <Card key={t.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-2xl">{t.avatar_emoji || "👨‍🏫"}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.email}</div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
