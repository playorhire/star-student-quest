import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  LayoutDashboard, GraduationCap, Award, MessageSquare, History,
  Gift, User, Bell, HelpCircle, CheckCircle2,
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
    intro: "Your daily teaching overview — your classes, top students, and recent points you've awarded.",
    steps: [
      "Sign in to land on the Dashboard.",
      "Tap any class or student card to drill in.",
    ],
  },
  {
    id: "students",
    title: "Students",
    icon: GraduationCap,
    intro: "Browse all students in the classes you teach.",
    steps: [
      "Tap Students in the bottom navigation.",
      "Use the class filter to focus on one section.",
      "Tap a student to view their points, badges, and history.",
    ],
  },
  {
    id: "assign",
    title: "Assign Points",
    icon: Award,
    intro: "The fastest way to reward a student — scan their QR code or pick from the list.",
    steps: [
      "Tap Assign in the bottom navigation.",
      "Either scan the student's QR badge with your camera, or pick the student from the list.",
      "Choose the subject and enter the marks/score the student earned.",
      "Tap Award — points are calculated and credited instantly.",
    ],
    tips: [
      "Points are auto-calculated from marks based on rules set by your Branch Admin.",
      "Every award sends an in-app notification to the student and their parent.",
    ],
  },
  {
    id: "messages",
    title: "Messages",
    icon: MessageSquare,
    intro: "Direct chat with parents and (where allowed) students.",
    steps: [
      "Tap Messages in the bottom navigation.",
      "Tap a conversation to reply, or tap New Message to start one.",
    ],
    tips: ["Unread messages show a red badge on the Messages icon."],
  },
  {
    id: "history",
    title: "History",
    icon: History,
    intro: "A scrollable log of every point award you've made (last 50).",
    steps: [
      "Tap History in the bottom navigation.",
      "Each row shows student, subject, marks entered, and points awarded.",
    ],
  },
  {
    id: "rewards",
    title: "Rewards",
    icon: Gift,
    intro: "View the reward catalog students can redeem with their points.",
    steps: [
      "Tap Rewards in the bottom navigation.",
      "Browse the rewards available in your branch.",
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    intro: "All in-app alerts — replies from parents, new students added to your class, etc.",
    steps: [
      "Tap the bell icon in the top-right header.",
      "Tap any notification to jump to the related screen.",
    ],
  },
  {
    id: "profile",
    title: "Profile",
    icon: User,
    intro: "Update your name, photo, and password.",
    steps: [
      "Tap Profile in the bottom navigation.",
      "Edit any field and tap Save.",
    ],
  },
];

export const Route = createFileRoute("/_authenticated/teacher/help")({
  component: TeacherHelp,
});

function TeacherHelp() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-black text-foreground">User Manual</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Step-by-step guide for every screen in the Teacher app.
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
