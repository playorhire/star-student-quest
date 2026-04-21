import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PasswordRequirements } from "@/components/password-requirements";
import { useAuth } from "../lib/auth-context";
import { getPasswordValidation } from "@/lib/password-validation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CheckCircle, KeyRound, Mail, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/teacher/profile")({
  component: TeacherProfile,
});

function TeacherProfile() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(true);
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

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("teachers").select("*").eq("user_id", user!.id).maybeSingle();
    if (data) {
      setName(data.name);
      setEmail(data.email);
    } else {
      setEmail(user!.email || "");
    }
    setLoading(false);
  }

  async function handleSave() {
    setErr(""); setMsg("");
    if (!name.trim() || !email.trim()) { setErr("Name and email are required"); return; }
    if (password && password !== confirm) { setErr("Passwords do not match"); return; }
    if (password && !passwordValidation.isValid) { setErr("Password does not meet the required criteria"); return; }
    setSaving(true);
    try {
      // Update teacher profile name
      const { error: pErr } = await supabase.from("teachers")
        .update({ name: name.trim(), email: email.trim() })
        .eq("user_id", user!.id);
      if (pErr) throw pErr;

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
        <p className="text-sm text-muted-foreground">Update your name, email, and password</p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-primary" /> Teacher Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="rounded-xl" />
          </div>
          <div>
            <Label className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" /> Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl" />
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
