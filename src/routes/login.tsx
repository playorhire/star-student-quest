import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import type { Role } from "../lib/mock-data";
import { GraduationCap, ScanLine, Shield } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Login — Student Rewards App" },
      { name: "description", content: "Choose your role to get started" },
    ],
  }),
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: Role) => {
    login(role);
    if (role === "admin") navigate({ to: "/admin/dashboard" });
    else if (role === "teacher") navigate({ to: "/teacher/dashboard" });
    else navigate({ to: "/student/dashboard" });
  };

  const roles = [
    { role: "admin" as Role, label: "Admin", desc: "Manage school & configure rules", icon: Shield, color: "accent" },
    { role: "teacher" as Role, label: "Teacher", desc: "Scan QR & assign points", icon: ScanLine, color: "primary" },
    { role: "student" as Role, label: "Student", desc: "View points & redeem rewards", icon: GraduationCap, color: "secondary" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-3xl font-black text-foreground mb-2">Student Rewards</h1>
        <p className="text-muted-foreground mb-10">Choose your role to get started</p>
        <div className="grid gap-4">
          {roles.map(({ role, label, desc, icon: Icon, color }) => (
            <button
              key={role}
              onClick={() => handleLogin(role)}
              className={`flex items-center gap-4 rounded-2xl border-2 border-${color}/20 bg-card p-6 text-left transition-all hover:border-${color} hover:shadow-lg hover:-translate-y-1`}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-${color}/10`}>
                <Icon className={`h-7 w-7 text-${color}`} />
              </div>
              <div>
                <div className="font-bold text-lg text-card-foreground">{label}</div>
                <div className="text-sm text-muted-foreground">{desc}</div>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-8 text-xs text-muted-foreground">Demo mode — uses mock data</p>
      </div>
    </div>
  );
}
