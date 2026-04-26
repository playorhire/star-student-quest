import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { School, UserCog, Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/super-admin/assign-school")({
  component: AssignSchoolPage,
});

function AssignSchoolPage() {
  const { user } = useAuth();
  const [schoolAdmins, setSchoolAdmins] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const [schoolsRes, adminsRes] = await Promise.all([
      (supabase as any).from("schools").select("id, name").order("name"),
      (supabase as any)
        .from("user_roles")
        .select("id, user_id, school_id, tenant_role, role, schools(id, name)")
        .eq("tenant_role", "school_admin"),
    ]);

    if (schoolsRes.error) {
      toast.error(`Failed to load schools: ${schoolsRes.error.message}`);
    } else {
      setSchools(schoolsRes.data || []);
    }

    if (adminsRes.error) {
      toast.error(`Failed to load school admins: ${adminsRes.error.message}`);
    } else {
      setSchoolAdmins(adminsRes.data || []);
    }

    setLoading(false);
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAdminId || !selectedSchoolId) {
      toast.error("Please select both a school admin and a school");
      return;
    }

    const admin = schoolAdmins.find((a) => a.id === selectedAdminId);
    if (!admin) {
      toast.error("School admin not found");
      return;
    }

    if (admin.school_id === selectedSchoolId) {
      toast.info("This school admin is already assigned to the selected school");
      return;
    }

    setSubmitting(true);
    const { error } = await (supabase as any)
      .from("user_roles")
      .update({ school_id: selectedSchoolId })
      .eq("id", selectedAdminId);

    if (error) {
      toast.error(`Assignment failed: ${error.message}`);
      setSubmitting(false);
      return;
    }

    toast.success("School assigned successfully");
    setSelectedAdminId("");
    setSelectedSchoolId("");
    setSubmitting(false);
    loadData();
  }

  if (user?.role !== "super_admin") {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold">Access Denied</h1>
      </div>
    );
  }

  const selectedAdmin = schoolAdmins.find((a) => a.id === selectedAdminId);
  const currentSchoolName = selectedAdmin?.schools?.name || "Not assigned";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Assign School</h1>
        <p className="text-sm text-muted-foreground">
          Assign a school to a school administrator
        </p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <form onSubmit={handleAssign} className="space-y-4">
              {/* School Admin Dropdown */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-primary" />
                  School Admin
                </label>
                <select
                  required
                  value={selectedAdminId}
                  onChange={(e) => {
                    setSelectedAdminId(e.target.value);
                    setSelectedSchoolId("");
                  }}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select School Admin</option>
                  {schoolAdmins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.user_id?.slice(0, 12)}... — Currently: {admin.schools?.name || "Not assigned"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Assignment Info */}
              {selectedAdminId && (
                <div className="rounded-lg bg-muted/50 p-3 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Currently assigned to: <strong>{currentSchoolName}</strong>
                  </span>
                </div>
              )}

              {/* School Dropdown */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2">
                  <School className="h-4 w-4 text-primary" />
                  School
                </label>
                <select
                  required
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select School</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                disabled={submitting || !selectedAdminId || !selectedSchoolId}
                className="w-full"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Assign School
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Assignment Summary */}
      {!loading && schoolAdmins.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Current Assignments
          </h2>
          {schoolAdmins.map((admin) => (
            <Card key={admin.id}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <UserCog className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-mono">
                      {admin.user_id?.slice(0, 12)}...
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {admin.schools?.name ? (
                        <span className="flex items-center gap-1">
                          <School className="h-3 w-3" />
                          {admin.schools.name}
                        </span>
                      ) : (
                        <span className="text-amber-500">Not assigned to any school</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
