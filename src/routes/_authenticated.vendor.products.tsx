import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ImagePlus, X, Package, Eye, EyeOff, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PRODUCT_CATEGORIES, categoryEmoji, type ProductCategory } from "@/lib/vendor-categories";

export const Route = createFileRoute("/_authenticated/vendor/products")({
  component: VendorProducts,
});

type Product = {
  id: string;
  product_name: string;
  description: string | null;
  category: ProductCategory;
  image_urls: string[];
  cash_price: number | null;
  required_points: number;
  stock_quantity: number;
  is_active: boolean;
  admin_status: "pending" | "approved" | "rejected";
};

function VendorProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await (supabase as any).from("vendor_products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  async function uploadImages(files: FileList): Promise<string[]> {
    if (!user) return [];
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("vendor-assets").upload(path, file);
      if (error) { toast.error(error.message); continue; }
      const { data: signed } = await supabase.storage.from("vendor-assets").createSignedUrl(path, 60 * 60 * 24 * 365);
      if (signed?.signedUrl) urls.push(signed.signedUrl);
    }
    return urls;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length || !editing) return;
    const urls = await uploadImages(e.target.files);
    setEditing({ ...editing, image_urls: [ ...(editing.image_urls || []), ...urls ] });
  }

  function removeImage(idx: number) {
    if (!editing) return;
    const urls = [ ...(editing.image_urls || []) ];
    urls.splice(idx, 1);
    setEditing({ ...editing, image_urls: urls });
  }

  async function save() {
    if (!editing?.product_name || !editing.required_points) {
      toast.error("Name and required points are needed");
      return;
    }
    setSaving(true);
    const { data: vendorId } = await (supabase as any).rpc("get_my_vendor_id");
    const payload = {
      vendor_id: vendorId,
      product_name: editing.product_name,
      description: editing.description || null,
      category: editing.category || "Others",
      image_urls: editing.image_urls || [],
      cash_price: editing.cash_price ?? null,
      required_points: editing.required_points,
      stock_quantity: editing.stock_quantity ?? 0,
      is_active: editing.is_active ?? true,
    };
    const { error } = editing.id
      ? await (supabase as any).from("vendor_products").update(payload).eq("id", editing.id)
      : await (supabase as any).from("vendor_products").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Product updated" : "Product added (pending approval)");
    setEditing(null);
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this product?")) return;
    const { error } = await (supabase as any).from("vendor_products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); load(); }
  }

  async function toggle(p: Product) {
    const { error } = await (supabase as any).from("vendor_products").update({ is_active: !p.is_active }).eq("id", p.id);
    if (error) toast.error(error.message); else load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">My Products</h1>
          <p className="text-sm text-muted-foreground">Manage your shop catalog</p>
        </div>
        <Button onClick={() => setEditing({ category: "Others", is_active: true, stock_quantity: 0, required_points: 100, image_urls: [] })} className="rounded-xl">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {([
          { key: "all", label: "All", icon: Package, count: products.length, color: "text-foreground" },
          { key: "pending", label: "Pending", icon: Clock, count: products.filter(p => p.admin_status === "pending").length, color: "text-amber-600" },
          { key: "approved", label: "Live", icon: CheckCircle2, count: products.filter(p => p.admin_status === "approved").length, color: "text-emerald-600" },
          { key: "rejected", label: "Rejected", icon: XCircle, count: products.filter(p => p.admin_status === "rejected").length, color: "text-red-600" },
        ] as const).map((t) => {
          const Icon = t.icon;
          const active = filter === t.key;
          return (
            <button key={t.key} onClick={() => setFilter(t.key)} className={`rounded-2xl border p-2 text-center transition-all ${active ? "bg-primary text-primary-foreground border-primary shadow" : "bg-card hover:bg-muted"}`}>
              <Icon className={`h-4 w-4 mx-auto ${active ? "" : t.color}`} />
              <div className={`text-lg font-black leading-none mt-1 ${active ? "" : t.color}`}>{t.count}</div>
              <div className={`text-[10px] mt-0.5 ${active ? "opacity-90" : "text-muted-foreground"}`}>{t.label}</div>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-6 text-sm text-muted-foreground">Loading...</div>
      ) : products.filter(p => filter === "all" || p.admin_status === filter).length === 0 ? (
        <Card className="border-dashed border-2"><CardContent className="p-8 text-center">
          <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{filter === "all" ? "No products yet. Add your first product to get started." : `No ${filter} products.`}</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {products.filter(p => filter === "all" || p.admin_status === filter).map((p) => (
            <Card key={p.id} className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="flex gap-3 p-3">
                <div className="relative h-20 w-20 flex-shrink-0 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden flex items-center justify-center text-3xl">
                  {p.image_urls?.[0] ? <img src={p.image_urls[0]} alt={p.product_name} className="h-full w-full object-cover" loading="lazy" /> : categoryEmoji(p.category)}
                  <span className="absolute bottom-1 left-1 rounded-full bg-background/90 backdrop-blur px-1.5 py-0.5 text-[9px] font-bold text-primary">
                    {p.required_points}✨
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-foreground line-clamp-1">{p.product_name}</div>
                  <div className="text-xs text-muted-foreground">{p.stock_quantity} in stock{p.cash_price ? ` · Rs ${p.cash_price}` : ""}</div>
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 ${p.admin_status === "approved" ? "bg-emerald-500/10 text-emerald-600" : p.admin_status === "rejected" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"}`}>
                      {p.admin_status === "approved" ? <CheckCircle2 className="h-2.5 w-2.5" /> : p.admin_status === "rejected" ? <XCircle className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                      {p.admin_status}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{p.is_active ? "active" : "hidden"}</span>
                    <span className="rounded-full bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5">{categoryEmoji(p.category)} {p.category}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing(p)} title="Edit"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggle(p)} title={p.is_active ? "Hide" : "Show"}>{p.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => del(p.id)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit product" : "Add product"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Product name</Label>
                <Input value={editing.product_name || ""} onChange={(e) => setEditing({ ...editing, product_name: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <Label className="text-xs">Category</Label>
                <select value={editing.category || "Others"} onChange={(e) => setEditing({ ...editing, category: e.target.value as ProductCategory })} className="w-full rounded-xl border bg-background p-2 text-sm">
                  {PRODUCT_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">Points</Label>
                  <Input type="number" min={0} value={editing.required_points ?? ""} onChange={(e) => setEditing({ ...editing, required_points: parseInt(e.target.value || "0", 10) })} className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs">Cash price</Label>
                  <Input type="number" min={0} step="0.01" value={editing.cash_price ?? ""} onChange={(e) => setEditing({ ...editing, cash_price: e.target.value ? parseFloat(e.target.value) : null })} className="rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs">Stock</Label>
                  <Input type="number" min={0} value={editing.stock_quantity ?? 0} onChange={(e) => setEditing({ ...editing, stock_quantity: parseInt(e.target.value || "0", 10) })} className="rounded-xl" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Images</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(editing.image_urls || []).map((u, i) => (
                    <div key={i} className="relative h-16 w-16 rounded-xl overflow-hidden border">
                      <img src={u} alt="" className="h-full w-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-black/60 text-white rounded-bl-xl p-0.5"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                  <label className="h-16 w-16 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer text-muted-foreground hover:bg-muted">
                    <ImagePlus className="h-5 w-5" />
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
              <Button onClick={save} disabled={saving} className="w-full rounded-xl">{saving ? "Saving..." : editing.id ? "Save" : "Add product"}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}