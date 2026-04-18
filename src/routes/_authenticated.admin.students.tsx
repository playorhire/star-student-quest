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

export const Route = createFileRoute("/_authenticated/admin/students")({
  component: AdminStudents,
});

interface StudentRow { id: string; name: string; roll_number: string; section: string; total_points: number; avatar_emoji: string; class_id: string; user_id: string | null; classes: { name: string } | null; }
interface ClassRow { id: string; name: string; }

function AdminStudents() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csvResult, setCsvResult] = useState<{ count: number } | null>(null);
  const [filterClassId, setFilterClassId] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [editStudent, setEditStudent] = useState<StudentRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editRoll, setEditRoll] = useState("");
  const [editClassId, setEditClassId] = useState("");
  const [editSection, setEditSection] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const [s, c] = await Promise.all([
      supabase.from("students").select("id, name, roll_number, section, total_points, avatar_emoji, class_id, user_id, classes(name)").order("name"),
      supabase.from("classes").select("id, name").order("name"),
    ]);
    setStudents(s.data as any || []);
    setClasses(c.data || []);
  }

  async function handleAdd() {
    if (!name.trim() || !roll.trim() || !classId) return;
    setCreating(true);
    setError("");
    try {
      const { data: student, error: insertErr } = await supabase.from("students").insert({ name: name.trim(), roll_number: roll.trim(), class_id: classId, section: section || "A" }).select("id").single();
      if (insertErr) throw insertErr;

      if (email.trim() && password.trim()) {
        const res = await supabase.functions.invoke("create-user", {
          body: { email: email.trim(), password, role: "student", meta: { studentId: student.id } },
        });
        if (res.data?.error) throw new Error(res.data.error);
      }

      setName(""); setRoll(""); setClassId(""); setSection(""); setEmail(""); setPassword("");
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleRemove(id: string) {
    await supabase.from("students").delete().eq("id", id);
    load();
  }

  function openEdit(s: StudentRow) {
    setEditStudent(s);
    setEditName(s.name);
    setEditRoll(s.roll_number);
    setEditClassId(s.class_id);
    setEditSection(s.section);
    setEditEmoji(s.avatar_emoji);
    setEditEmail("");
    setEditPassword("");
    setEditError("");
  }

  async function handleSaveEdit() {
    if (!editStudent || !editName.trim() || !editRoll.trim() || !editClassId) return;
    if (editPassword && editPassword.length < 6) {
      setEditError("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      const { error } = await supabase.from("students").update({
        name: editName.trim(),
        roll_number: editRoll.trim(),
        class_id: editClassId,
        section: editSection || "A",
        avatar_emoji: editEmoji || "🧑‍🎓",
      }).eq("id", editStudent.id);
      if (error) throw error;

      if (editStudent.user_id && (editPassword || editEmail.trim())) {
        const body: any = { targetUserId: editStudent.user_id };
        if (editEmail.trim()) body.email = editEmail.trim();
        if (editPassword) body.password = editPassword;
        const res = await supabase.functions.invoke("admin-update-user", { body });
        if (res.error) throw new Error(res.error.message);
        if (res.data?.error) throw new Error(res.data.error);
      }
      setEditStudent(null);
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
          const r = row.roll || row.Roll || row.roll_number || "";
          const c = row.class || row.Class || "";
          const s = row.section || row.Section || "A";
          if (n.trim() && r.trim() && c.trim()) {
            const cls = classes.find(cl => cl.name === c.trim());
            if (cls) {
              await supabase.from("students").insert({ name: n.trim(), roll_number: r.trim(), class_id: cls.id, section: s.trim() });
              count++;
            }
          }
        }
        setCsvResult({ count });
        load();
        setTimeout(() => setCsvResult(null), 3000);
      },
    });
    e.target.value = "";
  };

  const filtered = filterClassId ? students.filter(s => s.class_id === filterClassId) : students;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Students</h1>
        <p className="text-sm text-muted-foreground">{students.length} total students</p>
      </div>

      <Card className="border-2 border-accent/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-card-foreground">Import from CSV</div>
              <div className="text-[10px] text-muted-foreground">Columns: name, roll, class, section</div>
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
        <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Add Student</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Name</Label><Input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="rounded-xl" /></div>
            <div><Label className="text-xs">Roll Number</Label><Input placeholder="101" value={roll} onChange={e => setRoll(e.target.value)} className="rounded-xl" /></div>
            <div>
              <Label className="text-xs">Class</Label>
              <select value={classId} onChange={e => setClassId(e.target.value)} className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm">
                <option value="">Select</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Section</Label><Input placeholder="A" value={section} onChange={e => setSection(e.target.value)} className="rounded-xl" /></div>
          </div>
          <div className="border-t border-border pt-3 mt-2">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><KeyRound className="h-3 w-3" /> Optional: Create login account</p>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Email</Label><Input placeholder="student@school.edu" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl" /></div>
              <div><Label className="text-xs">Password</Label><Input type="password" placeholder="Min 6 chars" value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl" /></div>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleAdd} className="rounded-xl" disabled={!name.trim() || !roll.trim() || !classId || creating}>
            <Plus className="h-4 w-4 mr-1" /> {creating ? "Creating..." : "Add Student"}
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Button variant={filterClassId === "" ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setFilterClassId("")}>All</Button>
        {classes.map(c => (
          <Button key={c.id} variant={filterClassId === c.id ? "default" : "outline"} size="sm" className="rounded-xl text-xs" onClick={() => setFilterClassId(c.id)}>{c.name}</Button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(s => (
          <Card key={s.id} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-lg">{s.avatar_emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-card-foreground truncate">{s.name}</div>
                <div className="text-xs text-muted-foreground">Roll #{s.roll_number} • {s.classes?.name} ({s.section})</div>
              </div>
              <div className="text-right mr-1">
                <div className="font-black text-primary text-sm">{s.total_points}</div>
                <div className="text-[10px] text-muted-foreground">pts</div>
              </div>
              {s.user_id ? (
                <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-600">Login</Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] border-muted text-muted-foreground">No Login</Badge>
              )}
              <Button variant="ghost" size="icon" onClick={() => openEdit(s)} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleRemove(s.id)} className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editStudent} onOpenChange={open => !open && setEditStudent(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Student</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Name</Label><Input value={editName} onChange={e => setEditName(e.target.value)} className="rounded-xl" /></div>
            <div><Label className="text-xs">Roll Number</Label><Input value={editRoll} onChange={e => setEditRoll(e.target.value)} className="rounded-xl" /></div>
            <div>
              <Label className="text-xs">Class</Label>
              <select value={editClassId} onChange={e => setEditClassId(e.target.value)} className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm">
                <option value="">Select</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Section</Label><Input value={editSection} onChange={e => setEditSection(e.target.value)} className="rounded-xl" /></div>
            <div><Label className="text-xs">Avatar Emoji</Label><Input value={editEmoji} onChange={e => setEditEmoji(e.target.value)} className="rounded-xl" /></div>
            {editError && <p className="text-sm text-destructive">{editError}</p>}
            <Button onClick={handleSaveEdit} className="rounded-xl w-full" disabled={!editName.trim() || !editRoll.trim() || !editClassId || saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
