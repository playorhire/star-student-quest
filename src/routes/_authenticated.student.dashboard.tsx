import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/student/dashboard")({
  component: StudentDashboard,
});

function StudentDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [recentTxns, setRecentTxns] = useState<any[]>([]);

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    const { data: s } = await supabase.from("students").select("*, classes(name)").eq("user_id", user!.id).single();
    if (!s) return;
    setStudent(s);

    const [b, txns] = await Promise.all([
      supabase.from("badges").select("*").order("required_points"),
      supabase.from("point_transactions").select("id, points_awarded, marks_entered, created_at, subjects(name)").eq("student_id", s.id).order("created_at", { ascending: false }).limit(10),
    ]);
    setBadges(b.data || []);
    setRecentTxns(txns.data || []);
  }

  if (!student) return <div className="flex justify-center py-12"><div className="text-2xl animate-bounce">🎓</div></div>;

  const earnedBadges = badges.filter(b => student.total_points >= b.required_points);
  const nextBadge = badges.find(b => student.total_points < b.required_points);
  const progress = nextBadge ? Math.min(100, (student.total_points / nextBadge.required_points) * 100) : 100;

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
              <span className="text-xs text-muted-foreground">{student.total_points}/{nextBadge.required_points}</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>
      )}

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
