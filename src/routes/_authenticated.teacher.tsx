import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth-context";
import { LayoutDashboard, Award, History, Gift, User, LogOut, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/teacher")({
  component: TeacherLayout,
});

function TeacherLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [unreadMessages, setUnreadMessages] = useState(0);

  const navItems = [
    { to: "/teacher/dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { to: "/teacher/scan" as const, label: "Assign", icon: Award },
    { to: "/teacher/messages" as any, label: "Messages", icon: MessageSquare },
    { to: "/teacher/history" as const, label: "History", icon: History },
    { to: "/teacher/rewards" as const, label: "Rewards", icon: Gift },
    { to: "/teacher/profile" as const, label: "Profile", icon: User },
  ];

  useEffect(() => {
    if (!user?.id) return;

    const loadUnreadCount = async () => {
      const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("read", false);
      setUnreadMessages(count || 0);
    };

    void loadUnreadCount();

    const channel = supabase
      .channel(`teacher-unread-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `receiver_id=eq.${user.id}` },
        () => {
          void loadUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <span className="font-bold text-foreground">Teacher</span>
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
              <Link key={to} to={to} className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {label === "Messages" && unreadMessages > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-4 text-center">
                      {unreadMessages > 99 ? "99+" : unreadMessages}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
