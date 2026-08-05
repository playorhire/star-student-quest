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
    class_id: "",
    roll_number: "",
    section: "A",
  });
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([]);
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [schoolLoading, setSchoolLoading] = useState(true);
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
    if (!form.school_id) {
      setClasses([]);
      setForm((f) => ({ ...f, class_id: "" }));
      return;
    }

    async function loadClasses() {
      setClassesLoading(true);
      const { data, error } = await supabase.functions.invoke("public-school-data", {
        body: { school_id: form.school_id },
      });

      if (error || (data as any)?.error) {
        toast.error("Unable to load classes for the selected school.");
        setClasses([]);
      } else {
        setClasses((data as any)?.classes || []);
      }
      setClassesLoading(false);
    }

    loadClasses();
  }, [form.school_id]);

    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
        const payload = {
          ...form,
          school_name: schools.find((school) => school.id === form.school_id)?.name || "",
        };

        // Client-side required field check to provide clearer feedback
        const missing: string[] = [];
        if (!payload.name) missing.push("Full name");
        if (!payload.email) missing.push("Email");
        if (!payload.password) missing.push("Password");
        if (!payload.school_id) missing.push("School");
        if (!payload.class_id) missing.push("Class");
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
                  required
                  value={form.school_id}
                  onChange={(e) => update("school_id", e.target.value)}
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
