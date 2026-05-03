import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({
    meta: [
      { title: "Forgot password — StarPoints" },
      { name: "description", content: "Reset your StarPoints account password." },
    ],
  }),
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Reset link sent — check your email.");
    } catch (err: any) {
      toast.error(err.message || "Could not send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 px-5 py-10">
      <div className="mx-auto max-w-md">
        <Link to="/login" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>

        <div className="mt-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-2xl shadow-lg shadow-primary/30">
            🔑
          </div>
          <h1 className="mt-4 text-3xl font-black text-foreground">Forgot password?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <Card className="mt-6 border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-primary/10">
          <CardContent className="p-6">
            {sent ? (
              <div className="space-y-4 text-center">
                <div className="text-4xl">📧</div>
                <p className="text-sm text-foreground">
                  If an account exists for <strong>{email}</strong>, a reset link has been sent.
                </p>
                <p className="text-xs text-muted-foreground">
                  Check your inbox (and spam) and follow the link to set a new password.
                </p>
                <Link to="/login">
                  <Button variant="outline" className="rounded-full font-bold">Back to login</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" />
                </div>
                <Button type="submit" className="w-full rounded-full font-bold" disabled={loading}>
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Works for school admins, branch admins, teachers, parents, and students.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}