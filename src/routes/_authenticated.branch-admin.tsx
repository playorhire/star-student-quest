import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { LayoutDashboard, GraduationCap, Users, Gift, BookOpen, Medal, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/branch-admin")({
  component: BranchAdminLayout,
});

function BranchAdminLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

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
    { to: "/branch-admin/classes" as any, label: "Classes", icon: BookOpen },
    { to: "/branch-admin/rewards" as any, label: "Rewards", icon: Gift },
    { to: "/branch-admin/badges" as any, label: "Badges", icon: Medal },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-muted/50 border-r p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Users className="h-6 w-6 text-primary" />
          <span className="font-black">Branch Admin</span>
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
