import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, B as Button, C as Card, a as CardContent, I as Input } from "./_ssr/router-DuskeiVN.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { a0 as RefreshCw, z as Plus, a6 as TriangleAlert, B as Building2, a7 as LoaderCircle, a as Check, X, p as UserCog, F as Pencil, T as Trash2 } from "./_libs/lucide-react.mjs";
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
function BranchAdminsManagement() {
  const {
    user
  } = useAuth();
  const [admins, setAdmins] = reactExports.useState([]);
  const [branches, setBranches] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [createBranchId, setCreateBranchId] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editName, setEditName] = reactExports.useState("");
  const [editEmail, setEditEmail] = reactExports.useState("");
  const [editBranchId, setEditBranchId] = reactExports.useState("");
  const [editSubmitting, setEditSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    loadData();
  }, [user?.schoolId]);
  async function loadData() {
    if (!user?.schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const [branchesRes, rolesRes] = await Promise.all([supabase.from("branches").select("id, name").eq("school_id", user.schoolId).order("name"), supabase.from("user_roles").select("id, user_id, name, email, school_id, branch_id, tenant_role, role").eq("school_id", user.schoolId).eq("tenant_role", "branch_admin").eq("is_primary", true).order("name")]);
      if (branchesRes.error) {
        setError(`Branches query failed: ${branchesRes.error.message}`);
      } else {
        setBranches(branchesRes.data || []);
      }
      if (rolesRes.error) {
        setError(`user_roles query failed: ${rolesRes.error.message}`);
      } else {
        setAdmins(rolesRes.data || []);
      }
    } catch (err) {
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }
  async function handleCreate(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Email and password are required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be 6+ chars");
      return;
    }
    if (!createBranchId) {
      toast.error("Please assign a branch");
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
        branch_id: createBranchId,
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
    toast.success("Branch Admin created successfully");
    setShowForm(false);
    setEmail("");
    setPassword("");
    setName("");
    setCreateBranchId("");
    loadData();
    setSubmitting(false);
  }
  async function handleDelete(id, userId) {
    if (!confirm("Remove this branch admin role? This will also delete the user account permanently.")) return;
    if (userId) {
      const {
        error: deleteAuthError
      } = await supabase.functions.invoke("admin-update-user", {
        body: {
          targetUserId: userId,
          deleteUser: true
        }
      });
      if (deleteAuthError) {
        toast.error(`Failed to delete auth user: ${deleteAuthError.message}`);
      }
    }
    const {
      error: error2
    } = await supabase.from("user_roles").delete().eq("id", id);
    if (error2) toast.error(error2.message);
    else {
      toast.success("Branch admin removed");
      loadData();
    }
  }
  function startEdit(admin) {
    setEditingId(admin.id);
    setEditName(admin.name || "");
    setEditEmail(admin.email || "");
    setEditBranchId(admin.branch_id || "");
  }
  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
    setEditBranchId("");
  }
  async function handleSaveEdit(admin) {
    setEditSubmitting(true);
    const updates = {};
    if (editName.trim()) updates.name = editName.trim();
    if (editEmail.trim()) updates.email = editEmail.trim();
    updates.branch_id = editBranchId || null;
    const {
      error: roleError
    } = await supabase.from("user_roles").update(updates).eq("id", admin.id);
    if (roleError) {
      toast.error(`Update failed: ${roleError.message}`);
      setEditSubmitting(false);
      return;
    }
    if (editEmail.trim() && editEmail.trim() !== admin.email) {
      const {
        error: authError
      } = await supabase.functions.invoke("admin-update-user", {
        body: {
          targetUserId: admin.user_id,
          email: editEmail.trim()
        }
      });
      if (authError) {
        toast.error(`Auth email update failed: ${authError.message}`);
      }
    }
    toast.success("Branch admin updated");
    setEditSubmitting(false);
    setEditingId(null);
    loadData();
  }
  const allowedRoles = ["school_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Access Denied" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black", children: "Branch Admins" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage branch administrators" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: loadData, disabled: loading, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}` }),
          " Refresh"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowForm(!showForm), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          showForm ? "Cancel" : "Add"
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Error:" }),
        " ",
        error
      ] })
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreate, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", placeholder: "Email", required: true, value: email, onChange: (e) => setEmail(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", placeholder: "Password (6+ chars)", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Display Name (optional)", value: name, onChange: (e) => setName(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3 w-3" }),
          " Assign Branch *"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, value: createBranchId, onChange: (e) => setCreateBranchId(e.target.value), className: "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Branch" }),
          branches.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: b.id, children: b.name }, b.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: submitting, className: "w-full", children: [
        submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : null,
        "Create Branch Admin"
      ] })
    ] }) }) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Loading..." }) : admins.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground mb-2", children: "No branch admins found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: error ? "Fix the database error above, then refresh." : "Create a branch admin using the Add button." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: admins.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: editingId === a.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editName, onChange: (e) => setEditName(e.target.value), placeholder: "Display name" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: editEmail, onChange: (e) => setEditEmail(e.target.value), placeholder: "Email" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-muted-foreground flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3 w-3" }),
          " Branch"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: editBranchId, onChange: (e) => setEditBranchId(e.target.value), className: "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "No branch assigned" }),
          branches.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: b.id, children: b.name }, b.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => handleSaveEdit(a), disabled: editSubmitting, children: [
          editSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-1" }),
          "Save"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: cancelEdit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1" }),
          " Cancel"
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: a.name || a.email || `User: ${a.user_id?.slice(0, 12)}...` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: a.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Branch: ",
            branches.find((b) => b.id === a.branch_id)?.name || "Unassigned"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => startEdit(a), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-destructive", onClick: () => handleDelete(a.id, a.user_id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] })
    ] }) }) }, a.id)) })
  ] });
}
export {
  BranchAdminsManagement as component
};
