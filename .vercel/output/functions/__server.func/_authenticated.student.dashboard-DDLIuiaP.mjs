import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, C as Card, a as CardContent } from "./_ssr/router-WWTDPtlD.mjs";
import { P as Progress } from "./_ssr/progress-BciayuZp.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { H as HouseLeaderboard } from "./_ssr/HouseLeaderboard-aXMsBhh_.mjs";
import { d as describeSupabaseError, n as notifyError, E as ErrorState } from "./_ssr/handle-error-B9u69PcG.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
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
import "./_libs/lucide-react.mjs";
import "./_libs/radix-ui__react-progress.mjs";
function StudentDashboard() {
  const {
    user
  } = useAuth();
  const [student, setStudent] = reactExports.useState(null);
  const [badges, setBadges] = reactExports.useState([]);
  const [recentTxns, setRecentTxns] = reactExports.useState([]);
  const [error, setError] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const load = reactExports.useCallback(async () => {
    if (!user?.id) return;
    setError(null);
    setLoading(true);
    try {
      const {
        data: s,
        error: sErr
      } = await supabase.from("students").select("*, classes(name), lifetime_points, branch_id").eq("user_id", user.id).single();
      if (sErr) throw sErr;
      if (!s) {
        setError("We couldn't find your student profile. Please contact your school admin.");
        return;
      }
      setStudent(s);
      const [b, txns] = await Promise.all([supabase.from("badges").select("id, emoji, name, required_points").order("required_points"), supabase.from("point_transactions").select("id, points_awarded, marks_entered, created_at, subjects(name)").eq("student_id", s.id).order("created_at", {
        ascending: false
      }).limit(10)]);
      if (b.error) throw b.error;
      if (txns.error) throw txns.error;
      setBadges(b.data || []);
      setRecentTxns(txns.data || []);
    } catch (err) {
      const msg = describeSupabaseError(err);
      setError(msg);
      notifyError("Couldn't load your dashboard", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);
  reactExports.useEffect(() => {
    if (user) load();
  }, [user, load]);
  reactExports.useEffect(() => {
    if (!student?.id || !user?.id) return;
    const channel = supabase.channel(`student-dash-${student.id}`).on("postgres_changes", {
      event: "UPDATE",
      schema: "public",
      table: "students",
      filter: `id=eq.${student.id}`
    }, (payload) => {
      if (payload.new) setStudent((s) => s ? {
        ...s,
        ...payload.new
      } : s);
    }).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "point_transactions",
      filter: `student_id=eq.${student.id}`
    }, () => {
      load();
    }).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "notifications",
      filter: `user_id=eq.${user.id}`
    }, (payload) => {
      toast.success(payload.new.title, {
        description: payload.new.body
      });
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [student?.id, user?.id, load]);
  if (error && !student) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: error, onRetry: () => load() }) });
  }
  if (!student) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl animate-bounce", children: "🎓" }) });
  const earnedBadges = badges.filter((b) => (student.lifetime_points ?? student.total_points) >= b.required_points);
  const nextBadge = badges.find((b) => (student.lifetime_points ?? student.total_points) < b.required_points);
  const badgePoints = student.lifetime_points ?? student.total_points;
  const progress = nextBadge ? Math.min(100, badgePoints / nextBadge.required_points * 100) : 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-2", children: student.avatar_emoji }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-black text-foreground", children: student.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        student.classes?.name,
        " • Roll #",
        student.roll_number
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl font-black text-primary mt-3", children: student.total_points }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Points" })
    ] }) }),
    nextBadge && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-foreground", children: [
          "Next: ",
          nextBadge.emoji,
          " ",
          nextBadge.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          badgePoints,
          "/",
          nextBadge.required_points
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-3" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HouseLeaderboard, { branchId: student.branch_id }),
    earnedBadges.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-foreground mb-2", children: "Badges Earned" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: earnedBadges.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: b.emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-foreground", children: b.name })
      ] }, b.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-foreground mb-2", children: "Recent Activity" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        recentTxns.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center justify-between p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: tx.subjects?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
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
  StudentDashboard as component
};
