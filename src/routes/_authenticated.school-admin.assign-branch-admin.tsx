import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { Building2, Plus, Loader2, UserCog, Trash2, X, Check, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/school-admin/assign-branch-admin")({
  component: AssignBranchAdminPage,
});

function AssignBranchAdminPage() {
  const { user } = useAuth();
  const [branches, setBranches] = useState<any[]>([]);
  const [branchAdmins, setBranchAdmins] = useState<Map<string, any[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state per branch
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadData(); }, [user?.schoolId]);

  async function loadData() {
    if (!user?.schoolId) return;
    setLoading(true);
    setError(null);

    try {
      const { data: branchesData, error: branchesErr } = await (supabase as any)
        .from("branches")
        .select("id, name")
        .eq("school_id", user.schoolId)
        .order("name");

      if (branchesErr) {
        setError(`Branches query failed: ${branchesErr.message}`);
        setLoading(false);
        return;
      }

      const branchesList = branchesData || [];
      setBranches(branchesList);

      // Load branch admins for all branches
      const { data: adminsData, error: adminsErr } = await (supabase as any)
        .from("user_roles")
        .select("id, user_id, name, email, school_id, branch_id, tenant_role")
        .eq("school_id", user.schoolId)
        .eq("tenant_role", "branch_admin")
        .eq("is_primary", true);

      if (adminsErr) {
        setError(`Admins query failed: ${adminsErr.message}`);
      }

      const adminsByBranch = new Map<string, any[]>();
      for (const branch of branchesList) {
        adminsByBranch.set(branch.id, []);
      }
      for (const admin of (adminsData || [])) {
        if (admin.branch_id && adminsByBranch.has(admin.branch_id)) {
          adminsByBranch.get(admin.branch_id)!.push(admin);
        }
      }
      setBranchAdmins(adminsByBranch);
    } catch (err: any) {
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function openAssignForm(branchId: string) {
    setActiveBranchId(branchId);
    setEmail("");
    setPassword("");
    setName("");
  }

  function closeForm() {
    setActiveBranchId(null);
    setEmail("");
    setPassword("");
    setName("");
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) { toast.error("Email and password are required"); return; }
    if (password.length < 6) { toast.error("Password must be 6+ chars"); return; }
    if (!activeBranchId) { toast.error("No branch selected"); return; }
    setSubmitting(true);

    const res = await supabase.functions.invoke("create-user", {
      body: {
        email: email.trim(),
        password,
        role: "branch_admin",
        tenant_role: "branch_admin",
        is_primary: true,
        school_id: user!.schoolId,
        branch_id: activeBranchId,
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

    toast.success("Branch Admin assigned successfully");
    closeForm();
    loadData();
    setSubmitting(false);
  }

  async function handleRemove(adminId: string, userId?: string) {
    if (!confirm("Remove this branch admin?")) return;

    if (userId) {
      await supabase.functions.invoke("admin-update-user", {
        body: { targetUserId: userId, deleteUser: true },
      });
    }

    const { error } = await (supabase as any).from("user_roles").delete().eq("id", adminId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Branch admin removed");
      loadData();
    }
  }

  const allowedRoles = ["school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Assign Branch Admins</h1>
        <p className="text-sm text-muted-foreground">Assign administrators to each branch</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div><strong>Error:</strong> {error}</div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading branches...</div>
      ) : branches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">No branches found</div>
          <div className="text-xs text-muted-foreground mt-1">Create branches first in the Branches section.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {branches.map(branch => {
            const admins = branchAdmins.get(branch.id) || [];
            const isActive = activeBranchId === branch.id;

            return (
              <Card key={branch.id} className={isActive ? "ring-2 ring-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{branch.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {admins.length} admin{admins.length !== 1 ? 's' : ''} assigned
                    </div>
                  </div>

                  {admins.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {admins.map(admin => (
                        <div key={admin.id} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <UserCog className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">{admin.name || admin.email}</div>
                              <div className="text-xs text-muted-foreground">{admin.email}</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => handleRemove(admin.id, admin.user_id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {isActive ? (
                    <form onSubmit={handleAssign} className="space-y-3 border-t pt-3">
                      <Input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
                      <Input type="password" placeholder="Password (6+ chars)" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
                      <Input placeholder="Display Name (optional)" value={name} onChange={e => setName(e.target.value)} />
                      <div className="flex gap-2">
                        <Button type="submit" disabled={submitting} className="flex-1">
                          {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4 mr-1" />}
                          Assign Admin
                        </Button>
                        <Button type="button" variant="outline" onClick={closeForm}>
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => openAssignForm(branch.id)} className="w-full">
                      <Plus className="h-4 w-4 mr-1" /> Assign Branch Admin
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
