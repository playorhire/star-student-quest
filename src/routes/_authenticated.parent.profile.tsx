import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CheckCircle, Bell } from "lucide-react";

export const Route = createFileRoute("/_authenticated/parent/profile")({
  component: ParentProfile,
});

function ParentProfile() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [exists, setExists] = useState(false);

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("parents").select("*").eq("user_id", user!.id).maybeSingle();
    if (data) {
      setName(data.name); setEmail(data.email); setPhone(data.phone || "");
      setExists(true);
    } else {
      setEmail(user!.email || "");
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!name.trim() || !email.trim()) return;
    setSaving(true);
    setError("");
    try {
      if (exists) {
        const { error: err } = await supabase.from("parents").update({
          name: name.trim(), email: email.trim(), phone: phone.trim() || null,
        }).eq("user_id", user!.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("parents").insert({
          user_id: user!.id, name: name.trim(), email: email.trim(), phone: phone.trim() || null,
        });
        if (err) throw err;
        setExists(true);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="text-2xl animate-bounce">👤</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground">Contact info for points notifications</p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2"><Bell className="h-4 w-4" /> Notification Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="rounded-xl" />
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="rounded-xl" />
            <p className="text-[10px] text-muted-foreground mt-1">Used to receive points-earned notifications</p>
          </div>
          <div>
            <Label className="text-xs">Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 0100" className="rounded-xl" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleSave} className="rounded-xl w-full" disabled={!name.trim() || !email.trim() || saving}>
            {saved ? <><CheckCircle className="h-4 w-4 mr-1" /> Saved</> : saving ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
