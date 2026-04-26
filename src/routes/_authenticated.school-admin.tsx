import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { Building2, LayoutDashboard, GraduationCap, Gift, Users, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/school-admin" as any)({
  component: SchoolAdminLayout,
});

function SchoolAdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user || !["school_admin", "admin", "super_admin"].includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">School Admin access only.</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: "/school-admin/dashboard" as any, label: "Dashboard", icon: LayoutDashboard },
    { to: "/school-admin/branches" as any, label: "Branches", icon: Building2 },
    { to: "/school-admin/teachers" as any, label: "Teachers", icon: Users },
    { to: "/school-admin/students" as any, label: "Students", icon: GraduationCap },
    { to: "/school-admin/rewards" as any, label: "Rewards", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">School Admin</span>
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
