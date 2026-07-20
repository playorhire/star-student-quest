import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { UserPlus, Loader2, School, Building2, GraduationCap, Users, UserCog, Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/super-admin/create-user")({
  component: CreateUserPage,
});

type RoleOption = {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
};

const ROLE_OPTIONS: RoleOption[] = [
  { value: "school_admin", label: "School Admin", icon: UserCog, color: "text-indigo-500" },
  { value: "branch_admin", label: "Branch Admin", icon: Building2, color: "text-orange-500" },
  { value: "teacher", label: "Teacher", icon: Users, color: "text-blue-500" },
  { value: "student", label: "Student", icon: GraduationCap, color: "text-green-500" },
  { value: "parent", label: "Parent", icon: Users, color: "text-purple-500" },
  { value: "vendor", label: "Vendor", icon: UserPlus, color: "text-teal-500" },
  { value: "super_admin", label: "Super Admin", icon: Shield, color: "text-rose-500" },
];

function CreateUserPage() {
  const { user } = useAuth();
  const [schools, setSchools] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedRole, setSelectedRole] = useState<string>("school_admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [branchId, setBranchId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Reset branch when school changes
    setBranchId("");
    // Load branches for selected school
    if (schoolId) {
      (supabase as any)
        .from("branches")
        .select("id, name")
        .eq("school_id", schoolId)
        .order("name")
        .then((res: any) => {
          if (!res.error) setBranches(res.data || []);
        });
    } else {
      setBranches([]);
    }
  }, [schoolId]);

  async function loadData() {
    setLoading(true);
    const { data: schoolsData, error: schoolsError } = await (supabase as any)
      .from("schools")
      .select("id, name")
      .order("name");

    if (schoolsError) {
      toast.error(`Failed to load schools: ${schoolsError.message}`);
    } else {
      setSchools(schoolsData || []);
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) { toast.error("Email and password are required"); return; }
    if (password.length < 6) { toast.error("Password must be 6+ chars"); return; }
    if (!selectedRole) { toast.error("Please select a role"); return; }

    setSubmitting(true);

    const body: any = {
      email: email.trim(),
      password,
      role: selectedRole,
      tenant_role: selectedRole,
      is_primary: true,
    };

    if (name.trim()) {
      body.meta = { name: name.trim() };
    }

    if (schoolId) {
      body.school_id = schoolId;
    }

    if (branchId) {
      body.branch_id = branchId;
    }

    const res = await supabase.functions.invoke("create-user", {
      body,
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
        } catch { /* ignore */ }
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

    toast.success(
      `${ROLE_OPTIONS.find(r => r.value === selectedRole)?.label || selectedRole} created successfully!`
    );
    setEmail("");
    setPassword("");
    setName("");
    setSubmitting(false);
  }

  if (user?.role !== "super_admin") {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">Super Admin access only.</p>
      </div>
    );
  }

  // Roles that require a school assignment
  const requiresSchool = ["school_admin", "branch_admin", "teacher", "student"];
  // Roles that require a branch assignment
  const requiresBranch = ["branch_admin", "teacher", "student"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Create User</h1>
        <p className="text-sm text-muted-foreground">
          Create any user type across the system
        </p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-6">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-6">

              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">User Role</Label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLE_OPTIONS.map(({ value, label, icon: Icon, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setSelectedRole(value);
                        // Auto-clear branch/school if role doesn't need them
                        if (!requiresSchool.includes(value)) {
                          setSchoolId("");
                          setBranchId("");
                        }
                        if (!requiresBranch.includes(value)) {
                          setBranchId("");
                        }
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        selectedRole === value
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-input hover:border-muted-foreground/30"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${color}`} />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="user-email">Email *</Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="user@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="user-password">Password *</Label>
                <Input
                  id="user-password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Required for login access</p>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="user-name">Display Name</Label>
                <Input
                  id="user-name"
                  placeholder="Full name (optional)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              {/* School (for school-bound roles) */}
              {requiresSchool.includes(selectedRole) && (
                <div className="space-y-2">
                  <Label htmlFor="user-school" className="flex items-center gap-2">
                    <School className="h-4 w-4" />
                    School
                  </Label>
                  <select
                    id="user-school"
                    value={schoolId}
                    onChange={e => setSchoolId(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a school</option>
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Required for {ROLE_OPTIONS.find(r => r.value === selectedRole)?.label} users
                  </p>
                </div>
              )}

              {/* Branch (for branch-bound roles) */}
              {requiresBranch.includes(selectedRole) && schoolId && (
                <div className="space-y-2">
                  <Label htmlFor="user-branch" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Branch
                  </Label>
                  <select
                    id="user-branch"
                    value={branchId}
                    onChange={e => setBranchId(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a branch</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Required for {ROLE_OPTIONS.find(r => r.value === selectedRole)?.label} users
                  </p>
                </div>
              )}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                Create {ROLE_OPTIONS.find(r => r.value === selectedRole)?.label || "User"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-2">Super Admin Powers</h3>
          <p className="text-xs text-muted-foreground">
            As a Super Admin, you can create users of any role type across the entire system.
            Assign users to specific schools and branches to control their access scope.
          </p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-rose-500" /> Create School Admins (manage a school)
            </li>
            <li className="flex items-center gap-1.5">
              <Building2 className="h-3 w-3 text-orange-500" /> Create Branch Admins (manage a branch)
            </li>
            <li className="flex items-center gap-1.5">
              <Users className="h-3 w-3 text-blue-500" /> Create Teachers (across any school/branch)
            </li>
            <li className="flex items-center gap-1.5">
              <GraduationCap className="h-3 w-3 text-green-500" /> Create Students (in any class)
            </li>
            <li className="flex items-center gap-1.5">
              <UserPlus className="h-3 w-3 text-teal-500" /> Create Vendors (system-wide)
            </li>
            <li className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-rose-500" /> Create other Super Admins
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}