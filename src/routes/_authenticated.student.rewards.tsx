import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/_authenticated/student/rewards")({
  component: StudentRewards,
});

function StudentRewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [redemptions, setRedemptions] = useState<any[]>([]);

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    const { data: s } = await supabase.from("students").select("id, total_points").eq("user_id", user!.id).single();
    setStudent(s);
    const [r, red] = await Promise.all([
      supabase.from("rewards").select("*").order("point_cost"),
      s ? supabase.from("redemptions").select("*, rewards(name, emoji)").eq("student_id", s.id).order("created_at", { ascending: false }) : Promise.resolve({ data: [] }),
    ]);
    setRewards(r.data || []);
    setRedemptions(red.data || []);
  }

  async function handleRedeem(rewardId: string, cost: number) {
    if (!student || student.total_points < cost) return;
    await supabase.from("redemptions").insert({ student_id: student.id, reward_id: rewardId, points_spent: cost });
    // Deduct points (via admin or we update directly)
    await supabase.from("students").update({ total_points: student.total_points - cost }).eq("id", student.id);
    load();
  }

  if (!student) return <div className="flex justify-center py-12"><div className="text-2xl animate-bounce">🎁</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">Rewards</h1>
          <p className="text-sm text-muted-foreground">Redeem your points</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-primary">{student.total_points}</div>
          <div className="text-[10px] text-muted-foreground">points available</div>
        </div>
      </div>

      <div className="grid gap-3">
        {rewards.map(r => {
          const canAfford = student.total_points >= r.point_cost;
          return (
            <Card key={r.id} className={`border-0 shadow-sm ${!canAfford ? "opacity-60" : ""}`}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="text-3xl">{r.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-card-foreground">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.description}</div>
                  <div className="text-xs font-bold text-primary mt-1">{r.point_cost} pts • {r.stock} left</div>
                </div>
                <Button size="sm" className="rounded-xl" disabled={!canAfford || r.stock <= 0} onClick={() => handleRedeem(r.id, r.point_cost)}>
                  <ShoppingCart className="h-3 w-3 mr-1" /> Redeem
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {redemptions.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2">My Redemptions</h3>
          <div className="space-y-2">
            {redemptions.map(red => (
              <Card key={red.id} className="border-0 shadow-sm">
                <CardContent className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{red.rewards?.emoji}</span>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{red.rewards?.name}</div>
                      <div className="text-xs text-muted-foreground">{red.points_spent} pts</div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${red.status === "fulfilled" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                    {red.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
