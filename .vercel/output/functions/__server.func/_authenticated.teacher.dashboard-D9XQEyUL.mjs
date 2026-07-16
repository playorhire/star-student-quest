import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, C as Card, a as CardContent } from "./_ssr/router-OBc8LoFd.mjs";
import { H as HouseLeaderboard } from "./_ssr/HouseLeaderboard-DaCDq7_u.mjs";
import { d as describeSupabaseError, n as notifyError, E as ErrorState } from "./_ssr/handle-error-MhMBkfY6.mjs";
import "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { Z as Zap, U as Users, _ as TrendingUp } from "./_libs/lucide-react.mjs";
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
function TeacherDashboard() {
  const {
    user
  } = useAuth();
  const [stats, setStats] = reactExports.useState({
    pointsToday: 0,
    totalStudents: 0,
    totalScans: 0
  });
  const [recentTxns, setRecentTxns] = reactExports.useState([]);
  const [error, setError] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const load = reactExports.useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      let studentsQuery = supabase.from("students").select("id", {
        count: "exact",
        head: true
      });
      let todayTxQuery = supabase.from("point_transactions").select("points_awarded").gte("created_at", today);
      let totalTxQuery = supabase.from("point_transactions").select("id", {
        count: "exact",
        head: true
      });
      let recentQuery = supabase.from("point_transactions").select("id, points_awarded, marks_entered, created_at, students(name, avatar_emoji), subjects(name)").order("created_at", {
        ascending: false
      }).limit(5);
      if (user?.branchId) {
        studentsQuery = studentsQuery.eq("branch_id", user.branchId);
        todayTxQuery = todayTxQuery.eq("branch_id", user.branchId);
        totalTxQuery = totalTxQuery.eq("branch_id", user.branchId);
        recentQuery = recentQuery.eq("branch_id", user.branchId);
      }
      const [todayTx, studentsCount, totalTx, recent] = await Promise.all([todayTxQuery, studentsQuery, totalTxQuery, recentQuery]);
      const firstErr = todayTx.error || studentsCount.error || totalTx.error || recent.error;
      if (firstErr) throw firstErr;
      setStats({
        pointsToday: (todayTx.data || []).reduce((s, t) => s + t.points_awarded, 0),
        totalStudents: studentsCount.count || 0,
        // label kept as "totalScans" for backward compat; UI says "Records"
        totalScans: totalTx.count || 0
      });
      setRecentTxns(recent.data || []);
    } catch (err) {
      const msg = describeSupabaseError(err);
      setError(msg);
      notifyError("Couldn't load dashboard", err);
    } finally {
      setLoading(false);
    }
  }, [user?.branchId]);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your teaching overview" })
    ] }),
    error && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: () => load() }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "mx-auto h-6 w-6 text-primary mb-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-primary", children: stats.pointsToday }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-semibold", children: "Points Today" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-secondary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mx-auto h-6 w-6 text-secondary mb-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-secondary", children: stats.totalStudents }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-semibold", children: "Students" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "mx-auto h-6 w-6 text-accent mb-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-accent", children: stats.totalScans }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-semibold", children: "Total Records" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HouseLeaderboard, { branchId: user?.branchId }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground mb-3", children: "Recent Activity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        recentTxns.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg", children: tx.students?.avatar_emoji || "🧑" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-card-foreground truncate", children: tx.students?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              tx.subjects?.name,
              " • ",
              tx.marks_entered,
              " marks"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-black text-primary", children: [
              "+",
              tx.points_awarded
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "pts" })
          ] })
        ] }) }, tx.id)),
        recentTxns.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No activity yet" })
      ] })
    ] })
  ] });
}
export {
  TeacherDashboard as component
};
