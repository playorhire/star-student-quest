import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, B as Button, C as Card, a as CardContent, I as Input } from "./_ssr/router-DuskeiVN.mjs";
import { L as Label } from "./_ssr/label-TEKU4-jV.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./_ssr/dialog-CsPHMyaH.mjs";
import { c as categoryEmoji, a as categoryLabel } from "./_ssr/vendor-categories-DFpjRGfO.mjs";
import { T as Textarea } from "./_ssr/textarea-Dy6qCJjO.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { z as Plus, i as Store, D as Clock, y as CircleCheck, E as CircleX, a1 as Power, K as KeyRound, W as Search, J as Eye, q as School, a2 as ChevronLeft, a3 as ChevronRight, a4 as SquareCheckBig, a5 as Square } from "./_libs/lucide-react.mjs";
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
const PAGE_SIZE = 20;
function SuperAdminVendors() {
  const {
    user
  } = useAuth();
  const [tab, setTab] = reactExports.useState("vendors");
  const [vendors, setVendors] = reactExports.useState([]);
  const [products, setProducts] = reactExports.useState([]);
  const [schools, setSchools] = reactExports.useState([]);
  const [creating, setCreating] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({});
  const [assigning, setAssigning] = reactExports.useState(null);
  const [assignedSchools, setAssignedSchools] = reactExports.useState(/* @__PURE__ */ new Set());
  const [loading, setLoading] = reactExports.useState(true);
  const [productsLoading, setProductsLoading] = reactExports.useState(false);
  const [productsCount, setProductsCount] = reactExports.useState(0);
  const [productsPage, setProductsPage] = reactExports.useState(0);
  const [productsSearch, setProductsSearch] = reactExports.useState("");
  const [productsSearchDebounced, setProductsSearchDebounced] = reactExports.useState("");
  const [productsStatus, setProductsStatus] = reactExports.useState("all");
  const [detail, setDetail] = reactExports.useState(null);
  const [detailImgIdx, setDetailImgIdx] = reactExports.useState(0);
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [stats, setStats] = reactExports.useState({
    pendingProducts: 0,
    approvedProducts: 0,
    rejectedProducts: 0,
    activeVendors: 0
  });
  const [vendorPendingCounts, setVendorPendingCounts] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (user) {
      loadSidebars();
      loadStats();
    }
  }, [user]);
  reactExports.useEffect(() => {
    const t = setTimeout(() => {
      setProductsSearchDebounced(productsSearch.trim());
      setProductsPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [productsSearch]);
  reactExports.useEffect(() => {
    if (!user) return;
    if (tab !== "products") return;
    loadProducts();
  }, [user, tab, productsPage, productsSearchDebounced, productsStatus]);
  async function loadSidebars() {
    setLoading(true);
    const [v, s] = await Promise.all([supabase.from("vendors").select("*").order("created_at", {
      ascending: false
    }), supabase.from("schools").select("id, name").order("name")]);
    if (v.error || s.error) {
      toast.error(v.error?.message || s.error?.message || "Failed to load vendor data");
    }
    setVendors(v.data || []);
    setSchools(s.data || []);
    setLoading(false);
  }
  async function loadStats() {
    const [pending, approved, rejected, activeV, pendingByVendor] = await Promise.all([supabase.from("vendor_products").select("id", {
      count: "exact",
      head: true
    }).eq("admin_status", "pending"), supabase.from("vendor_products").select("id", {
      count: "exact",
      head: true
    }).eq("admin_status", "approved"), supabase.from("vendor_products").select("id", {
      count: "exact",
      head: true
    }).eq("admin_status", "rejected"), supabase.from("vendors").select("id", {
      count: "exact",
      head: true
    }).eq("status", "active"), supabase.from("vendor_products").select("vendor_id").eq("admin_status", "pending")]);
    setStats({
      pendingProducts: pending.count || 0,
      approvedProducts: approved.count || 0,
      rejectedProducts: rejected.count || 0,
      activeVendors: activeV.count || 0
    });
    const counts = {};
    (pendingByVendor.data || []).forEach((r) => {
      counts[r.vendor_id] = (counts[r.vendor_id] || 0) + 1;
    });
    setVendorPendingCounts(counts);
  }
  async function loadProducts() {
    setProductsLoading(true);
    const from = productsPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let q = supabase.from("vendor_products").select("*, vendors(shop_name)", {
      count: "exact"
    }).order("created_at", {
      ascending: false
    }).range(from, to);
    if (productsSearchDebounced) {
      q = q.ilike("product_name", `%${productsSearchDebounced}%`);
    }
    if (productsStatus !== "all") {
      q = q.eq("admin_status", productsStatus);
    }
    const {
      data,
      error,
      count
    } = await q;
    if (error) {
      toast.error(error.message);
      setProducts([]);
      setProductsCount(0);
    } else {
      setProducts(data || []);
      setProductsCount(count || 0);
    }
    setProductsLoading(false);
  }
  async function createVendor(e) {
    e.preventDefault();
    if (!form.email || !form.password || !form.shop_name) {
      toast.error("Email, password, shop name required");
      return;
    }
    const res = await supabase.functions.invoke("create-user", {
      body: {
        email: form.email,
        password: form.password,
        role: "vendor",
        tenant_role: "vendor",
        is_primary: true,
        meta: {
          shop_name: form.shop_name,
          owner_name: form.owner_name || form.shop_name,
          phone: form.phone,
          address: form.address,
          city: form.city
        }
      }
    });
    if (res.error || res.data?.error) {
      toast.error(res.data?.error || res.error?.message || "Failed to create vendor");
      return;
    }
    toast.success("Vendor created");
    setCreating(false);
    setForm({});
    loadSidebars();
  }
  async function toggleStatus(v) {
    const next = v.status === "active" ? "suspended" : "active";
    const {
      error
    } = await supabase.from("vendors").update({
      status: next
    }).eq("id", v.id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Status: ${next}`);
      loadSidebars();
    }
  }
  async function resetPassword(v) {
    const pw = prompt("New password (min 6 chars)");
    if (!pw || pw.length < 6) return;
    const {
      error
    } = await supabase.functions.invoke("admin-update-user", {
      body: {
        targetUserId: v.user_id,
        password: pw
      }
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset");
  }
  async function setApproval(id, admin_status) {
    const {
      error
    } = await supabase.from("vendor_products").update({
      admin_status
    }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Product ${admin_status}`);
      loadProducts();
      loadStats();
      setDetail(null);
      setRejectReason("");
    }
  }
  async function openAssign(p) {
    setAssigning(p);
    const {
      data
    } = await supabase.from("vendor_product_schools").select("school_id").eq("product_id", p.id);
    setAssignedSchools(new Set((data || []).map((r) => r.school_id)));
  }
  async function saveAssign() {
    if (!assigning) return;
    const {
      data: existing
    } = await supabase.from("vendor_product_schools").select("id, school_id").eq("product_id", assigning.id);
    const existingSet = new Set((existing || []).map((r) => r.school_id));
    const toAdd = [...assignedSchools].filter((s) => !existingSet.has(s));
    const toRemove = (existing || []).filter((r) => !assignedSchools.has(r.school_id)).map((r) => r.id);
    if (toAdd.length > 0) {
      await supabase.from("vendor_product_schools").insert(toAdd.map((sid) => ({
        product_id: assigning.id,
        school_id: sid,
        approved: true
      })));
    }
    if (toRemove.length > 0) {
      await supabase.from("vendor_product_schools").delete().in("id", toRemove);
    }
    toast.success("School assignments saved");
    setAssigning(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "Vendor Management" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Vendors, products & school assignments" })
      ] }),
      tab === "vendors" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setCreating(true), className: "rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
        " New"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4 w-4" }), label: "Active vendors", value: stats.activeVendors, tone: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }), label: "Pending", value: stats.pendingProducts, tone: "amber", onClick: () => {
        setTab("products");
        setProductsStatus("pending");
        setProductsPage(0);
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }), label: "Approved", value: stats.approvedProducts, tone: "emerald", onClick: () => {
        setTab("products");
        setProductsStatus("approved");
        setProductsPage(0);
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }), label: "Rejected", value: stats.rejectedProducts, tone: "red", onClick: () => {
        setTab("products");
        setProductsStatus("rejected");
        setProductsPage(0);
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: tab === "vendors" ? "default" : "outline", onClick: () => setTab("vendors"), className: "rounded-xl", children: "Vendors" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: tab === "products" ? "default" : "outline", onClick: () => setTab("products"), className: "rounded-xl", children: [
        "Products",
        stats.pendingProducts > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 rounded-full bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center", children: stats.pendingProducts })
      ] })
    ] }),
    tab === "vendors" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center text-muted-foreground py-6", children: "Loading vendors..." }) : vendors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center text-muted-foreground py-6", children: "No vendors yet" }) : vendors.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm truncate", children: v.shop_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
            v.email,
            " · ",
            v.city || "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${v.status === "active" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`, children: v.status }),
            vendorPendingCounts[v.id] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600", children: [
              vendorPendingCounts[v.id],
              " pending"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", onClick: () => toggleStatus(v), "aria-label": "Toggle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", onClick: () => resetPassword(v), "aria-label": "Reset password", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4" }) })
      ] }) }, v.id)),
      vendors.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center text-muted-foreground py-6", children: "No vendors yet" })
    ] }),
    tab === "products" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: productsSearch, onChange: (e) => setProductsSearch(e.target.value), placeholder: "Search products…", className: "pl-8 rounded-xl h-9" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: productsStatus, onChange: (e) => {
          setProductsStatus(e.target.value);
          setProductsPage(0);
        }, className: "h-9 rounded-xl border bg-background px-2 text-sm", "aria-label": "Filter status", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "approved", children: "Approved" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rejected", children: "Rejected" })
        ] })
      ] }),
      productsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center text-muted-foreground py-6", children: "Loading products..." }) : products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center text-muted-foreground py-6", children: productsSearchDebounced || productsStatus !== "all" ? "No matching products" : "No products yet" }) : products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
          setDetail(p);
          setDetailImgIdx(0);
          setRejectReason("");
        }, className: "w-full flex items-start gap-3 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden flex items-center justify-center text-2xl shrink-0", children: p.image_urls?.[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_urls[0], alt: "", className: "h-full w-full object-cover" }) : categoryEmoji(p.category) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm truncate", children: p.product_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: p.vendors?.shop_name || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${p.admin_status === "approved" ? "bg-emerald-500/10 text-emerald-600" : p.admin_status === "rejected" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"}`, children: p.admin_status }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5", children: [
                p.required_points,
                "✨"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5", children: [
                categoryEmoji(p.category),
                " ",
                categoryLabel(p.category)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5", children: [
                "Stock: ",
                p.stock_quantity
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 text-muted-foreground shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
          p.admin_status !== "approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setApproval(p.id, "approved"), className: "rounded-lg text-xs h-7 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 mr-1" }),
            "Approve"
          ] }),
          p.admin_status !== "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setApproval(p.id, "rejected"), className: "rounded-lg text-xs h-7 border-red-500/40 text-red-600 hover:bg-red-500/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 mr-1" }),
            "Reject"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => openAssign(p), className: "rounded-lg text-xs h-7", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "h-3 w-3 mr-1" }),
            "Schools"
          ] })
        ] })
      ] }) }, p.id)),
      productsCount > PAGE_SIZE && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "rounded-xl h-8", disabled: productsPage === 0 || productsLoading, onClick: () => setProductsPage((p) => Math.max(0, p - 1)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          productsPage * PAGE_SIZE + 1,
          "–",
          Math.min((productsPage + 1) * PAGE_SIZE, productsCount),
          " of ",
          productsCount
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "rounded-xl h-8", disabled: (productsPage + 1) * PAGE_SIZE >= productsCount || productsLoading, onClick: () => setProductsPage((p) => p + 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: creating, onOpenChange: setCreating, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create vendor" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: createVendor, className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Shop name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.shop_name || "", onChange: (e) => setForm({
            ...form,
            shop_name: e.target.value
          }), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Owner name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.owner_name || "", onChange: (e) => setForm({
            ...form,
            owner_name: e.target.value
          }), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: form.email || "", onChange: (e) => setForm({
            ...form,
            email: e.target.value
          }), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: form.password || "", onChange: (e) => setForm({
            ...form,
            password: e.target.value
          }), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.phone || "", onChange: (e) => setForm({
              ...form,
              phone: e.target.value
            }), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "City" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.city || "", onChange: (e) => setForm({
              ...form,
              city: e.target.value
            }), className: "rounded-xl" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.address || "", onChange: (e) => setForm({
            ...form,
            address: e.target.value
          }), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full rounded-xl", children: "Create" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!assigning, onOpenChange: (o) => !o && setAssigning(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[80vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Assign to schools" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        schools.map((s) => {
          const on = assignedSchools.has(s.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
            const next = new Set(assignedSchools);
            if (on) next.delete(s.id);
            else next.add(s.id);
            setAssignedSchools(next);
          }, className: "flex w-full items-center gap-2 p-2 rounded-xl hover:bg-muted text-left", children: [
            on ? /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: s.name })
          ] }, s.id);
        }),
        schools.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No schools" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveAssign, className: "w-full rounded-xl", children: "Save" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!detail, onOpenChange: (o) => !o && setDetail(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: detail?.product_name }) }),
      detail && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-6xl", children: [
          detail.image_urls?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: detail.image_urls[detailImgIdx], alt: "", className: "h-full w-full object-contain" }) : categoryEmoji(detail.category),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-2 right-2 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-sm font-black text-primary shadow", children: [
            detail.required_points,
            "✨"
          ] })
        ] }),
        (detail.image_urls?.length || 0) > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto", children: detail.image_urls.map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDetailImgIdx(i), className: `h-14 w-14 shrink-0 rounded-lg overflow-hidden border-2 ${i === detailImgIdx ? "border-primary" : "border-transparent"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: u, alt: "", className: "h-full w-full object-cover" }) }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Vendor", value: detail.vendors?.shop_name || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Category", value: `${categoryEmoji(detail.category)} ${categoryLabel(detail.category)}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Points", value: `${detail.required_points}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Cash price", value: detail.cash_price ? `Rs ${detail.cash_price}` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Stock", value: `${detail.stock_quantity}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Status", value: detail.admin_status })
        ] }),
        detail.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-muted/50 p-3 text-sm text-foreground/90 whitespace-pre-wrap", children: detail.description }),
        detail.admin_status !== "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Rejection reason (optional, shown in log)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: rejectReason, onChange: (e) => setRejectReason(e.target.value), placeholder: "Why is this being rejected?", className: "rounded-xl min-h-[60px]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
          detail.admin_status !== "approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setApproval(detail.id, "approved"), className: "flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-1" }),
            "Approve"
          ] }),
          detail.admin_status !== "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setApproval(detail.id, "rejected"), variant: "outline", className: "flex-1 rounded-xl border-red-500/40 text-red-600 hover:bg-red-500/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 mr-1" }),
            "Reject"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
            setDetail(null);
            openAssign(detail);
          }, variant: "outline", className: "rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "h-4 w-4 mr-1" }),
            "Schools"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
function StatTile({
  icon,
  label,
  value,
  tone,
  onClick
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-500/10 text-amber-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    red: "bg-red-500/10 text-red-600"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick, disabled: !onClick, className: `rounded-2xl border bg-card p-3 text-left transition-all ${onClick ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-8 w-8 rounded-xl flex items-center justify-center ${tones[tone]}`, children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xl font-black text-foreground leading-none", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-1", children: label })
  ] });
}
function InfoRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground font-bold", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground truncate", children: value })
  ] });
}
export {
  SuperAdminVendors as component
};
