import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Plus, Trash2, KeyRound, Pencil, Link2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/parents")({
  component: AdminParents,
});

interface ParentRow { id: string; user_id: string; name: string; email: string; phone: string | null; }
interface StudentOpt { id: string; name: string; roll_number: string; }
interface LinkRow { parent_user_id: string; student_id: string; students: { name: string; roll_number: string } | null; }

function AdminParents() {
  const [parents, setParents] = useState<ParentRow[]>([]);
  const [students, setStudents] = useState<StudentOpt[]>([]);
  const [links, setLinks] = useState<LinkRow[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [editParent, setEditParent] = useState<ParentRow | null>(null);
  const [eName, setEName] = useState("");
  const [eEmail, setEEmail] = useState("");
  const [ePhone, setEPhone] = useState("");
  const [eStudentId, setEStudentId] = useState("");
  const [ePassword, setEPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => { load(); }, []);

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

  async function load() {
    const [p, s, l] = await Promise.all([
      supabase.from("parents").select("*").order("name"),
      supabase.from("students").select("id, name, roll_number").order("name"),
      supabase.from("parent_student_links").select("parent_user_id, student_id, students(name, roll_number)"),
    ]);
    setParents(p.data || []);
    setStudents(s.data || []);
    setLinks((l.data as any) || []);
  }

  async function handleAdd() {
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await supabase.functions.invoke("create-user", {
        body: { email: email.trim(), password, role: "parent", meta: { name: name.trim(), phone: phone.trim() || null, studentId: studentId || null } },
      });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);
      setName(""); setEmail(""); setPhone(""); setPassword(""); setStudentId("");
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleRemove(p: ParentRow) {
    await supabase.from("parent_student_links").delete().eq("parent_user_id", p.user_id);
    await supabase.from("parents").delete().eq("id", p.id);
    load();
  }

  function openEdit(p: ParentRow) {
    setEditParent(p);
    setEName(p.name);
    setEEmail(p.email);
    setEPhone(p.phone || "");
    setEPassword("");
    const existing = links.find(l => l.parent_user_id === p.user_id);
    setEStudentId(existing?.student_id || "");
    setEditError("");
  }

  async function handleSaveEdit() {
    if (!editParent) return;
    if (ePassword && ePassword.length < 6) {
      setEditError("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      const { error } = await supabase.from("parents").update({
        name: eName.trim(), email: eEmail.trim(), phone: ePhone.trim() || null,
      }).eq("id", editParent.id);
      if (error) throw error;
      // update link: remove existing then insert new (simple approach)
      await supabase.from("parent_student_links").delete().eq("parent_user_id", editParent.user_id);
      if (eStudentId) {
        await supabase.from("parent_student_links").insert({ parent_user_id: editParent.user_id, student_id: eStudentId });
      }

      if (ePassword || eEmail.trim() !== editParent.email) {
        const body: any = { targetUserId: editParent.user_id };
        if (eEmail.trim() !== editParent.email) body.email = eEmail.trim();
        if (ePassword) body.password = ePassword;
        const res = await supabase.functions.invoke("admin-update-user", { body });
        if (res.error) {
          throw new Error(await getFunctionErrorMessage(res.error, "Failed to update login details"));
        }
        if (res.data?.error) throw new Error(res.data.error);
      }

      setEditParent(null);
      load();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Parents</h1>
        <p className="text-sm text-muted-foreground">Create parent accounts and link to students</p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Add Parent</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Name</Label><Input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="rounded-xl" /></div>
            <div><Label className="text-xs">Email</Label><Input placeholder="parent@example.com" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl" /></div>
            <div><Label className="text-xs">Phone</Label><Input placeholder="+1 555 0100" value={phone} onChange={e => setPhone(e.target.value)} className="rounded-xl" /></div>
            <div>
              <Label className="text-xs flex items-center gap-1"><KeyRound className="h-3 w-3" /> Password</Label>
              <Input type="password" placeholder="Min 6 chars" value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <div>
            <Label className="text-xs flex items-center gap-1"><Link2 className="h-3 w-3" /> Link to Child (optional)</Label>
            <select value={studentId} onChange={e => setStudentId(e.target.value)} className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm">
              <option value="">— None —</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} (#{s.roll_number})</option>)}
            </select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleAdd} className="rounded-xl" disabled={!name.trim() || !email.trim() || !password.trim() || creating}>
            <Plus className="h-4 w-4 mr-1" /> {creating ? "Creating..." : "Add Parent"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {parents.map(p => {
          const childLinks = links.filter(l => l.parent_user_id === p.user_id);
          return (
            <Card key={p.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-lg">👨‍👩‍👧</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-card-foreground truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.email}{p.phone ? ` • ${p.phone}` : ""}</div>
                  {childLinks.length > 0 && (
                    <div className="text-[10px] text-primary mt-0.5">
                      Linked: {childLinks.map(l => l.students?.name).filter(Boolean).join(", ")}
                    </div>
                  )}
                </div>
                {childLinks.length === 0 && <Badge variant="outline" className="text-[10px] border-muted text-muted-foreground">No Child</Badge>}
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)} className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleRemove(p)} className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          );
        })}
        {parents.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No parents yet</p>}
      </div>

      <Dialog open={!!editParent} onOpenChange={open => !open && setEditParent(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Parent</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Name</Label><Input value={eName} onChange={e => setEName(e.target.value)} className="rounded-xl" /></div>
            <div><Label className="text-xs">Email</Label><Input value={eEmail} onChange={e => setEEmail(e.target.value)} className="rounded-xl" /></div>
            <div><Label className="text-xs">Phone</Label><Input value={ePhone} onChange={e => setEPhone(e.target.value)} className="rounded-xl" /></div>
            <div>
              <Label className="text-xs">Linked Child</Label>
              <select value={eStudentId} onChange={e => setEStudentId(e.target.value)} className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm">
                <option value="">— None —</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} (#{s.roll_number})</option>)}
              </select>
            </div>
            <div className="border-t border-border pt-3">
              <Label className="text-xs flex items-center gap-1"><KeyRound className="h-3 w-3" /> New Password (leave blank to keep current)</Label>
              <Input type="password" value={ePassword} onChange={e => setEPassword(e.target.value)} className="rounded-xl" placeholder="Min 6 characters" />
            </div>
            {editError && <p className="text-sm text-destructive">{editError}</p>}
            <Button onClick={handleSaveEdit} className="rounded-xl w-full" disabled={!eName.trim() || !eEmail.trim() || saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
