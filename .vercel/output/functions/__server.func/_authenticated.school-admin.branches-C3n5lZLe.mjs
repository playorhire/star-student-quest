import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, B as Button, C as Card, a as CardContent, I as Input } from "./_ssr/router-DuskeiVN.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { z as Plus, ac as MapPin, F as Pencil, T as Trash2 } from "./_libs/lucide-react.mjs";
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
function BranchesManagement() {
  const {
    user
  } = useAuth();
  const [branches, setBranches] = reactExports.useState([]);
  const [schoolName, setSchoolName] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [isEditing, setIsEditing] = reactExports.useState(null);
  const [formName, setFormName] = reactExports.useState("");
  const [formAddress, setFormAddress] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (user?.schoolId) loadBranches();
  }, [user]);
  async function loadBranches() {
    setLoading(true);
    const {
      data: schoolData
    } = await supabase.from("schools").select("name").eq("id", user.schoolId).single();
    setSchoolName(schoolData?.name || "");
    const {
      data,
      error
    } = await supabase.from("branches").select("*").eq("school_id", user.schoolId).order("created_at", {
      ascending: false
    });
    if (error) toast.error(error.message);
    else setBranches(data || []);
    setLoading(false);
  }
  async function handleSave() {
    if (!formName.trim()) {
      toast.error("Name is required");
      return;
    }
    const payload = {
      school_id: user.schoolId,
      name: formName.trim(),
      address: formAddress.trim() || null
    };
    if (isEditing && isEditing !== "new") {
      const {
        error
      } = await supabase.from("branches").update({
        name: payload.name,
        address: payload.address
      }).eq("id", isEditing);
      if (error) toast.error(error.message);
      else toast.success("Branch updated");
    } else {
      const {
        error
      } = await supabase.from("branches").insert(payload);
      if (error) toast.error(error.message);
      else toast.success("Branch created");
    }
    setIsEditing(null);
    setFormName("");
    setFormAddress("");
    loadBranches();
  }
  async function handleDelete(id) {
    if (!confirm("Delete this branch? All linked data will be affected.")) return;
    const {
      error
    } = await supabase.from("branches").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Branch deleted");
    loadBranches();
  }
  const allowedRoles = ["school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Access Denied" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black", children: "Branches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Manage branches for ",
          schoolName || "your school"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
        setIsEditing("new");
        setFormName("");
        setFormAddress("");
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
        " Add Branch"
      ] })
    ] }),
    isEditing === "new" && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Branch Name", value: formName, onChange: (e) => setFormName(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Address (optional)", value: formAddress, onChange: (e) => setFormAddress(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, children: "Save" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsEditing(null), children: "Cancel" })
      ] })
    ] }) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Loading..." }) : branches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "No branches yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: branches.map((branch) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: isEditing === branch.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formName, onChange: (e) => setFormName(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: formAddress, onChange: (e) => setFormAddress(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, children: "Save" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setIsEditing(null), children: "Cancel" })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-accent" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: branch.name }),
          branch.address && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: branch.address })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
          setIsEditing(branch.id);
          setFormName(branch.name);
          setFormAddress(branch.address || "");
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive", onClick: () => handleDelete(branch.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] })
    ] }) }) }, branch.id)) })
  ] });
}
export {
  BranchesManagement as component
};
