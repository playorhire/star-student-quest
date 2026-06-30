import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";
import { HouseLeaderboard } from "@/components/HouseLeaderboard";
import { ErrorState } from "@/components/ErrorState";
import { notifyError, describeSupabaseError } from "@/lib/handle-error";

type StudentProfile = {
  id: string;
  avatar_emoji: string;
  branch_id: string | null;
  lifetime_points: number;
  name: string;
  roll_number: string;
  total_points: number;
  classes: { name: string | null } | null;
};

type BadgeRecord = {
  id: string;
  emoji: string;
  name: string;
  required_points: number;
};

type RecentTransaction = {
  id: string;
  points_awarded: number;
  marks_entered: number;
  subjects: { name: string | null } | null;
};

export const Route = createFileRoute("/_authenticated/student/dashboard")({
  component: StudentDashboard,
});

function StudentDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [badges, setBadges] = useState<BadgeRecord[]>([]);
  const [recentTxns, setRecentTxns] = useState<RecentTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setError(null);
    setLoading(true);
    try {
      const { data: s, error: sErr } = await supabase
        .from("students")
        .select("*, classes(name), lifetime_points, branch_id")
        .eq("user_id", user.id)
        .single();
      if (sErr) throw sErr;
      if (!s) { setError("We couldn't find your student profile. Please contact your school admin."); return; }
      setStudent(s);

      const [b, txns] = await Promise.all([
        supabase.from("badges").select("id, emoji, name, required_points").order("required_points"),
        supabase.from("point_transactions").select("id, points_awarded, marks_entered, created_at, subjects(name)").eq("student_id", s.id).order("created_at", { ascending: false }).limit(10),
      ]);
      if (b.error) throw b.error;
      if (txns.error) throw txns.error;
      setBadges(b.data || []);
      setRecentTxns(txns.data || []);
    } catch (err) {
      const msg = describeSupabaseError(err);
      setError(msg);
      notifyError("Couldn't load your dashboard", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { if (user) load(); }, [user, load]);

  // Realtime: live student total + new-points toast
  useEffect(() => {
    if (!student?.id || !user?.id) return;
    const channel = supabase
      .channel(`student-dash-${student.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "students", filter: `id=eq.${student.id}` },
        (payload) => { if (payload.new) setStudent((s) => (s ? { ...s, ...payload.new } : s)); })
      .on("postgres_changes", { event: "*", schema: "public", table: "point_transactions", filter: `student_id=eq.${student.id}` },
        () => { load(); })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => { toast.success(payload.new.title, { description: payload.new.body }); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [student?.id, user?.id, load]);

  if (error && !student) {
    return (
      <div className="py-6">
        <ErrorState message={error} onRetry={() => load()} />
      </div>
    );
  }
  if (!student) return <div className="flex justify-center py-12"><div className="text-2xl animate-bounce">🎓</div></div>;

  const earnedBadges = badges.filter(b => (student.lifetime_points ?? student.total_points) >= b.required_points);
  const nextBadge = badges.find(b => (student.lifetime_points ?? student.total_points) < b.required_points);
  const badgePoints = student.lifetime_points ?? student.total_points;
  const progress = nextBadge ? Math.min(100, (badgePoints / nextBadge.required_points) * 100) : 100;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6 text-center">
          <div className="text-5xl mb-2">{student.avatar_emoji}</div>
          <h2 className="text-xl font-black text-foreground">{student.name}</h2>
          <p className="text-xs text-muted-foreground">{student.classes?.name} • Roll #{student.roll_number}</p>
          <div className="text-4xl font-black text-primary mt-3">{student.total_points}</div>
          <p className="text-xs text-muted-foreground">Total Points</p>
        </CardContent>
      </Card>

      {nextBadge && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-foreground">Next: {nextBadge.emoji} {nextBadge.name}</span>
              <span className="text-xs text-muted-foreground">{badgePoints}/{nextBadge.required_points}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>
      )}

      <HouseLeaderboard branchId={student.branch_id} />

      {earnedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2">Badges Earned</h3>
          <div className="flex gap-2 flex-wrap">
            {earnedBadges.map(b => (
              <div key={b.id} className="rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-center">
                <div className="text-2xl">{b.emoji}</div>
                <div className="text-[10px] font-bold text-foreground">{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-foreground mb-2">Recent Activity</h3>
        <div className="space-y-2">
          {recentTxns.map(tx => (
            <Card key={tx.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">{tx.subjects?.name}</div>
                  <div className="text-xs text-muted-foreground">{tx.marks_entered} marks</div>
                </div>
                <div className="font-black text-primary">+{tx.points_awarded}</div>
              </CardContent>
            </Card>
          ))}
          {recentTxns.length === 0 && <p className="text-sm text-muted-foreground">No activity yet</p>}
        </div>
      </div>
    </div>
  );
}
