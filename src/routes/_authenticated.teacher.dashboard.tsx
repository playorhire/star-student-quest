import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "../components/ui/card";
import { TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { HouseLeaderboard } from "@/components/HouseLeaderboard";
import { ErrorState } from "@/components/ErrorState";
import { notifyError, describeSupabaseError } from "@/lib/handle-error";

export const Route = createFileRoute("/_authenticated/teacher/dashboard")({
  component: TeacherDashboard,
});

function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ pointsToday: 0, totalStudents: 0, totalScans: 0 });
  const [recentTxns, setRecentTxns] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [user]);

  async function load() {
    setError(null);
    setLoading(true);
    try {
    const today = new Date().toISOString().split("T")[0];
    const studentsQuery = supabase.from("students").select("id", { count: "exact", head: true });
    if (user?.branchId) {
      (studentsQuery as any).eq("branch_id", user.branchId);
    }
    
    const todayTxQuery = supabase.from("point_transactions").select("points_awarded").gte("created_at", today);
    const totalTxQuery = supabase.from("point_transactions").select("id", { count: "exact", head: true });
    const recentQuery = supabase.from("point_transactions").select("id, points_awarded, marks_entered, created_at, students(name, avatar_emoji), subjects(name)").order("created_at", { ascending: false }).limit(5);
    
    if (user?.branchId) {
      (todayTxQuery as any).eq("branch_id", user.branchId);
      (totalTxQuery as any).eq("branch_id", user.branchId);
      (recentQuery as any).eq("branch_id", user.branchId);
    }
    
    const [todayTx, studentsCount, totalTx, recent] = await Promise.all([
      todayTxQuery,
      studentsQuery,
      totalTxQuery,
      recentQuery,
    ]);
    const firstErr = [todayTx, studentsCount, totalTx, recent].find((r: any) => r.error)?.error;
    if (firstErr) throw firstErr;
    setStats({
      pointsToday: (todayTx.data || []).reduce((s, t) => s + t.points_awarded, 0),
      totalStudents: studentsCount.count || 0,
totalScans: totalTx.count || 0,
      // label kept as "totalScans" for backward compat; UI says "Records"
    });
    setRecentTxns(recent.data || []);
    } catch (err) {
      const msg = describeSupabaseError(err);
      setError(msg);
      notifyError("Couldn't load dashboard", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your teaching overview</p>
      </div>
      {error && !loading && (
        <ErrorState message={error} onRetry={() => load()} />
      )}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-2 border-primary/20"><CardContent className="p-4 text-center"><Zap className="mx-auto h-6 w-6 text-primary mb-1" /><div className="text-2xl font-black text-primary">{stats.pointsToday}</div><div className="text-[10px] text-muted-foreground font-semibold">Points Today</div></CardContent></Card>
        <Card className="border-2 border-secondary/20"><CardContent className="p-4 text-center"><Users className="mx-auto h-6 w-6 text-secondary mb-1" /><div className="text-2xl font-black text-secondary">{stats.totalStudents}</div><div className="text-[10px] text-muted-foreground font-semibold">Students</div></CardContent></Card>
        <Card className="border-2 border-accent/20"><CardContent className="p-4 text-center"><TrendingUp className="mx-auto h-6 w-6 text-accent mb-1" /><div className="text-2xl font-black text-accent">{stats.totalScans}</div><div className="text-[10px] text-muted-foreground font-semibold">Total Records</div></CardContent></Card>
      </div>
      <HouseLeaderboard branchId={user?.branchId} />
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">Recent Activity</h2>
        <div className="space-y-2">
          {recentTxns.map((tx) => (
            <Card key={tx.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">{tx.students?.avatar_emoji || "🧑"}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-card-foreground truncate">{tx.students?.name}</div>
                  <div className="text-xs text-muted-foreground">{tx.subjects?.name} • {tx.marks_entered} marks</div>
                </div>
                <div className="text-right"><div className="font-black text-primary">+{tx.points_awarded}</div><div className="text-[10px] text-muted-foreground">pts</div></div>
              </CardContent>
            </Card>
          ))}
          {recentTxns.length === 0 && <p className="text-sm text-muted-foreground">No activity yet</p>}
        </div>
      </div>
    </div>
  );
}
