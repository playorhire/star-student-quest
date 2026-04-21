import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { getPasswordValidation } from "@/lib/password-validation";
import { PasswordRequirements } from "@/components/password-requirements";
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
  const passwordValidation = getPasswordValidation(password);

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

  async function handleSave() {
    setErr(""); setMsg("");
    if (password && password !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    if (password && !passwordValidation.isValid) {
      setErr("Password does not meet the required criteria");
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
      if (res.error) {
        throw new Error(await getFunctionErrorMessage(res.error, "Failed to update account"));
      }
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
                <PasswordRequirements password={password} />
                {password && !passwordValidation.isValid && (
                  <p className="mt-2 text-xs text-destructive">
                    Password does not meet the required criteria.
                  </p>
                )}
              </div>
              <div>
                <Label className="text-xs">Confirm Password</Label>
                <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="rounded-xl" />
              </div>
            </div>
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          {msg && <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="h-4 w-4" /> {msg}</p>}
          <Button onClick={handleSave} className="rounded-xl w-full" disabled={saving || (Boolean(password) && !passwordValidation.isValid)}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
