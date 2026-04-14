import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") navigate({ to: "/admin/dashboard" });
      else if (user.role === "teacher") navigate({ to: "/teacher/dashboard" });
      else navigate({ to: "/student/dashboard" });
    } else {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, user, navigate]);

  return null;
}
