import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, B as Button, C as Card, a as CardContent, I as Input } from "./_ssr/router-WWTDPtlD.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { V as VendorProductGrid } from "./_ssr/VendorProductGrid-D8IfG3bC.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { z as Plus, k as ShoppingBag, X, a7 as LoaderCircle, F as Pencil, T as Trash2 } from "./_libs/lucide-react.mjs";
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
function SchoolAdminRewards() {
  const {
    user
  } = useAuth();
  const [rewards, setRewards] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    name: "",
    description: "",
    emoji: "🎁",
    point_cost: 0,
    stock: 0,
    category: "Items"
  });
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [vendorProducts, setVendorProducts] = reactExports.useState([]);
  const [vendorLoading, setVendorLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (user?.schoolId) {
      loadRewards();
      loadVendorProducts();
    }
  }, [user]);
  async function loadVendorProducts() {
    if (!user?.schoolId) {
      setVendorProducts([]);
      setVendorLoading(false);
      return;
    }
    setVendorLoading(true);
    const {
      data: links
    } = await supabase.from("vendor_product_schools").select("product_id").eq("school_id", user.schoolId).eq("approved", true);
    const ids = (links || []).map((l) => l.product_id).filter(Boolean);
    if (!ids.length) {
      setVendorProducts([]);
      setVendorLoading(false);
      return;
    }
    const {
      data
    } = await supabase.from("vendor_products").select("*, vendors(shop_name)").in("id", ids).eq("is_active", true).eq("admin_status", "approved").gt("stock_quantity", 0).order("required_points");
    setVendorProducts(data || []);
    setVendorLoading(false);
  }
  async function loadRewards() {
    setLoading(true);
    setError(null);
    const {
      data,
      error: err
    } = await supabase.from("rewards").select("id, name, emoji, point_cost, stock, description, category").eq("school_id", user.schoolId).order("point_cost");
    if (err) {
      setError(`${err.message} (${err.code})`);
      toast.error(err.message);
    } else {
      setRewards(data || []);
    }
    setLoading(false);
  }
  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      emoji: "🎁",
      point_cost: 0,
      stock: 0,
      category: "Items"
    });
    setShowForm(true);
  }
  function openEdit(r) {
    setEditing(r);
    setForm({
      name: r.name || "",
      description: r.description || "",
      emoji: r.emoji || "🎁",
      point_cost: r.point_cost || 0,
      stock: r.stock ?? 0,
      category: r.category || "Items"
    });
    setShowForm(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      emoji: form.emoji,
      point_cost: Number(form.point_cost),
      stock: Number(form.stock),
      category: form.category,
      school_id: user.schoolId
    };
    if (editing) {
      const {
        error: err
      } = await supabase.from("rewards").update(payload).eq("id", editing.id);
      if (err) toast.error(err.message);
      else toast.success("Reward updated");
    } else {
      const {
        error: err
      } = await supabase.from("rewards").insert(payload);
      if (err) toast.error(err.message);
      else toast.success("Reward created");
    }
    setShowForm(false);
    setEditing(null);
    setSubmitting(false);
    loadRewards();
  }
  async function handleDelete(id) {
    if (!confirm("Delete this reward?")) return;
    const {
      error: err
    } = await supabase.from("rewards").delete().eq("id", id);
    if (err) toast.error(err.message);
    else {
      toast.success("Reward deleted");
      loadRewards();
    }
  }
  const allowedRoles = ["school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Access Denied" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black", children: "Rewards" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Rewards catalog for your school" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openCreate, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
        "Add Reward"
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Error:" }),
      " ",
      error
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl bg-gradient-to-br from-primary/5 to-transparent p-4 border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-black text-foreground", children: "Vendor Marketplace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Approved vendor items available to students at this school" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VendorProductGrid, { products: vendorProducts, loading: vendorLoading, emptyMessage: "No vendor products are available for this school yet." })
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold", children: editing ? "Edit Reward" : "New Reward" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowForm(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[auto_1fr] gap-3 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.emoji, onChange: (e) => setForm((f) => ({
            ...f,
            emoji: e.target.value
          })), className: "w-16 text-center text-lg px-0", maxLength: 4 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Reward Name", required: true, value: form.name, onChange: (e) => setForm((f) => ({
            ...f,
            name: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Description (optional)", value: form.description, onChange: (e) => setForm((f) => ({
          ...f,
          description: e.target.value
        })) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", placeholder: "Point Cost", required: true, min: 1, value: form.point_cost, onChange: (e) => setForm((f) => ({
            ...f,
            point_cost: Number(e.target.value)
          })) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", placeholder: "Stock", required: true, min: 0, value: form.stock, onChange: (e) => setForm((f) => ({
            ...f,
            stock: Number(e.target.value)
          })) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Category", value: form.category, onChange: (e) => setForm((f) => ({
            ...f,
            category: e.target.value
          })) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: submitting, className: "flex-1", children: [
            submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : null,
            editing ? "Update" : "Create"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setShowForm(false), children: "Cancel" })
        ] })
      ] })
    ] }) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Loading..." }) : rewards.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "No rewards found. Click Add Reward to create one." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: rewards.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: r.emoji || "🎁" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: r.name }),
        r.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: r.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
          r.category,
          " • ",
          r.stock ?? 0,
          " in stock"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-black text-primary", children: [
        r.point_cost,
        " pts"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => openEdit(r), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive", onClick: () => handleDelete(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] })
    ] }) }, r.id)) })
  ] });
}
export {
  SchoolAdminRewards as component
};
