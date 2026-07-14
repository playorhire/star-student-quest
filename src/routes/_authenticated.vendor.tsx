import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../lib/auth-context";
import { LayoutDashboard, Package, ShoppingBag, Ticket, User, LogOut, Store } from "lucide-react";

export const Route = createFileRoute("/_authenticated/vendor")({
  component: VendorLayout,
});

function VendorLayout() {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && user.role !== "vendor") {
      navigate({ to: "/" });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center"><div className="text-4xl animate-bounce">🛍️</div></div>;
  }
  if (user.role !== "vendor") return null;

  const nav = [
    { to: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/vendor/products", label: "Products", icon: Package },
    { to: "/vendor/orders", label: "Orders", icon: ShoppingBag },
    { to: "/vendor/redeemed", label: "Redeem", icon: Ticket },
    { to: "/vendor/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">Vendor Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</span>
            <button onClick={() => logout()} aria-label="Sign out" className="text-muted-foreground hover:text-destructive">
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
          {nav.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to as any} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
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