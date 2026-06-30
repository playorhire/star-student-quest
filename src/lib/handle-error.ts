import { toast } from "sonner";

/**
 * Show a user-facing toast for a thrown/returned error and log it.
 * Use anywhere a Supabase call, mutation, or async action can fail.
 */
export function notifyError(label: string, err: unknown): string {
  const message =
    (err as any)?.message ||
    (typeof err === "string" ? err : "") ||
    "Something went wrong. Please try again.";
  console.error(`[${label}]`, err);
  toast.error(label, { description: message });
  return message;
}

/** Friendly description for a Supabase PostgrestError-like object. */
export function describeSupabaseError(err: any): string {
  if (!err) return "Unknown error";
  if (err.code === "23505") return "That record already exists.";
  if (err.code === "23503") return "Related record is missing.";
  if (err.code === "42501" || err.message?.includes("permission"))
    return "You don't have permission to perform this action.";
  if (err.message?.includes("JWT") || err.message?.includes("Unauthorized"))
    return "Your session expired. Please sign in again.";
  return err.message || "Something went wrong.";
}