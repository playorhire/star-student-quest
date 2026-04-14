import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { rewards, redemptions, students } from "../../../lib/mock-data";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/_authenticated/_student/rewards")({
  component: StudentRewards,
});

function StudentRewards() {
  const student = students[0];
  const [remainingPoints, setRemainingPoints] = useState(student.totalPoints);
  const [myRedemptions, setMyRedemptions] = useState(
    redemptions.filter((r) => r.studentId === student.id)
  );

  const categories = [...new Set(rewards.map((r) => r.category))];

  const handleRedeem = (reward: (typeof rewards)[0]) => {
    if (remainingPoints < reward.pointCost) return;

    setRemainingPoints((p) => p - reward.pointCost);
    setMyRedemptions((prev) => [
      {
        id: `red-${Date.now()}`,
        studentId: student.id,
        rewardId: reward.id,
        rewardName: reward.name,
        pointsSpent: reward.pointCost,
        status: "pending" as const,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);

    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.7 },
      colors: ["#8b5cf6", "#f97316", "#ec4899"],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Rewards Shop</h1>
        <p className="text-sm text-muted-foreground">Redeem your points for awesome rewards</p>
      </div>

      {/* Points Balance */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-4 text-center">
          <div className="text-sm font-semibold text-muted-foreground">Your Balance</div>
          <div className="text-4xl font-black text-primary">{remainingPoints}</div>
          <div className="text-xs text-muted-foreground">points available</div>
        </CardContent>
      </Card>

      {/* Rewards by Category */}
      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-lg font-bold text-foreground mb-3">{category}</h2>
          <div className="grid grid-cols-2 gap-3">
            {rewards
              .filter((r) => r.category === category)
              .map((reward) => {
                const canAfford = remainingPoints >= reward.pointCost;
                return (
                  <Card key={reward.id} className={`border-0 shadow-sm ${!canAfford ? "opacity-60" : ""}`}>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{reward.emoji}</div>
                      <div className="font-bold text-sm text-card-foreground">{reward.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{reward.description}</div>
                      <div className="mt-2 flex items-center justify-center gap-1">
                        <span className="text-xs">⭐</span>
                        <span className="font-black text-primary text-sm">{reward.pointCost}</span>
                      </div>
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        {reward.stock} left
                      </Badge>
                      <Button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canAfford}
                        className="w-full mt-3 rounded-xl text-xs h-8"
                        size="sm"
                      >
                        {canAfford ? "Redeem" : "Not enough"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}

      {/* My Redemptions */}
      {myRedemptions.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">My Redemptions</h2>
          <div className="space-y-2">
            {myRedemptions.map((red) => (
              <Card key={red.id} className="border-0 shadow-sm">
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-lg">
                    {rewards.find((r) => r.id === red.rewardId)?.emoji || "🎁"}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-card-foreground">{red.rewardName}</div>
                    <div className="text-xs text-muted-foreground">{red.pointsSpent} points</div>
                  </div>
                  <Badge variant={red.status === "fulfilled" ? "default" : "secondary"}>
                    {red.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
