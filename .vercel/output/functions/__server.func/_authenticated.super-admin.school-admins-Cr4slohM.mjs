import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, s as supabase, B as Button, C as Card, a as CardContent, I as Input } from "./_ssr/router-DuskeiVN.mjs";
import { L as Label } from "./_ssr/label-TEKU4-jV.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { a0 as RefreshCw, z as Plus, a6 as TriangleAlert, q as School, a7 as LoaderCircle, a8 as Copy, a as Check, X, p as UserCog, F as Pencil, T as Trash2 } from "./_libs/lucide-react.mjs";
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
import "./_libs/radix-ui__react-label.mjs";
function SchoolAdminsManagement() {
  const {
    user
  } = useAuth();
  const [admins, setAdmins] = reactExports.useState([]);
  const [schools, setSchools] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [showSqlMode, setShowSqlMode] = reactExports.useState(false);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [createSchoolId, setCreateSchoolId] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [debugInfo, setDebugInfo] = reactExports.useState("");
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editName, setEditName] = reactExports.useState("");
  const [editEmail, setEditEmail] = reactExports.useState("");
  const [editSchoolId, setEditSchoolId] = reactExports.useState("");
  const [editSubmitting, setEditSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    loadData();
  }, []);
  async function loadData() {
    setLoading(true);
    setError(null);
    setDebugInfo("");
    try {
      const [schoolsRes, rolesRes] = await Promise.all([supabase.from("schools").select("id, name").order("name"), supabase.from("user_roles").select("id, user_id, name, email, school_id, tenant_role, role, schools(id, name)").eq("tenant_role", "school_admin").eq("is_primary", true).order("name")]);
      if (schoolsRes.error) {
        setError(`Schools query failed: ${schoolsRes.error.message} (${schoolsRes.error.code})`);
        setDebugInfo((prev) => prev + `Schools error: ${JSON.stringify(schoolsRes.error)}
`);
      } else {
        setSchools(schoolsRes.data || []);
        setDebugInfo((prev) => prev + `Schools loaded: ${schoolsRes.data?.length || 0} rows
`);
      }
      if (rolesRes.error) {
        const errMsg = `user_roles query failed: ${rolesRes.error.message} (${rolesRes.error.code})`;
        setError((prev) => prev ? `${prev}; ${errMsg}` : errMsg);
        setDebugInfo((prev) => prev + `user_roles error: ${JSON.stringify(rolesRes.error)}
`);
      } else {
        const schoolAdmins = rolesRes.data || [];
        setAdmins(schoolAdmins);
        setDebugInfo((prev) => prev + `School admins loaded: ${schoolAdmins.length} rows
`);
      }
    } catch (err) {
      setError(`Unexpected error: ${err.message}`);
      setDebugInfo((prev) => prev + `Exception: ${err.message}
`);
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
    setSubmitting(true);
    setDebugInfo("");
    setDebugInfo((prev) => prev + `Step 1: Invoking create-user edge function for ${email.trim()}...
`);
    const res = await supabase.functions.invoke("create-user", {
      body: {
        email: email.trim(),
        password,
        role: "school_admin",
        tenant_role: "school_admin",
        is_primary: true,
        school_id: createSchoolId || void 0
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
      setDebugInfo((prev) => prev + `Edge function ERROR: ${msg}
`);
      toast.error(`Create failed: ${msg}`);
      setSubmitting(false);
      return;
    }
    if (res.data?.error) {
      setDebugInfo((prev) => prev + `Edge function returned error: ${res.data.error}
`);
      toast.error(`Create failed: ${res.data.error}`);
      setSubmitting(false);
      return;
    }
    const userId = res.data?.userId;
    if (!userId) {
      setDebugInfo((prev) => prev + `Edge function returned no userId. Response: ${JSON.stringify(res.data)}
`);
      toast.error("Could not get new user ID.");
      setSubmitting(false);
      return;
    }
    setDebugInfo((prev) => prev + `Step 2: SUCCESS! Auth user created via edge function: ${userId}
`);
    setDebugInfo((prev) => prev + `Step 3: user_roles inserted
`);
    toast.success("School Admin created successfully");
    setShowForm(false);
    setEmail("");
    setPassword("");
    setCreateSchoolId("");
    loadData();
    setSubmitting(false);
  }
  async function handleDelete(id, userId) {
    if (!confirm("Remove this school admin role? This will also delete the user account permanently.")) return;
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
      toast.success("School admin removed");
      loadData();
    }
  }
  function startEdit(admin) {
    setEditingId(admin.id);
    setEditName(admin.name || "");
    setEditEmail(admin.email || "");
    setEditSchoolId(admin.school_id || "");
  }
  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
    setEditSchoolId("");
  }
  async function handleSaveEdit(admin) {
    setEditSubmitting(true);
    const updates = {};
    if (editName.trim()) updates.name = editName.trim();
    if (editEmail.trim()) updates.email = editEmail.trim();
    updates.school_id = editSchoolId || null;
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
    toast.success("School admin updated");
    setEditSubmitting(false);
    setEditingId(null);
    loadData();
  }
  if (user?.role !== "super_admin") return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Access Denied" }) });
  const sqlCommand = `-- Run this in Supabase SQL Editor to manually create a school admin:

-- 1. Sign up the user first (or use an existing auth.users.id)
-- The auth user ID will be shown after signUp in Auth > Users

-- 2. Insert role (replace the user_id with actual value):
INSERT INTO public.user_roles (user_id, role, tenant_role, is_primary)
VALUES (
  'PASTE-USER-ID-HERE',
  'school_admin',
  'school_admin',
  true
);`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black", children: "School Admins" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage school administrators" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: loadData, disabled: loading, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}` }),
          " Refresh"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
          setShowForm(!showForm);
          setShowSqlMode(false);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          showForm ? "Cancel" : "Add"
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Database Error:" }),
        " ",
        error,
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs opacity-80", children: "This usually means the tenant_role column or RLS policies are not set up. Run the complete SQL setup script first." })
      ] })
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: showSqlMode ? "outline" : "default", size: "sm", onClick: () => setShowSqlMode(false), children: "UI Form" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: showSqlMode ? "default" : "outline", size: "sm", onClick: () => setShowSqlMode(true), children: "SQL Method" })
      ] }),
      !showSqlMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreate, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-email", children: "Email *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "admin-email", type: "email", placeholder: "schooladmin@school.com", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-password", children: "Password *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "admin-password", type: "password", placeholder: "Minimum 6 characters", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Required for login access" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "admin-school", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "h-4 w-4" }),
            "Assign School"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "admin-school", value: createSchoolId, onChange: (e) => setCreateSchoolId(e.target.value), className: "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a school" }),
            schools.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "The school this admin will manage" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: submitting, className: "w-full", children: [
          submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-1" }) : null,
          "Create School Admin"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-muted rounded-lg p-3 text-xs font-mono whitespace-pre-wrap overflow-auto max-h-60", children: [
          sqlCommand,
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "absolute top-2 right-2", onClick: () => {
            navigator.clipboard.writeText(sqlCommand);
            toast.success("Copied SQL");
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "1. Create a user in Supabase Dashboard → Authentication → Users → Add User",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "2. Copy their UUID and paste into the SQL above",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "3. Run the SQL in the SQL Editor"
        ] })
      ] })
    ] }) }),
    debugInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-lg p-3 text-xs font-mono whitespace-pre-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground mb-1 font-semibold", children: "Debug Log:" }),
      debugInfo
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Loading..." }) : admins.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground mb-2", children: "No school admins found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: error ? "Fix the database error above, then refresh." : "Create a school admin using the Add button." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: admins.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: editingId === a.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-name", children: "Display Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "edit-name", value: editName, onChange: (e) => setEditName(e.target.value), placeholder: "Display name" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-email", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "edit-email", type: "email", value: editEmail, onChange: (e) => setEditEmail(e.target.value), placeholder: "Email" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "edit-school", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "h-4 w-4" }),
          "School"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "edit-school", value: editSchoolId, onChange: (e) => setEditSchoolId(e.target.value), className: "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a school" }),
          schools.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id))
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: a.schools?.name || "No school assigned" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
            "role: ",
            a.role,
            " • tenant: ",
            a.tenant_role
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
  SchoolAdminsManagement as component
};
