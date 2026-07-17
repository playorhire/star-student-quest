import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, C as Card, a as CardContent, B as Button, d as cn, e as buttonVariants } from "./_ssr/router-DuskeiVN.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { V as VendorProductGrid } from "./_ssr/VendorProductGrid-Dvc-_Ofl.mjs";
import { R as Root2, P as Portal2, C as Content2, T as Title2, D as Description2, a as Cancel, A as Action, O as Overlay2 } from "./_libs/radix-ui__react-alert-dialog.mjs";
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
import "tslib";
import "./_libs/supabase__auth-js.mjs";
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
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__react-presence.mjs";
const AlertDialog = Root2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
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
  const [confirm, setConfirm] = reactExports.useState(null);
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
    const product = marketplace.find((p) => p.id === productId);
    if (!product) {
      toast.error("Product not found");
      return;
    }
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
    const {
      data,
      error: error2
    } = await supabase.rpc("redeem_vendor_product", {
      p_product_id: productId
    });
    setMpBusy(null);
    if (error2) {
      toast.error(error2.message || "Redemption failed. Please try again.");
      return;
    }
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    if (!parsed?.success) {
      toast.error(parsed?.message || "Redemption was rejected");
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
      setError("We couldn't find your student profile. Please refresh the page.");
      return;
    }
    if (student.total_points < cost) {
      setError(`You need ${cost - student.total_points} more points to redeem this reward.`);
      return;
    }
    const reward = rewards.find((r) => r.id === rewardId);
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
      const msg = error2 instanceof Error ? error2.message : "Redemption failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setRedeemingId(null);
      console.log("=== REDEEM END ===");
    }
  }
  function askRedeemReward(r) {
    setError("");
    if (student && student.total_points < r.point_cost) {
      setError(`You need ${r.point_cost - student.total_points} more points to redeem "${r.name}".`);
      return;
    }
    if ((r.stock ?? 0) <= 0) {
      setError(`"${r.name}" is out of stock right now.`);
      return;
    }
    setConfirm({
      kind: "reward",
      id: r.id,
      name: r.name,
      emoji: r.emoji,
      cost: r.point_cost,
      stock: r.stock
    });
  }
  function askRedeemVendor(p) {
    if (student && student.total_points < p.required_points) {
      toast.error(`You need ${p.required_points - student.total_points} more points`);
      return;
    }
    if ((p.stock_quantity ?? 0) <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    setConfirm({
      kind: "vendor",
      id: p.id,
      name: p.product_name,
      cost: p.required_points,
      stock: p.stock_quantity,
      shop: p.vendors?.shop_name
    });
  }
  async function confirmRedeem() {
    if (!confirm) return;
    const c = confirm;
    setConfirm(null);
    if (c.kind === "reward") await handleRedeem(c.id, c.cost);
    else await redeemVendor(c.id);
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "rounded-xl", disabled: !canAfford || r.stock <= 0 || isRedeeming, onClick: () => askRedeemReward(r), children: isRedeeming ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "w-full rounded-xl h-8 text-xs", disabled: !canAfford || busy || p.stock_quantity <= 0, onClick: () => askRedeemVendor(p), children: busy ? "…" : !canAfford ? `Need ${p.required_points - student.total_points} more` : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!confirm, onOpenChange: (open) => {
      if (!open) setConfirm(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Confirm redemption" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-1", children: [
          confirm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: confirm.kind === "reward" ? confirm.emoji || "🎁" : "🛍️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground truncate", children: confirm.name }),
              confirm.kind === "vendor" && confirm.shop && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: confirm.shop }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                confirm.stock,
                " available"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-black text-primary", children: [
              confirm.cost,
              " pts"
            ] }) })
          ] }),
          confirm && student && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Balance: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
              student.total_points,
              " pts"
            ] }),
            " → ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
              student.total_points - confirm.cost,
              " pts"
            ] }),
            " after redemption"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "This action cannot be undone." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: confirmRedeem, children: "Confirm redeem" })
      ] })
    ] }) })
  ] });
}
export {
  StudentRewards as component
};
