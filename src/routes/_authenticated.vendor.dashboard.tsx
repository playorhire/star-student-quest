import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingBag, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/vendor/dashboard")({
  component: VendorDashboard,
});

function VendorDashboard() {
  const [stats, setStats] = useState({ products: 0, pending: 0, approved: 0, collected: 0 });
  const [monthly, setMonthly] = useState<{ month: string; count: number }[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: vendor } = await (supabase as any).rpc("get_my_vendor_id");
    const vendorId = vendor as string | null;
    if (!vendorId) return;

    const [products, redemptions] = await Promise.all([
      (supabase as any).from("vendor_products").select("id, admin_status").eq("vendor_id", vendorId),
      (supabase as any).from("reward_redemptions").select("id, status, redeemed_at").eq("vendor_id", vendorId),
    ]);
    const p = products.data || [];
    const r = redemptions.data || [];
    setStats({
      products: p.length,
      pending: r.filter((x: any) => x.status === "pending" || x.status === "approved").length,
      approved: r.filter((x: any) => x.status === "approved").length,
      collected: r.filter((x: any) => x.status === "collected").length,
    });

    const byMonth: Record<string, number> = {};
    r.forEach((x: any) => {
      const m = new Date(x.redeemed_at).toISOString().slice(0, 7);
      byMonth[m] = (byMonth[m] || 0) + 1;
    });
    setMonthly(Object.entries(byMonth).sort(([a],[b]) => a.localeCompare(b)).map(([month, count]) => ({ month, count })));
  }

  const cards = [
    { label: "Products", value: stats.products, icon: Package, tint: "bg-primary/10 text-primary" },
    { label: "Pending", value: stats.pending, icon: Clock, tint: "bg-amber-500/10 text-amber-600" },
    { label: "Approved", value: stats.approved, icon: ShoppingBag, tint: "bg-blue-500/10 text-blue-600" },
    { label: "Collected", value: stats.collected, icon: CheckCircle2, tint: "bg-emerald-500/10 text-emerald-600" },
  ];

  const maxCount = Math.max(1, ...monthly.map((m) => m.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your shop</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <Card key={c.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${c.tint} mb-2`}>
                <c.icon className="h-4 w-4" />
              </div>
              <div className="text-2xl font-black text-foreground">{c.value}</div>
              <div className="text-xs text-muted-foreground">{c.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="mb-3 text-sm font-bold text-foreground">Monthly Redemptions</div>
          {monthly.length === 0 ? (
            <p className="text-xs text-muted-foreground">No redemptions yet</p>
          ) : (
            <div className="space-y-1.5">
              {monthly.map((m) => (
                <div key={m.month} className="flex items-center gap-2">
                  <div className="text-[10px] w-16 text-muted-foreground">{m.month}</div>
                  <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${(m.count / maxCount) * 100}%` }} />
                  </div>
                  <div className="text-xs font-bold w-8 text-right">{m.count}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}