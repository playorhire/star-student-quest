import { createFileRoute } from "@tanstack/react-router";
import { transactions, students } from "../lib/mock-data";
import { Card, CardContent } from "../components/ui/card";
import { TrendingUp, Users, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/teacher/dashboard")({
  component: TeacherDashboard,
});

function TeacherDashboard() {
  const todayTx = transactions.filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString());
  const totalPointsToday = todayTx.reduce((sum, t) => sum + t.pointsAwarded, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your teaching overview</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-2 border-primary/20">
          <CardContent className="p-4 text-center">
            <Zap className="mx-auto h-6 w-6 text-primary mb-1" />
            <div className="text-2xl font-black text-primary">{totalPointsToday}</div>
            <div className="text-[10px] text-muted-foreground font-semibold">Points Today</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-secondary/20">
          <CardContent className="p-4 text-center">
            <Users className="mx-auto h-6 w-6 text-secondary mb-1" />
            <div className="text-2xl font-black text-secondary">{students.length}</div>
            <div className="text-[10px] text-muted-foreground font-semibold">Students</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-accent/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="mx-auto h-6 w-6 text-accent mb-1" />
            <div className="text-2xl font-black text-accent">{transactions.length}</div>
            <div className="text-[10px] text-muted-foreground font-semibold">Total Scans</div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">Recent Activity</h2>
        <div className="space-y-2">
          {transactions.slice(0, 5).map((tx) => (
            <Card key={tx.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
                  {students.find(s => s.id === tx.studentId)?.avatarEmoji || "🧑"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-card-foreground truncate">{tx.studentName}</div>
                  <div className="text-xs text-muted-foreground">{tx.subjectName} • {tx.marksEntered} marks</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-primary">+{tx.pointsAwarded}</div>
                  <div className="text-[10px] text-muted-foreground">pts</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
