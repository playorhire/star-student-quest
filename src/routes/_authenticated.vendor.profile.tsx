import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/vendor/profile")({
  component: VendorProfile,
});

function VendorProfile() {
  const [v, setV] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    const { data } = await (supabase as any).from("vendors").select("*").limit(1).single();
    setV(data);
  }
  async function save() {
    if (!v) return;
    setSaving(true);
    const { error } = await (supabase as any).from("vendors").update({
      shop_name: v.shop_name,
      owner_name: v.owner_name,
      phone: v.phone,
      address: v.address,
      city: v.city,
    }).eq("id", v.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  }

  if (!v) return <div className="text-center py-6 text-sm text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Your shop details</p>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div><Label className="text-xs">Shop name</Label><Input value={v.shop_name || ""} onChange={(e) => setV({ ...v, shop_name: e.target.value })} className="rounded-xl" /></div>
          <div><Label className="text-xs">Owner name</Label><Input value={v.owner_name || ""} onChange={(e) => setV({ ...v, owner_name: e.target.value })} className="rounded-xl" /></div>
          <div><Label className="text-xs">Email</Label><Input value={v.email || ""} disabled className="rounded-xl" /></div>
          <div><Label className="text-xs">Phone</Label><Input value={v.phone || ""} onChange={(e) => setV({ ...v, phone: e.target.value })} className="rounded-xl" /></div>
          <div><Label className="text-xs">Address</Label><Input value={v.address || ""} onChange={(e) => setV({ ...v, address: e.target.value })} className="rounded-xl" /></div>
          <div><Label className="text-xs">City</Label><Input value={v.city || ""} onChange={(e) => setV({ ...v, city: e.target.value })} className="rounded-xl" /></div>
          <Button onClick={save} disabled={saving} className="w-full rounded-xl">{saving ? "Saving..." : "Save"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}