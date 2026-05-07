import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Home, Users, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { HouseLeaderboard } from "@/components/HouseLeaderboard";

export const Route = createFileRoute("/_authenticated/branch-admin/houses")({
  component: BranchAdminHouses,
});

interface House {
  id: string;
  name: string;
  color: string;
  emoji: string;
  total_points: number;
  student_count?: number;
  teacher_count?: number;
}

const PRESETS = [
  { name: "Red", color: "#ef4444", emoji: "🔴" },
  { name: "Blue", color: "#3b82f6", emoji: "🔵" },
  { name: "Green", color: "#22c55e", emoji: "🟢" },
  { name: "Yellow", color: "#eab308", emoji: "🟡" },
  { name: "Silver", color: "#94a3b8", emoji: "⚪" },
];

function BranchAdminHouses() {
  const { user } = useAuth();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<House | null>(null);
  const [form, setForm] = useState({ name: "", color: "#ef4444", emoji: "🏠" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user?.branchId) load(); }, [user]);

  async function load() {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("houses")
      .select("id, name, color, emoji, total_points")
      .eq("branch_id", user!.branchId)
      .order("name");
    const list: House[] = data || [];

    // Counts
    if (list.length > 0) {
      const ids = list.map(h => h.id);
      const [sc, tc] = await Promise.all([
        (supabase as any).from("students").select("house_id").in("house_id", ids),
        (supabase as any).from("teachers").select("house_id").in("house_id", ids),
      ]);
      const sCounts: Record<string, number> = {};
      const tCounts: Record<string, number> = {};
      (sc.data || []).forEach((r: any) => { sCounts[r.house_id] = (sCounts[r.house_id] || 0) + 1; });
      (tc.data || []).forEach((r: any) => { tCounts[r.house_id] = (tCounts[r.house_id] || 0) + 1; });
      list.forEach(h => { h.student_count = sCounts[h.id] || 0; h.teacher_count = tCounts[h.id] || 0; });
    }
    setHouses(list);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", color: "#ef4444", emoji: "🏠" });
    setShowForm(true);
  }

  function openEdit(h: House) {
    setEditing(h);
    setForm({ name: h.name, color: h.color, emoji: h.emoji });
    setShowForm(true);
  }

  function applyPreset(p: typeof PRESETS[number]) {
    setForm({ name: p.name, color: p.color, emoji: p.emoji });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      color: form.color,
      emoji: form.emoji || "🏠",
      school_id: user!.schoolId,
      branch_id: user!.branchId,
    };
    const res = editing
      ? await (supabase as any).from("houses").update(payload).eq("id", editing.id)
      : await (supabase as any).from("houses").insert(payload);
    if (res.error) toast.error(res.error.message);
    else {
      toast.success(editing ? "House updated" : "House created");
      setShowForm(false);
      load();
    }
    setSaving(false);
  }

  async function remove(h: House) {
    if (!confirm(`Delete house "${h.name}"? Members will be unassigned.`)) return;
    const { error } = await (supabase as any).from("houses").delete().eq("id", h.id);
    if (error) toast.error(error.message);
    else { toast.success("House deleted"); load(); }
  }

  const allowed = ["branch_admin", "school_admin", "admin", "super_admin"];
  if (!user || !allowed.includes(user.role)) {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Houses</h1>
          <p className="text-sm text-muted-foreground">Group students and teachers into houses</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add House</Button>
      </div>

      <HouseLeaderboard branchId={user.branchId} />

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : houses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Home className="h-10 w-10 mx-auto mb-2 opacity-30" />
          No houses yet. Create one to get started.
        </div>
      ) : (
        <div className="grid gap-3">
          {houses.map(h => (
            <Card key={h.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: h.color + "20", border: `2px solid ${h.color}` }}
                >
                  {h.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold">{h.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-3">
                    <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{h.student_count ?? 0}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{h.teacher_count ?? 0}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-primary">{h.total_points}</div>
                  <div className="text-[10px] text-muted-foreground">pts</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(h)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(h)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={(o) => !o && setShowForm(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit House" : "New House"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            {!editing && (
              <div className="space-y-2">
                <Label>Quick presets</Label>
                <div className="flex gap-2 flex-wrap">
                  {PRESETS.map(p => (
                    <Button key={p.name} type="button" variant="outline" size="sm" onClick={() => applyPreset(p)}>
                      <span className="mr-1">{p.emoji}</span>{p.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Red" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Emoji</Label>
                <Input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} maxLength={4} className="text-center text-lg" />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="h-10 p-1" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving} className="flex-1">{editing ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}