import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { R as RewardsManager } from "./_ssr/RewardsManager-D_IGII5n.mjs";
import { u as useAuth, s as supabase } from "./_ssr/router-OBc8LoFd.mjs";
import { V as VendorProductGrid } from "./_ssr/VendorProductGrid-ByY5OyXl.mjs";
import "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { k as ShoppingBag } from "./_libs/lucide-react.mjs";
import "./_ssr/label-Ccl7j--t.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_ssr/dialog-BX2IkkIR.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/isbot.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_libs/radix-ui__react-avatar.mjs";
import "./_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "./_libs/use-sync-external-store.mjs";
import "./_ssr/vendor-categories-DFpjRGfO.mjs";
function TeacherRewards() {
  const {
    user
  } = useAuth();
  const [vendorProducts, setVendorProducts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (user?.schoolId) loadVendorProducts();
  }, [user?.schoolId]);
  async function loadVendorProducts() {
    if (!user?.schoolId) {
      setVendorProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const {
      data: schoolLinks,
      error: schoolLinksError
    } = await supabase.from("vendor_product_schools").select("product_id").eq("school_id", user.schoolId).eq("approved", true);
    if (schoolLinksError) {
      console.error(schoolLinksError);
      setVendorProducts([]);
      return;
    }
    const productIds = (schoolLinks || []).map((entry) => entry.product_id).filter(Boolean);
    if (!productIds.length) {
      setVendorProducts([]);
      return;
    }
    const {
      data,
      error
    } = await supabase.from("vendor_products").select("*, vendors(shop_name)").in("id", productIds).eq("is_active", true).eq("admin_status", "approved").gt("stock_quantity", 0).order("required_points");
    if (error) {
      console.error(error);
      setVendorProducts([]);
    } else {
      setVendorProducts(data || []);
    }
    setLoading(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "Rewards" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Add, edit, and set points for rewards" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl bg-gradient-to-br from-primary/5 to-transparent p-4 border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-black text-foreground", children: "Vendor Marketplace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Products students can redeem with points" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VendorProductGrid, { products: vendorProducts, loading, emptyMessage: "No vendor products are available for this school yet." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RewardsManager, { branchId: user?.branchId || void 0 })
  ] });
}
export {
  TeacherRewards as component
};
