import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { s as supabase, C as Card, a as CardContent, B as Button, I as Input } from "./_ssr/router-WWTDPtlD.mjs";
import { L as Label } from "./_ssr/label-DtSqJuKJ.mjs";
import { B as Badge } from "./_ssr/badge-Ch0o6HSr.mjs";
import "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { v as BookOpen, a9 as Save } from "./_libs/lucide-react.mjs";
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
function AdminRules() {
  const [rules, setRules] = reactExports.useState([]);
  const [classes, setClasses] = reactExports.useState([]);
  const [subjects, setSubjects] = reactExports.useState([]);
  const [editId, setEditId] = reactExports.useState(null);
  const [editPassing, setEditPassing] = reactExports.useState("");
  const [editMultiplier, setEditMultiplier] = reactExports.useState("");
  const [editMin, setEditMin] = reactExports.useState("");
  const [editMax, setEditMax] = reactExports.useState("");
  const [filterClassId, setFilterClassId] = reactExports.useState("");
  const [loadingDefaults, setLoadingDefaults] = reactExports.useState(false);
  reactExports.useEffect(() => {
    load();
  }, []);
  async function load() {
    const [r, c, s] = await Promise.all([supabase.from("point_rules").select("id, passing_marks, multiplier, min_marks, max_marks, subject_id, subjects(id, name, class_id, classes(name))").order("subject_id"), supabase.from("classes").select("id, name").order("name"), supabase.from("subjects").select("id, name, class_id, classes(name)").order("name")]);
    setRules(r.data || []);
    setClasses(c.data || []);
    setSubjects(s.data || []);
  }
  const startEdit = (rule) => {
    setEditId(rule.id);
    setEditPassing(String(rule.passing_marks));
    setEditMultiplier(String(rule.multiplier));
    setEditMin(String(rule.min_marks));
    setEditMax(String(rule.max_marks));
  };
  async function saveEdit() {
    if (!editId) return;
    const pm = parseInt(editPassing, 10);
    const mul = parseFloat(editMultiplier);
    const min = parseInt(editMin, 10);
    const max = parseInt(editMax, 10);
    if (isNaN(pm) || isNaN(mul) || isNaN(min) || isNaN(max)) return;
    if (min < 0 || max <= 0 || min > max || pm < min || pm > max || mul <= 0) return;
    await supabase.from("point_rules").update({
      passing_marks: pm,
      multiplier: mul,
      min_marks: min,
      max_marks: max
    }).eq("id", editId);
    setEditId(null);
    load();
  }
  async function createDefaultRules() {
    const subjectsWithoutRules2 = subjects.filter((s) => !rules.some((r) => r.subject_id === s.id));
    if (subjectsWithoutRules2.length === 0) return;
    setLoadingDefaults(true);
    const defaultRules = subjectsWithoutRules2.map((s) => ({
      subject_id: s.id,
      passing_marks: 40,
      multiplier: 1,
      min_marks: 0,
      max_marks: 100
    }));
    const {
      error
    } = await supabase.from("point_rules").insert(defaultRules);
    setLoadingDefaults(false);
    if (error) {
      alert(`Unable to create default rules: ${error.message}`);
      console.error("Error creating default rules:", error);
      return;
    }
    load();
  }
  const filtered = filterClassId ? rules.filter((r) => r.subjects?.class_id === filterClassId) : rules;
  const subjectsWithoutRules = subjects.filter((s) => !rules.some((r) => r.subject_id === s.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "Point Rules" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Configure passing marks and multipliers per activity/quiz" }),
      subjects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-muted-foreground", children: [
        rules.length,
        " of ",
        subjects.length,
        " activities/quizzes have rules configured"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-primary/20 bg-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-card-foreground mb-1", children: "📐 Point Formula" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        "Points = (",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Marks" }),
        " − ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: "Passing Marks" }),
        ") × ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-secondary", children: "Multiplier" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Only awarded if marks ≥ passing marks" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 overflow-x-auto pb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: filterClassId === "" ? "default" : "outline", size: "sm", className: "rounded-xl text-xs", onClick: () => setFilterClassId(""), children: "All" }),
      classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: filterClassId === c.id ? "default" : "outline", size: "sm", className: "rounded-xl text-xs", onClick: () => setFilterClassId(c.id), children: c.name }, c.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      filtered.map((rule) => {
        const sub = rule.subjects;
        if (!sub) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: editId === rule.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm text-card-foreground", children: sub.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: sub.classes?.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Passing Marks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: editPassing, onChange: (e) => setEditPassing(e.target.value), className: "rounded-xl", min: "0", max: "100" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Multiplier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: editMultiplier, onChange: (e) => setEditMultiplier(e.target.value), className: "rounded-xl", min: "0.1", step: "0.1" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Min Marks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: editMin, onChange: (e) => setEditMin(e.target.value), className: "rounded-xl", min: "0", max: "100" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Max Marks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: editMax, onChange: (e) => setEditMax(e.target.value), className: "rounded-xl", min: "0", max: "100" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "rounded-xl", onClick: saveEdit, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3 w-3 mr-1" }),
              " Save"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "rounded-xl", onClick: () => setEditId(null), children: "Cancel" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => startEdit(rule), className: "w-full text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm text-card-foreground", children: sub.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: sub.classes?.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Pass" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-primary text-sm", children: rule.passing_marks })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "×" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-secondary text-sm", children: rule.multiplier })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground mt-1", children: [
            "Tap to edit • Example: (80 − ",
            rule.passing_marks,
            ") × ",
            rule.multiplier,
            " = ",
            ((80 - rule.passing_marks) * Number(rule.multiplier)).toFixed(0),
            " pts • Range: ",
            rule.min_marks,
            "–",
            rule.max_marks
          ] })
        ] }) }) }, rule.id);
      }),
      filtered.length === 0 && subjectsWithoutRules.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-amber-200 bg-amber-50 dark:bg-amber-950", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 text-center space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8 text-amber-600 dark:text-amber-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-amber-800 dark:text-amber-200", children: "Point Rules Needed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-amber-700 dark:text-amber-300", children: [
            subjectsWithoutRules.length,
            " activity/quiz",
            subjectsWithoutRules.length !== 1 ? "es" : "",
            " ",
            subjectsWithoutRules.length === 1 ? "needs" : "need",
            " point rules configured."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: createDefaultRules, className: "bg-amber-600 hover:bg-amber-700", disabled: loadingDefaults, children: loadingDefaults ? "Creating rules…" : "Create Default Rules" })
      ] }) }),
      filtered.length === 0 && subjectsWithoutRules.length === 0 && subjects.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No rules yet. Add activities/quizzes in Classes first." })
    ] })
  ] });
}
export {
  AdminRules as component
};
