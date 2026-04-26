import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { UserCog, Plus, Trash2, Loader2, RefreshCw, AlertTriangle, Pencil, Check, X, Building2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/school-admin/branch-admins")({
  component: BranchAdminsManagement,
});

function BranchAdminsManagement() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [createBranchId, setCreateBranchId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBranchId, setEditBranchId] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => { loadData(); }, [user?.schoolId]);

  async function loadData() {
    if (!user?.schoolId) return;
    setLoading(true);
    setError(null);

    try {
      const [branchesRes, rolesRes] = await Promise.all([
        (supabase as any).from("branches").select("id, name").eq("school_id", user.schoolId).order("name"),
        (supabase as any)
          .from("user_roles")
          .select("id, user_id, name, email, school_id, branch_id, tenant_role, role")
          .eq("school_id", user.schoolId)
          .eq("tenant_role", "branch_admin"),
      ]);

      if (branchesRes.error) {
        setError(`Branches query failed: ${branchesRes.error.message}`);
      } else {
        setBranches(branchesRes.data || []);
      }

      if (rolesRes.error) {
        setError(`user_roles query failed: ${rolesRes.error.message}`);
      } else {
        let all = rolesRes.data || [];

        // Backfill missing email/name from auth.users via edge function
        try {
          const { data: authUsersData, error: listErr } = await supabase.functions.invoke("list-users", {});
          if (!listErr && authUsersData?.users) {
            const authMap = new Map((authUsersData.users as any[]).map((u: any) => [u.id, u.email]));
            all = all.map((r: any) => {
              const authEmail = authMap.get(r.user_id);
              return {
                ...r,
                email: r.email || authEmail || "",
                name: r.name || r.email || authEmail || "",
              };
            });
          }
        } catch (e: any) {
          // ignore backfill errors
        }

        setAdmins(all);
      }
    } catch (err: any) {
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) { toast.error("Email and password are required"); return; }
    if (password.length < 6) { toast.error("Password must be 6+ chars"); return; }
    if (!createBranchId) { toast.error("Please assign a branch"); return; }
    setSubmitting(true);

    const res = await supabase.functions.invoke("create-user", {
      body: {
        email: email.trim(),
        password,
        role: "admin",
        tenant_role: "branch_admin",
        is_primary: true,
        school_id: user!.schoolId,
        branch_id: createBranchId,
        meta: { name: name.trim() || email.trim() },
      },
    });

    if (res.error) {
      let msg = res.error.message || "Edge function failed";
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
        } catch {}
      }
      toast.error(`Create failed: ${msg}`);
      setSubmitting(false);
      return;
    }

    if (res.data?.error) {
      toast.error(`Create failed: ${res.data.error}`);
      setSubmitting(false);
      return;
    }

    toast.success("Branch Admin created successfully");
    setShowForm(false); setEmail(""); setPassword(""); setName(""); setCreateBranchId("");
    loadData();
    setSubmitting(false);
  }

  async function handleDelete(id: string, userId?: string) {
    if (!confirm("Remove this branch admin role? This will also delete the user account permanently.")) return;

    if (userId) {
      const { error: deleteAuthError } = await supabase.functions.invoke("admin-update-user", {
        body: { targetUserId: userId, deleteUser: true },
      });
      if (deleteAuthError) {
        toast.error(`Failed to delete auth user: ${deleteAuthError.message}`);
      }
    }

    const { error } = await (supabase as any).from("user_roles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Branch admin removed"); loadData(); }
  }

  function startEdit(admin: any) {
    setEditingId(admin.id);
    setEditName(admin.name || "");
    setEditEmail(admin.email || "");
    setEditBranchId(admin.branch_id || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
    setEditBranchId("");
  }

  async function handleSaveEdit(admin: any) {
    setEditSubmitting(true);
    const updates: any = {};
    if (editName.trim()) updates.name = editName.trim();
    if (editEmail.trim()) updates.email = editEmail.trim();
    updates.branch_id = editBranchId || null;

    const { error: roleError } = await (supabase as any)
      .from("user_roles")
      .update(updates)
      .eq("id", admin.id);

    if (roleError) {
      toast.error(`Update failed: ${roleError.message}`);
      setEditSubmitting(false);
      return;
    }

    if (editEmail.trim() && editEmail.trim() !== admin.email) {
      const { error: authError } = await supabase.functions.invoke("admin-update-user", {
        body: { targetUserId: admin.user_id, email: editEmail.trim() },
      });
      if (authError) {
        toast.error(`Auth email update failed: ${authError.message}`);
      }
    }

    toast.success("Branch admin updated");
    setEditSubmitting(false);
    setEditingId(null);
    loadData();
  }

  const allowedRoles = ["school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Branch Admins</h1>
          <p className="text-sm text-muted-foreground">Manage branch administrators</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1" />{showForm ? "Cancel" : "Add"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div><strong>Error:</strong> {error}</div>
        </div>
      )}

      {showForm && (
        <Card><CardContent className="p-4 space-y-4">
          <form onSubmit={handleCreate} className="space-y-3">
            <Input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password (6+ chars)" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
            <Input placeholder="Display Name (optional)" value={name} onChange={e => setName(e.target.value)} />
            <div>
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1"><Building2 className="h-3 w-3" /> Assign Branch *</label>
              <select
                required
                value={createBranchId}
                onChange={e => setCreateBranchId(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Branch</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Create Branch Admin
            </Button>
          </form>
        </CardContent></Card>
      )}

      {loading ? <div className="text-center py-12 text-muted-foreground">Loading...</div> :
       admins.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">No branch admins found</div>
            <div className="text-xs text-muted-foreground">
              {error ? "Fix the database error above, then refresh." : "Create a branch admin using the Add button."}
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
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" /> Branch</label>
                    <select
                      value={editBranchId}
                      onChange={e => setEditBranchId(e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">No branch assigned</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
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
                      <div className="text-xs text-muted-foreground">{a.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Branch: {branches.find(b => b.id === a.branch_id)?.name || "Unassigned"}
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
