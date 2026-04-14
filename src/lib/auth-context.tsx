import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Role, students, teachers } from "./mock-data";

interface AuthUser {
  id: string;
  name: string;
  role: Role;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback((role: Role) => {
    if (role === "teacher") {
      setUser({ id: teachers[0].id, name: teachers[0].name, role: "teacher" });
    } else {
      setUser({ id: students[0].id, name: students[0].name, role: "student" });
    }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
