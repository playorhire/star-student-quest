import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useAuth, C as Card, b as CardHeader, c as CardTitle, a as CardContent, I as Input, B as Button, s as supabase } from "./_ssr/router-WWTDPtlD.mjs";
import { g as getPasswordValidation, P as PasswordRequirements } from "./_ssr/password-requirements-DUXKa7Wb.mjs";
import { L as Label } from "./_ssr/label-DtSqJuKJ.mjs";
import "./_libs/sonner.mjs";
import "./_libs/html5-qrcode.mjs";
import "./_libs/canvas-confetti.mjs";
import { ag as ShieldCheck, O as Mail, K as KeyRound, R as CircleCheckBig } from "./_libs/lucide-react.mjs";
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
import "./_ssr/progress-BciayuZp.mjs";
import "./_libs/radix-ui__react-progress.mjs";
import "./_libs/radix-ui__react-label.mjs";
function AdminProfile() {
  const {
    user
  } = useAuth();
  const [email, setEmail] = reactExports.useState(user?.email || "");
  const [password, setPassword] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [msg, setMsg] = reactExports.useState("");
  const [err, setErr] = reactExports.useState("");
  const passwordValidation = getPasswordValidation(password);
  async function getFunctionErrorMessage(error, fallback) {
    if (!error) return fallback;
    const context = error.context;
    if (context?.json) {
      try {
        const body = await context.json();
        if (body?.error) return String(body.error);
      } catch {
      }
    }
    if (context?.text) {
      try {
        const text = await context.text();
        if (text) return text;
      } catch {
      }
    }
    return error.message || fallback;
  }
  async function handleSave() {
    setErr("");
    setMsg("");
    if (password && password !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    if (password && !passwordValidation.isValid) {
      setErr("Password does not meet the required criteria");
      return;
    }
    if (!email.trim() && !password) {
      setErr("Nothing to update");
      return;
    }
    setSaving(true);
    try {
      const body = {
        selfUpdate: true
      };
      if (email.trim() && email.trim() !== user?.email) body.email = email.trim();
      if (password) body.password = password;
      const res = await supabase.functions.invoke("admin-update-user", {
        body
      });
      if (res.error) {
        throw new Error(await getFunctionErrorMessage(res.error, "Failed to update account"));
      }
      if (res.data?.error) throw new Error(res.data.error);
      setMsg("Profile updated successfully");
      setPassword("");
      setConfirm("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-foreground", children: "My Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Update your email and password" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2 border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-primary" }),
        " Admin Account"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3" }),
            " Email"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: email, onChange: (e) => setEmail(e.target.value), className: "rounded-xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-2 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-3 w-3" }),
            " Change Password (leave blank to keep current)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "New Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "rounded-xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordRequirements, { password }),
              password && !passwordValidation.isValid && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-destructive", children: "Password does not meet the required criteria." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Confirm Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: confirm, onChange: (e) => setConfirm(e.target.value), className: "rounded-xl" })
            ] })
          ] })
        ] }),
        err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: err }),
        msg && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-green-600 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }),
          " ",
          msg
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, className: "rounded-xl w-full", disabled: saving || Boolean(password) && !passwordValidation.isValid, children: saving ? "Saving..." : "Save Changes" })
      ] })
    ] })
  ] });
}
export {
  AdminProfile as component
};
