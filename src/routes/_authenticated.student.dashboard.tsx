import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { students, transactions, getStudentBadges, getNextBadge, getLeaderboard } from "../lib/mock-data";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Trophy, Flame, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/student/dashboard")({
  component: StudentDashboard,
});

function StudentDashboard() {
  const student = students[0];
  const earnedBadges = getStudentBadges(student.totalPoints);
  const nextBadge = getNextBadge(student.totalPoints);
  const leaderboard = getLeaderboard();
  const rank = leaderboard.findIndex((s) => s.id === student.id) + 1;
  const recentTx = transactions.filter((t) => t.studentId === student.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 3);

  const [displayPoints, setDisplayPoints] = useState(0);
  useEffect(() => {
    const target = student.totalPoints;
    let current = 0;
    const increment = target / 30;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) { setDisplayPoints(target); clearInterval(interval); }
      else { setDisplayPoints(Math.floor(current)); }
    }, 33);
    return () => clearInterval(interval);
  }, [student.totalPoints]);

  const lastBadgePoints = earnedBadges.length > 0 ? earnedBadges[earnedBadges.length - 1].requiredPoints : 0;
  const progressToNext = nextBadge ? ((student.totalPoints - lastBadgePoints) / (nextBadge.requiredPoints - lastBadgePoints)) * 100 : 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="text-4xl">{student.avatarEmoji}</div>
        <div>
          <h1 className="text-xl font-black text-foreground">Hi, {student.name.split(" ")[0]}! 👋</h1>
          <p className="text-sm text-muted-foreground">Class {student.className} • Roll #{student.rollNumber}</p>
        </div>
      </div>

      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6 text-center">
          <Star className="mx-auto h-8 w-8 text-primary mb-2" />
          <div className="text-5xl font-black text-primary">{displayPoints}</div>
          <div className="text-sm font-semibold text-muted-foreground mt-1">Total Points</div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1"><Trophy className="h-4 w-4 text-secondary" /><span className="text-sm font-bold text-secondary">#{rank}</span><span className="text-xs text-muted-foreground">rank</span></div>
            <div className="flex items-center gap-1"><Flame className="h-4 w-4 text-accent" /><span className="text-sm font-bold text-accent">{earnedBadges.length}</span><span className="text-xs text-muted-foreground">badges</span></div>
          </div>
        </CardContent>
      </Card>

      {nextBadge && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{nextBadge.emoji}</span>
                <div><div className="text-sm font-bold text-card-foreground">{nextBadge.name}</div><div className="text-[10px] text-muted-foreground">{nextBadge.description}</div></div>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{student.totalPoints}/{nextBadge.requiredPoints}</span>
            </div>
            <Progress value={progressToNext} className="h-3 rounded-full" />
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">Badges</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {earnedBadges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center min-w-[72px]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">{badge.emoji}</div>
              <span className="text-[10px] font-semibold text-card-foreground mt-1 text-center">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">Recent Activity</h2>
        <div className="space-y-2">
          {recentTx.map((tx) => (
            <Card key={tx.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-lg">📘</div>
                <div className="flex-1 min-w-0"><div className="font-semibold text-sm text-card-foreground">{tx.subjectName}</div><div className="text-xs text-muted-foreground">{tx.marksEntered} marks • by {tx.teacherName}</div></div>
                <div className="font-black text-primary">+{tx.pointsAwarded}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">🏆 Leaderboard</h2>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {leaderboard.slice(0, 5).map((s, i) => (
              <div key={s.id} className={`flex items-center gap-3 px-4 py-3 ${i < 4 ? "border-b" : ""} ${s.id === student.id ? "bg-primary/5" : ""}`}>
                <span className="text-lg font-black w-6 text-center">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}</span>
                <span className="text-lg">{s.avatarEmoji}</span>
                <span className="flex-1 text-sm font-semibold text-card-foreground truncate">{s.name}</span>
                <span className="font-black text-primary text-sm">{s.totalPoints}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
