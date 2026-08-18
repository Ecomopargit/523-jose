import { Feather } from "@expo/vector-icons";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActivationFlowModal } from "../components/ActivationFlowModal";
import { Card, IconBadge, ScreenAtmosphere } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { colors, fonts, shadow } from "../theme";
import type { AppTabParamList } from "../types";

type Props = BottomTabScreenProps<AppTabParamList, "Início">;

const money = (value = 0) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function HomeScreen({ navigation }: Props) {
  const { member, refresh } = useAuth();
  const [moneyVisible, setMoneyVisible] = useState(true);
  const [activationOpen, setActivationOpen] = useState(false);
  const firstName = member?.nome?.split(" ")[0] || "Associado";
  const total = (member?.saldoDisponivel || 0) + (member?.saldoBloqueado || 0) + (member?.saldoBonus || 0);
  const isActive = member?.status === "ativo";
  const status = isActive ? "Cadastro ativo" : "Cadastro em análise";

  const handleActivated = useCallback(async () => {
    await refresh();
  }, [refresh]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <StatusBar style="dark" />
      <ScreenAtmosphere />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl colors={[colors.green600]} onRefresh={refresh} refreshing={false} tintColor={colors.green600} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.top}>
          <View>
            <View style={styles.welcomeRow}><View style={styles.welcomeLine} /><Text style={styles.welcomeLabel}>BEM-VINDO DE VOLTA</Text></View>
            <Text style={styles.hello}>Olá, {firstName}</Text>
            <Text style={styles.date}>Veja como está sua jornada financeira</Text>
          </View>
          <Pressable onPress={() => navigation.navigate("Perfil")} style={styles.avatar}>
            {member?.photoURL ? (
              <Image source={{ uri: member.photoURL }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{firstName.slice(0, 2).toUpperCase()}</Text>
            )}
            <View style={styles.avatarDot} />
          </Pressable>
        </View>

        <LinearGradient colors={[colors.green600, colors.green800, colors.green950]} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.glow} />
          <View style={styles.heroTop}>
            <Text style={styles.heroLabel}>PATRIMÔNIO ECOMOPAR</Text>
            <Pressable accessibilityLabel={moneyVisible ? "Ocultar valores" : "Mostrar valores"} hitSlop={10} onPress={() => setMoneyVisible((visible) => !visible)}>
              <Feather color="rgba(255,255,255,0.75)" name={moneyVisible ? "eye" : "eye-off"} size={18} />
            </Pressable>
          </View>
          <Text style={styles.balance}>{moneyVisible ? money(total) : "••••••"}</Text>
          <View style={styles.status}>
            <View style={[styles.statusDot, isActive && { backgroundColor: colors.green400 }]} />
            <Text style={styles.statusText}>{status}</Text>
          </View>
          {!isActive ? (
            <Pressable onPress={() => setActivationOpen(true)} style={({ pressed }) => [styles.activateBtn, pressed && styles.pressed]}>
              <Feather color={colors.green900} name="zap" size={16} />
              <Text style={styles.activateBtnText}>Ativar cadastro · R$ 7</Text>
            </Pressable>
          ) : null}
          <View style={styles.heroRule} />
          <View style={styles.heroStats}>
            <View>
              <Text style={styles.heroStatLabel}>Reserva disponível</Text>
              <Text style={styles.heroStatValue}>{moneyVisible ? money(member?.saldoDisponivel) : "••••••"}</Text>
            </View>
            <View style={styles.statDivider} />
            <View>
              <Text style={styles.heroStatLabel}>Depósitos</Text>
              <Text style={styles.heroStatValue}>{member?.depositosCount || 0} dias</Text>
            </View>
          </View>
        </LinearGradient>

        {!isActive ? (
          <Pressable onPress={() => setActivationOpen(true)} style={({ pressed }) => [styles.activateBanner, pressed && styles.pressed]}>
            <IconBadge name="zap" tone="amber" />
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>Ative seu cadastro</Text>
              <Text style={styles.tipText}>Gere um PIX de R$ 7. R$ 2 já estão incluídos como taxa da transação.</Text>
            </View>
            <Feather color={colors.green700} name="chevron-right" size={18} />
          </Pressable>
        ) : null}

        <View style={styles.sectionRow}><Text style={styles.sectionTitle}>Acesso rápido</Text><Text style={styles.sectionCaption}>PRINCIPAIS AÇÕES</Text></View>
        <View style={styles.shortcuts}>
          <Shortcut icon="plus-circle" label="Depositar" onPress={() => navigation.navigate("Carteira", { flow: "deposit" })} />
          <Shortcut icon="send" label="Indicar" onPress={() => navigation.navigate("Benefícios")} />
          <Shortcut icon="arrow-down-circle" label="Sacar" onPress={() => navigation.navigate("Carteira", { flow: "withdraw" })} />
          <Shortcut icon="headphones" label="Suporte" onPress={() => navigation.navigate("Perfil")} />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Resumo da reserva</Text>
          <Pressable onPress={() => navigation.navigate("Carteira")}><Text style={styles.seeAll}>Ver detalhes</Text></Pressable>
        </View>
        <Card>
          <SummaryRow icon="check-circle" label="Disponível" tone="green" value={moneyVisible ? money(member?.saldoDisponivel) : "••••••"} />
          <View style={styles.rule} />
          <SummaryRow icon="lock" label="Em carência" tone="brick" value={moneyVisible ? money(member?.saldoBloqueado) : "••••••"} />
          <View style={styles.rule} />
          <SummaryRow icon="gift" label="Bônus" tone="amber" value={moneyVisible ? money(member?.saldoBonus) : "••••••"} />
        </Card>

        <LinearGradient colors={[colors.amber100, "#FFFDF8"]} style={styles.tip}>
          <IconBadge name="zap" tone="amber" />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Constância que protege</Text>
            <Text style={styles.tipText}>Contribua R$ 7 por dia. R$ 5 entram na sua reserva pessoal.</Text>
          </View>
        </LinearGradient>
      </ScrollView>

      <ActivationFlowModal
        memberEmail={member?.email}
        onActivated={handleActivated}
        onClose={() => setActivationOpen(false)}
        visible={activationOpen}
      />
    </SafeAreaView>
  );
}

function Shortcut({ icon, label, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.shortcut, pressed && styles.pressed]}>
      <View style={styles.shortcutIcon}><Feather color={colors.white} name={icon} size={20} /></View>
      <Text style={styles.shortcutText}>{label}</Text>
    </Pressable>
  );
}

function SummaryRow({ icon, label, value, tone }: { icon: keyof typeof Feather.glyphMap; label: string; value: string; tone: "green" | "brick" | "amber" }) {
  return (
    <View style={styles.summaryRow}>
      <IconBadge name={icon} tone={tone} />
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 20, paddingBottom: 112 },
  top: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 21 },
  welcomeRow: { alignItems: "center", flexDirection: "row", gap: 6, marginBottom: 3 },
  welcomeLine: { backgroundColor: colors.green500, height: 1, width: 14 },
  welcomeLabel: { color: colors.green600, fontFamily: fonts.bold, fontSize: 7.5, letterSpacing: 1.15 },
  hello: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 25, letterSpacing: -0.8 },
  date: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 10.5, marginTop: 2 },
  avatar: { alignItems: "center", backgroundColor: colors.green100, borderColor: colors.surface, borderRadius: 15, borderWidth: 3, height: 48, justifyContent: "center", overflow: "hidden", shadowColor: colors.green950, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.09, shadowRadius: 10, width: 48 },
  avatarImage: { height: "100%", width: "100%" },
  avatarText: { color: colors.green800, fontFamily: fonts.bold, fontSize: 14 },
  avatarDot: { backgroundColor: colors.green500, borderColor: colors.surface, borderRadius: 5, borderWidth: 2, bottom: -2, height: 10, position: "absolute", right: -2, width: 10 },
  hero: { borderRadius: 25, overflow: "hidden", padding: 22, ...shadow },
  glow: { backgroundColor: "rgba(58,182,137,0.18)", borderRadius: 100, height: 190, position: "absolute", right: -70, top: -85, width: 190 },
  heroTop: { flexDirection: "row", justifyContent: "space-between" },
  heroLabel: { color: "rgba(255,255,255,0.55)", fontFamily: fonts.bold, fontSize: 9.5, letterSpacing: 1.5 },
  balance: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 34, letterSpacing: -1.1, marginTop: 11 },
  status: { alignItems: "center", flexDirection: "row", gap: 6, marginTop: 5 },
  statusDot: { backgroundColor: colors.amber500, borderRadius: 4, height: 7, width: 7 },
  statusText: { color: "rgba(255,255,255,0.72)", fontFamily: fonts.medium, fontSize: 11 },
  activateBtn: { alignItems: "center", alignSelf: "flex-start", backgroundColor: colors.white, borderRadius: 999, flexDirection: "row", gap: 8, marginTop: 14, paddingHorizontal: 14, paddingVertical: 10 },
  activateBtnText: { color: colors.green900, fontFamily: fonts.bold, fontSize: 12.5 },
  activateBanner: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 18, borderWidth: 1, flexDirection: "row", gap: 12, marginTop: 16, padding: 14 },
  heroRule: { backgroundColor: "rgba(255,255,255,0.12)", height: 1, marginVertical: 18 },
  heroStats: { flexDirection: "row", gap: 24 },
  heroStatLabel: { color: "rgba(255,255,255,0.54)", fontFamily: fonts.medium, fontSize: 10 },
  heroStatValue: { color: colors.white, fontFamily: fonts.bold, fontSize: 14, marginTop: 3 },
  statDivider: { backgroundColor: "rgba(255,255,255,0.14)", width: 1 },
  sectionTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 16, marginBottom: 13, marginTop: 25 },
  shortcuts: { flexDirection: "row", justifyContent: "space-between" },
  shortcut: { alignItems: "center", gap: 8, width: "23%" },
  shortcutIcon: { alignItems: "center", backgroundColor: colors.green800, borderRadius: 15, height: 51, justifyContent: "center", width: 51 },
  shortcutText: { color: colors.inkSoft, fontFamily: fonts.semibold, fontSize: 10.5 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  sectionRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  sectionCaption: { color: colors.inkFaint, fontFamily: fonts.bold, fontSize: 7, letterSpacing: 0.8, marginTop: 13 },
  seeAll: { color: colors.green700, fontFamily: fonts.bold, fontSize: 11, marginTop: 13 },
  summaryRow: { alignItems: "center", flexDirection: "row", gap: 12 },
  summaryLabel: { color: colors.inkSoft, flex: 1, fontFamily: fonts.medium, fontSize: 13 },
  summaryValue: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13 },
  rule: { backgroundColor: colors.line, height: 1, marginVertical: 13, marginLeft: 54 },
  tip: { borderColor: "rgba(184,128,47,0.10)", borderRadius: 20, borderWidth: 1, flexDirection: "row", gap: 13, marginTop: 18, padding: 16 },
  tipTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13 },
  tipText: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 11.5, lineHeight: 17, marginTop: 3 },
});
