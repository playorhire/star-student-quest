import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Store, Power, KeyRound, CheckSquare, Square, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/super-admin/vendors")({
  component: SuperAdminVendors,
});

const PAGE_SIZE = 20;

function SuperAdminVendors() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"vendors" | "products">("vendors");
  const [vendors, setVendors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>({});
  const [assigning, setAssigning] = useState<any>(null);
  const [assignedSchools, setAssignedSchools] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [productsPage, setProductsPage] = useState(0);
  const [productsSearch, setProductsSearch] = useState("");
  const [productsSearchDebounced, setProductsSearchDebounced] = useState("");
  const [productsStatus, setProductsStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    if (user) loadSidebars();
  }, [user]);

  // Debounce the search input
  useEffect(() => {
    const t = setTimeout(() => {
      setProductsSearchDebounced(productsSearch.trim());
      setProductsPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [productsSearch]);

  // Reload paginated products server-side whenever filters/page change and tab is products
  useEffect(() => {
    if (!user) return;
    if (tab !== "products") return;
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, tab, productsPage, productsSearchDebounced, productsStatus]);

  async function loadSidebars() {
    setLoading(true);
    const [v, s] = await Promise.all([
      (supabase as any).from("vendors").select("*").order("created_at", { ascending: false }),
      (supabase as any).from("schools").select("id, name").order("name"),
    ]);
    if (v.error || s.error) {
      toast.error(v.error?.message || s.error?.message || "Failed to load vendor data");
    }
    setVendors(v.data || []);
    setSchools(s.data || []);
    setLoading(false);
  }

  async function loadProducts() {
    setProductsLoading(true);
    const from = productsPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let q = (supabase as any)
      .from("vendor_products")
      .select("*, vendors(shop_name)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    if (productsSearchDebounced) {
      q = q.ilike("product_name", `%${productsSearchDebounced}%`);
    }
    if (productsStatus !== "all") {
      q = q.eq("admin_status", productsStatus);
    }
    const { data, error, count } = await q;
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

  async function createVendor(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password || !form.shop_name) { toast.error("Email, password, shop name required"); return; }
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
          city: form.city,
        },
      },
    });
    if (res.error || res.data?.error) {
      toast.error(res.data?.error || res.error?.message || "Failed to create vendor");
      return;
    }
    toast.success("Vendor created");
    setCreating(false); setForm({}); loadSidebars();
  }

  async function toggleStatus(v: any) {
    const next = v.status === "active" ? "suspended" : "active";
    const { error } = await (supabase as any).from("vendors").update({ status: next }).eq("id", v.id);
    if (error) toast.error(error.message); else { toast.success(`Status: ${next}`); loadSidebars(); }
  }

  async function resetPassword(v: any) {
    const pw = prompt("New password (min 6 chars)");
    if (!pw || pw.length < 6) return;
    const { error } = await supabase.functions.invoke("admin-update-user", {
      body: { targetUserId: v.user_id, password: pw },
    });
    if (error) toast.error(error.message); else toast.success("Password reset");
  }

  async function setApproval(id: string, admin_status: "approved" | "rejected") {
    const { error } = await (supabase as any).from("vendor_products").update({ admin_status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success(admin_status); loadProducts(); }
  }

  async function openAssign(p: any) {
    setAssigning(p);
    const { data } = await (supabase as any).from("vendor_product_schools").select("school_id").eq("product_id", p.id);
    setAssignedSchools(new Set((data || []).map((r: any) => r.school_id)));
  }

  async function saveAssign() {
    if (!assigning) return;
    const { data: existing } = await (supabase as any).from("vendor_product_schools").select("id, school_id").eq("product_id", assigning.id);
    const existingSet = new Set((existing || []).map((r: any) => r.school_id));
    const toAdd = [...assignedSchools].filter((s) => !existingSet.has(s));
    const toRemove = (existing || []).filter((r: any) => !assignedSchools.has(r.school_id)).map((r: any) => r.id);
    if (toAdd.length > 0) {
      await (supabase as any).from("vendor_product_schools").insert(toAdd.map((sid) => ({ product_id: assigning.id, school_id: sid, approved: true })));
    }
    if (toRemove.length > 0) {
      await (supabase as any).from("vendor_product_schools").delete().in("id", toRemove);
    }
    toast.success("School assignments saved");
    setAssigning(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">Vendor Management</h1>
          <p className="text-sm text-muted-foreground">Vendors, products & school assignments</p>
        </div>
        {tab === "vendors" && (
          <Button onClick={() => setCreating(true)} className="rounded-xl"><Plus className="h-4 w-4 mr-1" /> New</Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant={tab === "vendors" ? "default" : "outline"} onClick={() => setTab("vendors")} className="rounded-xl">Vendors</Button>
        <Button size="sm" variant={tab === "products" ? "default" : "outline"} onClick={() => setTab("products")} className="rounded-xl">Products</Button>
      </div>

      {tab === "vendors" && (
        <div className="grid gap-2">
          {loading ? (
            <p className="text-sm text-center text-muted-foreground py-6">Loading vendors...</p>
          ) : vendors.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground py-6">No vendors yet</p>
          ) : vendors.map((v) => (
              <Card key={v.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <Store className="h-8 w-8 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{v.shop_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{v.email} · {v.city || "—"}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.status === "active" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>{v.status}</span>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggleStatus(v)} aria-label="Toggle"><Power className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => resetPassword(v)} aria-label="Reset password"><KeyRound className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          ))}
          {vendors.length === 0 && <p className="text-sm text-center text-muted-foreground py-6">No vendors yet</p>}
        </div>
      )}

      {tab === "products" && (
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={productsSearch}
                onChange={(e) => setProductsSearch(e.target.value)}
                placeholder="Search products…"
                className="pl-8 rounded-xl h-9"
              />
            </div>
            <select
              value={productsStatus}
              onChange={(e) => { setProductsStatus(e.target.value as any); setProductsPage(0); }}
              className="h-9 rounded-xl border bg-background px-2 text-sm"
              aria-label="Filter status"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          {productsLoading ? (
            <p className="text-sm text-center text-muted-foreground py-6">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground py-6">
              {productsSearchDebounced || productsStatus !== "all" ? "No matching products" : "No products yet"}
            </p>
          ) : products.map((p) => (
              <Card key={p.id} className="border-0 shadow-sm">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 rounded-xl bg-muted overflow-hidden flex items-center justify-center text-2xl shrink-0">
                    {p.image_urls?.[0] ? <img src={p.image_urls[0]} alt="" className="h-full w-full object-cover" /> : "📦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{p.product_name}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.vendors?.shop_name} · {p.required_points} pts</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.admin_status === "approved" ? "bg-emerald-500/10 text-emerald-600" : p.admin_status === "rejected" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"}`}>{p.admin_status}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => setApproval(p.id, "approved")} className="rounded-lg text-xs h-7">Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => setApproval(p.id, "rejected")} className="rounded-lg text-xs h-7">Reject</Button>
                  <Button size="sm" onClick={() => openAssign(p)} className="rounded-lg text-xs h-7">Assign Schools</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {productsCount > PAGE_SIZE && (
            <div className="flex items-center justify-between pt-2">
              <Button size="sm" variant="outline" className="rounded-xl h-8"
                disabled={productsPage === 0 || productsLoading}
                onClick={() => setProductsPage((p) => Math.max(0, p - 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {productsPage * PAGE_SIZE + 1}–{Math.min((productsPage + 1) * PAGE_SIZE, productsCount)} of {productsCount}
              </span>
              <Button size="sm" variant="outline" className="rounded-xl h-8"
                disabled={(productsPage + 1) * PAGE_SIZE >= productsCount || productsLoading}
                onClick={() => setProductsPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create vendor</DialogTitle></DialogHeader>
          <form onSubmit={createVendor} className="space-y-2">
            <div><Label className="text-xs">Shop name</Label><Input value={form.shop_name || ""} onChange={(e) => setForm({ ...form, shop_name: e.target.value })} className="rounded-xl" /></div>
            <div><Label className="text-xs">Owner name</Label><Input value={form.owner_name || ""} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} className="rounded-xl" /></div>
            <div><Label className="text-xs">Email</Label><Input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl" /></div>
            <div><Label className="text-xs">Password</Label><Input type="password" value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-xs">Phone</Label><Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl" /></div>
              <div><Label className="text-xs">City</Label><Input value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-xl" /></div>
            </div>
            <div><Label className="text-xs">Address</Label><Input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-xl" /></div>
            <Button type="submit" className="w-full rounded-xl">Create</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!assigning} onOpenChange={(o) => !o && setAssigning(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Assign to schools</DialogTitle></DialogHeader>
          <div className="space-y-1">
            {schools.map((s) => {
              const on = assignedSchools.has(s.id);
              return (
                <button key={s.id} type="button" onClick={() => {
                  const next = new Set(assignedSchools);
                  if (on) next.delete(s.id); else next.add(s.id);
                  setAssignedSchools(next);
                }} className="flex w-full items-center gap-2 p-2 rounded-xl hover:bg-muted text-left">
                  {on ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm">{s.name}</span>
                </button>
              );
            })}
            {schools.length === 0 && <p className="text-sm text-muted-foreground">No schools</p>}
          </div>
          <Button onClick={saveAssign} className="w-full rounded-xl">Save</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}