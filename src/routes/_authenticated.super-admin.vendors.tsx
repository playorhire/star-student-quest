import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Store, Power, KeyRound, CheckSquare, Square, Search, ChevronLeft, ChevronRight, Package, Clock, CheckCircle2, XCircle, Eye, School } from "lucide-react";
import { categoryEmoji, categoryLabel } from "@/lib/vendor-categories";
import { Textarea } from "@/components/ui/textarea";
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
  const [detail, setDetail] = useState<any>(null);
  const [detailImgIdx, setDetailImgIdx] = useState(0);
  const [rejectReason, setRejectReason] = useState("");
  const [stats, setStats] = useState({ pendingProducts: 0, approvedProducts: 0, rejectedProducts: 0, activeVendors: 0 });
  const [vendorPendingCounts, setVendorPendingCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (user) { loadSidebars(); loadStats(); }
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

  async function loadStats() {
    const [pending, approved, rejected, activeV, pendingByVendor] = await Promise.all([
      (supabase as any).from("vendor_products").select("id", { count: "exact", head: true }).eq("admin_status", "pending"),
      (supabase as any).from("vendor_products").select("id", { count: "exact", head: true }).eq("admin_status", "approved"),
      (supabase as any).from("vendor_products").select("id", { count: "exact", head: true }).eq("admin_status", "rejected"),
      (supabase as any).from("vendors").select("id", { count: "exact", head: true }).eq("status", "active"),
      (supabase as any).from("vendor_products").select("vendor_id").eq("admin_status", "pending"),
    ]);
    setStats({
      pendingProducts: pending.count || 0,
      approvedProducts: approved.count || 0,
      rejectedProducts: rejected.count || 0,
      activeVendors: activeV.count || 0,
    });
    const counts: Record<string, number> = {};
    (pendingByVendor.data || []).forEach((r: any) => { counts[r.vendor_id] = (counts[r.vendor_id] || 0) + 1; });
    setVendorPendingCounts(counts);
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
    if (error) toast.error(error.message); else {
      toast.success(`Product ${admin_status}`);
      loadProducts();
      loadStats();
      setDetail(null);
      setRejectReason("");
    }
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

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatTile icon={<Store className="h-4 w-4" />} label="Active vendors" value={stats.activeVendors} tone="primary" />
        <StatTile icon={<Clock className="h-4 w-4" />} label="Pending" value={stats.pendingProducts} tone="amber" onClick={() => { setTab("products"); setProductsStatus("pending"); setProductsPage(0); }} />
        <StatTile icon={<CheckCircle2 className="h-4 w-4" />} label="Approved" value={stats.approvedProducts} tone="emerald" onClick={() => { setTab("products"); setProductsStatus("approved"); setProductsPage(0); }} />
        <StatTile icon={<XCircle className="h-4 w-4" />} label="Rejected" value={stats.rejectedProducts} tone="red" onClick={() => { setTab("products"); setProductsStatus("rejected"); setProductsPage(0); }} />
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant={tab === "vendors" ? "default" : "outline"} onClick={() => setTab("vendors")} className="rounded-xl">Vendors</Button>
        <Button size="sm" variant={tab === "products" ? "default" : "outline"} onClick={() => setTab("products")} className="rounded-xl">
          Products
          {stats.pendingProducts > 0 && (
            <span className="ml-2 rounded-full bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center">{stats.pendingProducts}</span>
          )}
        </Button>
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
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{v.shop_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{v.email} · {v.city || "—"}</div>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.status === "active" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>{v.status}</span>
                    {vendorPendingCounts[v.id] > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                        {vendorPendingCounts[v.id]} pending
                      </span>
                    )}
                  </div>
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
              <Card key={p.id} className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-3 space-y-2">
                <button type="button" onClick={() => { setDetail(p); setDetailImgIdx(0); setRejectReason(""); }} className="w-full flex items-start gap-3 text-left">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden flex items-center justify-center text-2xl shrink-0">
                    {p.image_urls?.[0] ? <img src={p.image_urls[0]} alt="" className="h-full w-full object-cover" /> : categoryEmoji(p.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{p.product_name}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.vendors?.shop_name || "—"}</div>
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.admin_status === "approved" ? "bg-emerald-500/10 text-emerald-600" : p.admin_status === "rejected" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"}`}>{p.admin_status}</span>
                      <span className="rounded-full bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5">{p.required_points}✨</span>
                      <span className="rounded-full bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5">{categoryEmoji(p.category)} {categoryLabel(p.category)}</span>
                      <span className="rounded-full bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5">Stock: {p.stock_quantity}</span>
                    </div>
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
                <div className="flex gap-2 flex-wrap">
                  {p.admin_status !== "approved" && (
                    <Button size="sm" variant="outline" onClick={() => setApproval(p.id, "approved")} className="rounded-lg text-xs h-7 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"><CheckCircle2 className="h-3 w-3 mr-1" />Approve</Button>
                  )}
                  {p.admin_status !== "rejected" && (
                    <Button size="sm" variant="outline" onClick={() => setApproval(p.id, "rejected")} className="rounded-lg text-xs h-7 border-red-500/40 text-red-600 hover:bg-red-500/10"><XCircle className="h-3 w-3 mr-1" />Reject</Button>
                  )}
                  <Button size="sm" onClick={() => openAssign(p)} className="rounded-lg text-xs h-7"><School className="h-3 w-3 mr-1" />Schools</Button>
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

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{detail?.product_name}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-6xl">
                {detail.image_urls?.length ? (
                  <img src={detail.image_urls[detailImgIdx]} alt="" className="h-full w-full object-contain" />
                ) : (
                  categoryEmoji(detail.category)
                )}
                <span className="absolute top-2 right-2 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-sm font-black text-primary shadow">
                  {detail.required_points}✨
                </span>
              </div>
              {(detail.image_urls?.length || 0) > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {detail.image_urls.map((u: string, i: number) => (
                    <button key={i} onClick={() => setDetailImgIdx(i)} className={`h-14 w-14 shrink-0 rounded-lg overflow-hidden border-2 ${i === detailImgIdx ? "border-primary" : "border-transparent"}`}>
                      <img src={u} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <InfoRow label="Vendor" value={detail.vendors?.shop_name || "—"} />
                <InfoRow label="Category" value={`${categoryEmoji(detail.category)} ${categoryLabel(detail.category)}`} />
                <InfoRow label="Points" value={`${detail.required_points}`} />
                <InfoRow label="Cash price" value={detail.cash_price ? `Rs ${detail.cash_price}` : "—"} />
                <InfoRow label="Stock" value={`${detail.stock_quantity}`} />
                <InfoRow label="Status" value={detail.admin_status} />
              </div>
              {detail.description && (
                <div className="rounded-xl bg-muted/50 p-3 text-sm text-foreground/90 whitespace-pre-wrap">
                  {detail.description}
                </div>
              )}
              {detail.admin_status !== "rejected" && (
                <div>
                  <Label className="text-xs">Rejection reason (optional, shown in log)</Label>
                  <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Why is this being rejected?" className="rounded-xl min-h-[60px]" />
                </div>
              )}
              <div className="flex gap-2 pt-2">
                {detail.admin_status !== "approved" && (
                  <Button onClick={() => setApproval(detail.id, "approved")} className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700"><CheckCircle2 className="h-4 w-4 mr-1" />Approve</Button>
                )}
                {detail.admin_status !== "rejected" && (
                  <Button onClick={() => setApproval(detail.id, "rejected")} variant="outline" className="flex-1 rounded-xl border-red-500/40 text-red-600 hover:bg-red-500/10"><XCircle className="h-4 w-4 mr-1" />Reject</Button>
                )}
                <Button onClick={() => { setDetail(null); openAssign(detail); }} variant="outline" className="rounded-xl"><School className="h-4 w-4 mr-1" />Schools</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatTile({ icon, label, value, tone, onClick }: { icon: React.ReactNode; label: string; value: number; tone: "primary" | "amber" | "emerald" | "red"; onClick?: () => void }) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-500/10 text-amber-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    red: "bg-red-500/10 text-red-600",
  };
  return (
    <button type="button" onClick={onClick} disabled={!onClick} className={`rounded-2xl border bg-card p-3 text-left transition-all ${onClick ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : ""}`}>
      <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${tones[tone]}`}>{icon}</div>
      <div className="mt-2 text-xl font-black text-foreground leading-none">{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{label}</div>
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-bold">{label}</div>
      <div className="text-sm font-semibold text-foreground truncate">{value}</div>
    </div>
  );
}