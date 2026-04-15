import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "../components/ui/card";
import { TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/teacher/dashboard")({
  component: TeacherDashboard,
});

function TeacherDashboard() {
  const [stats, setStats] = useState({ pointsToday: 0, totalStudents: 0, totalScans: 0 });
  const [recentTxns, setRecentTxns] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const today = new Date().toISOString().split("T")[0];
    const [todayTx, studentsCount, totalTx, recent] = await Promise.all([
      supabase.from("point_transactions").select("points_awarded").gte("created_at", today),
      supabase.from("students").select("id", { count: "exact", head: true }),
      supabase.from("point_transactions").select("id", { count: "exact", head: true }),
      supabase.from("point_transactions").select("id, points_awarded, marks_entered, created_at, students(name, avatar_emoji), subjects(name)").order("created_at", { ascending: false }).limit(5),
    ]);
    setStats({
      pointsToday: (todayTx.data || []).reduce((s, t) => s + t.points_awarded, 0),
      totalStudents: studentsCount.count || 0,
      totalScans: totalTx.count || 0,
    });
    setRecentTxns(recent.data || []);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your teaching overview</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-2 border-primary/20"><CardContent className="p-4 text-center"><Zap className="mx-auto h-6 w-6 text-primary mb-1" /><div className="text-2xl font-black text-primary">{stats.pointsToday}</div><div className="text-[10px] text-muted-foreground font-semibold">Points Today</div></CardContent></Card>
        <Card className="border-2 border-secondary/20"><CardContent className="p-4 text-center"><Users className="mx-auto h-6 w-6 text-secondary mb-1" /><div className="text-2xl font-black text-secondary">{stats.totalStudents}</div><div className="text-[10px] text-muted-foreground font-semibold">Students</div></CardContent></Card>
        <Card className="border-2 border-accent/20"><CardContent className="p-4 text-center"><TrendingUp className="mx-auto h-6 w-6 text-accent mb-1" /><div className="text-2xl font-black text-accent">{stats.totalScans}</div><div className="text-[10px] text-muted-foreground font-semibold">Total Scans</div></CardContent></Card>
      </div>
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
