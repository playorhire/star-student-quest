import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, B as Button, C as Card, a as CardContent, I as Input } from "./_ssr/router-DuskeiVN.mjs";
import { L as Label } from "./_ssr/label-TEKU4-jV.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./_ssr/dialog-CsPHMyaH.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { H as HouseLeaderboard } from "./_ssr/HouseLeaderboard-LI4QOfwK.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { z as Plus, w as House, G as GraduationCap, U as Users, F as Pencil, T as Trash2 } from "./_libs/lucide-react.mjs";
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
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__react-presence.mjs";
const PRESETS = [{
  name: "Red",
  color: "#ef4444",
  emoji: "🔴"
}, {
  name: "Blue",
  color: "#3b82f6",
  emoji: "🔵"
}, {
  name: "Green",
  color: "#22c55e",
  emoji: "🟢"
}, {
  name: "Yellow",
  color: "#eab308",
  emoji: "🟡"
}, {
  name: "Silver",
  color: "#94a3b8",
  emoji: "⚪"
}];
function BranchAdminHouses() {
  const {
    user
  } = useAuth();
  const [houses, setHouses] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    name: "",
    color: "#ef4444",
    emoji: "🏠"
  });
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (user?.branchId) load();
  }, [user]);
  async function load() {
    setLoading(true);
    const {
      data
    } = await supabase.from("houses").select("id, name, color, emoji, total_points").eq("branch_id", user.branchId).order("name");
    const list = data || [];
    if (list.length > 0) {
      const ids = list.map((h) => h.id);
      const [sc, tc] = await Promise.all([supabase.from("students").select("house_id").in("house_id", ids), supabase.from("teachers").select("house_id").in("house_id", ids)]);
      const sCounts = {};
      const tCounts = {};
      (sc.data || []).forEach((r) => {
        sCounts[r.house_id] = (sCounts[r.house_id] || 0) + 1;
      });
      (tc.data || []).forEach((r) => {
        tCounts[r.house_id] = (tCounts[r.house_id] || 0) + 1;
      });
      list.forEach((h) => {
        h.student_count = sCounts[h.id] || 0;
        h.teacher_count = tCounts[h.id] || 0;
      });
    }
    setHouses(list);
    setLoading(false);
  }
  function openCreate() {
    setEditing(null);
    setForm({
      name: "",
      color: "#ef4444",
      emoji: "🏠"
    });
    setShowForm(true);
  }
  function openEdit(h) {
    setEditing(h);
    setForm({
      name: h.name,
      color: h.color,
      emoji: h.emoji
    });
    setShowForm(true);
  }
  function applyPreset(p) {
    setForm({
      name: p.name,
      color: p.color,
      emoji: p.emoji
    });
  }
  async function save(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      color: form.color,
      emoji: form.emoji || "🏠",
      school_id: user.schoolId,
      branch_id: user.branchId
    };
    const res = editing ? await supabase.from("houses").update(payload).eq("id", editing.id) : await supabase.from("houses").insert(payload);
    if (res.error) toast.error(res.error.message);
    else {
      toast.success(editing ? "House updated" : "House created");
      setShowForm(false);
      load();
    }
    setSaving(false);
  }
  async function remove(h) {
    if (!confirm(`Delete house "${h.name}"? Members will be unassigned.`)) return;
    const {
      error
    } = await supabase.from("houses").delete().eq("id", h.id);
    if (error) toast.error(error.message);
    else {
      toast.success("House deleted");
      load();
    }
  }
  const allowed = ["branch_admin", "school_admin", "admin", "super_admin"];
  if (!user || !allowed.includes(user.role)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Access Denied" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black", children: "Houses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Group students and teachers into houses" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openCreate, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
        "Add House"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HouseLeaderboard, { branchId: user.branchId }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Loading..." }) : houses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-10 w-10 mx-auto mb-2 opacity-30" }),
      "No houses yet. Create one to get started."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: houses.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0", style: {
        backgroundColor: h.color + "20",
        border: `2px solid ${h.color}`
      }, children: h.emoji }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: h.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-3 w-3" }),
            h.student_count ?? 0
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
            h.teacher_count ?? 0
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-primary", children: h.total_points }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "pts" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => openEdit(h), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive", onClick: () => remove(h), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] })
    ] }) }, h.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showForm, onOpenChange: (o) => !o && setShowForm(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit House" : "New House" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-4", children: [
        !editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Quick presets" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => applyPreset(p), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: p.emoji }),
            p.name
          ] }, p.name)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.name, onChange: (e) => setForm((f) => ({
            ...f,
            name: e.target.value
          })), placeholder: "e.g. Red", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Emoji" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.emoji, onChange: (e) => setForm((f) => ({
              ...f,
              emoji: e.target.value
            })), maxLength: 4, className: "text-center text-lg" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Color" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "color", value: form.color, onChange: (e) => setForm((f) => ({
              ...f,
              color: e.target.value
            })), className: "h-10 p-1" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: saving, className: "flex-1", children: editing ? "Update" : "Create" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setShowForm(false), children: "Cancel" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  BranchAdminHouses as component
};
