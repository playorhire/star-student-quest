import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./_ssr/router-OBc8LoFd.mjs";
import { B as Badge } from "./_ssr/badge-jnHTbLud.mjs";
import "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { o as CircleQuestionMark, j as LayoutDashboard, G as GraduationCap, n as Award, M as MessageSquare, H as History, h as Gift, t as Bell, m as User, y as CircleCheck } from "./_libs/lucide-react.mjs";
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
  intro: "Your daily teaching overview — your classes, top students, and recent points you've awarded.",
  steps: ["Sign in to land on the Dashboard.", "Tap any class or student card to drill in."]
}, {
  id: "students",
  title: "Students",
  icon: GraduationCap,
  intro: "Browse all students in the classes you teach.",
  steps: ["Tap Students in the bottom navigation.", "Use the class filter to focus on one section.", "Tap a student to view their points, badges, and history."]
}, {
  id: "assign",
  title: "Assign Points",
  icon: Award,
  intro: "The fastest way to reward a student — scan their QR code or pick from the list.",
  steps: ["Tap Assign in the bottom navigation.", "Either scan the student's QR badge with your camera, or pick the student from the list.", "Choose the subject and enter the marks/score the student earned.", "Tap Award — points are calculated and credited instantly."],
  tips: ["Points are auto-calculated from marks based on rules set by your Branch Admin.", "Every award sends an in-app notification to the student and their parent."]
}, {
  id: "messages",
  title: "Messages",
  icon: MessageSquare,
  intro: "Direct chat with parents and (where allowed) students.",
  steps: ["Tap Messages in the bottom navigation.", "Tap a conversation to reply, or tap New Message to start one."],
  tips: ["Unread messages show a red badge on the Messages icon."]
}, {
  id: "history",
  title: "History",
  icon: History,
  intro: "A scrollable log of every point award you've made (last 50).",
  steps: ["Tap History in the bottom navigation.", "Each row shows student, subject, marks entered, and points awarded."]
}, {
  id: "rewards",
  title: "Rewards",
  icon: Gift,
  intro: "View the reward catalog students can redeem with their points.",
  steps: ["Tap Rewards in the bottom navigation.", "Browse the rewards available in your branch."]
}, {
  id: "notifications",
  title: "Notifications",
  icon: Bell,
  intro: "All in-app alerts — replies from parents, new students added to your class, etc.",
  steps: ["Tap the bell icon in the top-right header.", "Tap any notification to jump to the related screen."]
}, {
  id: "profile",
  title: "Profile",
  icon: User,
  intro: "Update your name, photo, and password.",
  steps: ["Tap Profile in the bottom navigation.", "Edit any field and tap Save."]
}];
function TeacherHelp() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "User Manual" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Step-by-step guide for every screen in the Teacher app." })
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
  TeacherHelp as component
};
