import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { useEffect, useState } from "react";
import { Gift, Trophy, Zap, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/student/history")({
  component: StudentHistory,
});

function StudentHistory() {
  const { user } = useAuth();
  const [txns, setTxns] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    setLoading(true);
    const { data: s } = await supabase.from("students").select("id").eq("user_id", user!.id).single();
    if (!s) { setLoading(false); return; }

    const [txnsRes, redRes, badgeRes] = await Promise.all([
      supabase
        .from("point_transactions")
        .select("id, points_awarded, marks_entered, created_at, subjects(name), teachers(name)")
        .eq("student_id", s.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("redemptions")
        .select("id, points_spent, status, created_at, rewards(name, emoji)")
        .eq("student_id", s.id)
        .order("created_at", { ascending: false }),
      (supabase as any)
        .from("student_badges")
        .select("id, earned_at, badges(name, description, emoji, required_points)")
        .eq("student_id", s.id)
        .order("earned_at", { ascending: false }),
    ]);

    setTxns(txnsRes.data || []);
    setRedemptions(redRes.data || []);
    setBadges(badgeRes.data || []);
    setLoading(false);
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">History</h1>
        <p className="text-sm text-muted-foreground">Your badges, rewards & points</p>
      </div>

      {/* Badges Earned */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-yellow-500" /> Badges Earned
        </h2>
        <div className="space-y-2">
          {badges.map(b => (
            <Card key={b.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-lg">
                  {b.badges?.emoji || "🏆"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-card-foreground truncate">{b.badges?.name}</div>
                  <div className="text-xs text-muted-foreground">{b.badges?.description}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Earned on {formatDate(b.earned_at)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {badges.length === 0 && (
            <p className="text-sm text-muted-foreground">No badges earned yet. Keep earning points!</p>
          )}
        </div>
      </div>

      {/* Rewards Redeemed */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Gift className="h-4 w-4 text-pink-500" /> Rewards Redeemed
        </h2>
        <div className="space-y-2">
          {redemptions.map(r => (
            <Card key={r.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-lg">
                  {r.rewards?.emoji || "🎁"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-card-foreground truncate">{r.rewards?.name}</div>
                  <div className="text-xs text-muted-foreground">{r.points_spent} points • {r.status}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Redeemed on {formatDate(r.created_at)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {redemptions.length === 0 && (
            <p className="text-sm text-muted-foreground">No rewards redeemed yet. Visit the Rewards page!</p>
          )}
        </div>
      </div>

      {/* Point Transactions */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-primary" /> Point Transactions
        </h2>
        <div className="space-y-2">
          {txns.map(tx => (
            <Card key={tx.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">⚡</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-card-foreground truncate">{tx.subjects?.name}</div>
                  <div className="text-xs text-muted-foreground">by {tx.teachers?.name} • {tx.marks_entered} marks</div>
                  <div className="text-[10px] text-muted-foreground">{formatDate(tx.created_at)}</div>
                </div>
                <div className="font-black text-primary">+{tx.points_awarded}</div>
              </CardContent>
            </Card>
          ))}
          {txns.length === 0 && <p className="text-sm text-muted-foreground">No transactions yet</p>}
        </div>
      </div>
    </div>
  );
}
