import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Gift } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/school-admin/rewards" as any)({
  component: SchoolAdminRewards,
});

function SchoolAdminRewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.schoolId) loadRewards();
  }, [user]);

  async function loadRewards() {
    setLoading(true);
    setError(null);
    const { data, error: err } = await (supabase as any)
      .from("rewards")
      .select("id, name, emoji, point_cost, stock, description")
      .eq("school_id", user!.schoolId)
      .order("point_cost");
    if (err) {
      setError(`${err.message} (${err.code})`);
      toast.error(err.message);
    } else {
      setRewards(data || []);
    }
    setLoading(false);
  }

  const allowedRoles = ["school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Rewards</h1>
        <p className="text-sm text-muted-foreground">Rewards catalog for your school</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

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
