import { createFileRoute } from "@tanstack/react-router";
import { transactions, students } from "../lib/mock-data";
import { Card, CardContent } from "../components/ui/card";

export const Route = createFileRoute("/_authenticated/_teacher/history")({
  component: TeacherHistory,
});

function TeacherHistory() {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">History</h1>
        <p className="text-sm text-muted-foreground">All point assignments</p>
      </div>

      <div className="space-y-2">
        {sorted.map((tx) => {
          const stu = students.find((s) => s.id === tx.studentId);
          const date = new Date(tx.timestamp);
          return (
            <Card key={tx.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
                  {stu?.avatarEmoji || "🧑"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-card-foreground truncate">{tx.studentName}</div>
                  <div className="text-xs text-muted-foreground">
                    {tx.subjectName} • {tx.marksEntered} marks
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-primary">+{tx.pointsAwarded}</div>
                  <div className="text-[10px] text-muted-foreground">pts</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
