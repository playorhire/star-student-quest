import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { LayoutDashboard, GraduationCap, Users, Gift, BookOpen, Medal, Users2, LogOut, Home, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/branch-admin")({
  component: BranchAdminLayout,
});

function BranchAdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user || !["branch_admin", "school_admin", "admin", "super_admin"].includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">Branch Admin access only.</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: "/branch-admin/dashboard" as any, label: "Dashboard", icon: LayoutDashboard },
    { to: "/branch-admin/students" as any, label: "Students", icon: GraduationCap },
    { to: "/branch-admin/teachers" as any, label: "Teachers", icon: Users },
    { to: "/branch-admin/parents" as any, label: "Parents", icon: Users2 },
    { to: "/branch-admin/classes" as any, label: "Classes", icon: BookOpen },
    { to: "/branch-admin/houses" as any, label: "Houses", icon: Home },
    { to: "/branch-admin/rewards" as any, label: "Rewards", icon: Gift },
    { to: "/branch-admin/badges" as any, label: "Badges", icon: Medal },
    { to: "/branch-admin/help" as any, label: "Help", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">Branch Admin</span>
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
