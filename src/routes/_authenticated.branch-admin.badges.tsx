import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Medal, Plus, Trash2, Pencil, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface BadgeRow {
  id: string;
  name: string;
  emoji: string;
  required_points: number;
  description: string | null;
}

export const Route = createFileRoute("/_authenticated/branch-admin/badges")({
  component: BranchAdminBadges,
});

function BranchAdminBadges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<BadgeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BadgeRow | null>(null);
  const [form, setForm] = useState({ name: "", emoji: "🏅", required_points: 0, description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.schoolId) loadBadges();
  }, [user]);

  async function loadBadges() {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("badges")
      .select("id, name, emoji, required_points, description")
      .order("required_points");
    if (err) {
      setError(`${err.message} (${err.code})`);
      toast.error(err.message);
    } else {
      setBadges((data as BadgeRow[]) || []);
    }
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", emoji: "🏅", required_points: 0, description: "" });
    setShowForm(true);
  }

  function openEdit(b: BadgeRow) {
    setEditing(b);
    setForm({
      name: b.name || "",
      emoji: b.emoji || "🏅",
      required_points: b.required_points || 0,
      description: b.description || "",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || form.required_points < 0) {
      toast.error("Name is required and points must be 0 or more");
      return;
    }
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      emoji: form.emoji,
      required_points: Number(form.required_points),
      description: form.description.trim() || null,
    };

    if (editing) {
      const { error: err } = await supabase
        .from("badges")
        .update(payload)
        .eq("id", editing.id);
      if (err) toast.error(err.message);
      else toast.success("Badge updated");
    } else {
      const { error: err } = await supabase.from("badges").insert(payload);
      if (err) toast.error(err.message);
      else toast.success("Badge created");
    }

    setShowForm(false);
    setEditing(null);
    setSubmitting(false);
    loadBadges();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this badge?")) return;
    const { error: err } = await supabase.from("badges").delete().eq("id", id);
    if (err) toast.error(err.message);
    else { toast.success("Badge deleted"); loadBadges(); }
  }

  const allowedRoles = ["branch_admin", "school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Badges</h1>
          <p className="text-sm text-muted-foreground">Create and edit badge milestones students can earn</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add Badge</Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {showForm && (
        <Card><CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{editing ? "Edit Badge" : "New Badge"}</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
              <Input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} className="w-16 text-center text-lg px-0" maxLength={4} />
              <Input placeholder="Badge Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder="Required Points" required min={0} value={form.required_points} onChange={e => setForm(f => ({ ...f, required_points: Number(e.target.value) }))} />
              <Input placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
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
      ) : badges.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No badges found. Click Add Badge to create one.</div>
      ) : (
        <div className="grid gap-3">
          {badges.map(b => (
            <Card key={b.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-2xl">{b.emoji || "🏅"}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.description || "No description"}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-primary">{b.required_points} pts</div>
                  <div className="text-[10px] text-muted-foreground">required</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(b.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
