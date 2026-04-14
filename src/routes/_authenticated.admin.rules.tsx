import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { subjects, classes, updateSubject } from "../lib/mock-data";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Save, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/rules")({
  component: AdminRules,
});

function AdminRules() {
  const [, setTick] = useState(0);
  const rerender = () => setTick(t => t + 1);
  const [editId, setEditId] = useState<string | null>(null);
  const [editPassing, setEditPassing] = useState("");
  const [editMultiplier, setEditMultiplier] = useState("");
  const [filterClass, setFilterClass] = useState("");

  const startEdit = (sub: typeof subjects[0]) => {
    setEditId(sub.id);
    setEditPassing(String(sub.passingMarks));
    setEditMultiplier(String(sub.multiplier));
  };

  const saveEdit = () => {
    if (!editId) return;
    const pm = parseInt(editPassing);
    const mul = parseFloat(editMultiplier);
    if (!isNaN(pm) && !isNaN(mul) && pm >= 0 && mul > 0) {
      updateSubject(editId, { passingMarks: pm, multiplier: mul });
    }
    setEditId(null);
    rerender();
  };

  const filtered = filterClass ? subjects.filter(s => s.className === filterClass) : subjects;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Point Rules</h1>
        <p className="text-sm text-muted-foreground">Configure passing marks and multipliers per subject</p>
      </div>

      {/* Formula explanation */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="font-bold text-sm text-card-foreground mb-1">📐 Point Formula</div>
          <div className="text-sm text-muted-foreground">
            Points = (<span className="font-semibold text-foreground">Marks</span> − <span className="font-semibold text-primary">Passing Marks</span>) × <span className="font-semibold text-secondary">Multiplier</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Only awarded if marks ≥ passing marks</div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Button variant={filterClass === "" ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setFilterClass("")}>All</Button>
        {classes.map(c => (
          <Button key={c.id} variant={filterClass === c.name ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setFilterClass(c.name)}>{c.name}</Button>
        ))}
      </div>

      {/* Subject Rules */}
      <div className="space-y-2">
        {filtered.map((sub) => (
          <Card key={sub.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              {editId === sub.id ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm text-card-foreground">{sub.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{sub.className}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Passing Marks</Label>
                      <Input type="number" value={editPassing} onChange={e => setEditPassing(e.target.value)} className="rounded-xl" min="0" max="100" />
                    </div>
                    <div>
                      <Label className="text-xs">Multiplier</Label>
                      <Input type="number" value={editMultiplier} onChange={e => setEditMultiplier(e.target.value)} className="rounded-xl" min="0.1" step="0.1" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="rounded-xl" onClick={saveEdit}>
                      <Save className="h-3 w-3 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-xl" onClick={() => setEditId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <button onClick={() => startEdit(sub)} className="w-full text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-bold text-sm text-card-foreground">{sub.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{sub.className}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Pass</div>
                        <div className="font-black text-primary text-sm">{sub.passingMarks}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">×</div>
                        <div className="font-black text-secondary text-sm">{sub.multiplier}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">Tap to edit • Example: (80 − {sub.passingMarks}) × {sub.multiplier} = {(80 - sub.passingMarks) * sub.multiplier} pts</div>
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
