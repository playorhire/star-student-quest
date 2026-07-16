import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as Progress } from "./progress-4lmQrHPL.mjs";
import { d as cn } from "./router-OBc8LoFd.mjs";
import { Y as Circle, y as CircleCheck, E as CircleX } from "../_libs/lucide-react.mjs";
const PASSWORD_RULES = [
  {
    key: "length",
    label: "Minimum 8 characters",
    test: (value) => value.length >= 8
  },
  {
    key: "uppercase",
    label: "At least one uppercase letter (A-Z)",
    test: (value) => /[A-Z]/.test(value)
  },
  {
    key: "lowercase",
    label: "At least one lowercase letter (a-z)",
    test: (value) => /[a-z]/.test(value)
  },
  {
    key: "number",
    label: "At least one number (0-9)",
    test: (value) => /\d/.test(value)
  },
  {
    key: "special",
    label: "At least one special character (e.g. !@#$%^&*)",
    test: (value) => /[^A-Za-z0-9]/.test(value)
  }
];
function getPasswordValidation(password) {
  const results = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password)
  }));
  const passedCount = results.filter((rule) => rule.passed).length;
  const isValid = results.every((rule) => rule.passed);
  let strengthLabel = "Weak";
  if (passedCount >= 5) {
    strengthLabel = "Strong";
  } else if (passedCount >= 3) {
    strengthLabel = "Medium";
  }
  return {
    results,
    passedCount,
    isValid,
    strengthLabel,
    strengthPercent: Math.round(passedCount / PASSWORD_RULES.length * 100)
  };
}
function PasswordRequirements({ password }) {
  const validation = getPasswordValidation(password);
  const hasValue = password.length > 0;
  const strengthTone = validation.strengthLabel === "Strong" ? "text-green-600" : validation.strengthLabel === "Medium" ? "text-amber-600" : "text-destructive";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded-xl border border-border/70 bg-muted/30 p-3 transition-all duration-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-foreground", children: "Password requirements" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: cn("text-[11px] font-semibold transition-colors duration-200", hasValue ? strengthTone : "text-muted-foreground"), children: [
        "Strength: ",
        hasValue ? validation.strengthLabel : "--"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: hasValue ? validation.strengthPercent : 0, className: "mt-2 h-1.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-1.5", children: validation.results.map((rule) => {
      const Icon = !hasValue ? Circle : rule.passed ? CircleCheck : CircleX;
      const tone = !hasValue ? "text-muted-foreground" : rule.passed ? "text-green-600" : "text-destructive";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn("flex items-center gap-2 text-[11px] transition-colors duration-200", tone),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: rule.label })
          ]
        },
        rule.key
      );
    }) })
  ] });
}
export {
  PasswordRequirements as P,
  getPasswordValidation as g
};
