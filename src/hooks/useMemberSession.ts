"use client";

import { useAuth } from "@/components/AuthProvider";

/** @deprecated prefer useAuth — mantido para compatibilidade */
export function useMemberSession() {
  const { member, ready, refreshProfile, logout } = useAuth();
  return {
    member: member?.role === "admin" ? null : member,
    ready,
    refresh: refreshProfile,
    logout,
  };
}
