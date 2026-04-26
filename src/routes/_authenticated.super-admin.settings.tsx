import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/super-admin/settings")({
  component: SuperAdminSettings,
});

function SuperAdminSettings() {
  const { user } = useAuth();

  if (user?.role !== "super_admin") {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Settings</h1>
        <p className="text-sm text-muted-foreground">System configuration</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold">Super Admin</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Tenant role: <span className="font-mono bg-muted px-1 rounded">{user.role}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
