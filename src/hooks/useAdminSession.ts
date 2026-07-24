"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getAdminStats, listMembers, type MemberProfile } from "@/lib/member-store";

export function useAdminSession() {
  const { ready, isAdmin, logout, refreshProfile } = useAuth();
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getAdminStats>> | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAdmin) {
      setMembers([]);
      setStats(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [list, s] = await Promise.all([listMembers(), getAdminStats()]);
      setMembers(list);
      setStats(s);
      await refreshProfile();
    } catch (err) {
      console.error("Falha ao carregar admin:", err);
      setMembers([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, refreshProfile]);

  useEffect(() => {
    if (!ready) return;
    void refresh();
  }, [ready, refresh]);

  return {
    ready: ready && !loading,
    isAdmin,
    members,
    stats: stats ?? {
      total: 0,
      ativos: 0,
      pendentes: 0,
      inadimplentes: 0,
      bloqueados: 0,
      totalReserva: 0,
      totalBloqueado: 0,
      totalBonus: 0,
      totalDepositos: 0,
      novosHoje: 0,
      recentes: [] as MemberProfile[],
    },
    refresh,
    logout,
  };
}
