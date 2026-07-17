import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ShoppingCart, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { VendorProductGrid } from "@/components/VendorProductGrid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [marketplaceLoading, setMarketplaceLoading] = useState(false);
  const [confirm, setConfirm] = useState<
    | { kind: "reward"; id: string; name: string; emoji?: string; cost: number; stock: number }
    | { kind: "vendor"; id: string; name: string; cost: number; stock: number; shop?: string }
    | null
  >(null);

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
    const product = marketplace.find((p) => p.id === productId);
    if (!product) { toast.error("Product not found"); return; }
    if (!product.is_active || product.admin_status !== "approved") {
      toast.error("This product is no longer available");
      await load();
      return;
    }
    if ((product.stock_quantity ?? 0) <= 0) {
      toast.error("This product is out of stock");
      await load();
      return;
    }
    if ((student?.total_points ?? 0) < product.required_points) {
      toast.error(`You need ${product.required_points - (student?.total_points ?? 0)} more points`);
      return;
    }
    setMpBusy(productId);
    const { data, error } = await (supabase as any).rpc("redeem_vendor_product", { p_product_id: productId });
    setMpBusy(null);
    if (error) { toast.error(error.message || "Redemption failed. Please try again."); return; }
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    if (!parsed?.success) { toast.error(parsed?.message || "Redemption was rejected"); return; }
    toast.success(`Voucher: ${parsed.voucher}`);
    load();
  }

  async function handleRedeem(rewardId: string, cost: number) {
    console.log('=== REDEEM START ===', { rewardId, cost, studentId: student?.id, currentPoints: student?.total_points });
    
    // Validation checks
    if (!student?.id) {
      setError("We couldn't find your student profile. Please refresh the page.");
      return;
    }
    
    if (student.total_points < cost) {
      setError(`You need ${cost - student.total_points} more points to redeem this reward.`);
      return;
    }
    
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) {
      setError("This reward is no longer available.");
      await load();
      return;
    }
    if (reward.stock <= 0) {
      setError(`"${reward.name}" is out of stock right now.`);
      await load();
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
      const msg = error instanceof Error ? error.message : "Redemption failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setRedeemingId(null);
      console.log('=== REDEEM END ===');
    }
  }

  function askRedeemReward(r: any) {
    setError("");
    if (student && student.total_points < r.point_cost) {
      setError(`You need ${r.point_cost - student.total_points} more points to redeem "${r.name}".`);
      return;
    }
    if ((r.stock ?? 0) <= 0) {
      setError(`"${r.name}" is out of stock right now.`);
      return;
    }
    setConfirm({ kind: "reward", id: r.id, name: r.name, emoji: r.emoji, cost: r.point_cost, stock: r.stock });
  }

  function askRedeemVendor(p: any) {
    if (student && student.total_points < p.required_points) {
      toast.error(`You need ${p.required_points - student.total_points} more points`);
      return;
    }
    if ((p.stock_quantity ?? 0) <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    setConfirm({ kind: "vendor", id: p.id, name: p.product_name, cost: p.required_points, stock: p.stock_quantity, shop: p.vendors?.shop_name });
  }

  async function confirmRedeem() {
    if (!confirm) return;
    const c = confirm;
    setConfirm(null);
    if (c.kind === "reward") await handleRedeem(c.id, c.cost);
    else await redeemVendor(c.id);
  }

  if (!student) return <div className="flex justify-center py-12"><div className="text-2xl animate-bounce">🎁</div></div>;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/70 p-4 text-primary-foreground shadow-lg">
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">Rewards</h1>
            <p className="text-xs opacity-90">Redeem your points for cool stuff</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <Sparkles className="h-5 w-5" />
              <span className="text-3xl font-black leading-none">{student.total_points}</span>
            </div>
            <div className="text-[10px] opacity-90 mt-0.5">points available</div>
          </div>
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
                  onClick={() => askRedeemReward(r)}
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

      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-black text-foreground">Marketplace</h2>
            <p className="text-[11px] text-muted-foreground">Redeem points at partner vendors</p>
          </div>
        </div>
        <VendorProductGrid
          products={marketplace}
          loading={marketplaceLoading}
          studentPoints={student.total_points}
          emptyMessage="No marketplace products available for your school yet."
          renderAction={(p) => {
            const canAfford = student.total_points >= p.required_points;
            const busy = mpBusy === p.id;
            return (
              <Button
                size="sm"
                className="w-full rounded-xl h-8 text-xs"
                disabled={!canAfford || busy || p.stock_quantity <= 0}
                onClick={() => askRedeemVendor(p)}
              >
                {busy ? "…" : !canAfford ? `Need ${p.required_points - student.total_points} more` : (<><ShoppingCart className="h-3 w-3 mr-1" />Redeem</>)}
              </Button>
            );
          }}
        />
      </section>

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

      <AlertDialog open={!!confirm} onOpenChange={(open) => { if (!open) setConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm redemption</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-1">
                {confirm && (
                  <div className="flex items-center gap-3 rounded-xl border p-3">
                    <div className="text-2xl">{confirm.kind === "reward" ? (confirm.emoji || "🎁") : "🛍️"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate">{confirm.name}</div>
                      {confirm.kind === "vendor" && confirm.shop && (
                        <div className="text-xs text-muted-foreground truncate">{confirm.shop}</div>
                      )}
                      <div className="text-xs text-muted-foreground">{confirm.stock} available</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-primary">{confirm.cost} pts</div>
                    </div>
                  </div>
                )}
                {confirm && student && (
                  <div className="text-xs text-muted-foreground">
                    Balance: <span className="font-semibold text-foreground">{student.total_points} pts</span>
                    {" → "}
                    <span className="font-semibold text-foreground">{student.total_points - confirm.cost} pts</span> after redemption
                  </div>
                )}
                <div className="text-xs text-muted-foreground">This action cannot be undone.</div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRedeem}>Confirm redeem</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
