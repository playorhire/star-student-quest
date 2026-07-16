import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, C as Card, a as CardContent, B as Button } from "./_ssr/router-OBc8LoFd.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { V as VendorProductGrid } from "./_ssr/VendorProductGrid-ByY5OyXl.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { e as Sparkles, aa as ShoppingCart, k as ShoppingBag } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/radix-ui__react-avatar.mjs";
import "./_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "./_libs/use-sync-external-store.mjs";
import "./_ssr/vendor-categories-DFpjRGfO.mjs";
function StudentRewards() {
  const {
    user
  } = useAuth();
  const [rewards, setRewards] = reactExports.useState([]);
  const [student, setStudent] = reactExports.useState(null);
  const [redemptions, setRedemptions] = reactExports.useState([]);
  const [error, setError] = reactExports.useState("");
  const [redeemingId, setRedeemingId] = reactExports.useState(null);
  const [marketplace, setMarketplace] = reactExports.useState([]);
  const [vendorRedemptions, setVendorRedemptions] = reactExports.useState([]);
  const [mpBusy, setMpBusy] = reactExports.useState(null);
  const [marketplaceLoading, setMarketplaceLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (user) load();
  }, [user]);
  async function load() {
    console.log("Loading fresh data from database...");
    const {
      data: s
    } = await supabase.from("students").select("id, total_points, school_id").eq("user_id", user.id).single();
    setStudent(s);
    console.log("Student data loaded:", s);
    const [r, red] = await Promise.all([supabase.from("rewards").select("*").order("point_cost"), s ? supabase.from("redemptions").select("*, rewards(name, emoji)").eq("student_id", s.id).order("created_at", {
      ascending: false
    }) : Promise.resolve({
      data: []
    })]);
    console.log("Rewards loaded:", r.data);
    console.log("Redemptions loaded:", red.data);
    setRewards(r.data || []);
    setRedemptions(red.data || []);
    const [mpRed] = await Promise.all([s ? supabase.from("reward_redemptions").select("*, vendor_products(product_name), vendors(shop_name)").eq("student_id", s.id).order("redeemed_at", {
      ascending: false
    }) : Promise.resolve({
      data: []
    })]);
    setVendorRedemptions(mpRed.data || []);
    await loadMarketplaceProducts(s?.school_id || user?.schoolId);
  }
  async function loadMarketplaceProducts(schoolId) {
    if (!schoolId) {
      setMarketplace([]);
      setMarketplaceLoading(false);
      return;
    }
    setMarketplaceLoading(true);
    const {
      data: schoolLinks,
      error: schoolLinksError
    } = await supabase.from("vendor_product_schools").select("product_id").eq("school_id", schoolId).eq("approved", true);
    if (schoolLinksError) {
      console.error("Failed to load marketplace school links", schoolLinksError);
      setMarketplace([]);
      setMarketplaceLoading(false);
      return;
    }
    const productIds = (schoolLinks || []).map((entry) => entry.product_id).filter(Boolean);
    if (!productIds.length) {
      setMarketplace([]);
      setMarketplaceLoading(false);
      return;
    }
    const {
      data: products,
      error: productsError
    } = await supabase.from("vendor_products").select("*, vendors(shop_name)").in("id", productIds).eq("is_active", true).eq("admin_status", "approved").gt("stock_quantity", 0).order("required_points");
    if (productsError) {
      console.error("Failed to load marketplace products", productsError);
      setMarketplace([]);
    } else {
      setMarketplace(products || []);
    }
    setMarketplaceLoading(false);
  }
  async function redeemVendor(productId) {
    setMpBusy(productId);
    const {
      data,
      error: error2
    } = await supabase.rpc("redeem_vendor_product", {
      p_product_id: productId
    });
    setMpBusy(null);
    if (error2) {
      toast.error(error2.message);
      return;
    }
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    if (!parsed.success) {
      toast.error(parsed.message);
      return;
    }
    toast.success(`Voucher: ${parsed.voucher}`);
    load();
  }
  async function handleRedeem(rewardId, cost) {
    console.log("=== REDEEM START ===", {
      rewardId,
      cost,
      studentId: student?.id,
      currentPoints: student?.total_points
    });
    if (!student?.id) {
      setError("Student data not available");
      return;
    }
    if (student.total_points < cost) {
      setError("Insufficient points for this reward");
      return;
    }
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward || reward.stock <= 0) {
      setError("This reward is out of stock");
      return;
    }
    setRedeemingId(rewardId);
    setError("");
    try {
      console.log("Calling redeem_reward RPC...");
      const {
        data,
        error: error2
      } = await supabase.rpc("redeem_reward", {
        p_student_id: student.id,
        p_reward_id: rewardId,
        p_points_spent: cost
      });
      console.log("RPC response:", {
        data,
        error: error2
      });
      if (error2) {
        console.error("RPC call failed:", error2);
        throw new Error(`RPC Error: ${error2.message}`);
      }
      let result;
      try {
        result = typeof data === "string" ? JSON.parse(data) : data;
      } catch {
        result = data;
      }
      console.log("Parsed result:", result);
      if (!result || !result.success) {
        throw new Error(result?.message || "Redemption failed on server");
      }
      console.log("Redemption successful! New points:", result.new_points);
      setStudent({
        ...student,
        total_points: result.new_points || student.total_points - cost
      });
      setRewards(rewards.map((r) => r.id === rewardId ? {
        ...r,
        stock: r.stock - 1
      } : r));
      await load();
    } catch (error2) {
      console.error("Redemption failed:", error2);
      setError(error2 instanceof Error ? error2.message : "Redemption failed. Please try again.");
    } finally {
      setRedeemingId(null);
      console.log("=== REDEEM END ===");
    }
  }
  if (!student) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl animate-bounce", children: "🎁" }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/70 p-4 text-primary-foreground shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-black", children: "Rewards" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-90", children: "Redeem your points for cool stuff" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black leading-none", children: student.total_points })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] opacity-90 mt-0.5", children: "points available" })
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: error }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: rewards.map((r) => {
      const canAfford = student.total_points >= r.point_cost;
      const isRedeeming = redeemingId === r.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `border-0 shadow-sm ${!canAfford ? "opacity-60" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: r.emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-card-foreground", children: r.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: r.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-primary mt-1", children: [
            r.point_cost,
            " pts · ",
            r.stock,
            " left"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "rounded-xl", disabled: !canAfford || r.stock <= 0 || isRedeeming, onClick: () => handleRedeem(r.id, r.point_cost), children: isRedeeming ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" }),
          "Redeeming..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3 w-3 mr-1" }),
          " Redeem"
        ] }) })
      ] }) }, r.id);
    }) }),
    redemptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-foreground mb-2", children: "My Redemptions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: redemptions.map((red) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center justify-between p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: red.rewards?.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: red.rewards?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              red.points_spent,
              " pts"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-bold px-2 py-1 rounded-full ${red.status === "fulfilled" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`, children: red.status })
      ] }) }, red.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-black text-foreground", children: "Marketplace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Redeem points at partner vendors" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VendorProductGrid, { products: marketplace, loading: marketplaceLoading, studentPoints: student.total_points, emptyMessage: "No marketplace products available for your school yet.", renderAction: (p) => {
        const canAfford = student.total_points >= p.required_points;
        const busy = mpBusy === p.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "w-full rounded-xl h-8 text-xs", disabled: !canAfford || busy || p.stock_quantity <= 0, onClick: () => redeemVendor(p.id), children: busy ? "…" : !canAfford ? `Need ${p.required_points - student.total_points} more` : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3 w-3 mr-1" }),
          "Redeem"
        ] }) });
      } })
    ] }),
    vendorRedemptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-foreground mb-2 mt-4", children: "My Vouchers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: vendorRedemptions.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold truncate", children: r.vendor_products?.product_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
            r.vendors?.shop_name,
            " · ",
            r.points_used,
            " pts"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono tracking-widest mt-0.5", children: r.voucher_code })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-2 py-1 rounded-full ${r.status === "collected" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`, children: r.status })
      ] }) }) }, r.id)) })
    ] })
  ] });
}
export {
  StudentRewards as component
};
