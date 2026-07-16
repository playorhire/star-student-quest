import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RewardsManager } from "@/components/RewardsManager";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { VendorProductGrid } from "@/components/VendorProductGrid";
import { ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/_authenticated/teacher/rewards")({
  component: TeacherRewards,
});

function TeacherRewards() {
  const { user } = useAuth();
  const [vendorProducts, setVendorProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.schoolId) loadVendorProducts();
  }, [user?.schoolId]);

  async function loadVendorProducts() {
    if (!user?.schoolId) {
      setVendorProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data: schoolLinks, error: schoolLinksError } = await (supabase as any)
      .from("vendor_product_schools")
      .select("product_id")
      .eq("school_id", user.schoolId)
      .eq("approved", true);

    if (schoolLinksError) {
      console.error(schoolLinksError);
      setVendorProducts([]);
      return;
    }

    const productIds = (schoolLinks || []).map((entry: any) => entry.product_id).filter(Boolean);
    if (!productIds.length) {
      setVendorProducts([]);
      return;
    }

    const { data, error } = await (supabase as any)
      .from("vendor_products")
      .select("*, vendors(shop_name)")
      .in("id", productIds)
      .eq("is_active", true)
      .eq("admin_status", "approved")
      .gt("stock_quantity", 0)
      .order("required_points");

    if (error) {
      console.error(error);
      setVendorProducts([]);
    } else {
      setVendorProducts(data || []);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Rewards</h1>
        <p className="text-sm text-muted-foreground">Add, edit, and set points for rewards</p>
      </div>
      <section className="rounded-2xl bg-gradient-to-br from-primary/5 to-transparent p-4 border">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-black text-foreground">Vendor Marketplace</h2>
            <p className="text-[11px] text-muted-foreground">Products students can redeem with points</p>
          </div>
        </div>
        <VendorProductGrid
          products={vendorProducts}
          loading={loading}
          emptyMessage="No vendor products are available for this school yet."
        />
      </section>

      <RewardsManager branchId={user?.branchId || undefined} />
    </div>
  );
}
