import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CheckCircle, Bell, KeyRound, Mail } from "lucide-react";

export const Route = createFileRoute("/_authenticated/parent/profile")({
  component: ParentProfile,
});

function ParentProfile() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [exists, setExists] = useState(false);

  async function getFunctionErrorMessage(error: any, fallback: string) {
    if (!error) return fallback;
    const context = (error as { context?: { json?: () => Promise<any>; text?: () => Promise<string> } }).context;
    if (context?.json) {
      try {
        const body = await context.json();
        if (body?.error) return String(body.error);
      } catch {
        // ignore parsing failures
      }
    }
    if (context?.text) {
      try {
        const text = await context.text();
        if (text) return text;
      } catch {
        // ignore parsing failures
      }
    }
    return error.message || fallback;
  }

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
    setErr(""); setMsg("");
    if (!name.trim() || !email.trim()) { setErr("Name and email are required"); return; }
    if (password && password !== confirm) { setErr("Passwords do not match"); return; }
    if (password && password.length < 6) { setErr("Password must be at least 6 characters"); return; }
    setSaving(true);
    try {
      // Upsert profile row
      if (exists) {
        const { error: pErr } = await supabase.from("parents").update({
          name: name.trim(), email: email.trim(), phone: phone.trim() || null,
        }).eq("user_id", user!.id);
        if (pErr) throw pErr;
      } else {
        const { error: pErr } = await supabase.from("parents").insert({
          user_id: user!.id, name: name.trim(), email: email.trim(), phone: phone.trim() || null,
        });
        if (pErr) throw pErr;
        setExists(true);
      }

      // Update auth email/password if changed
      const body: any = { selfUpdate: true };
      if (email.trim() && email.trim() !== user?.email) body.email = email.trim();
      if (password) body.password = password;
      if (body.email || body.password) {
        const res = await supabase.functions.invoke("admin-update-user", { body });
        if (res.error) {
          throw new Error(await getFunctionErrorMessage(res.error, "Failed to update account"));
        }
        if (res.data?.error) throw new Error(res.data.error);
      }

      setMsg("Profile updated successfully");
      setPassword(""); setConfirm("");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="text-2xl animate-bounce">👤</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground">Update your contact info and password</p>
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
            <Label className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" /> Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="rounded-xl" />
            <p className="text-[10px] text-muted-foreground mt-1">Used to receive points-earned notifications</p>
          </div>
          <div>
            <Label className="text-xs">Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 0100" className="rounded-xl" />
          </div>
          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <KeyRound className="h-3 w-3" /> Change Password (leave blank to keep current)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">New Password</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl" />
              </div>
              <div>
                <Label className="text-xs">Confirm Password</Label>
                <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="rounded-xl" />
              </div>
            </div>
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          {msg && <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="h-4 w-4" /> {msg}</p>}
          <Button onClick={handleSave} className="rounded-xl w-full" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
