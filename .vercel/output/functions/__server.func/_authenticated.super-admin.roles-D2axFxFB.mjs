import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { s as supabase, d as cn } from "./_ssr/router-DuskeiVN.mjs";
import { C as Checkbox$1, a as CheckboxIndicator } from "./_libs/radix-ui__react-checkbox.mjs";
import { d as describeSupabaseError, n as notifyError, E as ErrorState } from "./_ssr/handle-error-xx_79tXN.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { a7 as LoaderCircle, a9 as Save, a as Check } from "./_libs/lucide-react.mjs";
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
import "./_libs/radix-ui__react-presence.mjs";
const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Checkbox$1,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxIndicator,
      {
        className: cn("grid place-content-center text-current"),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" })
      }
    )
  }
));
Checkbox.displayName = Checkbox$1.displayName;
const ROLES = [
  { key: "super_admin", label: "Super Admin" },
  { key: "school_admin", label: "School Admin" },
  { key: "branch_admin", label: "Branch Admin" },
  { key: "teacher", label: "Teacher" },
  { key: "student", label: "Student" },
  { key: "parent", label: "Parent" }
];
const FEATURES = [
  { section: "General", key: "dashboard.view", label: "View dashboard" },
  { section: "General", key: "profile.edit", label: "Edit own profile" },
  { section: "General", key: "notifications.view", label: "View notifications" },
  { section: "Organization", key: "schools.manage", label: "Manage schools" },
  { section: "Organization", key: "branches.manage", label: "Manage branches" },
  { section: "Organization", key: "school_admins.manage", label: "Manage school admins" },
  { section: "Organization", key: "branch_admins.manage", label: "Manage branch admins" },
  { section: "People", key: "teachers.manage", label: "Manage teachers" },
  { section: "People", key: "teachers.view", label: "View teachers" },
  { section: "People", key: "students.manage", label: "Manage students" },
  { section: "People", key: "students.view", label: "View students" },
  { section: "People", key: "parents.manage", label: "Manage parents" },
  { section: "People", key: "parents.view", label: "View parents" },
  { section: "Academics", key: "classes.manage", label: "Manage classes" },
  { section: "Academics", key: "classes.view", label: "View classes" },
  { section: "Academics", key: "houses.manage", label: "Manage houses" },
  { section: "Academics", key: "houses.view", label: "View houses" },
  { section: "Rewards & Points", key: "badges.manage", label: "Manage badges" },
  { section: "Rewards & Points", key: "badges.view", label: "View badges" },
  { section: "Rewards & Points", key: "rewards.manage", label: "Manage rewards" },
  { section: "Rewards & Points", key: "rewards.view", label: "View rewards" },
  { section: "Rewards & Points", key: "rewards.redeem", label: "Redeem rewards" },
  { section: "Rewards & Points", key: "point_rules.manage", label: "Manage point rules" },
  { section: "Rewards & Points", key: "points.award", label: "Award points" },
  { section: "Rewards & Points", key: "points.view_own", label: "View own points" },
  { section: "Rewards & Points", key: "points.view_history", label: "View points history" },
  { section: "Tools", key: "qr.scan", label: "Scan QR (teacher)" },
  { section: "Tools", key: "qr.show", label: "Show QR (student)" },
  { section: "Tools", key: "messages.send", label: "Send messages" },
  { section: "Tools", key: "messages.view", label: "View messages" },
  { section: "Tools", key: "reports.view", label: "View reports" },
  { section: "Tools", key: "settings.manage", label: "Manage settings" }
];
const FEATURE_SECTIONS = Array.from(
  new Set(FEATURES.map((f) => f.section))
);
const cellKey = (role, feat) => `${role}:${feat}`;
function RolesMatrixPage() {
  const [initial, setInitial] = reactExports.useState({});
  const [matrix, setMatrix] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const load = reactExports.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data,
        error: err
      } = await supabase.from("role_permissions").select("role, feature_key, allowed");
      if (err) throw err;
      const next = {};
      for (const role of ROLES.map((r) => r.key)) {
        for (const f of FEATURES) next[cellKey(role, f.key)] = false;
      }
      for (const row of data ?? []) {
        next[cellKey(row.role, row.feature_key)] = row.allowed;
      }
      setInitial(next);
      setMatrix(next);
    } catch (err) {
      setError(describeSupabaseError(err));
      notifyError("Failed to load permissions", err);
    } finally {
      setLoading(false);
    }
  }, []);
  reactExports.useEffect(() => {
    void load();
  }, [load]);
  const dirty = reactExports.useMemo(() => Object.keys(matrix).some((k) => matrix[k] !== initial[k]), [matrix, initial]);
  const toggleCell = (role, feat) => {
    setMatrix((m) => ({
      ...m,
      [cellKey(role, feat)]: !m[cellKey(role, feat)]
    }));
  };
  const toggleRow = (feat, value) => {
    setMatrix((m) => {
      const next = {
        ...m
      };
      for (const r of ROLES) next[cellKey(r.key, feat)] = value;
      return next;
    });
  };
  const toggleCol = (role, value) => {
    setMatrix((m) => {
      const next = {
        ...m
      };
      for (const f of FEATURES) next[cellKey(role, f.key)] = value;
      return next;
    });
  };
  const save = async () => {
    setSaving(true);
    try {
      const changed = Object.keys(matrix).filter((k) => matrix[k] !== initial[k]);
      const rows = changed.map((k) => {
        const [role, feature_key] = k.split(":");
        return {
          role,
          feature_key,
          allowed: matrix[k]
        };
      });
      if (rows.length === 0) return;
      const {
        error: err
      } = await supabase.from("role_permissions").upsert(rows, {
        onConflict: "role,feature_key"
      });
      if (err) throw err;
      setInitial(matrix);
      toast.success("Permissions saved", {
        description: `${rows.length} change${rows.length === 1 ? "" : "s"} applied`
      });
    } catch (err) {
      notifyError("Failed to save permissions", err);
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-20 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin mr-2" }),
      " Loading permissions…"
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { title: "Couldn't load permissions", message: error, onRetry: load });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "Roles & Permissions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Set which features each user group can access." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: save, disabled: !dirty || saving, className: "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow disabled:opacity-40", children: [
        saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
        "Save"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm border-collapse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 z-20 bg-muted/50 text-left px-3 py-2 min-w-[200px] font-semibold", children: "Feature" }),
        ROLES.map((r) => {
          const allChecked = FEATURES.every((f) => matrix[cellKey(r.key, f.key)]);
          return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-semibold text-center min-w-[96px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: r.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: allChecked, onCheckedChange: (v) => toggleCol(r.key, Boolean(v)), "aria-label": `Toggle all for ${r.label}` })
          ] }) }, r.key);
        })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: FEATURE_SECTIONS.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsx(ExpandSection, { section, matrix, toggleCell, toggleRow }, section)) })
    ] }) }) }),
    dirty && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "You have unsaved changes. Click Save to apply." })
  ] });
}
function ExpandSection({
  section,
  matrix,
  toggleCell,
  toggleRow
}) {
  const feats = FEATURES.filter((f) => f.section === section);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: ROLES.length + 1, className: "sticky left-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: section }) }),
    feats.map((f) => {
      const rowAll = ROLES.every((r) => matrix[cellKey(r.key, f.key)]);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t hover:bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 z-10 bg-card px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: rowAll, onCheckedChange: (v) => toggleRow(f.key, Boolean(v)), "aria-label": `Toggle all roles for ${f.label}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: f.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-mono", children: f.key })
          ] })
        ] }) }),
        ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: Boolean(matrix[cellKey(r.key, f.key)]), onCheckedChange: () => toggleCell(r.key, f.key), "aria-label": `${r.label} — ${f.label}` }) }, r.key))
      ] }, f.key);
    })
  ] });
}
export {
  RolesMatrixPage as component
};
