import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { UserCog, Plus, Trash2, Loader2, RefreshCw, AlertTriangle, Copy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/super-admin/school-admins")({
  component: SchoolAdminsManagement,
});

function SchoolAdminsManagement() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSqlMode, setShowSqlMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    setDebugInfo("");

    // Test schools first
    const schoolsRes = await (supabase as any).from("schools").select("id, name").order("name");
    if (schoolsRes.error) {
      setError(`Schools query failed: ${schoolsRes.error.message} (${schoolsRes.error.code})`);
      setDebugInfo(prev => prev + `Schools error: ${JSON.stringify(schoolsRes.error)}\n`);
    } else {
      setSchools(schoolsRes.data || []);
      setDebugInfo(prev => prev + `Schools loaded: ${schoolsRes.data?.length || 0} rows\n`);
    }

    // Test user_roles
    const rolesRes = await (supabase as any)
      .from("user_roles")
      .select("id, user_id, school_id, tenant_role, role, schools(id, name)")
      .eq("tenant_role", "school_admin");

    if (rolesRes.error) {
      const errMsg = `user_roles query failed: ${rolesRes.error.message} (${rolesRes.error.code})`;
      setError(prev => prev ? `${prev}; ${errMsg}` : errMsg);
      setDebugInfo(prev => prev + `user_roles error: ${JSON.stringify(rolesRes.error)}\n`);

      // Try fallback without tenant_role filter
      const fallbackRes = await (supabase as any)
        .from("user_roles")
        .select("id, user_id, school_id, role");
      if (!fallbackRes.error && fallbackRes.data) {
        setDebugInfo(prev => prev + `Fallback query returned ${fallbackRes.data.length} rows. tenant_role column likely missing.\n`);
      }
    } else {
      setAdmins(rolesRes.data || []);
      setDebugInfo(prev => prev + `School admins loaded: ${rolesRes.data?.length || 0} rows\n`);
    }

    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password || !schoolId) { toast.error("All fields required"); return; }
    if (password.length < 6) { toast.error("Password must be 6+ chars"); return; }
    setSubmitting(true);
    setDebugInfo("");

    // Method 1: Try to create auth user
    setDebugInfo(prev => prev + `Step 1: Creating auth user for ${email.trim()}...\n`);
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { role: "school_admin" } }
    });

    if (authErr) {
      setDebugInfo(prev => prev + `Auth signup ERROR: ${authErr.message} (${authErr.status})\n`);
      toast.error(`Auth signup failed: ${authErr.message}`);
      setSubmitting(false);
      return;
    }

    const targetUserId = authData?.user?.id;
    if (!targetUserId) {
      setDebugInfo(prev => prev + `Auth signup returned no user. Session user might be current user instead.\n`);
      toast.error("Could not get new user ID. Try the SQL method below.");
      setSubmitting(false);
      return;
    }

    setDebugInfo(prev => prev + `Step 2: Auth user created: ${targetUserId}\n`);

    // Method 2: Insert role
    setDebugInfo(prev => prev + `Step 3: Inserting role record...\n`);
    const { data: roleData, error: roleErr } = await (supabase as any).from("user_roles").insert({
      user_id: targetUserId,
      role: "admin",
      tenant_role: "school_admin",
      school_id: schoolId,
      is_primary: true,
    }).select();

    if (roleErr) {
      setDebugInfo(prev => prev + `Role insert ERROR: ${roleErr.message} (${roleErr.code})\n`);
      toast.error(`Role insert failed: ${roleErr.message}`);
      setSubmitting(false);
      return;
    }

    setDebugInfo(prev => prev + `Step 4: SUCCESS! Role inserted: ${JSON.stringify(roleData)}\n`);
    toast.success("School Admin created successfully");
    setShowForm(false); setEmail(""); setPassword(""); setSchoolId(""); loadData();
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this school admin role?")) return;
    const { error } = await (supabase as any).from("user_roles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Removed"); loadData(); }
  }

  if (user?.role !== "super_admin") return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;

  const selectedSchool = schools.find(s => s.id === schoolId);
  const sqlCommand = `-- Run this in Supabase SQL Editor to manually create a school admin:

-- 1. Sign up the user first (or use an existing auth.users.id)
-- The auth user ID will be shown after signUp in Auth > Users

-- 2. Insert role (replace the user_id with actual value):
INSERT INTO public.user_roles (user_id, role, tenant_role, school_id, is_primary)
VALUES (
  'PASTE-USER-ID-HERE',
  'admin',
  'school_admin',
  '${schoolId || "PASTE-SCHOOL-ID"}',
  true
);`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">School Admins</h1>
          <p className="text-sm text-muted-foreground">Manage school administrators</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button onClick={() => { setShowForm(!showForm); setShowSqlMode(false); }}>
            <Plus className="h-4 w-4 mr-1" />{showForm ? "Cancel" : "Add"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <strong>Database Error:</strong> {error}
            <div className="mt-1 text-xs opacity-80">
              This usually means the tenant_role column or RLS policies are not set up.
              Run the complete SQL setup script first.
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <Card><CardContent className="p-4 space-y-4">
          <div className="flex gap-2">
            <Button
              variant={showSqlMode ? "outline" : "default"}
              size="sm"
              onClick={() => setShowSqlMode(false)}
            >UI Form</Button>
            <Button
              variant={showSqlMode ? "default" : "outline"}
              size="sm"
              onClick={() => setShowSqlMode(true)}
            >SQL Method</Button>
          </div>

          {!showSqlMode ? (
            <form onSubmit={handleCreate} className="space-y-3">
              <Input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
              <Input type="password" placeholder="Password (6+ chars)" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
              <select required value={schoolId} onChange={e => setSchoolId(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select School</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                Create School Admin
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              <select value={schoolId} onChange={e => setSchoolId(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select School (to generate SQL)</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <div className="relative bg-muted rounded-lg p-3 text-xs font-mono whitespace-pre-wrap overflow-auto max-h-60">
                {sqlCommand}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => { navigator.clipboard.writeText(sqlCommand); toast.success("Copied SQL"); }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                1. Create a user in Supabase Dashboard → Authentication → Users → Add User<br/>
                2. Copy their UUID and paste into the SQL above<br/>
                3. Run the SQL in the SQL Editor
              </p>
            </div>
          )}
        </CardContent></Card>
      )}

      {debugInfo && (
        <div className="bg-muted/50 rounded-lg p-3 text-xs font-mono whitespace-pre-wrap">
          <div className="text-muted-foreground mb-1 font-semibold">Debug Log:</div>
          {debugInfo}
        </div>
      )}

      {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> :
       admins.length === 0 ? (
         <div className="text-center py-12">
           <div className="text-muted-foreground mb-2">No school admins found</div>
           <div className="text-xs text-muted-foreground">
             {error ? "Fix the database error above, then refresh." : "Create a school admin using the Add button."}
           </div>
         </div>
       ) : (
         <div className="space-y-3">{admins.map(a => (
           <Card key={a.id}><CardContent className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><UserCog className="h-5 w-5 text-primary" /></div>
               <div>
                 <div className="font-semibold">{a.schools?.name || "Unknown School"}</div>
                 <div className="text-xs text-muted-foreground font-mono">{a.user_id?.slice(0, 12)}...</div>
                 <div className="text-[10px] text-muted-foreground">
                   role: {a.role} • tenant: {a.tenant_role}
                 </div>
               </div>
             </div>
             <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(a.id)}>
               <Trash2 className="h-4 w-4" />
             </Button>
           </CardContent></Card>
         ))}</div>
      )}
    </div>
  );
}
