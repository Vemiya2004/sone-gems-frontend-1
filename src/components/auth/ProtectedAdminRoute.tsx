import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { hasAdminPermission, getFirstAllowedAdminPath } from "@/lib/adminNav";

interface ProtectedAdminRouteProps {
  permission: string;
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ permission, children }: ProtectedAdminRouteProps) {
  const { user, permissions, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const isAdmin = user?.role === "admin";
  const allowed = isAuthenticated && hasAdminPermission(isAdmin, permissions, permission);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin");
      return;
    }
    if (!allowed) {
      setLocation(getFirstAllowedAdminPath(isAdmin, permissions));
    }
  }, [isAuthenticated, allowed, isAdmin, permissions, setLocation]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}