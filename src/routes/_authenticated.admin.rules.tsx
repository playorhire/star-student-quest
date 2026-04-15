import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Save, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/rules")({
  component: AdminRules,
});

interface RuleRow {
  id: string;
  passing_marks: number;
  multiplier: number;
  subject_id: string;
  subjects: { id: string; name: string; class_id: string; classes: { name: string } | null } | null;
}

interface ClassRow { id: string; name: string; }

function AdminRules() {
  const [rules, setRules] = useState<RuleRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editPassing, setEditPassing] = useState("");
  const [editMultiplier, setEditMultiplier] = useState("");
  const [filterClassId, setFilterClassId] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const [r, c] = await Promise.all([
      supabase.from("point_rules").select("id, passing_marks, multiplier, subject_id, subjects(id, name, class_id, classes(name))").order("subject_id"),
      supabase.from("classes").select("id, name").order("name"),
    ]);
    setRules(r.data as any || []);
    setClasses(c.data || []);
  }

  const startEdit = (rule: RuleRow) => {
    setEditId(rule.id);
    setEditPassing(String(rule.passing_marks));
    setEditMultiplier(String(rule.multiplier));
  };

  async function saveEdit() {
    if (!editId) return;
    const pm = parseInt(editPassing);
    const mul = parseFloat(editMultiplier);
    if (!isNaN(pm) && !isNaN(mul) && pm >= 0 && mul > 0) {
      await supabase.from("point_rules").update({ passing_marks: pm, multiplier: mul }).eq("id", editId);
    }
    setEditId(null);
    load();
  }

  const filtered = filterClassId
    ? rules.filter(r => r.subjects?.class_id === filterClassId)
    : rules;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Point Rules</h1>
        <p className="text-sm text-muted-foreground">Configure passing marks and multipliers per subject</p>
      </div>

      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="font-bold text-sm text-card-foreground mb-1">📐 Point Formula</div>
          <div className="text-sm text-muted-foreground">
            Points = (<span className="font-semibold text-foreground">Marks</span> − <span className="font-semibold text-primary">Passing Marks</span>) × <span className="font-semibold text-secondary">Multiplier</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Only awarded if marks ≥ passing marks</div>
        </CardContent>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Button variant={filterClassId === "" ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setFilterClassId("")}>All</Button>
        {classes.map(c => (
          <Button key={c.id} variant={filterClassId === c.id ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setFilterClassId(c.id)}>{c.name}</Button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(rule => {
          const sub = rule.subjects;
          if (!sub) return null;
          return (
            <Card key={rule.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                {editId === rule.id ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-bold text-sm text-card-foreground">{sub.name}</span>
                      <Badge variant="secondary" className="text-[10px]">{sub.classes?.name}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-xs">Passing Marks</Label><Input type="number" value={editPassing} onChange={e => setEditPassing(e.target.value)} className="rounded-xl" min="0" max="100" /></div>
                      <div><Label className="text-xs">Multiplier</Label><Input type="number" value={editMultiplier} onChange={e => setEditMultiplier(e.target.value)} className="rounded-xl" min="0.1" step="0.1" /></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="rounded-xl" onClick={saveEdit}><Save className="h-3 w-3 mr-1" /> Save</Button>
                      <Button size="sm" variant="ghost" className="rounded-xl" onClick={() => setEditId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => startEdit(rule)} className="w-full text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-bold text-sm text-card-foreground">{sub.name}</span>
                        <Badge variant="secondary" className="text-[10px]">{sub.classes?.name}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Pass</div>
                          <div className="font-black text-primary text-sm">{rule.passing_marks}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">×</div>
                          <div className="font-black text-secondary text-sm">{rule.multiplier}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">Tap to edit • Example: (80 − {rule.passing_marks}) × {rule.multiplier} = {((80 - rule.passing_marks) * Number(rule.multiplier)).toFixed(0)} pts</div>
                  </button>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">No rules yet. Add subjects in Classes & Subjects first.</p>}
      </div>
    </div>
  );
}
