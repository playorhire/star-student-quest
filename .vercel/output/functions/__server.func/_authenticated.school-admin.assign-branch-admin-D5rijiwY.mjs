import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, C as Card, a as CardContent, B as Button, I as Input } from "./_ssr/router-DuskeiVN.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { a6 as TriangleAlert, B as Building2, p as UserCog, T as Trash2, a7 as LoaderCircle, a as Check, X, z as Plus } from "./_libs/lucide-react.mjs";
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
function AssignBranchAdminPage() {
  const {
    user
  } = useAuth();
  const [branches, setBranches] = reactExports.useState([]);
  const [branchAdmins, setBranchAdmins] = reactExports.useState(/* @__PURE__ */ new Map());
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [activeBranchId, setActiveBranchId] = reactExports.useState(null);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    loadData();
  }, [user?.schoolId]);
  async function loadData() {
    if (!user?.schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const {
        data: branchesData,
        error: branchesErr
      } = await supabase.from("branches").select("id, name").eq("school_id", user.schoolId).order("name");
      if (branchesErr) {
        setError(`Branches query failed: ${branchesErr.message}`);
        setLoading(false);
        return;
      }
      const branchesList = branchesData || [];
      setBranches(branchesList);
      const {
        data: adminsData,
        error: adminsErr
      } = await supabase.from("user_roles").select("id, user_id, name, email, school_id, branch_id, tenant_role").eq("school_id", user.schoolId).eq("tenant_role", "branch_admin").eq("is_primary", true);
      if (adminsErr) {
        setError(`Admins query failed: ${adminsErr.message}`);
      }
      const adminsByBranch = /* @__PURE__ */ new Map();
      for (const branch of branchesList) {
        adminsByBranch.set(branch.id, []);
      }
      for (const admin of adminsData || []) {
        if (admin.branch_id && adminsByBranch.has(admin.branch_id)) {
          adminsByBranch.get(admin.branch_id).push(admin);
        }
      }
      setBranchAdmins(adminsByBranch);
    } catch (err) {
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }
  function openAssignForm(branchId) {
    setActiveBranchId(branchId);
    setEmail("");
    setPassword("");
    setName("");
  }
  function closeForm() {
    setActiveBranchId(null);
    setEmail("");
    setPassword("");
    setName("");
  }
  async function handleAssign(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Email and password are required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be 6+ chars");
      return;
    }
    if (!activeBranchId) {
      toast.error("No branch selected");
      return;
    }
    setSubmitting(true);
    const res = await supabase.functions.invoke("create-user", {
      body: {
        email: email.trim(),
        password,
        role: "branch_admin",
        tenant_role: "branch_admin",
        is_primary: true,
        school_id: user.schoolId,
        branch_id: activeBranchId,
        meta: {
          name: name.trim() || email.trim()
        }
      }
    });
    if (res.error) {
      let msg = res.error.message || "Edge function failed";
      const ctx = res.error.context;
      if (ctx?.text) {
        try {
          const text = await ctx.text();
          if (text) {
            try {
              const parsed = JSON.parse(text);
              if (parsed?.error) msg = String(parsed.error);
            } catch {
              msg = text;
            }
          }
        } catch {
        }
      }
      toast.error(`Create failed: ${msg}`);
      setSubmitting(false);
      return;
    }
    if (res.data?.error) {
      toast.error(`Create failed: ${res.data.error}`);
      setSubmitting(false);
      return;
    }
    toast.success("Branch Admin assigned successfully");
    closeForm();
    loadData();
    setSubmitting(false);
  }
  async function handleRemove(adminId, userId) {
    if (!confirm("Remove this branch admin?")) return;
    if (userId) {
      await supabase.functions.invoke("admin-update-user", {
        body: {
          targetUserId: userId,
          deleteUser: true
        }
      });
    }
    const {
      error: error2
    } = await supabase.from("user_roles").delete().eq("id", adminId);
    if (error2) {
      toast.error(error2.message);
    } else {
      toast.success("Branch admin removed");
      loadData();
    }
  }
  const allowedRoles = ["school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Access Denied" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black", children: "Assign Branch Admins" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Assign administrators to each branch" })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Error:" }),
        " ",
        error
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Loading branches..." }) : branches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "No branches found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Create branches first in the Branches section." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: branches.map((branch) => {
      const admins = branchAdmins.get(branch.id) || [];
      const isActive = activeBranchId === branch.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: isActive ? "ring-2 ring-primary" : "", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: branch.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            admins.length,
            " admin",
            admins.length !== 1 ? "s" : "",
            " assigned"
          ] })
        ] }),
        admins.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mb-3", children: admins.map((admin) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: admin.name || admin.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: admin.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive h-8 w-8 p-0", onClick: () => handleRemove(admin.id, admin.user_id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] }, admin.id)) }),
        isActive ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAssign, className: "space-y-3 border-t pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", placeholder: "Email", required: true, value: email, onChange: (e) => setEmail(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", placeholder: "Password (6+ chars)", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Display Name (optional)", value: name, onChange: (e) => setName(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: submitting, className: "flex-1", children: [
              submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-1" }),
              "Assign Admin"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: closeForm, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
              " Cancel"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => openAssignForm(branch.id), className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          " Assign Branch Admin"
        ] })
      ] }) }, branch.id);
    }) })
  ] });
}
export {
  AssignBranchAdminPage as component
};
