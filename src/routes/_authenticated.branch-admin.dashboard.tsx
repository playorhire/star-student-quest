import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Users, GraduationCap, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { HouseLeaderboard } from "@/components/HouseLeaderboard";

export const Route = createFileRoute("/_authenticated/branch-admin/dashboard")({
  component: BranchAdminDashboard,
});

function BranchAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ teachers: 0, students: 0, rewards: 0 });

  useEffect(() => {
    if (user?.branchId) loadStats();
  }, [user]);

  async function loadStats() {
    const [t, s, r] = await Promise.all([
      (supabase as any).from("teachers").select("id", { count: "exact", head: true }).eq("branch_id", user!.branchId),
      (supabase as any).from("students").select("id", { count: "exact", head: true }).eq("branch_id", user!.branchId),
      (supabase as any).from("rewards").select("id", { count: "exact", head: true }).eq("branch_id", user!.branchId),
    ]);
    setStats({
      teachers: t.count || 0,
      students: s.count || 0,
      rewards: r.count || 0,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Branch Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your branch</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.teachers}</div>
              <div className="text-xs text-muted-foreground">Teachers</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.students}</div>
              <div className="text-xs text-muted-foreground">Students</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Gift className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.rewards}</div>
              <div className="text-xs text-muted-foreground">Rewards</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <HouseLeaderboard branchId={user?.branchId} />
    </div>
  );
}
