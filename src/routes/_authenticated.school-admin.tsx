import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { Building2, LayoutDashboard, GraduationCap, Gift, Users, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/school-admin" as any)({
  component: SchoolAdminLayout,
});

function SchoolAdminLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

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
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-muted/50 border-r p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-black">School Admin</span>
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
