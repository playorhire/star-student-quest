import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import type { Role } from "../lib/mock-data";
import { GraduationCap, ScanLine } from "lucide-react";

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
    if (role === "teacher") {
      navigate({ to: "/teacher/dashboard" });
    } else {
      navigate({ to: "/student/dashboard" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-3xl font-black text-foreground mb-2">Student Rewards</h1>
        <p className="text-muted-foreground mb-10">Choose your role to get started</p>

        <div className="grid gap-4">
          <button
            onClick={() => handleLogin("teacher")}
            className="flex items-center gap-4 rounded-2xl border-2 border-primary/20 bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <ScanLine className="h-7 w-7 text-primary" />
            </div>
            <div>
              <div className="font-bold text-lg text-card-foreground">Teacher</div>
              <div className="text-sm text-muted-foreground">Scan QR & assign points</div>
            </div>
          </button>

          <button
            onClick={() => handleLogin("student")}
            className="flex items-center gap-4 rounded-2xl border-2 border-secondary/20 bg-card p-6 text-left transition-all hover:border-secondary hover:shadow-lg hover:shadow-secondary/10 hover:-translate-y-1"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
              <GraduationCap className="h-7 w-7 text-secondary" />
            </div>
            <div>
              <div className="font-bold text-lg text-card-foreground">Student</div>
              <div className="text-sm text-muted-foreground">View points & redeem rewards</div>
            </div>
          </button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Demo mode — uses mock data
        </p>
      </div>
    </div>
  );
}
