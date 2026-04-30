import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Plus, Trash2, Pencil, Gift } from "lucide-react";

interface Reward {
  id: string;
  name: string;
  description: string | null;
  emoji: string;
  point_cost: number;
  stock: number;
  category: string;
}

export function RewardsManager({ branchId }: { branchId?: string }) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add form
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎁");
  const [description, setDescription] = useState("");
  const [pointCost, setPointCost] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Items");

  // Edit dialog
  const [editing, setEditing] = useState<Reward | null>(null);
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [branchId]);

  async function load() {
    let query = supabase.from("rewards").select("*").order("point_cost");
    if (branchId) {
      (query as any).eq("branch_id", branchId);
    }
    const { data } = await query;
    setRewards(data || []);
  }

  async function handleAdd() {
    if (!name.trim() || !pointCost) return;
    setLoading(true);
    setError("");
    const { error: err } = await supabase.from("rewards").insert({
      name: name.trim(),
      emoji: emoji.trim() || "🎁",
      description: description.trim() || null,
      point_cost: parseInt(pointCost, 10),
      stock: parseInt(stock || "0", 10),
      category: category.trim() || "Items",
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setName(""); setEmoji("🎁"); setDescription(""); setPointCost(""); setStock(""); setCategory("Items");
    load();
  }

  async function handleDelete(id: string) {
    await supabase.from("rewards").delete().eq("id", id);
    load();
  }

  async function handleSaveEdit() {
    if (!editing) return;
    setSaving(true);
    setEditError("");
    const { error: err } = await supabase.from("rewards").update({
      name: editing.name.trim(),
      emoji: editing.emoji.trim() || "🎁",
      description: editing.description?.trim() || null,
      point_cost: editing.point_cost,
      stock: editing.stock,
      category: editing.category.trim() || "Items",
    }).eq("id", editing.id);
    setSaving(false);
    if (err) { setEditError(err.message); return; }
    setEditing(null);
    load();
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2"><Gift className="h-4 w-4" /> Add Reward</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div>
              <Label className="text-xs">Emoji</Label>
              <Input value={emoji} onChange={e => setEmoji(e.target.value)} className="rounded-xl text-center text-xl" maxLength={4} />
            </div>
            <div>
              <Label className="text-xs">Name</Label>
              <Input placeholder="Reward name" value={name} onChange={e => setName(e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Input placeholder="Short description" value={description} onChange={e => setDescription(e.target.value)} className="rounded-xl" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Points</Label>
              <Input type="number" min="0" placeholder="100" value={pointCost} onChange={e => setPointCost(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <Label className="text-xs">Stock</Label>
              <Input type="number" min="0" placeholder="10" value={stock} onChange={e => setStock(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <Input placeholder="Items" value={category} onChange={e => setCategory(e.target.value)} className="rounded-xl" />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleAdd} className="rounded-xl" disabled={!name.trim() || !pointCost || loading}>
            <Plus className="h-4 w-4 mr-1" /> {loading ? "Adding..." : "Add Reward"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {rewards.map(r => (
          <Card key={r.id} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="text-2xl">{r.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-card-foreground truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground truncate">{r.description}</div>
                <div className="text-xs font-bold text-primary mt-0.5">{r.point_cost} pts • {r.stock} in stock</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing(r)} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)} className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {rewards.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No rewards yet</p>}
      </div>

      <Dialog open={!!editing} onOpenChange={open => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Reward</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <div>
                  <Label className="text-xs">Emoji</Label>
                  <Input value={editing.emoji} onChange={e => setEditing({ ...editing, emoji: e.target.value })} className="rounded-xl text-center text-xl" maxLength={4} />
                </div>
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="rounded-xl" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Input value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} className="rounded-xl" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Points</Label>
                  <Input type="number" min="0" value={editing.point_cost} onChange={e => setEditing({ ...editing, point_cost: parseInt(e.target.value || "0", 10) })} className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs">Stock</Label>
                  <Input type="number" min="0" value={editing.stock} onChange={e => setEditing({ ...editing, stock: parseInt(e.target.value || "0", 10) })} className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs">Category</Label>
                  <Input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="rounded-xl" />
                </div>
              </div>
              {editError && <p className="text-sm text-destructive">{editError}</p>}
              <Button onClick={handleSaveEdit} className="rounded-xl w-full" disabled={!editing.name.trim() || saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
