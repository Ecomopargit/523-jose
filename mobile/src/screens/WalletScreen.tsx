import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconBadge, ScreenAtmosphere, ScreenHeader } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { colors, fonts, shadow } from "../theme";

const money = (value = 0) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function WalletScreen() {
  const { member } = useAuth();
  const total = (member?.saldoDisponivel || 0) + (member?.saldoBloqueado || 0) + (member?.saldoBonus || 0);
  const notice = (title: string) => Alert.alert(title, "A integração PIX será conectada na próxima etapa do projeto.");

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScreenAtmosphere />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Sua reserva" title="Carteira" action={<View style={styles.secure}><Feather color={colors.green700} name="shield" size={15} /><Text style={styles.secureText}>Protegida</Text></View>} />

        <LinearGradient colors={["#126248", colors.green900, "#062F23"]} end={{ x: 1, y: 1 }} style={styles.totalCard}>
          <View pointerEvents="none" style={styles.heroCircle} />
          <Image source={require("../../assets/ecomopar-mark.png")} style={styles.watermark} />
          <View style={styles.totalTop}><Text style={styles.totalLabel}>SALDO TOTAL</Text><View style={styles.live}><View style={styles.liveDot} /><Text style={styles.liveText}>Atualizado</Text></View></View>
          <Text style={styles.total}>{money(total)}</Text>
          <Text style={styles.totalHint}>Patrimônio acumulado na ECOMOPAR</Text>
          <View style={styles.heroRule} />
          <View style={styles.heroFooter}>
            <View><Text style={styles.heroMetaLabel}>CONTRIBUIÇÕES</Text><Text style={styles.heroMetaValue}>{member?.depositosCount || 0} dias</Text></View>
            <View><Text style={styles.heroMetaLabel}>STATUS</Text><Text style={styles.heroMetaValue}>{member?.status === "ativo" ? "Ativa" : "Em análise"}</Text></View>
          </View>
        </LinearGradient>

        <View style={styles.actions}>
          <Action icon="plus" label="Depositar" hint="via PIX" onPress={() => notice("Depósito via PIX")} primary />
          <Action icon="arrow-down" label="Solicitar" hint="saque" onPress={() => notice("Solicitação de saque")} />
        </View>

        <View style={styles.sectionHeading}><View><Text style={styles.section}>Composição da reserva</Text><Text style={styles.sectionHint}>Entenda onde está o seu patrimônio</Text></View><Feather color={colors.inkFaint} name="pie-chart" size={18} /></View>
        <View style={styles.balanceGrid}>
          <Balance featured color={colors.green600} icon="check-circle" label="Disponível para saque" value={money(member?.saldoDisponivel)} />
          <View style={styles.balanceRow}>
            <Balance color={colors.brick500} icon="lock" label="Em carência" value={money(member?.saldoBloqueado)} />
            <Balance color={colors.amber500} icon="gift" label="Bônus" value={money(member?.saldoBonus)} />
          </View>
        </View>

        <View style={styles.sectionHeading}><View><Text style={styles.section}>Movimentações recentes</Text><Text style={styles.sectionHint}>Seu histórico financeiro</Text></View><Pressable><Text style={styles.seeAll}>Ver extrato</Text></Pressable></View>
        <View style={styles.transactionsCard}>
          {member?.depositosCount ? (
            <>
              <Transaction date="Último registro" icon="arrow-down-left" title="Contribuição diária" value="+ R$ 5,00" />
              <View style={styles.rule} />
              <Transaction date="Programa de indicação" icon="gift" title="Bônus acumulado" value={money(member?.saldoBonus)} />
            </>
          ) : (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}><Feather color={colors.green700} name="inbox" size={21} /></View>
              <Text style={styles.emptyTitle}>Sua jornada começa aqui</Text>
              <Text style={styles.emptyText}>Quando você fizer sua primeira contribuição, ela aparecerá neste histórico.</Text>
              <Pressable onPress={() => notice("Depósito via PIX")} style={styles.emptyAction}><Text style={styles.emptyActionText}>Fazer primeiro depósito</Text><Feather color={colors.green700} name="arrow-right" size={14} /></Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Action({ icon, label, hint, onPress, primary }: { icon: keyof typeof Feather.glyphMap; label: string; hint: string; onPress: () => void; primary?: boolean }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.action, primary && styles.actionPrimary, pressed && styles.pressed]}><View style={[styles.actionIcon, primary && styles.actionIconPrimary]}><Feather color={primary ? colors.white : colors.green700} name={icon} size={18} /></View><View><Text style={[styles.actionText, primary && styles.actionTextPrimary]}>{label}</Text><Text style={[styles.actionHint, primary && styles.actionHintPrimary]}>{hint}</Text></View><Feather color={primary ? "rgba(255,255,255,0.62)" : colors.inkFaint} name="chevron-right" size={16} /></Pressable>;
}

function Balance({ color, icon, label, value, featured }: { color: string; icon: keyof typeof Feather.glyphMap; label: string; value: string; featured?: boolean }) {
  return <View style={[styles.balanceCard, featured && styles.balanceFeatured]}><View style={[styles.balanceIcon, { backgroundColor: `${color}16` }]}><Feather color={color} name={icon} size={16} /></View><Text style={styles.balanceLabel}>{label}</Text><Text style={[styles.balanceValue, featured && styles.balanceValueFeatured]}>{value}</Text>{featured && <View style={styles.availableTag}><Text style={styles.availableTagText}>DISPONÍVEL AGORA</Text></View>}</View>;
}

function Transaction({ icon, title, date, value }: { icon: keyof typeof Feather.glyphMap; title: string; date: string; value: string }) {
  return <View style={styles.transaction}><IconBadge name={icon} /><View style={{ flex: 1 }}><Text style={styles.transactionTitle}>{title}</Text><Text style={styles.transactionDate}>{date}</Text></View><Text style={styles.transactionValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 20, paddingBottom: 112 },
  secure: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 13, flexDirection: "row", gap: 5, paddingHorizontal: 10, paddingVertical: 7 },
  secureText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 8.5 },
  totalCard: { borderRadius: 25, overflow: "hidden", padding: 21, ...shadow },
  heroCircle: { borderColor: "rgba(255,255,255,0.07)", borderRadius: 100, borderWidth: 30, height: 200, position: "absolute", right: -85, top: -65, width: 200 },
  watermark: { height: 115, opacity: 0.055, position: "absolute", right: 10, top: 42, width: 115 },
  totalTop: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  totalLabel: { color: "rgba(255,255,255,0.53)", fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.7 },
  live: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 12, flexDirection: "row", gap: 5, paddingHorizontal: 8, paddingVertical: 5 },
  liveDot: { backgroundColor: colors.green400, borderRadius: 3, height: 6, width: 6 },
  liveText: { color: "rgba(255,255,255,0.67)", fontFamily: fonts.semibold, fontSize: 7.5 },
  total: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 37, letterSpacing: -1.25, marginTop: 10 },
  totalHint: { color: "rgba(255,255,255,0.53)", fontFamily: fonts.regular, fontSize: 10.5, marginTop: 3 },
  heroRule: { backgroundColor: "rgba(255,255,255,0.10)", height: 1, marginVertical: 17 },
  heroFooter: { flexDirection: "row", gap: 38 },
  heroMetaLabel: { color: "rgba(255,255,255,0.38)", fontFamily: fonts.bold, fontSize: 7, letterSpacing: 1 },
  heroMetaValue: { color: colors.white, fontFamily: fonts.bold, fontSize: 11.5, marginTop: 3, textTransform: "capitalize" },
  actions: { flexDirection: "row", gap: 10, marginTop: 12 },
  action: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 16, borderWidth: 1, flex: 1, flexDirection: "row", gap: 8, height: 58, paddingHorizontal: 10, ...shadow },
  actionPrimary: { backgroundColor: colors.green600, borderColor: colors.green600 },
  actionIcon: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 10, height: 35, justifyContent: "center", width: 35 },
  actionIconPrimary: { backgroundColor: "rgba(255,255,255,0.13)" },
  actionText: { color: colors.green800, fontFamily: fonts.bold, fontSize: 10.5 },
  actionTextPrimary: { color: colors.white },
  actionHint: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 8.5, marginTop: 1 },
  actionHintPrimary: { color: "rgba(255,255,255,0.56)" },
  sectionHeading: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between", marginBottom: 12, marginTop: 25 },
  section: { color: colors.ink, fontFamily: fonts.bold, fontSize: 15.5 },
  sectionHint: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 9.5, marginTop: 3 },
  seeAll: { color: colors.green700, fontFamily: fonts.bold, fontSize: 9 },
  balanceGrid: { gap: 10 },
  balanceRow: { flexDirection: "row", gap: 10 },
  balanceCard: { backgroundColor: colors.surface, borderColor: "rgba(18,36,28,0.05)", borderRadius: 18, borderWidth: 1, flex: 1, minHeight: 125, padding: 15, ...shadow },
  balanceFeatured: { minHeight: 112 },
  balanceIcon: { alignItems: "center", borderRadius: 10, height: 34, justifyContent: "center", width: 34 },
  balanceLabel: { color: colors.inkSoft, fontFamily: fonts.medium, fontSize: 9.5, marginTop: 10 },
  balanceValue: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 16, letterSpacing: -0.4, marginTop: 2 },
  balanceValueFeatured: { fontSize: 20 },
  availableTag: { position: "absolute", right: 14, top: 16 },
  availableTagText: { color: colors.green600, fontFamily: fonts.bold, fontSize: 7, letterSpacing: 0.8 },
  transactionsCard: { backgroundColor: colors.surface, borderColor: "rgba(18,36,28,0.045)", borderRadius: 20, borderWidth: 1, padding: 17, ...shadow },
  transaction: { alignItems: "center", flexDirection: "row", gap: 11 },
  transactionTitle: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 12 },
  transactionDate: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 9, marginTop: 2 },
  transactionValue: { color: colors.green700, fontFamily: fonts.bold, fontSize: 11 },
  rule: { backgroundColor: colors.line, height: 1, marginLeft: 53, marginVertical: 14 },
  empty: { alignItems: "center", paddingHorizontal: 15, paddingVertical: 16 },
  emptyIcon: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 14, height: 48, justifyContent: "center", width: 48 },
  emptyTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13.5, marginTop: 11 },
  emptyText: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 10, lineHeight: 15, marginTop: 4, maxWidth: 270, textAlign: "center" },
  emptyAction: { alignItems: "center", flexDirection: "row", gap: 6, marginTop: 13 },
  emptyActionText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 10 },
  pressed: { opacity: 0.74, transform: [{ scale: 0.985 }] },
});
