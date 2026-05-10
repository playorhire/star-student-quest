import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  LayoutDashboard, Building2, UserPlus, UserCog, Users, GraduationCap,
  Gift, BookOpen, HelpCircle, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/school-admin/help")({
  component: SchoolAdminHelp,
});

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  intro: string;
  steps: string[];
  tips?: string[];
  screenshot?: string;
}

const sections: Section[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    intro: "The first screen you see. It gives a quick overview of your whole school: number of branches, teachers, students, and rewards available.",
    steps: [
      "Open the app and sign in with your School Admin email and password.",
      "You land on the Dashboard automatically.",
      "Use the cards to see live counts. Tap the bottom navigation to jump into any area.",
    ],
    tips: [
      "Counts update in real time as you add branches, teachers, students, or rewards.",
      "If a count looks wrong, pull down to refresh or open that section to verify.",
    ],
    screenshot: "/help/school-admin/dashboard.png",
  },
  {
    id: "branches",
    title: "Branches",
    icon: Building2,
    intro: "Branches are the physical campuses of your school. Every teacher and student belongs to one branch.",
    steps: [
      "Tap Branches in the bottom navigation.",
      "Tap Add Branch and fill in the branch name and (optional) location.",
      "Save to create the branch — it becomes available everywhere immediately.",
      "Tap a branch to edit its name or remove it.",
    ],
    tips: [
      "Create branches before adding teachers and students so you can assign them properly.",
      "Removing a branch will fail if it still has teachers or students — move them first.",
    ],
  },
  {
    id: "assign",
    title: "Assign Branch Admin",
    icon: UserPlus,
    intro: "Branch Admins manage day-to-day operations for a single branch (classes, point rules, badges, houses, rewards).",
    steps: [
      "Tap Assign in the bottom navigation.",
      "Pick the branch you want to assign an admin to.",
      "Enter the new admin's name, email, and a temporary password.",
      "Tap Create — the user is invited and instantly receives Branch Admin access.",
    ],
    tips: [
      "Each branch should have at least one Branch Admin.",
      "Share the temporary password securely; the admin can change it from their Profile screen.",
    ],
  },
  {
    id: "branch-admins",
    title: "Branch Admins",
    icon: UserCog,
    intro: "View and manage every Branch Admin across your school.",
    steps: [
      "Tap Admins in the bottom navigation.",
      "Browse the list — each row shows the admin's name, email, and assigned branch.",
      "Tap an admin to edit their email/password, or remove them from the school.",
    ],
    tips: [
      "Removing a Branch Admin does not delete the branch or its data — it only revokes access.",
    ],
  },
  {
    id: "teachers",
    title: "Teachers",
    icon: Users,
    intro: "Read-only view of every teacher across all branches.",
    steps: [
      "Tap Teachers in the bottom navigation.",
      "Use the branch filter at the top to narrow the list to a specific campus.",
      "Tap a teacher to see their classes, subjects, and recent point activity.",
    ],
    tips: [
      "To add or remove teachers, ask the relevant Branch Admin — School Admins oversee, Branch Admins create.",
    ],
  },
  {
    id: "students",
    title: "Students",
    icon: GraduationCap,
    intro: "Read-only view of every student across all branches, with totals and house assignments.",
    steps: [
      "Tap Students in the bottom navigation.",
      "Filter by branch or class to find a specific student.",
      "Tap a student to see their points, badges, and reward redemptions.",
    ],
  },
  {
    id: "rewards",
    title: "Rewards",
    icon: Gift,
    intro: "Set up the catalog of rewards students can redeem with their points (e.g. stickers, homework passes, treats).",
    steps: [
      "Tap Rewards in the bottom navigation.",
      "Tap Add Reward, give it a name, point cost, and optional emoji/image.",
      "Save — it appears in every student's reward shop immediately.",
      "Tap any reward to edit its cost or remove it.",
    ],
    tips: [
      "Keep low-cost rewards for daily wins and high-cost rewards for big milestones — students stay motivated.",
    ],
  },
  {
    id: "profile",
    title: "Your Profile & Sign Out",
    icon: BookOpen,
    intro: "Manage your own account credentials.",
    steps: [
      "Your email shows in the top-right of the header.",
      "Tap the logout icon (arrow) next to it to sign out.",
      "To change your password, use Forgot Password from the login screen.",
    ],
  },
];

function SchoolAdminHelp() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-black text-foreground">User Manual</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          A walkthrough of every screen in the School Admin app, with screenshots and step-by-step guidance.
        </p>
      </div>

      {/* Quick index */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Jump to a section</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2 text-xs font-semibold text-foreground hover:bg-primary/10 transition-colors"
            >
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

            {s.screenshot && (
              <div className="rounded-2xl border-2 border-border overflow-hidden bg-muted/30">
                <img
                  src={s.screenshot}
                  alt={`${s.title} screen`}
                  className="w-full h-auto block"
                  loading="lazy"
                />
                <div className="px-3 py-2 text-[10px] text-muted-foreground bg-card border-t">
                  Screenshot — {s.title}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">How to use it</h3>
              <ol className="space-y-2">
                {s.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black text-primary">
                      {i + 1}
                    </span>
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
