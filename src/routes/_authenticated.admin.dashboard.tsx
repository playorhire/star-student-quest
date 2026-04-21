import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "../components/ui/card";
import { Users, GraduationCap, School, BookOpen, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ classes: 0, teachers: 0, students: 0, subjects: 0, totalPoints: 0 });
  const [recentTxns, setRecentTxns] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
    loadRecent();
  }, []);

  async function loadStats() {
    const [c, t, s, sub, txns] = await Promise.all([
      supabase.from("classes").select("id", { count: "exact", head: true }),
      supabase.from("teachers").select("id", { count: "exact", head: true }),
      supabase.from("students").select("id", { count: "exact", head: true }),
      supabase.from("subjects").select("id", { count: "exact", head: true }),
      supabase.from("point_transactions").select("points_awarded"),
    ]);
    const totalPoints = (txns.data || []).reduce((sum, t) => sum + t.points_awarded, 0);
    setStats({
      classes: c.count || 0, teachers: t.count || 0, students: s.count || 0,
      subjects: sub.count || 0, totalPoints,
    });
  }

  async function loadRecent() {
    const { data } = await supabase
      .from("point_transactions")
      .select("id, points_awarded, marks_entered, created_at, students(name), teachers(name), subjects(name)")
      .order("created_at", { ascending: false })
      .limit(5);
    setRecentTxns(data || []);
  }

  const statCards = [
    { label: "Classes", value: stats.classes, icon: School, color: "primary" },
    { label: "Teachers", value: stats.teachers, icon: Users, color: "secondary" },
    { label: "Students", value: stats.students, icon: GraduationCap, color: "accent" },
    { label: "Act/Quiz", value: stats.subjects, icon: BookOpen, color: "primary" },
    { label: "Points Given", value: stats.totalPoints, icon: Zap, color: "secondary" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">School overview at a glance</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className={`border-2 border-${color}/20`}>
            <CardContent className="p-4 text-center">
              <Icon className={`mx-auto h-6 w-6 text-${color} mb-1`} />
              <div className={`text-2xl font-black text-${color}`}>{value}</div>
              <div className="text-[10px] text-muted-foreground font-semibold">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">Recent Activity</h2>
        <div className="space-y-2">
          {recentTxns.map((tx) => (
            <Card key={tx.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">⚡</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-card-foreground truncate">{tx.teachers?.name} → {tx.students?.name}</div>
                  <div className="text-xs text-muted-foreground">{tx.subjects?.name} • {tx.marks_entered} marks</div>
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
