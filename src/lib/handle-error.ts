import { toast } from "sonner";

type ErrorLike = {
  code?: string;
  message?: string;
};

function getErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const message = (err as ErrorLike).message;
    if (message) return message;
  }
  return "Something went wrong. Please try again.";
}

function toErrorLike(err: unknown): ErrorLike {
  return err && typeof err === "object" ? (err as ErrorLike) : {};
}

/**
 * Show a user-facing toast for a thrown/returned error and log it.
 * Use anywhere a Supabase call, mutation, or async action can fail.
 */
export function notifyError(label: string, err: unknown): string {
  const message = getErrorMessage(err);
  console.error(`[${label}]`, err);
  toast.error(label, { description: message });
  return message;
}

/** Friendly description for a Supabase PostgrestError-like object. */
export function describeSupabaseError(err: unknown): string {
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