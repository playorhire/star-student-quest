import { CheckCircle2, Circle, XCircle } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getPasswordValidation } from "@/lib/password-validation";

type PasswordRequirementsProps = {
  password: string;
};

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const validation = getPasswordValidation(password);
  const hasValue = password.length > 0;

  const strengthTone =
    validation.strengthLabel === "Strong"
      ? "text-green-600"
      : validation.strengthLabel === "Medium"
        ? "text-amber-600"
        : "text-destructive";

  return (
    <div className="mt-2 rounded-xl border border-border/70 bg-muted/30 p-3 transition-all duration-200">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium text-foreground">Password requirements</p>
        <p className={cn("text-[11px] font-semibold transition-colors duration-200", hasValue ? strengthTone : "text-muted-foreground")}>
          Strength: {hasValue ? validation.strengthLabel : "--"}
        </p>
      </div>

      <Progress value={hasValue ? validation.strengthPercent : 0} className="mt-2 h-1.5" />

      <div className="mt-3 space-y-1.5">
        {validation.results.map((rule) => {
          const Icon = !hasValue ? Circle : rule.passed ? CheckCircle2 : XCircle;
          const tone = !hasValue
            ? "text-muted-foreground"
            : rule.passed
              ? "text-green-600"
              : "text-destructive";

          return (
            <div
              key={rule.key}
              className={cn("flex items-center gap-2 text-[11px] transition-colors duration-200", tone)}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{rule.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
