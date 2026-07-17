import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { s as supabase, C as Card, a as CardContent, I as Input, B as Button } from "./_ssr/router-DuskeiVN.mjs";
import { L as Label } from "./_ssr/label-TEKU4-jV.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
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
import "./_libs/lucide-react.mjs";
import "./_libs/radix-ui__react-label.mjs";
function VendorProfile() {
  const [v, setV] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    load();
  }, []);
  async function load() {
    const {
      data
    } = await supabase.from("vendors").select("*").limit(1).single();
    setV(data);
  }
  async function save() {
    if (!v) return;
    setSaving(true);
    const {
      error
    } = await supabase.from("vendors").update({
      shop_name: v.shop_name,
      owner_name: v.owner_name,
      phone: v.phone,
      address: v.address,
      city: v.city
    }).eq("id", v.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  }
  if (!v) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-sm text-muted-foreground", children: "Loading..." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your shop details" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Shop name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.shop_name || "", onChange: (e) => setV({
          ...v,
          shop_name: e.target.value
        }), className: "rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Owner name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.owner_name || "", onChange: (e) => setV({
          ...v,
          owner_name: e.target.value
        }), className: "rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.email || "", disabled: true, className: "rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.phone || "", onChange: (e) => setV({
          ...v,
          phone: e.target.value
        }), className: "rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.address || "", onChange: (e) => setV({
          ...v,
          address: e.target.value
        }), className: "rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "City" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: v.city || "", onChange: (e) => setV({
          ...v,
          city: e.target.value
        }), className: "rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, disabled: saving, className: "w-full rounded-xl", children: saving ? "Saving..." : "Save" })
    ] }) })
  ] });
}
export {
  VendorProfile as component
};
