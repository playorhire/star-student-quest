import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Building2, Plus, Trash2, Pencil, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/school-admin/branches")({
  component: BranchesManagement,
});

function BranchesManagement() {
  const { user } = useAuth();
  const [branches, setBranches] = useState<any[]>([]);
  const [schoolName, setSchoolName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");

  useEffect(() => {
    if (user?.schoolId) loadBranches();
  }, [user]);

  async function loadBranches() {
    setLoading(true);
    const { data: schoolData } = await (supabase as any).from("schools").select("name").eq("id", user!.schoolId).single();
    setSchoolName(schoolData?.name || "");

    const { data, error } = await (supabase as any)
      .from("branches")
      .select("*")
      .eq("school_id", user!.schoolId)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setBranches(data || []);
    setLoading(false);
  }

  async function handleSave() {
    if (!formName.trim()) { toast.error("Name is required"); return; }
    const payload = {
      school_id: user!.schoolId,
      name: formName.trim(),
      address: formAddress.trim() || null,
    };

    if (isEditing && isEditing !== "new") {
      const { error } = await (supabase as any).from("branches").update({ name: payload.name, address: payload.address }).eq("id", isEditing);
      if (error) toast.error(error.message);
      else toast.success("Branch updated");
    } else {
      const { error } = await (supabase as any).from("branches").insert(payload);
      if (error) toast.error(error.message);
      else toast.success("Branch created");
    }

    setIsEditing(null);
    setFormName("");
    setFormAddress("");
    loadBranches();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this branch? All linked data will be affected.")) return;
    const { error } = await (supabase as any).from("branches").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Branch deleted");
    loadBranches();
  }

  const allowedRoles = ["school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Branches</h1>
          <p className="text-sm text-muted-foreground">
            Manage branches for {schoolName || "your school"}
          </p>
        </div>
        <Button onClick={() => { setIsEditing("new"); setFormName(""); setFormAddress(""); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Branch
        </Button>
      </div>

      {isEditing === "new" && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Input placeholder="Branch Name" value={formName} onChange={e => setFormName(e.target.value)} />
            <Input placeholder="Address (optional)" value={formAddress} onChange={e => setFormAddress(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : branches.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No branches yet</div>
      ) : (
        <div className="space-y-3">
          {branches.map(branch => (
            <Card key={branch.id}>
              <CardContent className="p-4">
                {isEditing === branch.id ? (
                  <div className="space-y-3">
                    <Input value={formName} onChange={e => setFormName(e.target.value)} />
                    <Input value={formAddress} onChange={e => setFormAddress(e.target.value)} />
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>Save</Button>
                      <Button variant="outline" onClick={() => setIsEditing(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-bold">{branch.name}</div>
                        {branch.address && <div className="text-sm text-muted-foreground">{branch.address}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => { setIsEditing(branch.id); setFormName(branch.name); setFormAddress(branch.address || ""); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(branch.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
