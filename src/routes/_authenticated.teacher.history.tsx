import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "../components/ui/card";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/teacher/history")({
  component: TeacherHistory,
});

function TeacherHistory() {
  const [txns, setTxns] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("point_transactions")
      .select("id, points_awarded, marks_entered, created_at, students(name, avatar_emoji), subjects(name)")
      .order("created_at", { ascending: false })
      .limit(50);
    setTxns(data || []);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">History</h1>
        <p className="text-sm text-muted-foreground">All point assignments</p>
      </div>
      <div className="space-y-2">
        {txns.map(tx => {
          const date = new Date(tx.created_at);
          return (
            <Card key={tx.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">{tx.students?.avatar_emoji || "🧑"}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-card-foreground truncate">{tx.students?.name}</div>
                  <div className="text-xs text-muted-foreground">{tx.subjects?.name} • {tx.marks_entered} marks</div>
                  <div className="text-[10px] text-muted-foreground">{date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <div className="text-right"><div className="font-black text-primary">+{tx.points_awarded}</div><div className="text-[10px] text-muted-foreground">pts</div></div>
              </CardContent>
            </Card>
          );
        })}
        {txns.length === 0 && <p className="text-sm text-muted-foreground">No transactions yet</p>}
      </div>
    </div>
  );
}
