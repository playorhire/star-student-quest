import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/branch-admin/rewards")({
  component: BranchAdminRewards,
});

function BranchAdminRewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.branchId) loadRewards();
  }, [user]);

  async function loadRewards() {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("rewards")
      .select("id, name, emoji, point_cost, stock, description")
      .eq("branch_id", user!.branchId)
      .order("point_cost");
    if (error) toast.error(error.message);
    else setRewards(data || []);
    setLoading(false);
  }

  const allowedRoles = ["branch_admin", "school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Branch Rewards</h1>
        <p className="text-sm text-muted-foreground">Rewards available in your branch</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : rewards.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No rewards found</div>
      ) : (
        <div className="grid gap-3">
          {rewards.map(r => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-2xl">{r.emoji || "🎁"}</div>
                <div className="flex-1">
                  <div className="font-semibold">{r.name}</div>
                  {r.description && <div className="text-xs text-muted-foreground">{r.description}</div>}
                </div>
                <div className="text-right">
                  <div className="font-black text-primary">{r.point_cost} pts</div>
                  <div className="text-[10px] text-muted-foreground">{r.stock ?? 0} in stock</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
