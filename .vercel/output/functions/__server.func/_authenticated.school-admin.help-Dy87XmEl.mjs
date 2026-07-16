import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./_ssr/router-OBc8LoFd.mjs";
import { B as Badge } from "./_ssr/badge-jnHTbLud.mjs";
import "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { o as CircleQuestionMark, j as LayoutDashboard, B as Building2, s as UserPlus, p as UserCog, U as Users, G as GraduationCap, h as Gift, v as BookOpen, y as CircleCheck } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/radix-ui__react-avatar.mjs";
import "./_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "./_libs/use-sync-external-store.mjs";
const sections = [{
  id: "dashboard",
  title: "Dashboard",
  icon: LayoutDashboard,
  intro: "The first screen you see. It gives a quick overview of your whole school: number of branches, teachers, students, and rewards available.",
  steps: ["Open the app and sign in with your School Admin email and password.", "You land on the Dashboard automatically.", "Use the cards to see live counts. Tap the bottom navigation to jump into any area."],
  tips: ["Counts update in real time as you add branches, teachers, students, or rewards.", "If a count looks wrong, pull down to refresh or open that section to verify."],
  screenshot: "/help/school-admin/dashboard.png"
}, {
  id: "branches",
  title: "Branches",
  icon: Building2,
  intro: "Branches are the physical campuses of your school. Every teacher and student belongs to one branch.",
  steps: ["Tap Branches in the bottom navigation.", "Tap Add Branch and fill in the branch name and (optional) location.", "Save to create the branch — it becomes available everywhere immediately.", "Tap a branch to edit its name or remove it."],
  tips: ["Create branches before adding teachers and students so you can assign them properly.", "Removing a branch will fail if it still has teachers or students — move them first."]
}, {
  id: "assign",
  title: "Assign Branch Admin",
  icon: UserPlus,
  intro: "Branch Admins manage day-to-day operations for a single branch (classes, point rules, badges, houses, rewards).",
  steps: ["Tap Assign in the bottom navigation.", "Pick the branch you want to assign an admin to.", "Enter the new admin's name, email, and a temporary password.", "Tap Create — the user is invited and instantly receives Branch Admin access."],
  tips: ["Each branch should have at least one Branch Admin.", "Share the temporary password securely; the admin can change it from their Profile screen."]
}, {
  id: "branch-admins",
  title: "Branch Admins",
  icon: UserCog,
  intro: "View and manage every Branch Admin across your school.",
  steps: ["Tap Admins in the bottom navigation.", "Browse the list — each row shows the admin's name, email, and assigned branch.", "Tap an admin to edit their email/password, or remove them from the school."],
  tips: ["Removing a Branch Admin does not delete the branch or its data — it only revokes access."]
}, {
  id: "teachers",
  title: "Teachers",
  icon: Users,
  intro: "Read-only view of every teacher across all branches.",
  steps: ["Tap Teachers in the bottom navigation.", "Use the branch filter at the top to narrow the list to a specific campus.", "Tap a teacher to see their classes, subjects, and recent point activity."],
  tips: ["To add or remove teachers, ask the relevant Branch Admin — School Admins oversee, Branch Admins create."]
}, {
  id: "students",
  title: "Students",
  icon: GraduationCap,
  intro: "Read-only view of every student across all branches, with totals and house assignments.",
  steps: ["Tap Students in the bottom navigation.", "Filter by branch or class to find a specific student.", "Tap a student to see their points, badges, and reward redemptions."]
}, {
  id: "rewards",
  title: "Rewards",
  icon: Gift,
  intro: "Set up the catalog of rewards students can redeem with their points (e.g. stickers, homework passes, treats).",
  steps: ["Tap Rewards in the bottom navigation.", "Tap Add Reward, give it a name, point cost, and optional emoji/image.", "Save — it appears in every student's reward shop immediately.", "Tap any reward to edit its cost or remove it."],
  tips: ["Keep low-cost rewards for daily wins and high-cost rewards for big milestones — students stay motivated."]
}, {
  id: "profile",
  title: "Your Profile & Sign Out",
  icon: BookOpen,
  intro: "Manage your own account credentials.",
  steps: ["Your email shows in the top-right of the header.", "Tap the logout icon (arrow) next to it to sign out.", "To change your password, use Forgot Password from the login screen."]
}];
function SchoolAdminHelp() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "User Manual" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "A walkthrough of every screen in the School Admin app, with screenshots and step-by-step guidance." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2 border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-bold", children: "Jump to a section" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "grid grid-cols-2 gap-2", children: sections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `#${s.id}`, className: "flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2 text-xs font-semibold text-foreground hover:bg-primary/10 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-3.5 w-3.5 text-primary" }),
        s.title
      ] }, s.id)) })
    ] }),
    sections.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { id: s.id, className: "border-0 shadow-sm scroll-mt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px]", children: [
          "Step ",
          idx + 1
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg font-black", children: s.title })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: s.intro }),
        s.screenshot && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border-2 border-border overflow-hidden bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.screenshot, alt: `${s.title} screen`, className: "w-full h-auto block", loading: "lazy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 text-[10px] text-muted-foreground bg-card border-t", children: [
            "Screenshot — ",
            s.title
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold text-foreground mb-2 uppercase tracking-wide", children: "How to use it" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-2", children: s.steps.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-sm text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-black text-primary", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "leading-relaxed", children: step })
          ] }, i)) })
        ] }),
        s.tips && s.tips.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-accent/10 border border-accent/20 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-bold text-accent mb-2 uppercase tracking-wide flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
            " Tips"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: s.tips.map((tip, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs text-foreground/80 leading-relaxed", children: [
            "• ",
            tip
          ] }, i)) })
        ] })
      ] })
    ] }, s.id)),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-secondary/30 bg-secondary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "Need more help?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
        "Call ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "0331-897-2780" }),
        " for support."
      ] })
    ] }) })
  ] });
}
export {
  SchoolAdminHelp as component
};
