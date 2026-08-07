import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/student-signup")({
  component: StudentSignup,
  head: () => ({
    meta: [
      { title: "Student sign up — StarPoints" },
      { name: "description", content: "Create your student account and join your school." },
    ],
  }),
});

function StudentSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    school_id: "",
    branch_id: "",
    class_id: "",
    roll_number: "",
    section: "A",
    use_custom_school: false,
    custom_school_name: "",
    custom_school_address: "",
    custom_branch_name: "",
    custom_class_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([]);
  const [branches, setBranches] = useState<Array<{ id: string; name: string }>>([]);
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [schoolLoading, setSchoolLoading] = useState(true);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);

  useEffect(() => {
    async function loadSchools() {
      const { data, error } = await supabase.functions.invoke("public-school-data", {
        body: { action: "schools" },
      });

      if (error || (data as any)?.error) {
        toast.error("Unable to load schools. Please refresh the page.");
        setSchools([]);
      } else {
        setSchools((data as any)?.schools || []);
      }
      setSchoolLoading(false);
    }

    loadSchools();
  }, []);

  useEffect(() => {
    setBranches([]);
    setForm((f) => ({ ...f, branch_id: "", class_id: "" }));

    if (!form.school_id) {
      return;
    }

    async function loadBranches() {
      setBranchesLoading(true);

      const branchesResponse = await supabase.functions.invoke("public-school-data", {
        body: { action: "branches", school_id: form.school_id },
      });

      const branchesData = branchesResponse.data as any;

      if (branchesResponse.error || branchesData?.error) {
        toast.error("Unable to load branches for the selected school.");
        setBranches([]);
      } else {
        setBranches(branchesData?.branches || []);
      }

      setBranchesLoading(false);
    }

    loadBranches();
  }, [form.school_id]);

  useEffect(() => {
    setClasses([]);
    setForm((f) => ({ ...f, class_id: "" }));

    if (!form.school_id || !form.branch_id) {
      return;
    }

    async function loadClasses() {
      setClassesLoading(true);

      const classesResponse = await supabase.functions.invoke("public-school-data", {
        body: { action: "classes", school_id: form.school_id, branch_id: form.branch_id },
      });

      const classesData = classesResponse.data as any;

      if (classesResponse.error || classesData?.error) {
        toast.error("Unable to load classes for the selected branch.");
        setClasses([]);
      } else {
        setClasses(classesData?.classes || []);
      }

      setClassesLoading(false);
    }

    loadClasses();
  }, [form.school_id, form.branch_id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
        const isCustomSchool = form.use_custom_school;
        const payload = {
          ...form,
          // include both snake_case and camelCase aliases to match deployed function expectations
          school_id: isCustomSchool ? "" : form.school_id,
          branch_id: isCustomSchool ? "" : form.branch_id,
          class_id: isCustomSchool ? "" : form.class_id,
          school_name: isCustomSchool ? form.custom_school_name.trim() : schools.find((school) => school.id === form.school_id)?.name || "",
          school: isCustomSchool ? form.custom_school_name.trim() : schools.find((school) => school.id === form.school_id)?.name || "",
          school_address: form.custom_school_address.trim(),
          branch_name: isCustomSchool ? form.custom_branch_name.trim() : branches.find((branch) => branch.id === form.branch_id)?.name || "",
          branch: isCustomSchool ? form.custom_branch_name.trim() : branches.find((branch) => branch.id === form.branch_id)?.name || "",
          class_name: isCustomSchool ? form.custom_class_name.trim() : classes.find((c) => c.id === form.class_id)?.name || "",
          class: isCustomSchool ? form.custom_class_name.trim() : classes.find((c) => c.id === form.class_id)?.name || "",
          create_custom_school: isCustomSchool ? "true" : "false",
          rollNumber: form.roll_number,
        };

        // Client-side required field check to provide clearer feedback
        const missing: string[] = [];
        if (!payload.name) missing.push("Full name");
        if (!payload.email) missing.push("Email");
        if (!payload.password) missing.push("Password");
        if (isCustomSchool) {
          if (!payload.school_name) missing.push("School name");
          if (!payload.branch_name) missing.push("Branch name");
          if (!payload.class_name) missing.push("Class name");
        } else {
          if (!payload.school_id) missing.push("School");
          if (!payload.branch_id) missing.push("Branch");
          if (!payload.class_id) missing.push("Class");
        }
        if (!payload.roll_number) missing.push("Roll number");

        if (missing.length > 0) {
          toast.error(`Please fill: ${missing.join(", ")}`);
          setLoading(false);
          return;
        }

        console.log("student-signup payload:", payload);

        const { data, error } = await supabase.functions.invoke("student-signup", {
          body: payload,
        });

        console.log("student-signup result:", { data, error });

        const message = error instanceof Error ? error.message : (data as any)?.error || "Signup failed";
        if (error || (data as any)?.error) {
          console.error("student-signup error payload:", { data, error });
          throw new Error(message);
        }

      toast.success("Account created! Signing you in...");
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError) {
        toast.error("Account created. Please sign in manually.");
        navigate({ to: "/login" });
        return;
      }

      navigate({ to: "/student/dashboard" as any });
    } catch (err: any) {
      const message = err?.message || "Signup failed";
      toast.error(message.includes("HTTPError") ? "The signup service is unavailable right now. Please try again shortly." : message);
    } finally {
      setLoading(false);
    }
  }

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 px-5 py-10">
      <div className="mx-auto max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="mt-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-2xl shadow-lg shadow-primary/30">
            🎓
          </div>
          <h1 className="mt-4 text-3xl font-black text-foreground">Create student account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join your school and start earning points.</p>
        </div>

        <Card className="mt-6 border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-primary/10">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required minLength={8} value={form.password} onChange={(e) => update("password", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school_id">School</Label>
                <select
                  id="school_id"
                  required={!form.use_custom_school}
                  value={form.use_custom_school ? "custom" : form.school_id}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setForm((f) => ({ ...f, school_id: "", branch_id: "", class_id: "", use_custom_school: true }));
                    } else {
                      setForm((f) => ({ ...f, school_id: e.target.value, branch_id: "", class_id: "", use_custom_school: false }));
                    }
                  }}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="" disabled>
                    {schoolLoading ? "Loading schools..." : "Select a school"}
                  </option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                  <option value="custom">My school is not listed</option>
                </select>
              </div>
              {form.use_custom_school ? (
                <div className="space-y-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
                  <p className="text-sm font-medium text-foreground">We’ll create this school and branch for you.</p>
                  <div className="space-y-2">
                    <Label htmlFor="custom_school_name">School name</Label>
                    <Input id="custom_school_name" required value={form.custom_school_name} onChange={(e) => update("custom_school_name", e.target.value)} placeholder="Enter school name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom_school_address">Address (optional)</Label>
                    <Input id="custom_school_address" value={form.custom_school_address} onChange={(e) => update("custom_school_address", e.target.value)} placeholder="Enter address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom_branch_name">Branch name</Label>
                    <Input id="custom_branch_name" required value={form.custom_branch_name} onChange={(e) => update("custom_branch_name", e.target.value)} placeholder="Enter branch name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom_class_name">Class name</Label>
                    <Input id="custom_class_name" required value={form.custom_class_name} onChange={(e) => update("custom_class_name", e.target.value)} placeholder="Enter class name" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="branch_id">Branch</Label>
                    <select
                      id="branch_id"
                      required
                      value={form.branch_id}
                      onChange={(e) => update("branch_id", e.target.value)}
                      disabled={!form.school_id || branchesLoading}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="" disabled>
                        {!form.school_id
                          ? "Select a school first"
                          : branchesLoading
                          ? "Loading branches..."
                          : branches.length > 0
                          ? "Select a branch"
                          : "No branches found"}
                      </option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class_id">Class</Label>
                    <select
                      id="class_id"
                      required
                      value={form.class_id}
                      onChange={(e) => update("class_id", e.target.value)}
                      disabled={!form.school_id || classesLoading}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="" disabled>
                        {!form.school_id
                          ? "Select a school first"
                          : classesLoading
                          ? "Loading classes..."
                          : classes.length > 0
                          ? "Select a class"
                          : "No classes found"}
                      </option>
                      {classes.map((clazz) => (
                        <option key={clazz.id} value={clazz.id}>
                          {clazz.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="roll_number">Roll number</Label>
                <Input id="roll_number" required value={form.roll_number} onChange={(e) => update("roll_number", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input id="section" value={form.section} onChange={(e) => update("section", e.target.value)} />
              </div>
              <Button type="submit" className="w-full rounded-full font-bold" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
