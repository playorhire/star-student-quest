import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Gift, Plus, Trash2, Pencil, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export const Route = createFileRoute("/_authenticated/branch-admin/rewards")({
  component: BranchAdminRewards,
});

function BranchAdminRewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", emoji: "🎁", point_cost: 0, stock: 0, category: "Items" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.branchId) loadRewards();
  }, [user]);

  async function loadRewards() {
    setLoading(true);
    setError(null);
    const { data, error: err } = await (supabase as any)
      .from("rewards")
      .select("id, name, emoji, point_cost, stock, description, category")
      .eq("branch_id", user!.branchId)
      .order("point_cost");
    if (err) {
      setError(`${err.message} (${err.code})`);
      toast.error(err.message);
    } else {
      setRewards(data || []);
    }
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", description: "", emoji: "🎁", point_cost: 0, stock: 0, category: "Items" });
    setShowForm(true);
  }

  function openEdit(r: any) {
    setEditing(r);
    setForm({
      name: r.name || "",
      description: r.description || "",
      emoji: r.emoji || "🎁",
      point_cost: r.point_cost || 0,
      stock: r.stock ?? 0,
      category: r.category || "Items",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      emoji: form.emoji,
      point_cost: Number(form.point_cost),
      stock: Number(form.stock),
      category: form.category,
      school_id: user!.schoolId,
      branch_id: user!.branchId,
    };

    if (editing) {
      const { error: err } = await (supabase as any).from("rewards").update(payload).eq("id", editing.id);
      if (err) toast.error(err.message);
      else toast.success("Reward updated");
    } else {
      const { error: err } = await (supabase as any).from("rewards").insert(payload);
      if (err) toast.error(err.message);
      else toast.success("Reward created");
    }

    setShowForm(false);
    setEditing(null);
    setSubmitting(false);
    loadRewards();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this reward?")) return;
    const { error: err } = await (supabase as any).from("rewards").delete().eq("id", id);
    if (err) toast.error(err.message);
    else { toast.success("Reward deleted"); loadRewards(); }
  }

  const allowedRoles = ["branch_admin", "school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Branch Rewards</h1>
          <p className="text-sm text-muted-foreground">Rewards catalog for your branch</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add Reward</Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {showForm && (
        <Card><CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{editing ? "Edit Reward" : "New Reward"}</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
              <Input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} className="w-16 text-center text-lg px-0" maxLength={4} />
              <Input placeholder="Reward Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <Input placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <div className="grid grid-cols-3 gap-3">
              <Input type="number" placeholder="Point Cost" required min={1} value={form.point_cost} onChange={e => setForm(f => ({ ...f, point_cost: Number(e.target.value) }))} />
              <Input type="number" placeholder="Stock" required min={0} value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} />
              <Input placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
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
      ) : rewards.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No rewards found. Click Add Reward to create one.</div>
      ) : (
        <div className="grid gap-3">
          {rewards.map(r => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-2xl">{r.emoji || "🎁"}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{r.name}</div>
                  {r.description && <div className="text-xs text-muted-foreground truncate">{r.description}</div>}
                  <div className="text-[10px] text-muted-foreground">{r.category} • {r.stock ?? 0} in stock</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-primary">{r.point_cost} pts</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
