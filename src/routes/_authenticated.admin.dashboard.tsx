import { createFileRoute } from "@tanstack/react-router";
import { students, teachers, classes, subjects, transactions } from "../lib/mock-data";
import { Card, CardContent } from "../components/ui/card";
import { Users, GraduationCap, School, BookOpen, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const totalPoints = transactions.reduce((sum, t) => sum + t.pointsAwarded, 0);

  const stats = [
    { label: "Classes", value: classes.length, icon: School, color: "primary" },
    { label: "Teachers", value: teachers.length, icon: Users, color: "secondary" },
    { label: "Students", value: students.length, icon: GraduationCap, color: "accent" },
    { label: "Subjects", value: subjects.length, icon: BookOpen, color: "primary" },
    { label: "Points Given", value: totalPoints, icon: Zap, color: "secondary" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">School overview at a glance</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
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
          {transactions.slice(0, 5).map((tx) => (
            <Card key={tx.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">⚡</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-card-foreground truncate">{tx.teacherName} → {tx.studentName}</div>
                  <div className="text-xs text-muted-foreground">{tx.subjectName} • {tx.marksEntered} marks</div>
                </div>
                <div className="font-black text-primary">+{tx.pointsAwarded}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
