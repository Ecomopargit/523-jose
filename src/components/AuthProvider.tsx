"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import {
  fetchMemberByUid,
  logoutMember,
  subscribeAuth,
  type MemberProfile,
} from "@/lib/member-store";

type AuthContextValue = {
  ready: boolean;
  user: User | null;
  member: MemberProfile | null;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<MemberProfile | null>(null);

  const loadProfile = useCallback(async (u: User | null) => {
    if (!u) {
      setMember(null);
      return;
    }
    try {
      const profile = await fetchMemberByUid(u.uid);
      setMember(profile);
    } catch (err) {
      console.error("Falha ao carregar perfil Firestore:", err);
      setMember(null);
    }
  }, []);

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setReady(false);
      setUser(u);
      void (async () => {
        try {
          await loadProfile(u);
        } finally {
          setReady(true);
        }
      })();
    });
    return () => unsub();
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    await loadProfile(user);
  }, [loadProfile, user]);

  const logout = useCallback(async () => {
    await logoutMember();
    setMember(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      user,
      member,
      isAdmin: member?.role === "admin",
      refreshProfile,
      logout,
    }),
    [ready, user, member, refreshProfile, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
