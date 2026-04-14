import { createFileRoute } from "@tanstack/react-router";
import { transactions, students } from "../lib/mock-data";
import { Card, CardContent } from "../components/ui/card";

export const Route = createFileRoute("/_authenticated/student/history")({
  component: StudentHistory,
});

function StudentHistory() {
  const student = students[0];
  const myTx = transactions.filter((t) => t.studentId === student.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const totalPoints = myTx.reduce((sum, t) => sum + t.pointsAwarded, 0);
  const bySubject = myTx.reduce((acc, tx) => { acc[tx.subjectName] = (acc[tx.subjectName] || 0) + tx.pointsAwarded; return acc; }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Point History</h1>
        <p className="text-sm text-muted-foreground">{myTx.length} transactions • {totalPoints} total points</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(bySubject).map(([subject, points]) => (
          <div key={subject} className="flex-shrink-0 rounded-2xl bg-primary/10 px-4 py-3 text-center min-w-[100px]">
            <div className="text-lg font-black text-primary">{points}</div>
            <div className="text-[10px] font-semibold text-muted-foreground">{subject}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {myTx.map((tx) => {
          const date = new Date(tx.timestamp);
          return (
            <Card key={tx.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-lg">📘</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-card-foreground">{tx.subjectName}</div>
                  <div className="text-xs text-muted-foreground">{tx.marksEntered} marks • by {tx.teacherName}</div>
                  <div className="text-[10px] text-muted-foreground">{date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-primary">+{tx.pointsAwarded}</div>
                  <div className="text-[10px] text-muted-foreground">({tx.marksEntered}-{tx.passingMarks})×{tx.multiplier}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
