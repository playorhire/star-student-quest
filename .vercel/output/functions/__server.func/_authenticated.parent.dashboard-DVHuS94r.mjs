import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { d as useNavigate } from "./_libs/tanstack__react-router.mjs";
import { u as useAuth, s as supabase } from "./_ssr/router-DuskeiVN.mjs";
import { L as LinkedChildrenManager } from "./_ssr/LinkedChildrenManager-C7XvLSiN.mjs";
import { H as HouseLeaderboard } from "./_ssr/HouseLeaderboard-LI4QOfwK.mjs";
import "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { M as MessageSquare, X } from "./_libs/lucide-react.mjs";
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
import "./_ssr/label-TEKU4-jV.mjs";
import "./_libs/radix-ui__react-label.mjs";
function ParentDashboard() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = reactExports.useState([]);
  const [selectedChildId, setSelectedChildId] = reactExports.useState("all");
  const [recentActivity, setRecentActivity] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [pickerChild, setPickerChild] = reactExports.useState(null);
  const [pickerTeachers, setPickerTeachers] = reactExports.useState([]);
  const [pickerLoading, setPickerLoading] = reactExports.useState(false);
  const [childBranchId, setChildBranchId] = reactExports.useState(null);
  async function openTeacherPicker(child) {
    setPickerChild(child);
    setPickerLoading(true);
    setPickerTeachers([]);
    const {
      data
    } = await supabase.from("teacher_assignments").select("teachers(id, name, user_id), subjects(name)").eq("class_id", child.class_id);
    const opts = (data || []).map((row) => ({
      id: row.teachers?.id,
      name: row.teachers?.name || "Teacher",
      user_id: row.teachers?.user_id || null,
      subject_name: row.subjects?.name || ""
    })).filter((t) => t.id);
    const map = /* @__PURE__ */ new Map();
    for (const t of opts) {
      const existing = map.get(t.id);
      if (existing) {
        existing.subject_name = existing.subject_name ? `${existing.subject_name}, ${t.subject_name}` : t.subject_name;
      } else {
        map.set(t.id, {
          ...t
        });
      }
    }
    setPickerTeachers([...map.values()]);
    setPickerLoading(false);
  }
  function startConversation(teacher) {
    if (!teacher.user_id) return;
    setPickerChild(null);
    navigate({
      to: "/parent/messages",
      search: {
        with: teacher.user_id,
        name: teacher.name
      }
    });
  }
  reactExports.useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);
  reactExports.useEffect(() => {
    if (!children.length) return;
    loadActivity();
    loadChildBranch();
  }, [selectedChildId, children]);
  async function loadData() {
    const {
      data,
      error
    } = await supabase.rpc("get_my_linked_children");
    if (!error && data) {
      setChildren(data.map((s) => ({
        id: s.id,
        name: s.name,
        total_points: s.total_points,
        avatar_emoji: s.avatar_emoji,
        class_name: s.class_name || "",
        class_id: s.class_id,
        roll_number: s.roll_number,
        branch_name: s.branch_name || "",
        school_name: s.school_name || ""
      })));
    }
    setLoading(false);
  }
  async function loadActivity() {
    const ids = selectedChildId === "all" ? children.map((c) => c.id) : [selectedChildId];
    if (!ids.length) return;
    const {
      data: txns
    } = await supabase.from("point_transactions").select("id, points_awarded, marks_entered, created_at, subjects(name), students(name)").in("student_id", ids).order("created_at", {
      ascending: false
    }).limit(10);
    if (txns) setRecentActivity(txns);
  }
  async function loadChildBranch() {
    const targetId = selectedChildId === "all" ? children[0]?.id : selectedChildId;
    if (!targetId) return;
    const {
      data
    } = await supabase.from("students").select("branch_id").eq("id", targetId).maybeSingle();
    setChildBranchId(data?.branch_id || null);
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl animate-bounce", children: "👨‍👩‍👧" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black text-foreground", children: "My Children" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Track your children's progress" })
    ] }),
    children.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 text-center space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "👶" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No children linked to your account yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Search by your child's name and roll number to link them." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LinkedChildrenManager, { compact: true, onChange: () => loadData() })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      children.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 overflow-x-auto pb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedChildId("all"), className: `px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${selectedChildId === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`, children: "All" }),
        children.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedChildId(c.id), className: `px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors flex items-center gap-1 ${selectedChildId === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.avatar_emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.name.split(" ")[0] })
        ] }, c.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: children.filter((c) => selectedChildId === "all" || c.id === selectedChildId).map((child) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: child.avatar_emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-foreground", children: child.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              child.class_name,
              " • Roll #",
              child.roll_number
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
              child.school_name,
              child.branch_name ? ` — ${child.branch_name}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-primary", children: child.total_points }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "points" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openTeacherPicker(child), className: "mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-background hover:border-primary hover:text-primary px-3 py-2 text-xs font-bold text-foreground transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4" }),
          "Message a Teacher"
        ] })
      ] }, child.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LinkedChildrenManager, { compact: true, onChange: () => loadData() }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HouseLeaderboard, { branchId: childBranchId }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-foreground mb-3", children: [
        "Recent Activity",
        selectedChildId !== "all" && children.find((c) => c.id === selectedChildId) ? ` — ${children.find((c) => c.id === selectedChildId).name}` : ""
      ] }),
      recentActivity.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No recent activity" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: recentActivity.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border bg-card/50 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: tx.students?.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            tx.subjects?.name,
            " • ",
            tx.marks_entered,
            " marks"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-bold text-primary", children: [
          "+",
          tx.points_awarded,
          " pts"
        ] })
      ] }, tx.id)) })
    ] }),
    pickerChild && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4", onClick: () => setPickerChild(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-card border border-border p-4 space-y-3", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-foreground", children: "Message a Teacher" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "For ",
            pickerChild.name
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPickerChild(null), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
      ] }),
      pickerLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-2xl animate-bounce", children: "👩‍🏫" }) : pickerTeachers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "No teachers assigned to this class yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: pickerTeachers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => startConversation(t), disabled: !t.user_id, className: "w-full flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-left hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: "👩‍🏫" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-foreground", children: t.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: t.subject_name || "Activity/Quiz" })
        ] }),
        !t.user_id && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "No account" })
      ] }, t.id)) })
    ] }) })
  ] });
}
export {
  ParentDashboard as component
};
