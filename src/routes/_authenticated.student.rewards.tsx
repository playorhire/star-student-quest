import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { categoryEmoji } from "@/lib/vendor-categories";

export const Route = createFileRoute("/_authenticated/student/rewards")({
  component: StudentRewards,
});

function StudentRewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [marketplace, setMarketplace] = useState<any[]>([]);
  const [vendorRedemptions, setVendorRedemptions] = useState<any[]>([]);
  const [mpBusy, setMpBusy] = useState<string | null>(null);
  const [mpSearch, setMpSearch] = useState("");
  const [marketplaceLoading, setMarketplaceLoading] = useState(false);

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    console.log('Loading fresh data from database...');
    const { data: s } = await supabase
      .from("students")
      .select("id, total_points, school_id")
      .eq("user_id", user!.id)
      .single();
    
    setStudent(s);
    console.log('Student data loaded:', s);
    
    const [r, red] = await Promise.all([
      supabase
        .from("rewards")
        .select("*")
        .order("point_cost"),
      s ? supabase
        .from("redemptions")
        .select("*, rewards(name, emoji)")
        .eq("student_id", s.id)
        .order("created_at", { ascending: false }) 
      : Promise.resolve({ data: [] }),
    ]);
    
    console.log('Rewards loaded:', r.data);
    console.log('Redemptions loaded:', red.data);
    
    setRewards(r.data || []);
    setRedemptions(red.data || []);

    const [mpRed] = await Promise.all([
      s ? (supabase as any).from("reward_redemptions").select("*, vendor_products(product_name), vendors(shop_name)").eq("student_id", s.id).order("redeemed_at", { ascending: false }) : Promise.resolve({ data: [] }),
    ]);
    setVendorRedemptions(mpRed.data || []);
    await loadMarketplaceProducts(s?.school_id || user?.schoolId);
  }

  async function loadMarketplaceProducts(schoolId?: string | null) {
    if (!schoolId) {
      setMarketplace([]);
      setMarketplaceLoading(false);
      return;
    }

    setMarketplaceLoading(true);
    const { data: schoolLinks, error: schoolLinksError } = await (supabase as any)
      .from("vendor_product_schools")
      .select("product_id")
      .eq("school_id", schoolId)
      .eq("approved", true);

    if (schoolLinksError) {
      console.error("Failed to load marketplace school links", schoolLinksError);
      setMarketplace([]);
      setMarketplaceLoading(false);
      return;
    }

    const productIds = (schoolLinks || []).map((entry: any) => entry.product_id).filter(Boolean);
    if (!productIds.length) {
      setMarketplace([]);
      setMarketplaceLoading(false);
      return;
    }

    const { data: products, error: productsError } = await (supabase as any)
      .from("vendor_products")
      .select("*, vendors(shop_name)")
      .in("id", productIds)
      .eq("is_active", true)
      .eq("admin_status", "approved")
      .gt("stock_quantity", 0)
      .order("required_points");

    if (productsError) {
      console.error("Failed to load marketplace products", productsError);
      setMarketplace([]);
    } else {
      setMarketplace(products || []);
    }
    setMarketplaceLoading(false);
  }

  async function redeemVendor(productId: string) {
    setMpBusy(productId);
    const { data, error } = await (supabase as any).rpc("redeem_vendor_product", { p_product_id: productId });
    setMpBusy(null);
    if (error) { toast.error(error.message); return; }
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    if (!parsed.success) { toast.error(parsed.message); return; }
    toast.success(`Voucher: ${parsed.voucher}`);
    load();
  }

  async function handleRedeem(rewardId: string, cost: number) {
    console.log('=== REDEEM START ===', { rewardId, cost, studentId: student?.id, currentPoints: student?.total_points });
    
    // Validation checks
    if (!student?.id) {
      setError('Student data not available');
      return;
    }
    
    if (student.total_points < cost) {
      setError('Insufficient points for this reward');
      return;
    }
    
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.stock <= 0) {
      setError('This reward is out of stock');
      return;
    }
    
    setRedeemingId(rewardId);
    setError("");
    
    try {
      // Call the RPC function - this handles everything atomically with SECURITY DEFINER
      console.log('Calling redeem_reward RPC...');
      
      const { data, error } = await (supabase.rpc as any)('redeem_reward', {
        p_student_id: student.id,
        p_reward_id: rewardId,
        p_points_spent: cost
      });
      
      console.log('RPC response:', { data, error });
      
      if (error) {
        console.error('RPC call failed:', error);
        throw new Error(`RPC Error: ${error.message}`);
      }
      
      // Parse the result (returns JSONB)
      let result;
      try {
        result = typeof data === 'string' ? JSON.parse(data) : data;
      } catch {
        result = data;
      }
      
      console.log('Parsed result:', result);
      
      if (!result || !result.success) {
        throw new Error(result?.message || 'Redemption failed on server');
      }
      
      console.log('Redemption successful! New points:', result.new_points);
      
      // Immediately update local state for instant UI feedback
      setStudent({ ...student, total_points: result.new_points || student.total_points - cost });
      setRewards(rewards.map(r => 
        r.id === rewardId ? { ...r, stock: r.stock - 1 } : r
      ));
      
      // Then reload from server to confirm
      await load();
      
    } catch (error) {
      console.error('Redemption failed:', error);
      setError(error instanceof Error ? error.message : 'Redemption failed. Please try again.');
    } finally {
      setRedeemingId(null);
      console.log('=== REDEEM END ===');
    }
  }

  if (!student) return <div className="flex justify-center py-12"><div className="text-2xl animate-bounce">🎁</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">Rewards</h1>
          <p className="text-sm text-muted-foreground">Redeem your points</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-primary">{student.total_points}</div>
          <div className="text-[10px] text-muted-foreground">points available</div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid gap-3">
        {rewards.map(r => {
          const canAfford = student.total_points >= r.point_cost;
          const isRedeeming = redeemingId === r.id;
          return (
            <Card key={r.id} className={`border-0 shadow-sm ${!canAfford ? "opacity-60" : ""}`}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="text-3xl">{r.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-card-foreground">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.description}</div>
                  <div className="text-xs font-bold text-primary mt-1">{r.point_cost} pts · {r.stock} left</div>
                </div>
                <Button 
                  size="sm" 
                  className="rounded-xl" 
                  disabled={!canAfford || r.stock <= 0 || isRedeeming} 
                  onClick={() => handleRedeem(r.id, r.point_cost)}
                >
                  {isRedeeming ? (
                    <>
                      <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Redeeming...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-3 w-3 mr-1" /> Redeem
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {redemptions.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2">My Redemptions</h3>
          <div className="space-y-2">
            {redemptions.map(red => (
              <Card key={red.id} className="border-0 shadow-sm">
                <CardContent className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{red.rewards?.emoji}</span>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{red.rewards?.name}</div>
                      <div className="text-xs text-muted-foreground">{red.points_spent} pts</div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${red.status === "fulfilled" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                    {red.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-foreground mb-2 mt-4">Marketplace</h3>
        <input value={mpSearch} onChange={(e) => setMpSearch(e.target.value)} placeholder="Search products..." className="w-full rounded-xl border bg-background p-2 text-sm mb-2" />
        {marketplaceLoading ? <p className="text-sm text-muted-foreground text-center py-3">Loading marketplace…</p> : (
        <div className="grid gap-2">
          {marketplace.filter((p) => !mpSearch || p.product_name.toLowerCase().includes(mpSearch.toLowerCase()) || p.vendors?.shop_name?.toLowerCase().includes(mpSearch.toLowerCase())).map((p) => {
            const canAfford = student.total_points >= p.required_points;
            const busy = mpBusy === p.id;
            return (
              <Card key={p.id} className={`border-0 shadow-sm ${!canAfford ? "opacity-60" : ""}`}>
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="h-14 w-14 rounded-xl bg-muted overflow-hidden flex items-center justify-center text-2xl shrink-0">
                    {p.image_urls?.[0] ? <img src={p.image_urls[0]} alt={p.product_name} className="h-full w-full object-cover" loading="lazy" /> : categoryEmoji(p.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{p.product_name}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.vendors?.shop_name} · {p.stock_quantity} left</div>
                    <div className="text-xs font-bold text-primary mt-0.5">{p.required_points} pts{p.cash_price ? ` · Rs ${p.cash_price}` : ""}</div>
                  </div>
                  <Button size="sm" className="rounded-xl" disabled={!canAfford || busy} onClick={() => redeemVendor(p.id)}>
                    {busy ? "..." : "Redeem"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          {marketplace.length === 0 && <p className="text-sm text-muted-foreground text-center py-3">No marketplace products available for your school yet.</p>}
        </div>
        )}
      </div>

      {vendorRedemptions.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2 mt-4">My Vouchers</h3>
          <div className="grid gap-2">
            {vendorRedemptions.map((r) => (
              <Card key={r.id} className="border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate">{r.vendor_products?.product_name}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.vendors?.shop_name} · {r.points_used} pts</div>
                      <div className="text-[10px] font-mono tracking-widest mt-0.5">{r.voucher_code}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${r.status === "collected" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>{r.status}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
