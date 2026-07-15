import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RewardsManager } from "@/components/RewardsManager";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { categoryEmoji } from "@/lib/vendor-categories";
import { Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/teacher/rewards")({
  component: TeacherRewards,
});

function TeacherRewards() {
  const { user } = useAuth();
  const [vendorProducts, setVendorProducts] = useState<any[]>([]);

  useEffect(() => {
    if (user?.schoolId) loadVendorProducts();
  }, [user?.schoolId]);

  async function loadVendorProducts() {
    if (!user?.schoolId) {
      setVendorProducts([]);
      return;
    }

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
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Rewards</h1>
        <p className="text-sm text-muted-foreground">Add, edit, and set points for rewards</p>
      </div>
      <div>
        <h2 className="text-lg font-black text-foreground">Vendor Products for Your School</h2>
        <p className="text-sm text-muted-foreground">Approved marketplace items that students can redeem with points</p>
      </div>

      <div className="grid gap-2">
        {vendorProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-3">No vendor products are available for this school yet.</p>
        ) : (
          vendorProducts.map((product) => (
            <Card key={product.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden flex items-center justify-center text-2xl shrink-0">
                  {product.image_urls?.[0] ? <img src={product.image_urls[0]} alt={product.product_name} className="h-full w-full object-cover" loading="lazy" /> : categoryEmoji(product.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{product.product_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{product.vendors?.shop_name} · {product.stock_quantity} left</div>
                  <div className="text-xs font-bold text-primary mt-0.5">{product.required_points} pts</div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span className="text-xs font-semibold">Available</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <RewardsManager branchId={user?.branchId || undefined} />
    </div>
  );
}
