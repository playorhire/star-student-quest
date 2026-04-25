import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { UserCog, Plus, Trash2, Pencil, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/super-admin/school-admins" as any)({
  component: SchoolAdminsManagement,
});

function SchoolAdminsManagement() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: a }, { data: s }] = await Promise.all([
      (supabase as any).from("user_roles").select("id, user_id, school_id, schools(id, name)").eq("tenant_role", "school_admin"),
      (supabase as any).from("schools").select("id, name").order("name"),
    ]);
    setAdmins(a || []);
    setSchools(s || []);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password || !schoolId) { toast.error("All fields required"); return; }
    if (password.length < 6) { toast.error("Password must be 6+ chars"); return; }
    setSubmitting(true);

    const { data: authData, error: authErr } = await supabase.auth.signUp({ email: email.trim(), password });
    if (authErr || !authData.user) {
      toast.error(authErr?.message || "Failed to create user");
      setSubmitting(false);
      return;
    }

    const { error: roleErr } = await (supabase as any).from("user_roles").insert({
      user_id: authData.user.id, role: "admin", tenant_role: "school_admin",
      school_id: schoolId, is_primary: true,
    });

    if (roleErr) toast.error(roleErr.message);
    else { toast.success("School Admin created"); setShowForm(false); setEmail(""); setPassword(""); setSchoolId(""); loadData(); }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this school admin?")) return;
    const { error } = await (supabase as any).from("user_roles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Removed"); loadData(); }
  }

  if (user?.role !== "super_admin") return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">School Admins</h1>
          <p className="text-sm text-muted-foreground">Manage school administrators</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" />{showForm ? "Cancel" : "Add"}</Button>
      </div>

      {showForm && (
        <Card><CardContent className="p-4 space-y-3">
          <form onSubmit={handleCreate} className="space-y-3">
            <Input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password (6+ chars)" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
            <select required value={schoolId} onChange={e => setSchoolId(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select School</option>
              {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <Button type="submit" disabled={submitting} className="w-full">{submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}Create</Button>
          </form>
        </CardContent></Card>
      )}

      {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> :
       admins.length === 0 ? <div className="text-center py-12 text-muted-foreground">No school admins</div> :
       <div className="space-y-3">{admins.map(a => (
         <Card key={a.id}><CardContent className="p-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><UserCog className="h-5 w-5 text-primary" /></div>
             <div><div className="font-semibold">{a.schools?.name || "Unknown"}</div><div className="text-xs text-muted-foreground font-mono">{a.user_id.slice(0, 8)}...</div></div>
           </div>
           <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(a.id)}><Trash2 className="h-4 w-4" /></Button>
         </CardContent></Card>
       ))}</div>}
    </div>
  );
}
