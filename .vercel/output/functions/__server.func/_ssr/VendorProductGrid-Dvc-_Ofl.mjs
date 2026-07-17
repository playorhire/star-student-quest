import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as Input, C as Card, a as CardContent } from "./router-DuskeiVN.mjs";
import { P as PRODUCT_CATEGORIES, c as categoryEmoji, a as categoryLabel } from "./vendor-categories-DFpjRGfO.mjs";
import { W as Search, e as Sparkles, P as Package } from "../_libs/lucide-react.mjs";
function VendorProductGrid({
  products,
  loading,
  emptyMessage = "No marketplace products available yet.",
  onSelect,
  renderAction,
  studentPoints,
  compact
}) {
  const [search, setSearch] = reactExports.useState("");
  const [cat, setCat] = reactExports.useState("all");
  const cats = reactExports.useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return PRODUCT_CATEGORIES.filter((c) => set.has(c.key));
  }, [products]);
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (!q) return true;
      return p.product_name.toLowerCase().includes(q) || (p.vendors?.shop_name || "").toLowerCase().includes(q);
    });
  }, [products, search, cat]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Search products or vendors…",
          className: "pl-9 rounded-xl h-10"
        }
      )
    ] }),
    cats.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setCat("all"),
          className: `shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-colors ${cat === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`,
          children: "✨ All"
        }
      ),
      cats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setCat(c.key),
          className: `shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-colors ${cat === c.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`,
          children: [
            c.emoji,
            " ",
            c.label
          ]
        },
        c.key
      ))
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-6 w-6 mx-auto mb-2 animate-pulse text-primary" }),
      "Loading marketplace…"
    ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-dashed border-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: search || cat !== "all" ? "No matching products" : emptyMessage })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`, children: filtered.map((p) => {
      const canAfford = typeof studentPoints !== "number" || studentPoints >= p.required_points;
      const outOfStock = p.stock_quantity <= 0;
      const clickable = !!onSelect;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          onClick: clickable ? () => onSelect(p) : void 0,
          className: `group relative overflow-hidden border-0 shadow-sm transition-all ${clickable ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : ""} ${!canAfford || outOfStock ? "opacity-60" : ""}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-3xl", children: [
              p.image_urls?.[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_urls[0], alt: p.product_name, className: "h-full w-full object-cover", loading: "lazy" }) : categoryEmoji(p.category),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute bottom-1 left-1 rounded-full bg-background/90 backdrop-blur px-1.5 py-0.5 text-[9px] font-bold text-primary shadow-sm", children: [
                p.required_points,
                "✨"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-card-foreground line-clamp-1", children: p.product_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: p.vendors?.shop_name || "Vendor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5", children: [
                  categoryEmoji(p.category),
                  " ",
                  categoryLabel(p.category)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full text-[10px] font-bold px-2 py-0.5 ${outOfStock ? "bg-red-500/10 text-red-600" : p.stock_quantity < 5 ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"}`, children: outOfStock ? "Out of stock" : `${p.stock_quantity} left` }),
                p.cash_price ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5", children: [
                  "Rs ",
                  p.cash_price
                ] }) : null
              ] }),
              renderAction && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", onClick: (e) => e.stopPropagation(), children: renderAction(p) })
            ] })
          ] })
        },
        p.id
      );
    }) })
  ] });
}
export {
  VendorProductGrid as V
};
