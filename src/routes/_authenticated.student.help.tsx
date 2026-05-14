import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  LayoutDashboard, QrCode, History, Gift, Bell, Award,
  HelpCircle, CheckCircle2,
} from "lucide-react";

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  intro: string;
  steps: string[];
  tips?: string[];
}

const sections: Section[] = [
  {
    id: "dashboard",
    title: "Home",
    icon: LayoutDashboard,
    intro: "Your home screen — see your total points, your house standing, badges you've earned, and recent rewards.",
    steps: [
      "Sign in to land on Home.",
      "Your point total is at the top — watch it grow each time a teacher rewards you!",
    ],
  },
  {
    id: "qr",
    title: "My QR",
    icon: QrCode,
    intro: "Your personal QR badge. Show it to a teacher and they can award you points instantly.",
    steps: [
      "Tap My QR in the bottom navigation.",
      "Show the screen to your teacher when they're ready to award points.",
      "Hold steady — they'll scan it with their phone.",
    ],
    tips: ["Brightness up makes it scan faster!"],
  },
  {
    id: "history",
    title: "History",
    icon: History,
    intro: "A list of every reward you've earned — when, which teacher, and which subject.",
    steps: [
      "Tap History in the bottom navigation.",
      "Scroll to see your latest awards first.",
    ],
  },
  {
    id: "rewards",
    title: "Rewards",
    icon: Gift,
    intro: "Spend your points on real rewards — stickers, treats, homework passes, and more.",
    steps: [
      "Tap Rewards in the bottom navigation.",
      "Browse what's available in your school.",
      "Tap Redeem on any reward you have enough points for.",
      "Show the confirmation to your teacher to claim it.",
    ],
    tips: ["Save up for big rewards or grab small ones often — your choice!"],
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    intro: "Alerts when you earn points, unlock a badge, or your reward is ready.",
    steps: [
      "Tap the bell icon in the top-right.",
      "Tap any notification to see the details.",
    ],
  },
  {
    id: "badges",
    title: "Badges & Houses",
    icon: Award,
    intro: "Badges are achievements you unlock automatically. Your house wins when everyone earns points together.",
    steps: [
      "See your badges on the Home screen.",
      "Check the house leaderboard to see how your team is doing.",
    ],
    tips: ["Help your house win — every point you earn counts for your team too."],
  },
];

export const Route = createFileRoute("/_authenticated/student/help")({
  component: StudentHelp,
});

function StudentHelp() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-black text-foreground">How to Use the App</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          A quick guide to everything you can do.
        </p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Jump to a section</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2 text-xs font-semibold text-foreground hover:bg-primary/10 transition-colors">
              <s.icon className="h-3.5 w-3.5 text-primary" />
              {s.title}
            </a>
          ))}
        </CardContent>
      </Card>

      {sections.map((s, idx) => (
        <Card key={s.id} id={s.id} className="border-0 shadow-sm scroll-mt-20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">Step {idx + 1}</Badge>
              <s.icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-black">{s.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{s.intro}</p>
            <div>
              <h3 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">How to use it</h3>
              <ol className="space-y-2">
                {s.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black text-primary">{i + 1}</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            {s.tips && s.tips.length > 0 && (
              <div className="rounded-xl bg-accent/10 border border-accent/20 p-3">
                <h3 className="text-xs font-bold text-accent mb-2 uppercase tracking-wide flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Tips
                </h3>
                <ul className="space-y-1">
                  {s.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-foreground/80 leading-relaxed">• {tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Card className="border-2 border-secondary/30 bg-secondary/5">
        <CardContent className="p-4 text-center">
          <p className="text-sm font-bold text-foreground">Stuck?</p>
          <p className="text-xs text-muted-foreground mt-1">
            Ask your teacher, or call <span className="font-semibold text-foreground">0331-897-2780</span>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
