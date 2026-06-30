import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { useState } from "react";
import { GraduationCap, ScanLine, Shield, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Login — Student Rewards App" },
      { name: "description", content: "Sign in to access the Student Rewards system" },
    ],
  }),
});

function LoginPage() {
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("That doesn't look like a valid email address."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setLoading(true);
    try {
      await login(email, password);
      // Auth state change listener will handle role detection and redirect happens in _authenticated or index
      navigate({ to: "/" });
    } catch (err: any) {
      const raw = err?.message || "Login failed";
      const friendly = /invalid login/i.test(raw)
        ? "Incorrect email or password."
        : /email not confirmed/i.test(raw)
        ? "Please confirm your email before signing in."
        : raw;
      setError(friendly);
      toast.error("Login failed", { description: friendly });
    } finally {
      setLoading(false);
    }
  };

  const roleInfo = [
    { label: "Admin", desc: "Manage school & configure rules", icon: Shield, color: "accent" },
    { label: "Teacher", desc: "Scan QR & assign points", icon: ScanLine, color: "primary" },
    { label: "Student", desc: "View points & redeem rewards", icon: GraduationCap, color: "secondary" },
    { label: "Parent", desc: "Track child's progress & message teachers", icon: Users, color: "muted" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-3xl font-black text-foreground mb-2">Student Rewards</h1>
        <p className="text-muted-foreground mb-8">Sign in to get started</p>

        <form onSubmit={handleLogin} className="space-y-4 text-left mb-8">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@school.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="text-right">
            <Link to={"/forgot-password" as any} className="text-xs font-bold text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-left">
          <p className="text-xs text-muted-foreground mb-3 text-center">Available roles</p>
          <div className="grid grid-cols-2 gap-2">
            {roleInfo.map(({ label, desc, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl border border-border bg-card/50 p-3">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-xs font-bold text-card-foreground">{label}</div>
                  <div className="text-[10px] text-muted-foreground">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">Question ! 0331-897-2780 <br />
          Admin creates accounts for teachers, students, and parents
        </p>
      </div>
    </div>
  );
}
