import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Building2, Plus, Trash2, Pencil, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/super-admin/schools" as any)({
  component: SchoolsManagement,
});

function SchoolsManagement() {
  const { user } = useAuth();
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");

  useEffect(() => {
    loadSchools();
  }, []);

  async function loadSchools() {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("schools")
      .select("*, branches(id, name)")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setSchools(data || []);
    setLoading(false);
  }

  async function handleSave() {
    if (!formName.trim()) { toast.error("Name is required"); return; }
    const payload = { name: formName.trim(), address: formAddress.trim() || null };

    if (isEditing && isEditing !== "new") {
      const { error } = await (supabase as any).from("schools").update(payload).eq("id", isEditing);
      if (error) toast.error(error.message);
      else toast.success("School updated");
    } else {
      const { error } = await (supabase as any).from("schools").insert(payload);
      if (error) toast.error(error.message);
      else toast.success("School created");
    }

    setIsEditing(null);
    setFormName("");
    setFormAddress("");
    loadSchools();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this school and all its branches?")) return;
    const { error } = await (supabase as any).from("schools").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("School deleted");
    loadSchools();
  }

  if (user?.role !== "super_admin") {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Schools</h1>
          <p className="text-sm text-muted-foreground">Manage all schools in the system</p>
        </div>
        <Button onClick={() => { setIsEditing("new"); setFormName(""); setFormAddress(""); }}>
          <Plus className="h-4 w-4 mr-1" /> Add School
        </Button>
      </div>

      {isEditing === "new" && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Input placeholder="School Name" value={formName} onChange={e => setFormName(e.target.value)} />
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
      ) : schools.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No schools yet</div>
      ) : (
        <div className="space-y-3">
          {schools.map(school => (
            <Card key={school.id}>
              <CardContent className="p-4">
                {isEditing === school.id ? (
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
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold">{school.name}</div>
                        {school.address && <div className="text-sm text-muted-foreground">{school.address}</div>}
                        <div className="text-xs text-muted-foreground mt-1">
                          {school.branches?.length || 0} branches
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => { setIsEditing(school.id); setFormName(school.name); setFormAddress(school.address || ""); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(school.id)}>
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
