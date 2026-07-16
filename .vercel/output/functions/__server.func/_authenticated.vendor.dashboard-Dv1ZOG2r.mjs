import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { s as supabase, C as Card, a as CardContent } from "./_ssr/router-OBc8LoFd.mjs";
import "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { P as Package, D as Clock, k as ShoppingBag, y as CircleCheck } from "./_libs/lucide-react.mjs";
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
function VendorDashboard() {
  const [stats, setStats] = reactExports.useState({
    products: 0,
    pending: 0,
    approved: 0,
    collected: 0
  });
  const [monthly, setMonthly] = reactExports.useState([]);
  reactExports.useEffect(() => {
    load();
  }, []);
  async function load() {
    const {
      data: vendor
    } = await supabase.rpc("get_my_vendor_id");
    const vendorId = vendor;
    if (!vendorId) return;
    const [products, redemptions] = await Promise.all([supabase.from("vendor_products").select("id, admin_status").eq("vendor_id", vendorId), supabase.from("reward_redemptions").select("id, status, redeemed_at").eq("vendor_id", vendorId)]);
    const p = products.data || [];
    const r = redemptions.data || [];
    setStats({
      products: p.length,
      pending: r.filter((x) => x.status === "pending" || x.status === "approved").length,
      approved: r.filter((x) => x.status === "approved").length,
      collected: r.filter((x) => x.status === "collected").length
    });
    const byMonth = {};
    r.forEach((x) => {
      const m = new Date(x.redeemed_at).toISOString().slice(0, 7);
      byMonth[m] = (byMonth[m] || 0) + 1;
    });
    setMonthly(Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)).map(([month, count]) => ({
      month,
      count
    })));
  }
  const cards = [{
    label: "Products",
    value: stats.products,
    icon: Package,
    tint: "bg-primary/10 text-primary"
  }, {
    label: "Pending",
    value: stats.pending,
    icon: Clock,
    tint: "bg-amber-500/10 text-amber-600"
  }, {
    label: "Approved",
    value: stats.approved,
    icon: ShoppingBag,
    tint: "bg-blue-500/10 text-blue-600"
  }, {
    label: "Collected",
    value: stats.collected,
    icon: CircleCheck,
    tint: "bg-emerald-500/10 text-emerald-600"
  }];
  const maxCount = Math.max(1, ...monthly.map((m) => m.count));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Overview of your shop" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex h-9 w-9 items-center justify-center rounded-xl ${c.tint} mb-2`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-foreground", children: c.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.label })
    ] }) }, c.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-sm font-bold text-foreground", children: "Monthly Redemptions" }),
      monthly.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No redemptions yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: monthly.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] w-16 text-muted-foreground", children: m.month }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-4 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-primary to-accent", style: {
          width: `${m.count / maxCount * 100}%`
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold w-8 text-right", children: m.count })
      ] }, m.month)) })
    ] }) })
  ] });
}
export {
  VendorDashboard as component
};
