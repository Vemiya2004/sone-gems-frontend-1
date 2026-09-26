import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/api-client";
import { setAuthTokenGetter } from "@/api-client";

interface AuthContextType {
  user: User | null;
  token: string | null;
  permissions: string[];
  login: (token: string, user: User) => void;
  logout: () => void;
  isAdmin: boolean;
  isStaff: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("wg_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("wg_token");
  });

  const [permissions, setPermissions] = useState<string[]>(() => {
    const saved = localStorage.getItem("wg_permissions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setAuthTokenGetter(() => localStorage.getItem("wg_token"));
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    const perms = (newUser as any)?.permissions || [];
    setPermissions(perms);
    localStorage.setItem("wg_token", newToken);
    localStorage.setItem("wg_user", JSON.stringify(newUser));
    localStorage.setItem("wg_permissions", JSON.stringify(perms));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPermissions([]);
    localStorage.removeItem("wg_token");
    localStorage.removeItem("wg_user");
    localStorage.removeItem("wg_permissions");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        login,
        logout,
        isAdmin: user?.role === UserRole.admin,
        isStaff: user?.role === UserRole.staff || user?.role === UserRole.admin,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
