import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CheckCircle, KeyRound, Mail, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/profile")({
  component: AdminProfile,
});

function AdminProfile() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function handleSave() {
    setErr(""); setMsg("");
    if (password && password !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    if (password && password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }
    if (!email.trim() && !password) {
      setErr("Nothing to update");
      return;
    }
    setSaving(true);
    try {
      const body: any = { selfUpdate: true };
      if (email.trim() && email.trim() !== user?.email) body.email = email.trim();
      if (password) body.password = password;
      const res = await supabase.functions.invoke("admin-update-user", { body });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);
      setMsg("Profile updated successfully");
      setPassword(""); setConfirm("");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground">Update your email and password</p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" /> Admin Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" /> Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl" />
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
