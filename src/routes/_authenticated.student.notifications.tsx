import { createFileRoute } from "@tanstack/react-router";
import { NotificationsList } from "@/components/NotificationsList";

export const Route = createFileRoute("/_authenticated/student/notifications")({
  component: NotificationsList,
});