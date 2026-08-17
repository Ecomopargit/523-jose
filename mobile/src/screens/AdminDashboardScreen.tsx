import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenAtmosphere } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { getAdminStats, setMemberStatus, type AdminStats } from "../lib/admin";
import { colors, fonts, shadow } from "../theme";
import type { MemberProfile } from "../types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";

const money = (value = 0) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type Props = NativeStackScreenProps<RootStackParamList, "Admin">;

export function AdminDashboardScreen({ navigation }: Props) {
  const { logout } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      setStats(await getAdminStats());
    } catch {
      setError("Não foi possível carregar os dados administrativos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function approve(member: MemberProfile) {
    setUpdatingId(member.id);
    try {
      await setMemberStatus(member.id, "ativo");
      await load(true);
    } catch {
      Alert.alert("Não foi possível aprovar", "Verifique sua conexão e tente novamente.");
    } finally {
      setUpdatingId("");
    }
  }

  function confirmLogout() {
    Alert.alert("Sair do painel?", "A sessão administrativa será encerrada.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout },
    ]);
  }

  const pending = stats?.members.filter((member) => member.status === "pendente").slice(0, 5) || [];

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScreenAtmosphere />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl colors={[colors.green600]} onRefresh={() => load(true)} refreshing={refreshing} tintColor={colors.green600} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>PAINEL ADMINISTRATIVO</Text>
            <Text style={styles.title}>Visão geral</Text>
            <Text style={styles.subtitle}>Gestão ECOMOPAR em tempo real</Text>
          </View>
          <Pressable accessibilityLabel="Sair" onPress={confirmLogout} style={({ pressed }) => [styles.logout, pressed && styles.pressed]}>
            <Feather color={colors.danger} name="log-out" size={18} />
          </Pressable>
        </View>

        <LinearGradient colors={[colors.green800, colors.green950]} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.adminTag}><Feather color={colors.green400} name="shield" size={13} /><Text style={styles.adminTagText}>ACESSO ADMINISTRATIVO</Text></View>
          <Text style={styles.heroLabel}>PATRIMÔNIO SOB GESTÃO</Text>
          <Text style={styles.heroValue}>{money(stats?.totalAssets)}</Text>
          <View style={styles.heroRule} />
          <View style={styles.heroFooter}>
            <View><Text style={styles.heroMetaLabel}>DISPONÍVEL</Text><Text style={styles.heroMetaValue}>{money(stats?.totalAvailable)}</Text></View>
            <View><Text style={styles.heroMetaLabel}>ASSOCIADOS</Text><Text style={styles.heroMetaValue}>{stats?.total || 0}</Text></View>
            <View><Text style={styles.heroMetaLabel}>RECEITA PIX</Text><Text style={styles.heroMetaValue}>{money(stats?.adminRevenue)}</Text></View>
          </View>
        </LinearGradient>

        {loading ? (
          <View style={styles.loading}><ActivityIndicator color={colors.green600} size="large" /><Text style={styles.loadingText}>Carregando painel…</Text></View>
        ) : error ? (
          <View style={styles.error}><Feather color={colors.danger} name="alert-circle" size={20} /><Text style={styles.errorText}>{error}</Text><Pressable onPress={() => load()}><Text style={styles.retry}>Tentar novamente</Text></Pressable></View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Indicadores</Text>
            <View style={styles.statsGrid}>
              <Stat icon="users" label="Cadastrados" tone="green" value={stats?.total || 0} />
              <Stat icon="check-circle" label="Ativos" tone="green" value={stats?.active || 0} />
              <Stat icon="clock" label="Pendentes" tone="amber" value={stats?.pending || 0} />
              <Stat icon="alert-circle" label="Inadimplentes" tone="brick" value={stats?.overdue || 0} />
              <Stat icon="zap" label="PIX aprovados" tone="green" value={stats?.approvedPix || 0} />
            </View>

            <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>Aprovações pendentes</Text><Text style={styles.sectionHint}>Cadastros aguardando análise</Text></View><View style={styles.countBadge}><Text style={styles.countText}>{stats?.pending || 0}</Text></View></View>
            <View style={styles.pendingCard}>
              {pending.length ? pending.map((member, index) => (
                <View key={member.id}>
                  <View style={styles.memberRow}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>{initials(member.nome)}</Text></View>
                    <View style={styles.memberCopy}><Text numberOfLines={1} style={styles.memberName}>{member.nome || "Associado"}</Text><Text numberOfLines={1} style={styles.memberEmail}>{member.email}</Text></View>
                    <Pressable disabled={updatingId === member.id} onPress={() => approve(member)} style={({ pressed }) => [styles.approve, pressed && styles.pressed]}>
                      {updatingId === member.id ? <ActivityIndicator color={colors.white} size="small" /> : <><Feather color={colors.white} name="check" size={14} /><Text style={styles.approveText}>Aprovar</Text></>}
                    </Pressable>
                  </View>
                  {index < pending.length - 1 && <View style={styles.rowRule} />}
                </View>
              )) : (
                <View style={styles.empty}><View style={styles.emptyIcon}><Feather color={colors.green700} name="check-circle" size={22} /></View><Text style={styles.emptyTitle}>Fila limpa</Text><Text style={styles.emptyText}>Nenhum cadastro pendente no momento.</Text></View>
              )}
            </View>

            <Text style={styles.sectionTitle}>Acesso rápido</Text>
            <View style={styles.actions}>
              <AdminAction icon="users" label="Associados" onPress={() => navigation.navigate("AdminOperations", { section: "associados" })} />
              <AdminAction icon="trending-down" label="Saques" onPress={() => navigation.navigate("AdminOperations", { section: "saques" })} />
              <AdminAction icon="message-circle" label="Atendimento" onPress={() => navigation.navigate("AdminOperations", { section: "atendimento" })} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "AS";
}

function Stat({ icon, label, value, tone }: { icon: keyof typeof Feather.glyphMap; label: string; value: number; tone: "green" | "amber" | "brick" }) {
  const palette = tone === "amber" ? [colors.amber100, colors.amber600] : tone === "brick" ? [colors.brick100, colors.brick500] : [colors.green100, colors.green700];
  return <View style={styles.stat}><View style={[styles.statIcon, { backgroundColor: palette[0] }]}><Feather color={palette[1]} name={icon} size={17} /></View><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function AdminAction({ icon, label, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}><View style={styles.actionIcon}><Feather color={colors.green700} name={icon} size={19} /></View><Text style={styles.actionText}>{label}</Text><Text style={styles.actionHint}>Abrir</Text></Pressable>;
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 20, paddingBottom: 44 },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1.35 },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 28, letterSpacing: -1, marginTop: 3 },
  subtitle: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 10, marginTop: 2 },
  logout: { alignItems: "center", backgroundColor: colors.brick100, borderRadius: 13, height: 43, justifyContent: "center", width: 43 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  hero: { borderRadius: 24, overflow: "hidden", padding: 21, ...shadow },
  heroGlow: { backgroundColor: "rgba(58,182,137,0.16)", borderRadius: 100, height: 180, position: "absolute", right: -65, top: -75, width: 180 },
  adminTag: { alignItems: "center", alignSelf: "flex-start", backgroundColor: "rgba(58,182,137,0.12)", borderRadius: 13, flexDirection: "row", gap: 6, paddingHorizontal: 9, paddingVertical: 6 },
  adminTagText: { color: colors.green400, fontFamily: fonts.bold, fontSize: 7, letterSpacing: 0.8 },
  heroLabel: { color: "rgba(255,255,255,0.48)", fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1.25, marginTop: 20 },
  heroValue: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 31, letterSpacing: -1, marginTop: 4 },
  heroRule: { backgroundColor: "rgba(255,255,255,0.10)", height: 1, marginVertical: 16 },
  heroFooter: { flexDirection: "row", gap: 42 },
  heroMetaLabel: { color: "rgba(255,255,255,0.4)", fontFamily: fonts.bold, fontSize: 7, letterSpacing: 0.8 },
  heroMetaValue: { color: colors.white, fontFamily: fonts.bold, fontSize: 12, marginTop: 3 },
  loading: { alignItems: "center", paddingVertical: 60 },
  loadingText: { color: colors.inkSoft, fontFamily: fonts.medium, fontSize: 10, marginTop: 12 },
  error: { alignItems: "center", backgroundColor: colors.brick100, borderRadius: 18, marginTop: 22, padding: 22 },
  errorText: { color: colors.danger, fontFamily: fonts.semibold, fontSize: 10, marginTop: 8, textAlign: "center" },
  retry: { color: colors.green700, fontFamily: fonts.bold, fontSize: 10, marginTop: 12 },
  sectionTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 15, marginTop: 25 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  stat: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 17, borderWidth: 1, minHeight: 112, padding: 14, width: "48.4%", ...shadow },
  statIcon: { alignItems: "center", borderRadius: 9, height: 33, justifyContent: "center", width: 33 },
  statValue: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 21, marginTop: 9 },
  statLabel: { color: colors.inkSoft, fontFamily: fonts.medium, fontSize: 9, marginTop: 1 },
  sectionHeader: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between" },
  sectionHint: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 8.5, marginTop: 2 },
  countBadge: { alignItems: "center", backgroundColor: colors.amber100, borderRadius: 10, height: 27, justifyContent: "center", minWidth: 27 },
  countText: { color: colors.amber600, fontFamily: fonts.bold, fontSize: 10 },
  pendingCard: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 19, borderWidth: 1, marginTop: 12, padding: 14, ...shadow },
  memberRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  avatar: { alignItems: "center", backgroundColor: colors.amber100, borderRadius: 12, height: 40, justifyContent: "center", width: 40 },
  avatarText: { color: colors.amber600, fontFamily: fonts.bold, fontSize: 10 },
  memberCopy: { flex: 1 },
  memberName: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 10.5 },
  memberEmail: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 8.5, marginTop: 2 },
  approve: { alignItems: "center", backgroundColor: colors.green600, borderRadius: 10, flexDirection: "row", gap: 4, height: 34, justifyContent: "center", minWidth: 73, paddingHorizontal: 9 },
  approveText: { color: colors.white, fontFamily: fonts.bold, fontSize: 8.5 },
  rowRule: { backgroundColor: colors.line, height: 1, marginLeft: 50, marginVertical: 12 },
  empty: { alignItems: "center", paddingVertical: 16 },
  emptyIcon: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 13, height: 44, justifyContent: "center", width: 44 },
  emptyTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 12, marginTop: 9 },
  emptyText: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 9, marginTop: 3 },
  actions: { flexDirection: "row", gap: 9, marginTop: 12 },
  action: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 16, borderWidth: 1, flex: 1, paddingVertical: 14, ...shadow },
  actionIcon: { alignItems: "center", backgroundColor: colors.green50, borderRadius: 10, height: 37, justifyContent: "center", width: 37 },
  actionText: { color: colors.ink, fontFamily: fonts.bold, fontSize: 8.5, marginTop: 7 },
  actionHint: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 7, marginTop: 1 },
});
