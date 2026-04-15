import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated && user) {
      if (user.role === "admin") navigate({ to: "/admin/dashboard" });
      else if (user.role === "teacher") navigate({ to: "/teacher/dashboard" });
      else if (user.role === "parent") navigate({ to: "/parent/dashboard" });
      else navigate({ to: "/student/dashboard" });
    } else {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, user, loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-4xl animate-bounce">🎓</div>
    </div>
  );
}
