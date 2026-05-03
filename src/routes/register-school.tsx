import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/register-school")({
  component: RegisterSchool,
  head: () => ({
    meta: [
      { title: "Register your school — StarPoints" },
      { name: "description", content: "Create your StarPoints school admin account in seconds." },
    ],
  }),
});

function RegisterSchool() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    school_name: "",
    contact_person: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("register-school", {
        body: form,
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);

      toast.success("School registered! Signing you in...");

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (signInError) {
        toast.error("Account created. Please log in.");
        navigate({ to: "/login" });
        return;
      }
      navigate({ to: "/school-admin/dashboard" as any });
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
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
            ✨
          </div>
          <h1 className="mt-4 text-3xl font-black text-foreground">Register your school</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your StarPoints school admin account.
          </p>
        </div>

        <Card className="mt-6 border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-primary/10">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school_name">School name</Label>
                <Input id="school_name" required value={form.school_name} onChange={(e) => update("school_name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact person</Label>
                <Input id="contact_person" required value={form.contact_person} onChange={(e) => update("contact_person", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" required value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required minLength={8} value={form.password} onChange={(e) => update("password", e.target.value)} />
                <p className="text-xs text-muted-foreground">At least 8 characters.</p>
              </div>
              <Button type="submit" className="w-full rounded-full font-bold" disabled={loading}>
                {loading ? "Creating..." : "Create school account"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
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