import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { s as supabase, C as Card, a as CardContent } from "./_ssr/router-OBc8LoFd.mjs";
import "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { q as School, U as Users, G as GraduationCap, v as BookOpen, Z as Zap } from "./_libs/lucide-react.mjs";
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
function AdminDashboard() {
  const [stats, setStats] = reactExports.useState({
    classes: 0,
    teachers: 0,
    students: 0,
    subjects: 0,
    totalPoints: 0
  });
  const [recentTxns, setRecentTxns] = reactExports.useState([]);
  reactExports.useEffect(() => {
    loadStats();
    loadRecent();
  }, []);
  async function loadStats() {
    const [c, t, s, sub, txns] = await Promise.all([supabase.from("classes").select("id", {
      count: "exact",
      head: true
    }), supabase.from("teachers").select("id", {
      count: "exact",
      head: true
    }), supabase.from("students").select("id", {
      count: "exact",
      head: true
    }), supabase.from("subjects").select("id", {
      count: "exact",
      head: true
    }), supabase.from("point_transactions").select("points_awarded")]);
    const totalPoints = (txns.data || []).reduce((sum, t2) => sum + t2.points_awarded, 0);
    setStats({
      classes: c.count || 0,
      teachers: t.count || 0,
      students: s.count || 0,
      subjects: sub.count || 0,
      totalPoints
    });
  }
  async function loadRecent() {
    const {
      data
    } = await supabase.from("point_transactions").select("id, points_awarded, marks_entered, created_at, students(name), teachers(name), subjects(name)").order("created_at", {
      ascending: false
    }).limit(5);
    setRecentTxns(data || []);
  }
  const statCards = [{
    label: "Classes",
    value: stats.classes,
    icon: School,
    color: "primary"
  }, {
    label: "Teachers",
    value: stats.teachers,
    icon: Users,
    color: "secondary"
  }, {
    label: "Students",
    value: stats.students,
    icon: GraduationCap,
    color: "accent"
  }, {
    label: "Act/Quiz",
    value: stats.subjects,
    icon: BookOpen,
    color: "primary"
  }, {
    label: "Points Given",
    value: stats.totalPoints,
    icon: Zap,
    color: "secondary"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "Admin Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "School overview at a glance" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: statCards.map(({
      label,
      value,
      icon: Icon,
      color
    }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `border-2 border-${color}/20`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `mx-auto h-6 w-6 text-${color} mb-1` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-2xl font-black text-${color}`, children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-semibold", children: label })
    ] }) }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground mb-3", children: "Recent Activity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        recentTxns.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg", children: "⚡" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-sm text-card-foreground truncate", children: [
              tx.teachers?.name,
              " → ",
              tx.students?.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              tx.subjects?.name,
              " • ",
              tx.marks_entered,
              " marks"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-black text-primary", children: [
            "+",
            tx.points_awarded
          ] })
        ] }) }, tx.id)),
        recentTxns.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No activity yet" })
      ] })
    ] })
  ] });
}
export {
  AdminDashboard as component
};
