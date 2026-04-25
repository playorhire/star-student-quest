import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type TenantRole = "super_admin" | "school_admin" | "branch_admin" | "teacher" | "student" | "parent" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: TenantRole;
  schoolId: string | null;
  branchId: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

async function fetchUserRole(userId: string): Promise<AuthUser | null> {
  const { data } = await (supabase as any)
    .from("user_roles")
    .select("tenant_role, school_id, branch_id")
    .eq("user_id", userId)
    .eq("is_primary", true)
    .limit(1)
    .single();

  if (!data) return null;

  return {
    id: userId,
    email: "",
    role: (data.tenant_role || "student") as TenantRole,
    schoolId: data.school_id,
    branchId: data.branch_id,
  };
}

function buildAuthUser(supaUser: User, roleData: AuthUser | null): AuthUser {
  return {
    id: supaUser.id,
    email: supaUser.email || "",
    role: roleData?.role || "student",
    schoolId: roleData?.schoolId || null,
    branchId: roleData?.branchId || null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session first (synchronous-ish path)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const roleData = await fetchUserRole(session.user.id);
        if (roleData) {
          setUser(buildAuthUser(session.user, roleData));
        }
      }
      setLoading(false);
    });

    // Listen for subsequent auth changes (sign in/out) — no await inside
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          // Fire and forget — don't block the listener
          fetchUserRole(session.user.id).then((roleData) => {
            if (roleData) {
              setUser(buildAuthUser(session.user!, roleData));
            } else {
              setUser(null);
            }
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, session, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
