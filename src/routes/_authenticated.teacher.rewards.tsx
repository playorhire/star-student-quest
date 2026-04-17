import { createFileRoute } from "@tanstack/react-router";
import { RewardsManager } from "@/components/RewardsManager";

export const Route = createFileRoute("/_authenticated/teacher/rewards")({
  component: TeacherRewards,
});

function TeacherRewards() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Rewards</h1>
        <p className="text-sm text-muted-foreground">Add, edit, and set points for rewards</p>
      </div>
      <RewardsManager />
    </div>
  );
}
