import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, C as Card, a as CardContent, B as Button } from "./_ssr/router-DuskeiVN.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { T as Trash2 } from "./_libs/lucide-react.mjs";
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
function TeacherStudents() {
  const {
    user
  } = useAuth();
  const [students, setStudents] = reactExports.useState([]);
  const [classes, setClasses] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (user?.schoolId) loadData();
  }, [user]);
  async function loadData() {
    setLoading(true);
    setError(null);
    const {
      data: teacher
    } = await supabase.from("teachers").select("id, branch_id").maybeSingle();
    let assignedClassIds = [];
    if (teacher) {
      const {
        data: assignments
      } = await supabase.from("teacher_assignments").select("class_id").eq("teacher_id", teacher.id);
      assignedClassIds = (assignments || []).map((a) => a.class_id);
    }
    const classQuery = supabase.from("classes").select("id, name").eq("school_id", user.schoolId).order("name");
    if (assignedClassIds.length > 0) {
      classQuery.in("id", assignedClassIds);
    }
    const studentQuery = supabase.from("students").select("id, name, roll_number, total_points, classes(name), avatar_emoji, class_id, section, email").eq("school_id", user.schoolId).order("name");
    if (teacher?.branch_id) {
      studentQuery.eq("branch_id", teacher.branch_id);
    }
    const [sRes, cRes] = await Promise.all([supabase.from("students").select("id, name, roll_number, total_points, classes(name), avatar_emoji, class_id, section, user_id, email").eq("branch_id", user.branchId).order("name"), studentQuery, classQuery]);
    if (sRes.error) {
      setError(sRes.error.message + " (" + sRes.error.code + ")");
      toast.error(sRes.error.message);
    } else {
      let studentData = sRes.data || [];
      if (assignedClassIds.length > 0) {
        studentData = studentData.filter((s) => assignedClassIds.includes(s.class_id));
      }
      setStudents(studentData);
    }
    setClasses(cRes.data || []);
    setLoading(false);
  }
  async function handleDelete(id) {
    if (!confirm("Delete this student?")) return;
    const {
      error: err
    } = await supabase.from("students").delete().eq("id", id);
    if (err) toast.error(err.message);
    else {
      toast.success("Student deleted");
      loadData();
    }
  }
  const allowedRoles = ["teacher", "school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Access Denied" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black", children: "Students" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Students in your classes" })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Error:" }),
      " ",
      error
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Loading..." }) : students.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "No students found in your assigned classes." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: students.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: s.avatar_emoji || "🎓" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: s.name }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          s.classes?.name,
          " • Roll #",
          s.roll_number,
          " • Section ",
          s.section
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-primary", children: s.total_points ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "pts" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive", onClick: () => handleDelete(s.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }) })
    ] }) }, s.id)) })
  ] });
}
export {
  TeacherStudents as component
};
