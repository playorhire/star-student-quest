import { createFileRoute } from "@tanstack/react-router";
import { BadgesManager } from "@/components/BadgesManager";

export const Route = createFileRoute("/_authenticated/admin/badges")({
  component: AdminBadges,
});

function AdminBadges() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Badges</h1>
        <p className="text-sm text-muted-foreground">Create and edit badge milestones students can earn</p>
      </div>
      <BadgesManager />
    </div>
  );
}
