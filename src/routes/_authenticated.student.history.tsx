import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/student/history")({
  component: StudentHistory,
});

function StudentHistory() {
  const { user } = useAuth();
  const [txns, setTxns] = useState<any[]>([]);

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    const { data: s } = await supabase.from("students").select("id").eq("user_id", user!.id).single();
    if (!s) return;
    const { data } = await supabase
      .from("point_transactions")
      .select("id, points_awarded, marks_entered, created_at, subjects(name), teachers(name)")
      .eq("student_id", s.id)
      .order("created_at", { ascending: false });
    setTxns(data || []);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">History</h1>
        <p className="text-sm text-muted-foreground">Your point transactions</p>
      </div>
      <div className="space-y-2">
        {txns.map(tx => {
          const date = new Date(tx.created_at);
          return (
            <Card key={tx.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">⚡</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-card-foreground truncate">{tx.subjects?.name}</div>
                  <div className="text-xs text-muted-foreground">by {tx.teachers?.name} • {tx.marks_entered} marks</div>
                  <div className="text-[10px] text-muted-foreground">{date.toLocaleDateString()}</div>
                </div>
                <div className="font-black text-primary">+{tx.points_awarded}</div>
              </CardContent>
            </Card>
          );
        })}
        {txns.length === 0 && <p className="text-sm text-muted-foreground">No transactions yet</p>}
      </div>
    </div>
  );
}
