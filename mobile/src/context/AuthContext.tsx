import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { auth } from "../lib/firebase";
import { ensureMemberProfile, getMember } from "../lib/members";
import { registerExpoPushToken, unregisterExpoPushToken } from "../lib/push-tokens";
import type { MemberProfile } from "../types";

type AuthValue = {
  user: User | null;
  member: MemberProfile | null;
  initializing: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let active = true;
    const safetyTimer = setTimeout(() => {
      if (active) setInitializing(false);
    }, 8000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (nextUser) => {
        if (!active) return;

        if (!nextUser) {
          clearTimeout(safetyTimer);
          setUser(null);
          setMember(null);
          setInitializing(false);
          return;
        }

        void ensureMemberProfile(nextUser)
          .then(async (profile) => {
            if (!active) return;
            clearTimeout(safetyTimer);
            setUser(nextUser);
            setMember(profile);
            setInitializing(false);
            try {
              await registerExpoPushToken();
            } catch (error) {
              console.warn("Não foi possível registrar push token.", error);
            }
          })
          .catch((error) => {
            console.warn("Não foi possível carregar o perfil do associado.", error);
            if (active) {
              clearTimeout(safetyTimer);
              setUser(null);
              setMember(null);
              setInitializing(false);
            }
          });
      },
      (error) => {
        console.warn("Não foi possível restaurar a sessão Firebase.", error);
        clearTimeout(safetyTimer);
        if (!active) return;
        setUser(null);
        setMember(null);
        setInitializing(false);
      },
    );

    return () => {
      active = false;
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      member,
      initializing,
      refresh: async () => {
        if (!user) return;
        try {
          setMember(await getMember(user.uid));
        } catch (error) {
          console.warn("Não foi possível atualizar o perfil.", error);
        }
      },
      logout: async () => {
        try {
          await unregisterExpoPushToken();
        } catch {
          /* ignore */
        }
        await signOut(auth);
      },
    }),
    [initializing, member, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return value;
}
