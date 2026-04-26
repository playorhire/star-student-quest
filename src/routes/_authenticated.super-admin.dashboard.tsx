import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Building2, Users, School, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/super-admin/dashboard")({
  component: SuperAdminDashboard,
});

function SuperAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ schools: 0, branches: 0, teachers: 0, students: 0 });

  useEffect(() => {
    if (user?.role === "super_admin") loadStats();
  }, [user]);

  async function loadStats() {
    const [s, b, t, st] = await Promise.all([
      (supabase as any).from("schools").select("id", { count: "exact", head: true }),
      (supabase as any).from("branches").select("id", { count: "exact", head: true }),
      (supabase as any).from("teachers").select("id", { count: "exact", head: true }),
      (supabase as any).from("students").select("id", { count: "exact", head: true }),
    ]);
    setStats({
      schools: s.count || 0,
      branches: b.count || 0,
      teachers: t.count || 0,
      students: st.count || 0,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Super Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage all schools and tenants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <School className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.schools}</div>
              <div className="text-xs text-muted-foreground">Schools</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.branches}</div>
              <div className="text-xs text-muted-foreground">Branches</div>
            </div>
          </CardContent>
        </Card>
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
      </div>
    </div>
  );
}
