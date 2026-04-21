export type PasswordRule = {
  key: "length" | "uppercase" | "lowercase" | "number" | "special";
  label: string;
  test: (value: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    key: "length",
    label: "Minimum 8 characters",
    test: (value) => value.length >= 8,
  },
  {
    key: "uppercase",
    label: "At least one uppercase letter (A-Z)",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    key: "lowercase",
    label: "At least one lowercase letter (a-z)",
    test: (value) => /[a-z]/.test(value),
  },
  {
    key: "number",
    label: "At least one number (0-9)",
    test: (value) => /\d/.test(value),
  },
  {
    key: "special",
    label: "At least one special character (e.g. !@#$%^&*)",
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

export function getPasswordValidation(password: string) {
  const results = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password),
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
    strengthPercent: Math.round((passedCount / PASSWORD_RULES.length) * 100),
  };
}
