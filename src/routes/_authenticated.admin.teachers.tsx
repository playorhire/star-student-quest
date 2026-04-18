import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Plus, Trash2, Upload, CheckCircle, KeyRound, Pencil } from "lucide-react";
import Papa from "papaparse";

export const Route = createFileRoute("/_authenticated/admin/teachers")({
  component: AdminTeachers,
});

interface TeacherRow { id: string; name: string; email: string; user_id: string | null; }

function AdminTeachers() {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csvResult, setCsvResult] = useState<{ count: number } | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [editTeacher, setEditTeacher] = useState<TeacherRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("teachers").select("id, name, email, user_id").order("name");
    setTeachers(data || []);
  }

  async function handleAdd() {
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await supabase.functions.invoke("create-user", {
        body: { email: email.trim(), password, role: "teacher", meta: { name: name.trim() } },
      });
      if (res.error) throw new Error(res.error.message || "Failed to create account");
      if (res.data?.error) throw new Error(res.data.error);
      setName(""); setEmail(""); setPassword("");
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleRemove(id: string) {
    await supabase.from("teachers").delete().eq("id", id);
    load();
  }

  function openEdit(t: TeacherRow) {
    setEditTeacher(t);
    setEditName(t.name);
    setEditEmail(t.email);
    setEditPassword("");
    setEditError("");
  }

  async function handleSaveEdit() {
    if (!editTeacher || !editName.trim() || !editEmail.trim()) return;
    if (editPassword && editPassword.length < 6) {
      setEditError("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      const { error } = await supabase.from("teachers").update({ name: editName.trim(), email: editEmail.trim() }).eq("id", editTeacher.id);
      if (error) throw error;

      if (editTeacher.user_id && (editPassword || editEmail.trim() !== editTeacher.email)) {
        const body: any = { targetUserId: editTeacher.user_id };
        if (editEmail.trim() !== editTeacher.email) body.email = editEmail.trim();
        if (editPassword) body.password = editPassword;
        const res = await supabase.functions.invoke("admin-update-user", { body });
        if (res.error) throw new Error(res.error.message);
        if (res.data?.error) throw new Error(res.data.error);
      }
      setEditTeacher(null);
      load();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: async (results) => {
        let count = 0;
        for (const row of results.data as Record<string, string>[]) {
          const n = row.name || row.Name || "";
          const em = row.email || row.Email || "";
          if (n.trim()) {
            await supabase.from("teachers").insert({ name: n.trim(), email: em.trim() });
            count++;
          }
        }
        setCsvResult({ count });
        load();
        setTimeout(() => setCsvResult(null), 3000);
      },
    });
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Teachers</h1>
        <p className="text-sm text-muted-foreground">Manage teacher accounts</p>
      </div>

      <Card className="border-2 border-accent/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-card-foreground">Import from CSV</div>
              <div className="text-[10px] text-muted-foreground">Columns: name, email (no login account created)</div>
            </div>
            <div className="flex items-center gap-2">
              {csvResult && <Badge className="bg-green-500/10 text-green-600 border-0 gap-1"><CheckCircle className="h-3 w-3" /> {csvResult.count} imported</Badge>}
              <input ref={fileRef} type="file" accept=".csv" onChange={handleCSV} className="hidden" />
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4 mr-1" /> Upload CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Add Teacher with Login</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Name</Label><Input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="rounded-xl" /></div>
            <div><Label className="text-xs">Email</Label><Input placeholder="email@school.edu" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl" /></div>
          </div>
          <div>
            <Label className="text-xs flex items-center gap-1"><KeyRound className="h-3 w-3" /> Password</Label>
            <Input type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleAdd} className="rounded-xl" disabled={!name.trim() || !email.trim() || !password.trim() || creating}>
            <Plus className="h-4 w-4 mr-1" /> {creating ? "Creating..." : "Add Teacher"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {teachers.map(t => (
          <Card key={t.id} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">👩‍🏫</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-card-foreground truncate">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.email}</div>
              </div>
              {t.user_id ? (
                <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-600">Has Login</Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] border-muted text-muted-foreground">No Login</Badge>
              )}
              <Button variant="ghost" size="icon" onClick={() => openEdit(t)} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleRemove(t.id)} className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editTeacher} onOpenChange={open => !open && setEditTeacher(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Teacher</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Name</Label><Input value={editName} onChange={e => setEditName(e.target.value)} className="rounded-xl" /></div>
            <div><Label className="text-xs">Email</Label><Input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="rounded-xl" /></div>
            {editTeacher?.user_id && (
              <div>
                <Label className="text-xs flex items-center gap-1"><KeyRound className="h-3 w-3" /> New Password (leave blank to keep current)</Label>
                <Input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} className="rounded-xl" placeholder="Min 6 characters" />
              </div>
            )}
            {editError && <p className="text-sm text-destructive">{editError}</p>}
            <Button onClick={handleSaveEdit} className="rounded-xl w-full" disabled={!editName.trim() || !editEmail.trim() || saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
