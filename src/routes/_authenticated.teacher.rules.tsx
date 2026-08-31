import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { BookOpen, Save, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/teacher/rules")({
  component: TeacherRules,
});

type Rule = {
  id: string;
  passing_marks: number;
  min_marks: number;
  max_marks: number;
  multiplier: number;
  subjects: { id: string; name: string; classes: { name: string } | null } | null;
};

type Draft = { passing: string; min: string; max: string };

function TeacherRules() {
  const { user } = useAuth();
  const [rules, setRules] = useState<Rule[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadRules = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    const { data: teacher, error: teacherError } = await supabase
      .from("teachers")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (teacherError || !teacher) {
      toast.error("Teacher profile not found");
      setLoading(false);
      return;
    }

    const { data: assignments, error: assignmentsError } = await supabase
      .from("teacher_assignments")
      .select("subject_id")
      .eq("teacher_id", teacher.id);

    if (assignmentsError) {
      toast.error("Unable to load your activities");
      setLoading(false);
      return;
    }

    const subjectIds = [...new Set((assignments ?? []).map((assignment) => assignment.subject_id))];
    if (subjectIds.length === 0) {
      setRules([]);
      setDrafts({});
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("point_rules")
      .select("id, passing_marks, min_marks, max_marks, multiplier, subjects(id, name, classes(name))")
      .in("subject_id", subjectIds)
      .order("subject_id");

    if (error) {
      toast.error("Unable to load marking rules");
      setLoading(false);
      return;
    }

    const loadedRules = (data ?? []) as Rule[];
    setRules(loadedRules);
    setDrafts(Object.fromEntries(loadedRules.map((rule) => [rule.id, {
      passing: String(rule.passing_marks),
      min: String(rule.min_marks),
      max: String(rule.max_marks),
    }])));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { void loadRules(); }, [loadRules]);

  const setDraft = (ruleId: string, field: keyof Draft, value: string) => {
    setDrafts((current) => ({ ...current, [ruleId]: { ...current[ruleId], [field]: value } }));
  };

  const saveRule = async (rule: Rule) => {
    const draft = drafts[rule.id];
    const passing = Number(draft?.passing);
    const min = Number(draft?.min);
    const max = Number(draft?.max);

    if (![passing, min, max].every(Number.isInteger) || min < 0 || max < min || passing < min || passing > max) {
      toast.error("Use whole numbers: minimum ≤ passing mark ≤ maximum.");
      return;
    }

    setSavingId(rule.id);
    const { error } = await supabase
      .from("point_rules")
      .update({ passing_marks: passing, min_marks: min, max_marks: max })
      .eq("id", rule.id);
    setSavingId(null);

    if (error) {
      toast.error(error.message || "Unable to save the marking rule");
      return;
    }

    setRules((current) => current.map((item) => item.id === rule.id
      ? { ...item, passing_marks: passing, min_marks: min, max_marks: max }
      : item));
    toast.success(`${rule.subjects?.name || "Activity"} rule saved`);
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading marking rules…</p>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-foreground">Marking Rules</h1>
        <p className="text-sm text-muted-foreground">Set the minimum, passing, and maximum marks for each of your activities.</p>
      </div>

      {rules.map((rule) => {
        const draft = drafts[rule.id];
        return (
          <Card key={rule.id} className="border-0 shadow-sm">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-bold text-sm">{rule.subjects?.name || "Activity"}</p>
                  <p className="text-xs text-muted-foreground">{rule.subjects?.classes?.name || "Assigned class"}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label className="text-xs">Minimum</Label><Input aria-label="Minimum marks" type="number" min="0" step="1" value={draft?.min ?? ""} onChange={(event) => setDraft(rule.id, "min", event.target.value)} /></div>
                <div><Label className="text-xs">Passing</Label><Input aria-label="Passing marks" type="number" min="0" step="1" value={draft?.passing ?? ""} onChange={(event) => setDraft(rule.id, "passing", event.target.value)} /></div>
                <div><Label className="text-xs">Maximum</Label><Input aria-label="Maximum marks" type="number" min="0" step="1" value={draft?.max ?? ""} onChange={(event) => setDraft(rule.id, "max", event.target.value)} /></div>
              </div>
              <p className="text-xs text-muted-foreground">Scores must be within the minimum–maximum range. Students pass at the passing mark or above.</p>
              <Button size="sm" className="rounded-xl" onClick={() => void saveRule(rule)} disabled={savingId === rule.id}>
                <Save className="mr-1 h-3 w-3" /> {savingId === rule.id ? "Saving…" : "Save rule"}
              </Button>
            </CardContent>
          </Card>
        );
      })}

      {rules.length === 0 && (
        <Card className="border-dashed"><CardContent className="p-6 text-center">
          <Settings2 className="mx-auto mb-2 h-7 w-7 text-muted-foreground" />
          <p className="font-medium">No assigned activities yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Ask an administrator to assign you to a subject or activity.</p>
        </CardContent></Card>
      )}
    </div>
  );
}
