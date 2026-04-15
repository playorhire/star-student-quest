import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/parent/notifications")({
  component: ParentNotifications,
});

interface Notification {
  id: string;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
}

function ParentNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel("parent-notifications")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  async function loadNotifications() {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    setNotifications(data || []);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  async function markAllRead() {
    if (!user) return;
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from("notifications").update({ read: true }).in("id", unreadIds);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="text-2xl animate-bounce">🔔</div></div>;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground">Notifications</h2>
          <p className="text-muted-foreground text-sm">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs font-semibold text-primary hover:underline">
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-muted-foreground">No notifications yet.</p>
          <p className="text-xs text-muted-foreground mt-1">You'll be notified when your child earns points.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`rounded-2xl border p-4 transition-colors ${n.read ? "border-border bg-card/50" : "border-primary/30 bg-primary/5"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-bold text-sm text-foreground">{n.title}</div>
                  {n.body && <div className="text-xs text-muted-foreground mt-1">{n.body}</div>}
                  <div className="text-[10px] text-muted-foreground mt-2">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="shrink-0 rounded-lg bg-primary/10 p-1.5 text-primary hover:bg-primary/20"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
