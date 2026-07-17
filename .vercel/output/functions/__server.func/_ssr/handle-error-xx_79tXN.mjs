import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./router-DuskeiVN.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { $ as CircleAlert, a0 as RefreshCw } from "../_libs/lucide-react.mjs";
function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center ${className}`,
      role: "alert",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-8 w-8 text-destructive" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-foreground", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: message })
        ] }),
        onRetry && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: onRetry,
            className: "rounded-full font-bold",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-3.5 w-3.5" }),
              "Try again"
            ]
          }
        )
      ]
    }
  );
}
function getErrorMessage(err) {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const message = err.message;
    if (message) return message;
  }
  return "Something went wrong. Please try again.";
}
function toErrorLike(err) {
  return err && typeof err === "object" ? err : {};
}
function notifyError(label, err) {
  const message = getErrorMessage(err);
  console.error(`[${label}]`, err);
  toast.error(label, { description: message });
  return message;
}
function describeSupabaseError(err) {
  if (!err) return "Unknown error";
  const error = toErrorLike(err);
  if (error.code === "23505") return "That record already exists.";
  if (error.code === "23503") return "Related record is missing.";
  if (error.code === "42501" || error.message?.includes("permission"))
    return "You don't have permission to perform this action.";
  if (error.message?.includes("JWT") || error.message?.includes("Unauthorized"))
    return "Your session expired. Please sign in again.";
  return error.message || "Something went wrong.";
}
export {
  ErrorState as E,
  describeSupabaseError as d,
  notifyError as n
};
