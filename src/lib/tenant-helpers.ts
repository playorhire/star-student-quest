import { supabase } from "@/integrations/supabase/client";

/**
 * Get current user's role from the database via RPC.
 */
export async function getCurrentUserRole(): Promise<string | null> {
  const { data, error } = await (supabase as any).rpc("get_my_tenant_role");
  if (error) throw error;
  return data as string | null;
}

/**
 * Get current user's school_id.
 */
export async function getCurrentSchoolId(): Promise<string | null> {
  const { data, error } = await (supabase as any).rpc("get_my_school_id");
  if (error) throw error;
  return data as string | null;
}

/**
 * Get current user's branch_id.
 */
export async function getCurrentBranchId(): Promise<string | null> {
  const { data, error } = await (supabase as any).rpc("get_my_branch_id");
  if (error) throw error;
  return data as string | null;
}

/**
 * Check if current user has a specific tenant role.
 */
export async function hasTenantRole(role: string): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc("has_tenant_role", { _role: role });
  if (error) throw error;
  return data as boolean;
}

/**
 * Check if current user is super_admin.
 */
export async function isSuperAdmin(): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc("is_super_admin");
  if (error) throw error;
  return data as boolean;
}

/**
 * Apply tenant filters to a Supabase query.
 * Use this when you need explicit client-side filtering.
 */
export function enforceTenantFilter<T>(
  query: any,
  options?: { schoolId?: string; branchId?: string }
): any {
  const schoolId = options?.schoolId;
  const branchId = options?.branchId;

  if (schoolId) {
    query = query.eq("school_id", schoolId);
  }
  if (branchId) {
    query = query.eq("branch_id", branchId);
  }
  return query;
}

/**
 * Build a query scoped to the user's school.
 */
export async function queryBySchool(table: string, schoolId?: string) {
  const sid = schoolId || (await getCurrentSchoolId());
  if (!sid) throw new Error("No school_id available");
  return (supabase as any).from(table).select("*").eq("school_id", sid);
}

/**
 * Build a query scoped to the user's branch.
 */
export async function queryByBranch(table: string, branchId?: string) {
  const bid = branchId || (await getCurrentBranchId());
  if (!bid) throw new Error("No branch_id available");
  return (supabase as any).from(table).select("*").eq("branch_id", bid);
}
