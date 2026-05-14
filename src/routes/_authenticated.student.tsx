import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { LayoutDashboard, QrCode, History, Gift, LogOut, HelpCircle } from "lucide-react";
import { NotificationBell } from "@/components/NotificationsList";

export const Route = createFileRoute("/_authenticated/student")({
  component: StudentLayout,
});

function StudentLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: "/student/dashboard" as const, label: "Home", icon: LayoutDashboard },
    { to: "/student/qr" as const, label: "My QR", icon: QrCode },
    { to: "/student/history" as const, label: "History", icon: History },
    { to: "/student/rewards" as const, label: "Rewards", icon: Gift },
    { to: "/student/help" as any, label: "Help", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <span className="font-bold text-foreground">My Rewards</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <NotificationBell to="/student/notifications" />
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
