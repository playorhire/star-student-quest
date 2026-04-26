import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { UserCog, Plus, Trash2, Loader2, RefreshCw, AlertTriangle, Copy, Pencil, Check, X, School } from "lucide-react";

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
  const [createSchoolId, setCreateSchoolId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSchoolId, setEditSchoolId] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    setDebugInfo("");

    try {
      const [schoolsRes, rolesRes] = await Promise.all([
        (supabase as any).from("schools").select("id, name").order("name"),
        (supabase as any)
          .from("user_roles")
          .select("id, user_id, name, email, school_id, tenant_role, role, schools(id, name)"),
      ]);

      if (schoolsRes.error) {
        setError(`Schools query failed: ${schoolsRes.error.message} (${schoolsRes.error.code})`);
        setDebugInfo(prev => prev + `Schools error: ${JSON.stringify(schoolsRes.error)}\n`);
      } else {
        setSchools(schoolsRes.data || []);
        setDebugInfo(prev => prev + `Schools loaded: ${schoolsRes.data?.length || 0} rows\n`);
      }

      if (rolesRes.error) {
        const errMsg = `user_roles query failed: ${rolesRes.error.message} (${rolesRes.error.code})`;
        setError(prev => prev ? `${prev}; ${errMsg}` : errMsg);
        setDebugInfo(prev => prev + `user_roles error: ${JSON.stringify(rolesRes.error)}\n`);
      } else {
        const all = rolesRes.data || [];
        const filtered = all.filter((r: any) =>
          r.tenant_role === "school_admin" ||
          (r.role === "admin" && !r.tenant_role)
        );
        setAdmins(filtered);
        setDebugInfo(prev => prev + `School admins loaded: ${filtered.length} rows (from ${all.length} total)\n`);
      }
    } catch (err: any) {
      setError(`Unexpected error: ${err.message}`);
      setDebugInfo(prev => prev + `Exception: ${err.message}\n`);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) { toast.error("Email and password are required"); return; }
    if (password.length < 6) { toast.error("Password must be 6+ chars"); return; }
    setSubmitting(true);
    setDebugInfo("");

    // Use Edge Function (service role) so current super-admin session is NOT affected
    setDebugInfo(prev => prev + `Step 1: Invoking create-user edge function for ${email.trim()}...\n`);
    const res = await supabase.functions.invoke("create-user", {
      body: {
        email: email.trim(),
        password,
        role: "admin",
        tenant_role: "school_admin",
        is_primary: true,
        school_id: createSchoolId || undefined,
      },
    });

    if (res.error) {
      let msg = res.error.message || "Edge function failed";
      // Try to read the actual error body from the edge function response
      const ctx = (res.error as any).context;
      if (ctx?.text) {
        try {
          const text = await ctx.text();
          if (text) {
            try {
              const parsed = JSON.parse(text);
              if (parsed?.error) msg = String(parsed.error);
            } catch {
              msg = text;
            }
          }
        } catch {
          /* ignore */
        }
      }
      setDebugInfo(prev => prev + `Edge function ERROR: ${msg}\n`);
      toast.error(`Create failed: ${msg}`);
      setSubmitting(false);
      return;
    }

    if (res.data?.error) {
      setDebugInfo(prev => prev + `Edge function returned error: ${res.data.error}\n`);
      toast.error(`Create failed: ${res.data.error}`);
      setSubmitting(false);
      return;
    }

    const userId = res.data?.userId;
    if (!userId) {
      setDebugInfo(prev => prev + `Edge function returned no userId. Response: ${JSON.stringify(res.data)}\n`);
      toast.error("Could not get new user ID.");
      setSubmitting(false);
      return;
    }

    setDebugInfo(prev => prev + `Step 2: SUCCESS! Auth user created via edge function: ${userId}\n`);
    setDebugInfo(prev => prev + `Step 3: user_roles inserted\n`);
    toast.success("School Admin created successfully");
    setShowForm(false); setEmail(""); setPassword(""); setCreateSchoolId(""); loadData();
    setSubmitting(false);
  }

  async function handleDelete(id: string, userId?: string) {
    if (!confirm("Remove this school admin role? This will also delete the user account permanently.")) return;

    // Delete auth user first via edge function if userId exists
    if (userId) {
      const { error: deleteAuthError } = await supabase.functions.invoke("admin-update-user", {
        body: { targetUserId: userId, deleteUser: true },
      });
      if (deleteAuthError) {
        toast.error(`Failed to delete auth user: ${deleteAuthError.message}`);
        // Continue to delete role anyway
      }
    }

    const { error } = await (supabase as any).from("user_roles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("School admin removed"); loadData(); }
  }

  function startEdit(admin: any) {
    setEditingId(admin.id);
    setEditName(admin.name || "");
    setEditEmail(admin.email || "");
    setEditSchoolId(admin.school_id || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
    setEditSchoolId("");
  }

  async function handleSaveEdit(admin: any) {
    setEditSubmitting(true);
    const updates: any = {};
    if (editName.trim()) updates.name = editName.trim();
    if (editEmail.trim()) updates.email = editEmail.trim();
    updates.school_id = editSchoolId || null;

    // Update user_roles
    const { error: roleError } = await (supabase as any)
      .from("user_roles")
      .update(updates)
      .eq("id", admin.id);

    if (roleError) {
      toast.error(`Update failed: ${roleError.message}`);
      setEditSubmitting(false);
      return;
    }

    // If email changed, update auth user too
    if (editEmail.trim() && editEmail.trim() !== admin.email) {
      const { error: authError } = await supabase.functions.invoke("admin-update-user", {
        body: { targetUserId: admin.user_id, email: editEmail.trim() },
      });
      if (authError) {
        toast.error(`Auth email update failed: ${authError.message}`);
      }
    }

    toast.success("School admin updated");
    setEditSubmitting(false);
    setEditingId(null);
    loadData();
  }

  if (user?.role !== "super_admin") return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;

  const sqlCommand = `-- Run this in Supabase SQL Editor to manually create a school admin:

-- 1. Sign up the user first (or use an existing auth.users.id)
-- The auth user ID will be shown after signUp in Auth > Users

-- 2. Insert role (replace the user_id with actual value):
INSERT INTO public.user_roles (user_id, role, tenant_role, is_primary)
VALUES (
  'PASTE-USER-ID-HERE',
  'admin',
  'school_admin',
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
              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1"><School className="h-3 w-3" /> Assign School (optional)</label>
                <select
                  value={createSchoolId}
                  onChange={e => setCreateSchoolId(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">No school assigned</option>
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                Create School Admin
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
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
            <Card key={a.id}><CardContent className="p-4">
              {editingId === a.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Name</label>
                    <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Display name" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Email</label>
                    <Input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="Email" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><School className="h-3 w-3" /> School</label>
                    <select
                      value={editSchoolId}
                      onChange={e => setEditSchoolId(e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">No school assigned</option>
                      {schools.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveEdit(a)} disabled={editSubmitting}>
                      {editSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4 mr-1" />}
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><UserCog className="h-5 w-5 text-primary" /></div>
                    <div>
                      <div className="font-semibold">{a.name || a.email || `User: ${a.user_id?.slice(0, 12)}...`}</div>
                      <div className="text-xs text-muted-foreground">{a.schools?.name || "No school assigned"}</div>
                      <div className="text-[10px] text-muted-foreground">
                        role: {a.role} • tenant: {a.tenant_role}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(a)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(a.id, a.user_id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent></Card>
          ))}</div>
       )}
    </div>
  );
}
