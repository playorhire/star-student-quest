import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { LayoutDashboard, School, Users, GraduationCap, Settings, LogOut, Gift, UserPlus, UserCog, Medal } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const allowedRoles = ["admin", "school_admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">Admin access only.</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: "/admin/dashboard" as const, label: "Home", icon: LayoutDashboard },
    { to: "/admin/classes" as const, label: "Classes", icon: School },
    { to: "/admin/teachers" as const, label: "Teachers", icon: Users },
    { to: "/admin/students" as const, label: "Students", icon: GraduationCap },
    { to: "/admin/parents" as const, label: "Parents", icon: UserPlus },
    { to: "/admin/badges" as const, label: "Badges", icon: Medal },
    { to: "/admin/rewards" as const, label: "Rewards", icon: Gift },
    { to: "/admin/rules" as const, label: "Rules", icon: Settings },
    { to: "/admin/profile" as const, label: "Profile", icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <span className="font-bold text-foreground">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <button onClick={() => logout()} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 pb-20 pt-4">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-around py-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link key={to} to={to} className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
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
