import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Plus, Trash2, Pencil, Medal } from "lucide-react";

interface BadgeRow {
  id: string;
  name: string;
  emoji: string;
  required_points: number;
  description: string | null;
}

export function BadgesManager() {
  const [badges, setBadges] = useState<BadgeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🏅");
  const [requiredPoints, setRequiredPoints] = useState("");
  const [description, setDescription] = useState("");

  const [editing, setEditing] = useState<BadgeRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("badges").select("*").order("required_points");
    setBadges((data as BadgeRow[]) || []);
  }

  async function handleAdd() {
    const minPoints = parseInt(requiredPoints, 10);
    if (!name.trim() || Number.isNaN(minPoints) || minPoints < 0) return;
    setLoading(true);
    setError("");
    const { error: insertError } = await supabase.from("badges").insert({
      name: name.trim(),
      emoji: emoji.trim() || "🏅",
      required_points: minPoints,
      description: description.trim() || null,
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setName("");
    setEmoji("🏅");
    setRequiredPoints("");
    setDescription("");
    load();
  }

  async function handleDelete(id: string) {
    await supabase.from("badges").delete().eq("id", id);
    load();
  }

  async function handleSaveEdit() {
    if (!editing) return;
    if (!editing.name.trim() || editing.required_points < 0) return;
    setSaving(true);
    setEditError("");
    const { error: updateError } = await supabase
      .from("badges")
      .update({
        name: editing.name.trim(),
        emoji: editing.emoji.trim() || "🏅",
        required_points: editing.required_points,
        description: editing.description?.trim() || null,
      })
      .eq("id", editing.id);
    setSaving(false);
    if (updateError) {
      setEditError(updateError.message);
      return;
    }
    setEditing(null);
    load();
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Medal className="h-4 w-4" /> Add Badge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div>
              <Label className="text-xs">Emoji</Label>
              <Input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="rounded-xl text-center text-xl"
                maxLength={4}
              />
            </div>
            <div>
              <Label className="text-xs">Name</Label>
              <Input
                placeholder="Badge name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Required Points</Label>
              <Input
                type="number"
                min="0"
                placeholder="100"
                value={requiredPoints}
                onChange={(e) => setRequiredPoints(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Input
                placeholder="Optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleAdd} className="rounded-xl" disabled={!name.trim() || !requiredPoints || loading}>
            <Plus className="h-4 w-4 mr-1" /> {loading ? "Adding..." : "Add Badge"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {badges.map((badge) => (
          <Card key={badge.id} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="text-2xl">{badge.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-card-foreground truncate">{badge.name}</div>
                <div className="text-xs text-muted-foreground truncate">{badge.description || "No description"}</div>
                <div className="text-xs font-bold text-primary mt-0.5">{badge.required_points} pts required</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing(badge)} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(badge.id)} className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {badges.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No badges yet</p>}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Badge</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <div>
                  <Label className="text-xs">Emoji</Label>
                  <Input
                    value={editing.emoji}
                    onChange={(e) => setEditing({ ...editing, emoji: e.target.value })}
                    className="rounded-xl text-center text-xl"
                    maxLength={4}
                  />
                </div>
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Required Points</Label>
                  <Input
                    type="number"
                    min="0"
                    value={editing.required_points}
                    onChange={(e) =>
                      setEditing({ ...editing, required_points: parseInt(e.target.value || "0", 10) })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={editing.description || ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    className="rounded-xl"
                  />
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
