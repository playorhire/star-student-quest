import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, Sparkles } from "lucide-react";
import { PRODUCT_CATEGORIES, categoryEmoji, categoryLabel } from "@/lib/vendor-categories";

export type MarketplaceProduct = {
  id: string;
  product_name: string;
  description?: string | null;
  category: string;
  image_urls?: string[] | null;
  cash_price?: number | null;
  required_points: number;
  stock_quantity: number;
  vendors?: { shop_name?: string | null } | null;
};

type Props = {
  products: MarketplaceProduct[];
  loading?: boolean;
  emptyMessage?: string;
  onSelect?: (p: MarketplaceProduct) => void;
  renderAction?: (p: MarketplaceProduct) => React.ReactNode;
  studentPoints?: number;
  compact?: boolean;
};

export function VendorProductGrid({
  products,
  loading,
  emptyMessage = "No marketplace products available yet.",
  onSelect,
  renderAction,
  studentPoints,
  compact,
}: Props) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>("all");

  const cats = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return PRODUCT_CATEGORIES.filter((c) => set.has(c.key));
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (!q) return true;
      return (
        p.product_name.toLowerCase().includes(q) ||
        (p.vendors?.shop_name || "").toLowerCase().includes(q)
      );
    });
  }, [products, search, cat]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products or vendors…"
          className="pl-9 rounded-xl h-10"
        />
      </div>

      {cats.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
          <button
            onClick={() => setCat("all")}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-colors ${cat === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
          >
            ✨ All
          </button>
          {cats.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-colors ${cat === c.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          <Sparkles className="h-6 w-6 mx-auto mb-2 animate-pulse text-primary" />
          Loading marketplace…
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-8 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {search || cat !== "all" ? "No matching products" : emptyMessage}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
          {filtered.map((p) => {
            const canAfford = typeof studentPoints !== "number" || studentPoints >= p.required_points;
            const outOfStock = p.stock_quantity <= 0;
            const clickable = !!onSelect;
            return (
              <Card
                key={p.id}
                onClick={clickable ? () => onSelect!(p) : undefined}
                className={`group relative overflow-hidden border-0 shadow-sm transition-all ${clickable ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : ""} ${!canAfford || outOfStock ? "opacity-60" : ""}`}
              >
                <div className="flex gap-3 p-3">
                  <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-3xl">
                    {p.image_urls?.[0] ? (
                      <img src={p.image_urls[0]} alt={p.product_name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      categoryEmoji(p.category)
                    )}
                    <span className="absolute bottom-1 left-1 rounded-full bg-background/90 backdrop-blur px-1.5 py-0.5 text-[9px] font-bold text-primary shadow-sm">
                      {p.required_points}✨
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="font-bold text-sm text-card-foreground line-clamp-1">{p.product_name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {p.vendors?.shop_name || "Vendor"}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="rounded-full bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5">
                        {categoryEmoji(p.category)} {categoryLabel(p.category)}
                      </span>
                      <span className={`rounded-full text-[10px] font-bold px-2 py-0.5 ${outOfStock ? "bg-red-500/10 text-red-600" : p.stock_quantity < 5 ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                        {outOfStock ? "Out of stock" : `${p.stock_quantity} left`}
                      </span>
                      {p.cash_price ? (
                        <span className="rounded-full bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5">
                          Rs {p.cash_price}
                        </span>
                      ) : null}
                    </div>
                    {renderAction && (
                      <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                        {renderAction(p)}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}