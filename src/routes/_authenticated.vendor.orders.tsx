import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/vendor/orders")({
  component: VendorOrders,
});

function VendorOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("reward_redemptions")
      .select("id, status, points_used, voucher_code, redeemed_at, expires_at, vendor_products(product_name), students(name)")
      .order("redeemed_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">All redemption requests</p>
      </div>
      {loading ? (
        <div className="text-center py-6 text-sm text-muted-foreground">Loading...</div>
      ) : orders.length === 0 ? (
        <Card className="border-dashed"><CardContent className="p-6 text-center text-sm text-muted-foreground">No orders yet.</CardContent></Card>
      ) : (
        <div className="grid gap-2">
          {orders.map((o) => (
            <Card key={o.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center justify-between p-3">
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate">{o.vendor_products?.product_name}</div>
                  <div className="text-xs text-muted-foreground">{o.students?.name} · {o.points_used} pts</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-mono tracking-wider">{o.voucher_code}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${o.status === "collected" ? "bg-emerald-500/10 text-emerald-600" : o.status === "cancelled" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"}`}>{o.status}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}