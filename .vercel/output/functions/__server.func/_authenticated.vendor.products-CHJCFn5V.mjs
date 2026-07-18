import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, B as Button, C as Card, a as CardContent, I as Input } from "./_ssr/router-WWTDPtlD.mjs";
import { L as Label } from "./_ssr/label-DtSqJuKJ.mjs";
import { T as Textarea } from "./_ssr/textarea-B_fBR_mw.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./_ssr/dialog-f2JQFkZf.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { c as categoryEmoji, P as PRODUCT_CATEGORIES } from "./_ssr/vendor-categories-DFpjRGfO.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { z as Plus, P as Package, D as Clock, y as CircleCheck, E as CircleX, F as Pencil, I as EyeOff, J as Eye, T as Trash2, X, N as ImagePlus } from "./_libs/lucide-react.mjs";
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
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__react-presence.mjs";
function VendorProducts() {
  const {
    user
  } = useAuth();
  const [products, setProducts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [editing, setEditing] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [filter, setFilter] = reactExports.useState("all");
  reactExports.useEffect(() => {
    load();
  }, []);
  async function load() {
    setLoading(true);
    const {
      data
    } = await supabase.from("vendor_products").select("*").order("created_at", {
      ascending: false
    });
    setProducts(data || []);
    setLoading(false);
  }
  async function uploadImages(files) {
    if (!user) return [];
    const urls = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const {
        error
      } = await supabase.storage.from("vendor-assets").upload(path, file);
      if (error) {
        toast.error(error.message);
        continue;
      }
      const {
        data: signed
      } = await supabase.storage.from("vendor-assets").createSignedUrl(path, 60 * 60 * 24 * 365);
      if (signed?.signedUrl) urls.push(signed.signedUrl);
    }
    return urls;
  }
  async function handleFileChange(e) {
    if (!e.target.files?.length || !editing) return;
    const urls = await uploadImages(e.target.files);
    setEditing({
      ...editing,
      image_urls: [...editing.image_urls || [], ...urls]
    });
  }
  function removeImage(idx) {
    if (!editing) return;
    const urls = [...editing.image_urls || []];
    urls.splice(idx, 1);
    setEditing({
      ...editing,
      image_urls: urls
    });
  }
  async function save() {
    if (!editing?.product_name || !editing.required_points) {
      toast.error("Name and required points are needed");
      return;
    }
    setSaving(true);
    const {
      data: vendorId
    } = await supabase.rpc("get_my_vendor_id");
    const payload = {
      vendor_id: vendorId,
      product_name: editing.product_name,
      description: editing.description || null,
      category: editing.category || "Others",
      image_urls: editing.image_urls || [],
      cash_price: editing.cash_price ?? null,
      required_points: editing.required_points,
      stock_quantity: editing.stock_quantity ?? 0,
      is_active: editing.is_active ?? true
    };
    const {
      error
    } = editing.id ? await supabase.from("vendor_products").update(payload).eq("id", editing.id) : await supabase.from("vendor_products").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing.id ? "Product updated" : "Product added (pending approval)");
    setEditing(null);
    load();
  }
  async function del(id) {
    if (!confirm("Delete this product?")) return;
    const {
      error
    } = await supabase.from("vendor_products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      load();
    }
  }
  async function toggle(p) {
    const {
      error
    } = await supabase.from("vendor_products").update({
      is_active: !p.is_active
    }).eq("id", p.id);
    if (error) toast.error(error.message);
    else load();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "My Products" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage your shop catalog" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setEditing({
        category: "Others",
        is_active: true,
        stock_quantity: 0,
        required_points: 100,
        image_urls: []
      }), className: "rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
        " Add"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: [{
      key: "all",
      label: "All",
      icon: Package,
      count: products.length,
      color: "text-foreground"
    }, {
      key: "pending",
      label: "Pending",
      icon: Clock,
      count: products.filter((p) => p.admin_status === "pending").length,
      color: "text-amber-600"
    }, {
      key: "approved",
      label: "Live",
      icon: CircleCheck,
      count: products.filter((p) => p.admin_status === "approved").length,
      color: "text-emerald-600"
    }, {
      key: "rejected",
      label: "Rejected",
      icon: CircleX,
      count: products.filter((p) => p.admin_status === "rejected").length,
      color: "text-red-600"
    }].map((t) => {
      const Icon = t.icon;
      const active = filter === t.key;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilter(t.key), className: `rounded-2xl border p-2 text-center transition-all ${active ? "bg-primary text-primary-foreground border-primary shadow" : "bg-card hover:bg-muted"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 mx-auto ${active ? "" : t.color}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-lg font-black leading-none mt-1 ${active ? "" : t.color}`, children: t.count }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[10px] mt-0.5 ${active ? "opacity-90" : "text-muted-foreground"}`, children: t.label })
      ] }, t.key);
    }) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-sm text-muted-foreground", children: "Loading..." }) : products.filter((p) => filter === "all" || p.admin_status === filter).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-dashed border-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: filter === "all" ? "No products yet. Add your first product to get started." : `No ${filter} products.` })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: products.filter((p) => filter === "all" || p.admin_status === filter).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex gap-3 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-20 w-20 flex-shrink-0 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden flex items-center justify-center text-3xl", children: [
        p.image_urls?.[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_urls[0], alt: p.product_name, className: "h-full w-full object-cover", loading: "lazy" }) : categoryEmoji(p.category),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute bottom-1 left-1 rounded-full bg-background/90 backdrop-blur px-1.5 py-0.5 text-[9px] font-bold text-primary", children: [
          p.required_points,
          "✨"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-foreground line-clamp-1", children: p.product_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          p.stock_quantity,
          " in stock",
          p.cash_price ? ` · Rs ${p.cash_price}` : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 ${p.admin_status === "approved" ? "bg-emerald-500/10 text-emerald-600" : p.admin_status === "rejected" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"}`, children: [
            p.admin_status === "approved" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-2.5 w-2.5" }) : p.admin_status === "rejected" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5" }),
            p.admin_status
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${p.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`, children: p.is_active ? "active" : "hidden" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5", children: [
            categoryEmoji(p.category),
            " ",
            p.category
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", onClick: () => setEditing(p), title: "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", onClick: () => toggle(p), title: p.is_active ? "Hide" : "Show", children: p.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 text-destructive", onClick: () => del(p.id), title: "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] })
    ] }) }, p.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (o) => !o && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing?.id ? "Edit product" : "Add product" }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Product name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.product_name || "", onChange: (e) => setEditing({
            ...editing,
            product_name: e.target.value
          }), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: editing.description || "", onChange: (e) => setEditing({
            ...editing,
            description: e.target.value
          }), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: editing.category || "Others", onChange: (e) => setEditing({
            ...editing,
            category: e.target.value
          }), className: "w-full rounded-xl border bg-background p-2 text-sm", children: PRODUCT_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.key, children: [
            c.emoji,
            " ",
            c.label
          ] }, c.key)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Points" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, value: editing.required_points ?? "", onChange: (e) => setEditing({
              ...editing,
              required_points: parseInt(e.target.value || "0", 10)
            }), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Cash price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, step: "0.01", value: editing.cash_price ?? "", onChange: (e) => setEditing({
              ...editing,
              cash_price: e.target.value ? parseFloat(e.target.value) : null
            }), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, value: editing.stock_quantity ?? 0, onChange: (e) => setEditing({
              ...editing,
              stock_quantity: parseInt(e.target.value || "0", 10)
            }), className: "rounded-xl" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Images" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-1", children: [
            (editing.image_urls || []).map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-16 w-16 rounded-xl overflow-hidden border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u, alt: "", className: "h-full w-full object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeImage(i), className: "absolute top-0 right-0 bg-black/60 text-white rounded-bl-xl p-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
            ] }, i)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "h-16 w-16 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer text-muted-foreground hover:bg-muted", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", multiple: true, accept: "image/*", className: "hidden", onChange: handleFileChange })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, disabled: saving, className: "w-full rounded-xl", children: saving ? "Saving..." : editing.id ? "Save" : "Add product" })
      ] })
    ] }) })
  ] });
}
export {
  VendorProducts as component
};
