import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { useState } from "react";
import { GraduationCap, Mail, Phone, ScanLine, Shield, Users } from "lucide-react";
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
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const value = identifier.trim();
    if (!value) { setError(`Please enter your ${method === "email" ? "email" : "mobile number"}.`); return; }
    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setError("That doesn't look like a valid email address."); return; }
    if (method === "phone" && !/^\+[1-9]\d{7,14}$/.test(value)) { setError("Enter your mobile number with country code, for example +923001234567."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setLoading(true);
    try {
      await login(value, password, method);
      // Auth state change listener will handle role detection and redirect happens in _authenticated or index
      navigate({ to: "/" });
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "Login failed";
      const friendly = /invalid login/i.test(raw)
        ? `Incorrect ${method === "email" ? "email" : "mobile number"} or password.`
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
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1" role="group" aria-label="Sign-in method">
            <button type="button" onClick={() => { setMethod("email"); setIdentifier(""); setError(""); }} className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold ${method === "email" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Mail className="h-4 w-4" /> Email
            </button>
            <button type="button" onClick={() => { setMethod("phone"); setIdentifier(""); setError(""); }} className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold ${method === "phone" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Phone className="h-4 w-4" /> Mobile
            </button>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">{method === "email" ? "Email" : "Mobile number"}</label>
            <input
              type={method === "email" ? "email" : "tel"}
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={method === "email" ? "you@school.edu" : "+923001234567"}
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
            {method === "email" && <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">
              Forgot password?
            </Link>}
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
          <Link to="/student-signup" className="mb-4 inline-flex w-full items-center justify-center rounded-xl border border-[#f6b46b] bg-[#f6b46b]/15 px-3 py-2 text-sm font-semibold text-[#9a4f00] transition-colors hover:bg-primary hover:text-white hover:border-primary">
            Create student account
          </Link>
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
