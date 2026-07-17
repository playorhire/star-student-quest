import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, C as Card, a as CardContent, B as Button } from "./_ssr/router-DuskeiVN.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { p as UserCog, y as CircleCheck, q as School, a7 as LoaderCircle } from "./_libs/lucide-react.mjs";
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
function AssignSchoolPage() {
  const {
    user
  } = useAuth();
  const [schoolAdmins, setSchoolAdmins] = reactExports.useState([]);
  const [schools, setSchools] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [selectedAdminId, setSelectedAdminId] = reactExports.useState("");
  const [selectedSchoolId, setSelectedSchoolId] = reactExports.useState("");
  reactExports.useEffect(() => {
    loadData();
  }, []);
  async function loadData() {
    setLoading(true);
    const [schoolsRes, adminsRes] = await Promise.all([supabase.from("schools").select("id, name").order("name"), supabase.from("user_roles").select("id, user_id, name, email, school_id, tenant_role, role, schools(id, name)").eq("tenant_role", "school_admin").eq("is_primary", true).order("name")]);
    if (schoolsRes.error) {
      toast.error(`Failed to load schools: ${schoolsRes.error.message}`);
    } else {
      setSchools(schoolsRes.data || []);
    }
    if (adminsRes.error) {
      toast.error(`Failed to load school admins: ${adminsRes.error.message}`);
    } else {
      setSchoolAdmins(adminsRes.data || []);
    }
    setLoading(false);
  }
  async function handleAssign(e) {
    e.preventDefault();
    if (!selectedAdminId || !selectedSchoolId) {
      toast.error("Please select both a school admin and a school");
      return;
    }
    const admin = schoolAdmins.find((a) => a.id === selectedAdminId);
    if (!admin) {
      toast.error("School admin not found");
      return;
    }
    if (admin.school_id === selectedSchoolId) {
      toast.info("This school admin is already assigned to the selected school");
      return;
    }
    setSubmitting(true);
    const {
      error
    } = await supabase.from("user_roles").update({
      school_id: selectedSchoolId
    }).eq("id", selectedAdminId);
    if (error) {
      toast.error(`Assignment failed: ${error.message}`);
      setSubmitting(false);
      return;
    }
    toast.success("School assigned successfully");
    setSelectedAdminId("");
    setSelectedSchoolId("");
    setSubmitting(false);
    loadData();
  }
  if (user?.role !== "super_admin") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Access Denied" }) });
  }
  const selectedAdmin = schoolAdmins.find((a) => a.id === selectedAdminId);
  const currentSchoolName = selectedAdmin?.schools?.name || "Not assigned";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black", children: "Assign School" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Assign a school to a school administrator" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 space-y-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Loading..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAssign, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm font-medium flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "h-4 w-4 text-primary" }),
          "School Admin"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, value: selectedAdminId, onChange: (e) => {
          setSelectedAdminId(e.target.value);
          setSelectedSchoolId("");
        }, className: "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select School Admin" }),
          schoolAdmins.map((admin) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: admin.id, children: [
            admin.name || admin.email || `User: ${admin.user_id?.slice(0, 12)}...`,
            " — ",
            admin.schools?.name || "No school"
          ] }, admin.id))
        ] })
      ] }),
      selectedAdminId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/50 p-3 text-sm flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          selectedAdmin?.name || selectedAdmin?.email || `User: ${selectedAdmin?.user_id?.slice(0, 12)}...`,
          " → ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: currentSchoolName })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm font-medium flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "h-4 w-4 text-primary" }),
          "School"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, value: selectedSchoolId, onChange: (e) => setSelectedSchoolId(e.target.value), className: "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select School" }),
          schools.map((school) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: school.id, children: school.name }, school.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: submitting || !selectedAdminId || !selectedSchoolId, className: "w-full", children: [
        submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-2" }),
        "Assign School"
      ] })
    ] }) }) }),
    !loading && schoolAdmins.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Current Assignments" }),
      schoolAdmins.map((admin) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-3 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: admin.name || admin.email || `User: ${admin.user_id?.slice(0, 12)}...` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: admin.schools?.name ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "h-3 w-3" }),
            admin.schools.name
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-500", children: "No school assigned" }) })
        ] })
      ] }) }) }, admin.id))
    ] })
  ] });
}
export {
  AssignSchoolPage as component
};
