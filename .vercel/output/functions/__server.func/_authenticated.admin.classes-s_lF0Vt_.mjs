import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { s as supabase, C as Card, b as CardHeader, c as CardTitle, a as CardContent, I as Input, B as Button } from "./_ssr/router-WWTDPtlD.mjs";
import { L as Label } from "./_ssr/label-DtSqJuKJ.mjs";
import { B as Badge } from "./_ssr/badge-Ch0o6HSr.mjs";
import "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { z as Plus, T as Trash2, v as BookOpen } from "./_libs/lucide-react.mjs";
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
function AdminClasses() {
  const [classes, setClasses] = reactExports.useState([]);
  const [subjects, setSubjects] = reactExports.useState([]);
  const [newClassName, setNewClassName] = reactExports.useState("");
  const [newSubjectName, setNewSubjectName] = reactExports.useState("");
  const [newSubjectClassId, setNewSubjectClassId] = reactExports.useState("");
  reactExports.useEffect(() => {
    load();
  }, []);
  async function load() {
    const [c, s] = await Promise.all([supabase.from("classes").select("id, name").order("name"), supabase.from("subjects").select("id, name, class_id").order("name")]);
    setClasses(c.data || []);
    setSubjects(s.data || []);
  }
  async function handleAddClass() {
    if (!newClassName.trim()) return;
    await supabase.from("classes").insert({
      name: newClassName.trim()
    });
    setNewClassName("");
    load();
  }
  async function handleRemoveClass(id) {
    await supabase.from("classes").delete().eq("id", id);
    load();
  }
  async function handleAddSubject() {
    if (!newSubjectName.trim() || !newSubjectClassId) return;
    const {
      data
    } = await supabase.from("subjects").insert({
      name: newSubjectName.trim(),
      class_id: newSubjectClassId
    }).select().single();
    if (data) {
      await supabase.from("point_rules").insert({
        subject_id: data.id,
        passing_marks: 35,
        multiplier: 1,
        min_marks: 0,
        max_marks: 100
      });
    }
    setNewSubjectName("");
    setNewSubjectClassId("");
    load();
  }
  async function handleRemoveSubject(id) {
    await supabase.from("subjects").delete().eq("id", id);
    load();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "Classes & Activities/Quizzes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage school structure" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2 border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-bold", children: "Add Class" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Class Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. 10A", value: newClassName, onChange: (e) => setNewClassName(e.target.value), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleAddClass, className: "rounded-xl", disabled: !newClassName.trim(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          " Add Class"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: classes.map((cls) => {
      const classSubjects = subjects.filter((s) => s.class_id === cls.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "🏫" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-card-foreground", children: cls.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleRemoveClass(cls.id), className: "h-8 w-8 text-destructive hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] }),
        classSubjects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: classSubjects.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3 w-3" }),
          " ",
          sub.name,
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRemoveSubject(sub.id), className: "ml-1 text-destructive hover:text-destructive", children: "×" })
        ] }, sub.id)) })
      ] }) }, cls.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2 border-secondary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-bold", children: "Add Activity/Quiz" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Activity/Quiz Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. Quiz 1", value: newSubjectName, onChange: (e) => setNewSubjectName(e.target.value), className: "rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "For Class" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newSubjectClassId, onChange: (e) => setNewSubjectClassId(e.target.value), className: "flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select class" }),
              classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleAddSubject, variant: "secondary", className: "rounded-xl", disabled: !newSubjectName.trim() || !newSubjectClassId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          " Add Activity/Quiz"
        ] })
      ] })
    ] })
  ] });
}
export {
  AdminClasses as component
};
