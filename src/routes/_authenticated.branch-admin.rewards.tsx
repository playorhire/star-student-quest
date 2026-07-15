import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Gift, Plus, Trash2, Pencil, Loader2, X, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { categoryEmoji } from "../lib/vendor-categories";

export const Route = createFileRoute("/_authenticated/branch-admin/rewards")({
  component: BranchAdminRewards,
});

function BranchAdminRewards() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", emoji: "🎁", point_cost: 0, stock: 0, category: "Items" });
  const [submitting, setSubmitting] = useState(false);
  const [vendorProducts, setVendorProducts] = useState<any[]>([]);

  useEffect(() => {
    if (user?.branchId) {
      loadRewards();
      loadVendorProducts();
    }
  }, [user]);

  async function loadRewards() {
    setLoading(true);
    setError(null);
    const { data, error: err } = await (supabase as any)
      .from("rewards")
      .select("id, name, emoji, point_cost, stock, description, category")
      .eq("branch_id", user!.branchId)
      .order("point_cost");
    if (err) {
      setError(`${err.message} (${err.code})`);
      toast.error(err.message);
    } else {
      setRewards(data || []);
    }
    setLoading(false);
  }

  async function loadVendorProducts() {
    if (!user?.schoolId) {
      setVendorProducts([]);
      return;
    }

    const { data: schoolLinks, error: schoolLinksError } = await (supabase as any)
      .from("vendor_product_schools")
      .select("product_id")
      .eq("school_id", user.schoolId)
      .eq("approved", true);

    if (schoolLinksError) {
      console.error(schoolLinksError);
      setVendorProducts([]);
      return;
    }

    const productIds = (schoolLinks || []).map((entry: any) => entry.product_id).filter(Boolean);
    if (!productIds.length) {
      setVendorProducts([]);
      return;
    }

    const { data, error } = await (supabase as any)
      .from("vendor_products")
      .select("*, vendors(shop_name)")
      .in("id", productIds)
      .eq("is_active", true)
      .eq("admin_status", "approved")
      .gt("stock_quantity", 0)
      .order("required_points");

    if (error) {
      console.error(error);
      setVendorProducts([]);
    } else {
      setVendorProducts(data || []);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", description: "", emoji: "🎁", point_cost: 0, stock: 0, category: "Items" });
    setShowForm(true);
  }

  function openEdit(r: any) {
    setEditing(r);
    setForm({
      name: r.name || "",
      description: r.description || "",
      emoji: r.emoji || "🎁",
      point_cost: r.point_cost || 0,
      stock: r.stock ?? 0,
      category: r.category || "Items",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      emoji: form.emoji,
      point_cost: Number(form.point_cost),
      stock: Number(form.stock),
      category: form.category,
      school_id: user!.schoolId,
      branch_id: user!.branchId,
    };

    if (editing) {
      const { error: err } = await (supabase as any).from("rewards").update(payload).eq("id", editing.id);
      if (err) toast.error(err.message);
      else toast.success("Reward updated");
    } else {
      const { error: err } = await (supabase as any).from("rewards").insert(payload);
      if (err) toast.error(err.message);
      else toast.success("Reward created");
    }

    setShowForm(false);
    setEditing(null);
    setSubmitting(false);
    loadRewards();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this reward?")) return;
    const { error: err } = await (supabase as any).from("rewards").delete().eq("id", id);
    if (err) toast.error(err.message);
    else { toast.success("Reward deleted"); loadRewards(); }
  }

  const allowedRoles = ["branch_admin", "school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Branch Rewards</h1>
          <p className="text-sm text-muted-foreground">Rewards catalog for your branch</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add Reward</Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div>
        <h2 className="text-lg font-black">Vendor Products for Your School</h2>
        <p className="text-sm text-muted-foreground">Approved marketplace items available to students in this branch</p>
      </div>

      <div className="grid gap-2">
        {vendorProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-3">No vendor products are available for this school yet.</p>
        ) : (
          vendorProducts.map((product) => (
            <Card key={product.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden flex items-center justify-center text-2xl shrink-0">
                  {product.image_urls?.[0] ? <img src={product.image_urls[0]} alt={product.product_name} className="h-full w-full object-cover" loading="lazy" /> : categoryEmoji(product.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{product.product_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{product.vendors?.shop_name} · {product.stock_quantity} left</div>
                  <div className="text-xs font-bold text-primary mt-0.5">{product.required_points} pts</div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span className="text-xs font-semibold">Available</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {showForm && (
        <Card><CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{editing ? "Edit Reward" : "New Reward"}</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
              <Input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} className="w-16 text-center text-lg px-0" maxLength={4} />
              <Input placeholder="Reward Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <Input placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <div className="grid grid-cols-3 gap-3">
              <Input type="number" placeholder="Point Cost" required min={1} value={form.point_cost} onChange={e => setForm(f => ({ ...f, point_cost: Number(e.target.value) }))} />
              <Input type="number" placeholder="Stock" required min={0} value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} />
              <Input placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting} className="flex-1">{submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}{editing ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </CardContent></Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : rewards.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No rewards found. Click Add Reward to create one.</div>
      ) : (
        <div className="grid gap-3">
          {rewards.map(r => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-2xl">{r.emoji || "🎁"}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{r.name}</div>
                  {r.description && <div className="text-xs text-muted-foreground truncate">{r.description}</div>}
                  <div className="text-[10px] text-muted-foreground">{r.category} • {r.stock ?? 0} in stock</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-primary">{r.point_cost} pts</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
