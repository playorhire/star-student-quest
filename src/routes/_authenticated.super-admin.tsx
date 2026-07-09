import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { Building2, LayoutDashboard, Settings, Shield, LogOut, UserCog, School, KeyRound } from "lucide-react";

export const Route = createFileRoute("/_authenticated/super-admin")({
  component: SuperAdminLayout,
});

function SuperAdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user || user.role !== "super_admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">Super Admin access only.</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: "/super-admin/dashboard" as any, label: "Dashboard", icon: LayoutDashboard },
    { to: "/super-admin/schools" as any, label: "Schools", icon: Building2 },
    { to: "/super-admin/school-admins" as any, label: "Admins", icon: UserCog },
    { to: "/super-admin/assign-school" as any, label: "Assign", icon: School },
    { to: "/super-admin/roles" as any, label: "Roles", icon: KeyRound },
    { to: "/super-admin/settings" as any, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">Super Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <button onClick={() => logout()} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 pb-20 pt-4">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link key={to} to={to} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
