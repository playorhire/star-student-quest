import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  LayoutDashboard, GraduationCap, Users, Users2, BookOpen, Home,
  Gift, Medal, HelpCircle, CheckCircle2,
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
    title: "Dashboard",
    icon: LayoutDashboard,
    intro: "Your branch overview — total students, teachers, classes, houses, and recent point activity for your campus.",
    steps: [
      "Sign in and you land on the Dashboard.",
      "Review the live counts for your branch at a glance.",
      "Use the bottom navigation to jump into any area.",
    ],
    tips: ["Numbers refresh in real time as your teachers award points."],
  },
  {
    id: "students",
    title: "Students",
    icon: GraduationCap,
    intro: "Add, edit, and manage every student in your branch.",
    steps: [
      "Tap Students in the bottom navigation.",
      "Tap Add Student, fill in name, class, house, and (optional) avatar.",
      "Save — the student appears on the leaderboard immediately.",
      "Tap a student to edit their details, change class/house, or remove them.",
    ],
    tips: ["Assign each student to a house so house leaderboards work correctly."],
  },
  {
    id: "teachers",
    title: "Teachers",
    icon: Users,
    intro: "Invite teachers to your branch and manage their access.",
    steps: [
      "Tap Teachers in the bottom navigation.",
      "Tap Add Teacher and enter name, email, and a temporary password.",
      "Pick the subjects/classes they teach.",
      "Save — they can sign in immediately.",
    ],
    tips: ["Share temporary passwords securely; teachers can change them later."],
  },
  {
    id: "parents",
    title: "Parents",
    icon: Users2,
    intro: "Invite parents and link them to their children so they can follow progress.",
    steps: [
      "Tap Parents in the bottom navigation.",
      "Tap Add Parent and enter their details.",
      "Link one or more students to that parent.",
    ],
  },
  {
    id: "classes",
    title: "Classes",
    icon: BookOpen,
    intro: "Set up the classes/sections in your branch (e.g. Grade 5-A).",
    steps: [
      "Tap Classes in the bottom navigation.",
      "Tap Add Class, enter name and grade level.",
      "Save — students and teachers can now be assigned to it.",
    ],
  },
  {
    id: "houses",
    title: "Houses",
    icon: Home,
    intro: "Create the houses students compete in (e.g. Red, Blue, Green, Gold).",
    steps: [
      "Tap Houses in the bottom navigation.",
      "Tap Add House, give it a name and color.",
      "Save — assign students to houses from the Students screen.",
    ],
    tips: ["House totals are the sum of every member's points — a fair team competition."],
  },
  {
    id: "rewards",
    title: "Rewards",
    icon: Gift,
    intro: "Customize the reward catalog for your branch (in addition to school-wide rewards).",
    steps: [
      "Tap Rewards in the bottom navigation.",
      "Tap Add Reward, set name, point cost, and emoji/image.",
      "Save — it appears in every student's reward shop.",
    ],
  },
  {
    id: "badges",
    title: "Badges",
    icon: Medal,
    intro: "Define achievement badges students unlock automatically (e.g. 100 points, 5 perfect days).",
    steps: [
      "Tap Badges in the bottom navigation.",
      "Tap Add Badge and pick the criteria (point thresholds, streaks, etc.).",
      "Save — students earn it the moment they qualify.",
    ],
  },
];

export const Route = createFileRoute("/_authenticated/branch-admin/help")({
  component: BranchAdminHelp,
});

function BranchAdminHelp() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-black text-foreground">User Manual</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Step-by-step guide for every screen in the Branch Admin app.
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
          <p className="text-sm font-bold text-foreground">Need more help?</p>
          <p className="text-xs text-muted-foreground mt-1">
            Call <span className="font-semibold text-foreground">0331-897-2780</span> for support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
