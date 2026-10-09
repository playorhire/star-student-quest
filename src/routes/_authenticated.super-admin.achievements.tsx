import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Award, RefreshCw, Search, Star, Trophy, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/super-admin/achievements")({ component: SuperAdminAchievements });

function SuperAdminAchievements() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const selected = students.find((student) => student.id === studentId);
  const filteredStudents = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return students;
    return students.filter((s) => [s.name, s.roll_number, s.email, s.schools?.name, s.classes?.name]
      .filter(Boolean).some((value) => String(value).toLowerCase().includes(needle)));
  }, [students, search]);

  async function loadStudents() {
    setLoading(true);
    const { data, error } = await (supabase as any).from("students")
      .select("id, name, email, roll_number, total_points, lifetime_points, avatar_emoji, school_id, class_id, schools:schools!students_school_id_fkey(name), classes:classes!students_class_id_fkey(name)")
      .order("name");
    if (error) toast.error(error.message || "Could not load students");
    else setStudents(data || []);
    setLoading(false);
  }

  async function loadAchievementData(id: string) {
    const [txResult, badgeResult] = await Promise.all([
      (supabase as any).from("point_transactions").select("id, points_awarded, notes, transaction_type, created_at, subjects(name), teachers(name)").eq("student_id", id).order("created_at", { ascending: false }),
      (supabase as any).from("student_badges").select("id, earned_at, badges(name, description, emoji, required_points)").eq("student_id", id).order("earned_at", { ascending: false }),
    ]);
    if (txResult.error) toast.error(txResult.error.message || "Could not load point history");
    else setTransactions(txResult.data || []);
    if (badgeResult.error) toast.error(badgeResult.error.message || "Could not load badges");
    else setBadges(badgeResult.data || []);
  }

  useEffect(() => { if (user?.role === "super_admin") void loadStudents(); }, [user]);
  useEffect(() => { if (studentId) void loadAchievementData(studentId); else { setTransactions([]); setBadges([]); } }, [studentId]);

  async function awardPoints(event: React.FormEvent) {
    event.preventDefault();
    const amount = Number(points);
    if (!selected || !Number.isSafeInteger(amount) || amount <= 0 || !reason.trim()) {
      toast.error("Enter a positive whole number of points and a reason");
      return;
    }
    setSaving(true);
    const { error } = await (supabase as any).from("point_transactions").insert({
      student_id: selected.id,
      teacher_id: null,
      subject_id: null,
      marks_entered: 0,
      passing_marks: 0,
      multiplier: 1,
      points_awarded: amount,
      school_id: selected.school_id || null,
      transaction_type: "admin_award",
      notes: reason.trim(),
    });
    if (error) toast.error(error.message || "Could not award points");
    else {
      toast.success(`${amount} points awarded to ${selected.name}`);
      setPoints(""); setReason("");
      await Promise.all([loadStudents(), loadAchievementData(selected.id)]);
    }
    setSaving(false);
  }

  if (!user || user.role !== "super_admin") return <div className="py-20 text-center font-semibold">Access denied</div>;

  return <div className="space-y-5">
    <div className="flex items-start justify-between gap-3">
      <div><h1 className="text-2xl font-black">Student Achievements</h1><p className="text-sm text-muted-foreground">Review badges and point history, then award points.</p></div>
      <Button variant="outline" size="sm" onClick={() => { void loadStudents(); if (studentId) void loadAchievementData(studentId); }} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</Button>
    </div>

    <Card><CardContent className="space-y-3 p-4">
      <Label htmlFor="student-search">Find a student</Label>
      <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input id="student-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, roll number, school or class" className="pl-9" /></div>
      <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
        <option value="">Select a student ({filteredStudents.length})</option>
        {filteredStudents.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.schools?.name || "No school"} · #{s.roll_number || "—"}</option>)}
      </select>
    </CardContent></Card>

    {selected && <>
      <Card className="border-primary/20"><CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">{selected.avatar_emoji || "🎓"}</div>
        <div className="min-w-0 flex-1"><div className="font-bold">{selected.name}</div><div className="text-xs text-muted-foreground">{selected.schools?.name || "No school"} · {selected.classes?.name || "No class"} · #{selected.roll_number || "—"}</div></div>
        <div className="text-right"><div className="text-2xl font-black text-primary">{selected.total_points ?? 0}</div><div className="text-[10px] text-muted-foreground">points available</div></div>
      </CardContent></Card>

      <Card><CardContent className="p-4"><div className="mb-3 flex items-center gap-2 font-bold"><Zap className="h-4 w-4 text-primary" />Award points</div>
        <form onSubmit={awardPoints} className="space-y-3">
          <div><Label htmlFor="award-points">Points</Label><Input id="award-points" type="number" min="1" step="1" required value={points} onChange={(e) => setPoints(e.target.value)} placeholder="e.g. 10" /></div>
          <div><Label htmlFor="award-reason">Reason</Label><Input id="award-reason" required maxLength={240} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Helped a classmate" /></div>
          <Button type="submit" disabled={saving || !points || !reason.trim()} className="w-full">{saving ? "Awarding…" : "Award points"}</Button>
        </form>
      </CardContent></Card>

      <section className="space-y-3"><h2 className="flex items-center gap-2 font-bold"><Trophy className="h-4 w-4 text-amber-500" />Earned badges ({badges.length})</h2>
        {badges.length ? <div className="grid grid-cols-2 gap-2">{badges.map((item) => <Card key={item.id}><CardContent className="flex items-center gap-3 p-3"><span className="text-2xl">{item.badges?.emoji || "🏅"}</span><div className="min-w-0"><div className="truncate text-sm font-semibold">{item.badges?.name || "Badge"}</div><div className="text-[11px] text-muted-foreground">Earned {new Date(item.earned_at).toLocaleDateString()}</div></div></CardContent></Card>)}</div> : <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">No badges earned yet.</p>}
      </section>

      <section className="space-y-3"><h2 className="flex items-center gap-2 font-bold"><Award className="h-4 w-4 text-primary" />Achievement and point history ({transactions.length})</h2>
        {transactions.length ? transactions.map((tx) => <Card key={tx.id}><CardContent className="flex items-start gap-3 p-3"><Star className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" /><div className="min-w-0 flex-1"><div className="text-sm font-semibold">{tx.notes || tx.subjects?.name || "Points awarded"}</div><div className="text-[11px] text-muted-foreground">{tx.transaction_type === "admin_award" ? "Super Admin" : tx.teachers?.name || "Teacher"} · {new Date(tx.created_at).toLocaleString()}</div></div><div className="font-black text-primary">+{tx.points_awarded}</div></CardContent></Card>) : <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">No point history yet.</p>}
      </section>
    </>}
  </div>;
}
