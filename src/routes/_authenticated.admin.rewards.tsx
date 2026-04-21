import { createFileRoute } from "@tanstack/react-router";
import { RewardsManager } from "@/components/RewardsManager";
import { BadgesManager } from "@/components/BadgesManager";

export const Route = createFileRoute("/_authenticated/admin/rewards")({
  component: AdminRewards,
});

function AdminRewards() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Rewards</h1>
        <p className="text-sm text-muted-foreground">Manage rewards and badge milestones students can earn</p>
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">Badges Earned</h2>
        <p className="text-sm text-muted-foreground">Create and edit badge thresholds shown on student dashboard</p>
        <BadgesManager />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">Rewards Shop</h2>
        <p className="text-sm text-muted-foreground">Add, edit, and set points for rewards</p>
        <RewardsManager />
      </div>
    </div>
  );
}
