import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-context";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated && user) {
    if (user.role === "teacher") {
      navigate({ to: "/teacher/dashboard" });
    } else {
      navigate({ to: "/student/dashboard" });
    }
    return null;
  }

  navigate({ to: "/login" });
  return null;
}
