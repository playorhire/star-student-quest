import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, B as Button, C as Card, a as CardContent, I as Input } from "./_ssr/router-DuskeiVN.mjs";
import { B as Badge } from "./_ssr/badge-BDzIIcyg.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { z as Plus, X, a7 as LoaderCircle, F as Pencil, T as Trash2, v as BookOpen } from "./_libs/lucide-react.mjs";
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
import "tslib";
import "./_libs/supabase__auth-js.mjs";
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
function BranchAdminClasses() {
  const {
    user
  } = useAuth();
  const [classes, setClasses] = reactExports.useState([]);
  const [subjects, setSubjects] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showClassForm, setShowClassForm] = reactExports.useState(false);
  const [editingClass, setEditingClass] = reactExports.useState(null);
  const [className, setClassName] = reactExports.useState("");
  const [classSubmitting, setClassSubmitting] = reactExports.useState(false);
  const [showSubjectForm, setShowSubjectForm] = reactExports.useState(false);
  const [editingSubject, setEditingSubject] = reactExports.useState(null);
  const [subjectName, setSubjectName] = reactExports.useState("");
  const [subjectClassId, setSubjectClassId] = reactExports.useState("");
  const [subjectSubmitting, setSubjectSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (user?.schoolId) load();
  }, [user]);
  async function load() {
    setLoading(true);
    const [c, s] = await Promise.all([supabase.from("classes").select("id, name").eq("school_id", user.schoolId).eq("branch_id", user.branchId).order("name"), supabase.from("subjects").select("id, name, class_id").eq("school_id", user.schoolId).eq("branch_id", user.branchId).order("name")]);
    setClasses(c.data || []);
    setSubjects(s.data || []);
    setLoading(false);
  }
  function openCreateClass() {
    setEditingClass(null);
    setClassName("");
    setShowClassForm(true);
  }
  function openEditClass(cls) {
    setEditingClass(cls);
    setClassName(cls.name);
    setShowClassForm(true);
  }
  async function handleSaveClass(e) {
    e.preventDefault();
    if (!className.trim()) {
      toast.error("Class name is required");
      return;
    }
    setClassSubmitting(true);
    if (editingClass) {
      const {
        error
      } = await supabase.from("classes").update({
        name: className.trim()
      }).eq("id", editingClass.id);
      if (error) toast.error(error.message);
      else toast.success("Class updated");
    } else {
      const {
        error
      } = await supabase.from("classes").insert({
        name: className.trim(),
        school_id: user.schoolId,
        branch_id: user.branchId
      });
      if (error) toast.error(error.message);
      else toast.success("Class created");
    }
    setClassSubmitting(false);
    setShowClassForm(false);
    setEditingClass(null);
    setClassName("");
    load();
  }
  async function handleDeleteClass(id) {
    if (!confirm("Delete this class? All linked subjects will also be removed.")) return;
    const {
      error
    } = await supabase.from("classes").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Class deleted");
    load();
  }
  function openCreateSubject() {
    setEditingSubject(null);
    setSubjectName("");
    setSubjectClassId("");
    setShowSubjectForm(true);
  }
  function openEditSubject(sub) {
    setEditingSubject(sub);
    setSubjectName(sub.name);
    setSubjectClassId(sub.class_id);
    setShowSubjectForm(true);
  }
  async function handleSaveSubject(e) {
    e.preventDefault();
    if (!subjectName.trim() || !subjectClassId) {
      toast.error("Subject name and class are required");
      return;
    }
    setSubjectSubmitting(true);
    if (editingSubject) {
      const {
        error
      } = await supabase.from("subjects").update({
        name: subjectName.trim(),
        class_id: subjectClassId
      }).eq("id", editingSubject.id);
      if (error) toast.error(error.message);
      else toast.success("Subject updated");
    } else {
      const {
        data,
        error
      } = await supabase.from("subjects").insert({
        name: subjectName.trim(),
        class_id: subjectClassId,
        school_id: user.schoolId,
        branch_id: user.branchId
      }).select().single();
      if (error) {
        toast.error(error.message);
      } else if (data) {
        await supabase.from("point_rules").insert({
          subject_id: data.id,
          passing_marks: 35,
          multiplier: 1,
          min_marks: 0,
          max_marks: 100,
          school_id: user.schoolId,
          branch_id: user.branchId
        });
        toast.success("Subject created");
      }
    }
    setSubjectSubmitting(false);
    setShowSubjectForm(false);
    setEditingSubject(null);
    setSubjectName("");
    setSubjectClassId("");
    load();
  }
  async function handleDeleteSubject(id) {
    if (!confirm("Delete this subject?")) return;
    const {
      error
    } = await supabase.from("subjects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Subject deleted");
    load();
  }
  const allowedRoles = ["branch_admin", "school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Access Denied" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black", children: "Classes & Subjects" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage school structure" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: openCreateSubject, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          " Subject"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: openCreateClass, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          " Class"
        ] })
      ] })
    ] }),
    showClassForm && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold", children: editingClass ? "Edit Class" : "New Class" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowClassForm(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveClass, className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Class Name (e.g. 10A)", value: className, onChange: (e) => setClassName(e.target.value), className: "flex-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: classSubmitting, children: [
          classSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : null,
          editingClass ? "Update" : "Create"
        ] })
      ] })
    ] }) }),
    showSubjectForm && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 border-secondary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold", children: editingSubject ? "Edit Subject" : "New Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowSubjectForm(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveSubject, className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Subject Name", value: subjectName, onChange: (e) => setSubjectName(e.target.value), className: "flex-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: subjectClassId, onChange: (e) => setSubjectClassId(e.target.value), className: "h-10 rounded-md border border-input bg-background px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select class" }),
          classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: subjectSubmitting, children: [
          subjectSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : null,
          editingSubject ? "Update" : "Create"
        ] })
      ] })
    ] }) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Loading..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      classes.map((cls) => {
        const classSubjects = subjects.filter((s) => s.class_id === cls.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "🏫" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-card-foreground", children: cls.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => openEditClass(cls), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive", onClick: () => handleDeleteClass(cls.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
            ] })
          ] }),
          classSubjects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: classSubjects.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3 w-3" }),
            " ",
            sub.name,
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openEditSubject(sub), className: "ml-1 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDeleteSubject(sub.id), className: "ml-1 text-destructive hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
          ] }, sub.id)) })
        ] }) }, cls.id);
      }),
      classes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "No classes found. Click Add Class to create one." })
    ] })
  ] });
}
export {
  BranchAdminClasses as component
};
