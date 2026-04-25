import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { Building2, LayoutDashboard, Settings, Shield, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/super-admin" as any)({
  component: SuperAdminLayout,
});

function SuperAdminLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

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
    { to: "/super-admin/settings" as any, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-muted/50 border-r p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-black">Super Admin</span>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted w-full mt-auto"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
