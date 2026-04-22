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
  const [error, setError] = useState("");
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    console.log('Loading fresh data from database...');
    const { data: s } = await supabase
      .from("students")
      .select("id, total_points")
      .eq("user_id", user!.id)
      .single();
    
    setStudent(s);
    console.log('Student data loaded:', s);
    
    const [r, red] = await Promise.all([
      supabase
        .from("rewards")
        .select("*")
        .order("point_cost"),
      s ? supabase
        .from("redemptions")
        .select("*, rewards(name, emoji)")
        .eq("student_id", s.id)
        .order("created_at", { ascending: false }) 
      : Promise.resolve({ data: [] }),
    ]);
    
    console.log('Rewards loaded:', r.data);
    console.log('Redemptions loaded:', red.data);
    
    setRewards(r.data || []);
    setRedemptions(red.data || []);
  }

  async function handleRedeem(rewardId: string, cost: number) {
    console.log('=== REDEEM START ===', { rewardId, cost, studentId: student?.id, currentPoints: student?.total_points });
    
    // Validation checks
    if (!student?.id) {
      setError('Student data not available');
      return;
    }
    
    if (student.total_points < cost) {
      setError('Insufficient points for this reward');
      return;
    }
    
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.stock <= 0) {
      setError('This reward is out of stock');
      return;
    }
    
    setRedeemingId(rewardId);
    setError("");
    
    try {
      // Call the RPC function - this handles everything atomically with SECURITY DEFINER
      console.log('Calling redeem_reward RPC...');
      
      const { data, error } = await (supabase.rpc as any)('redeem_reward', {
        p_student_id: student.id,
        p_reward_id: rewardId,
        p_points_spent: cost
      });
      
      console.log('RPC response:', { data, error });
      
      if (error) {
        console.error('RPC call failed:', error);
        throw new Error(`RPC Error: ${error.message}`);
      }
      
      // Parse the result (returns JSONB)
      let result;
      try {
        result = typeof data === 'string' ? JSON.parse(data) : data;
      } catch {
        result = data;
      }
      
      console.log('Parsed result:', result);
      
      if (!result || !result.success) {
        throw new Error(result?.message || 'Redemption failed on server');
      }
      
      console.log('Redemption successful! New points:', result.new_points);
      
      // Immediately update local state for instant UI feedback
      setStudent({ ...student, total_points: result.new_points || student.total_points - cost });
      setRewards(rewards.map(r => 
        r.id === rewardId ? { ...r, stock: r.stock - 1 } : r
      ));
      
      // Then reload from server to confirm
      await load();
      
    } catch (error) {
      console.error('Redemption failed:', error);
      setError(error instanceof Error ? error.message : 'Redemption failed. Please try again.');
    } finally {
      setRedeemingId(null);
      console.log('=== REDEEM END ===');
    }
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

      {error && (
        <div className="p-3 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid gap-3">
        {rewards.map(r => {
          const canAfford = student.total_points >= r.point_cost;
          const isRedeeming = redeemingId === r.id;
          return (
            <Card key={r.id} className={`border-0 shadow-sm ${!canAfford ? "opacity-60" : ""}`}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="text-3xl">{r.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-card-foreground">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.description}</div>
                  <div className="text-xs font-bold text-primary mt-1">{r.point_cost} pts · {r.stock} left</div>
                </div>
                <Button 
                  size="sm" 
                  className="rounded-xl" 
                  disabled={!canAfford || r.stock <= 0 || isRedeeming} 
                  onClick={() => handleRedeem(r.id, r.point_cost)}
                >
                  {isRedeeming ? (
                    <>
                      <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Redeeming...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-3 w-3 mr-1" /> Redeem
                    </>
                  )}
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
