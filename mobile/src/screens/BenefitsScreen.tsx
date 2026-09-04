import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconBadge, ScreenAtmosphere, ScreenHeader } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { getReferralDashboard, type ReferralDashboard } from "../lib/referrals";
import { colors, fonts, shadow } from "../theme";
import type { RootStackParamList } from "../types";

const benefits = [
  { id: "financial" as const, icon: "shield", title: "Proteção financeira", text: "Sua reserva para enfrentar imprevistos.", tone: "green" as const, label: "Incluído" },
  { id: "health" as const, icon: "heart", title: "Assistência à saúde", text: "Apoio para cuidar de você e da família.", tone: "brick" as const, label: "Incluído" },
  { id: "legal" as const, icon: "briefcase", title: "Orientação jurídica", text: "Suporte especializado para o motorista.", tone: "amber" as const, label: "Incluído" },
  { id: "vehicle" as const, icon: "tool", title: "Assistência veicular", text: "Mais tranquilidade para seguir viagem.", tone: "green" as const, label: "Incluído" },
];

export function BenefitsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { member } = useAuth();
  const [referral, setReferral] = useState<ReferralDashboard | null>(null);
  const [loadingReferral, setLoadingReferral] = useState(!member?.referralCode);
  const [referralError, setReferralError] = useState("");
  const code = referral?.code || member?.referralCode || "";
  const progress = (referral?.valid ?? member?.referralValidCount ?? 0) % 3;
  const remaining = progress === 0 && (referral?.valid ?? member?.referralValidCount ?? 0) > 0 ? 3 : 3 - progress;

  const loadReferral = useCallback(async () => {
    // Código do perfil aparece na hora; só mostra "GERANDO..." se ainda não existir.
    setLoadingReferral(!member?.referralCode);
    setReferralError("");
    try {
      setReferral(await getReferralDashboard(true));
    } catch (error) {
      setReferralError(
        error instanceof Error ? error.message : "Não foi possível carregar seu código.",
      );
    } finally {
      setLoadingReferral(false);
    }
  }, [member?.referralCode]);

  useFocusEffect(
    useCallback(() => {
      void loadReferral();
    }, [loadReferral]),
  );

  async function share() {
    if (!code) {
      Alert.alert("Código indisponível", "Tente carregar seu código novamente antes de compartilhar.");
      return;
    }
    const link = `https://ecomopar.netlify.app/cadastrar?ref=${code}`;
    try {
      await Share.share({
        message: `Venha para a ECOMOPAR! Use meu código ${code} ou cadastre-se pelo link: ${link}`,
        url: link,
      });
    } catch {
      Alert.alert("Não foi possível compartilhar", "Tente novamente em alguns instantes.");
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <StatusBar style="dark" />
      <ScreenAtmosphere />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Cuidado completo"
          title="Benefícios"
          action={<View style={styles.headerMark}><Image alt="Símbolo ECOMOPAR" source={require("../../assets/ecomopar-mark.png")} style={styles.headerMarkImage} /></View>}
        />

        <LinearGradient colors={["#0F5D45", colors.green900, "#073125"]} end={{ x: 1, y: 1 }} style={styles.referral}>
          <View pointerEvents="none" style={styles.referralGlow} />
          <View style={styles.referralTop}>
            <View style={styles.referralIcon}><Feather color={colors.white} name="gift" size={20} /></View>
            <View style={styles.rewardPill}><Text style={styles.rewardPillText}>R$ 150 DE BÔNUS</Text></View>
          </View>
          <Text style={styles.referralKicker}>INDIQUE E GANHE</Text>
          <Text style={styles.referralTitle}>Sua rede também pode dirigir mais tranquila.</Text>
          <Text style={styles.referralText}>
            Compartilhe seu código. A cada 3 parceiros ativados, você recebe R$ 150. Saques
            ficam em carência por 90 dias após sua ativação.
          </Text>
          <View style={styles.codeRow}>
            <View>
              <Text style={styles.codeLabel}>SEU CÓDIGO</Text>
              <Text style={styles.code}>{code || (loadingReferral ? "GERANDO..." : "INDISPONÍVEL")}</Text>
            </View>
            <Pressable disabled={!code || loadingReferral} onPress={share} style={({ pressed }) => [styles.share, (!code || loadingReferral) && styles.shareDisabled, pressed && styles.pressed]}>
              {loadingReferral ? <ActivityIndicator color={colors.green900} size="small" /> : <Feather color={colors.green900} name="share-2" size={17} />}
              <Text style={styles.shareText}>Compartilhar</Text>
            </Pressable>
          </View>
          {referralError ? (
            <Pressable accessibilityRole="button" onPress={() => void loadReferral()} style={styles.referralError}>
              <Feather color="#FFD5CC" name="alert-circle" size={15} />
              <Text numberOfLines={2} style={styles.referralErrorText}>{referralError}</Text>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          ) : null}
          <View style={styles.referralStats}>
            <Text style={styles.referralStat}>{referral?.total ?? 0} indicados</Text>
            <Text style={styles.referralStat}>{referral?.valid ?? member?.referralValidCount ?? 0} ativados</Text>
            <Text style={styles.referralStat}>R$ {(referral?.bonus ?? (member?.referralBonusPaidGroups ?? 0) * 150).toLocaleString("pt-BR")} em bônus</Text>
          </View>
          <View style={styles.bonusProgress}>
            <View style={styles.progressBars}>
              {[0, 1, 2].map((step) => <View key={step} style={[styles.progressBar, step < progress && styles.progressBarActive]} />)}
            </View>
            <Text style={styles.progressText}>{remaining === 1 ? "Falta 1 ativação para o próximo bônus" : `Faltam ${remaining} ativações para o próximo bônus`}</Text>
          </View>
        </LinearGradient>

        <View style={styles.sectionHeading}>
          <View><Text style={styles.section}>Sua rede de proteção</Text><Text style={styles.sectionHint}>Apoio pensado para a rotina na estrada</Text></View>
          <View style={styles.count}><Text style={styles.countText}>4</Text></View>
        </View>

        <View style={styles.list}>
          {benefits.map((benefit) => (
            <Pressable
              accessibilityHint="Abre informações sobre o benefício"
              accessibilityRole="button"
              key={benefit.title}
              onPress={() => navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.navigate("BenefitDetail", { benefitId: benefit.id })}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <View style={styles.benefit}>
                <IconBadge name={benefit.icon as keyof typeof Feather.glyphMap} tone={benefit.tone} />
                <View style={styles.benefitCopy}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitText}>{benefit.text}</Text>
                </View>
                <View style={styles.benefitEnd}>
                  <Text style={[styles.benefitLabel, benefit.label === "Em breve" && styles.benefitLabelMuted]}>{benefit.label}</Text>
                  <Feather color={colors.inkFaint} name="arrow-up-right" size={17} />
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.navigate("Support")}
          style={({ pressed }) => [styles.supportNote, pressed && styles.pressed]}
        >
          <Feather color={colors.green700} name="message-circle" size={18} />
          <Text style={styles.supportText}>Precisa de ajuda para usar um benefício?</Text>
          <Text style={styles.supportLink}>Fale conosco</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 20, paddingBottom: 110 },
  headerMark: { borderRadius: 13, height: 42, overflow: "hidden", width: 42, ...shadow },
  headerMarkImage: { height: "100%", width: "100%" },
  referral: { borderRadius: 25, overflow: "hidden", padding: 21, ...shadow },
  referralGlow: { backgroundColor: "rgba(58,182,137,0.16)", borderRadius: 120, height: 230, position: "absolute", right: -105, top: -100, width: 230 },
  referralTop: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  referralIcon: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.11)", borderColor: "rgba(255,255,255,0.12)", borderRadius: 13, borderWidth: 1, height: 44, justifyContent: "center", width: 44 },
  rewardPill: { backgroundColor: "rgba(58,182,137,0.16)", borderColor: "rgba(58,182,137,0.24)", borderRadius: 16, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  rewardPillText: { color: colors.green400, fontFamily: fonts.extraBold, fontSize: 8, letterSpacing: 0.8 },
  referralKicker: { color: colors.green400, fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.7, marginTop: 21 },
  referralTitle: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 22, letterSpacing: -0.65, lineHeight: 28, marginTop: 6, maxWidth: 310 },
  referralText: { color: "rgba(255,255,255,0.56)", fontFamily: fonts.regular, fontSize: 11, lineHeight: 17, marginTop: 7, maxWidth: 310 },
  codeRow: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.075)", borderColor: "rgba(255,255,255,0.10)", borderRadius: 15, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", marginTop: 18, padding: 5, paddingLeft: 14 },
  codeLabel: { color: "rgba(255,255,255,0.42)", fontFamily: fonts.bold, fontSize: 7.5, letterSpacing: 1.1 },
  code: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 14, letterSpacing: 1.7, marginTop: 2 },
  referralError: { alignItems: "center", backgroundColor: "rgba(189,62,39,0.24)", borderColor: "rgba(255,213,204,0.18)", borderRadius: 11, borderWidth: 1, flexDirection: "row", gap: 7, marginTop: 10, paddingHorizontal: 10, paddingVertical: 9 },
  referralErrorText: { color: "#FFE4DE", flex: 1, fontFamily: fonts.medium, fontSize: 8.5, lineHeight: 12 },
  retryText: { color: colors.white, fontFamily: fonts.bold, fontSize: 8.5 },
  referralStats: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  referralStat: { backgroundColor: "rgba(255,255,255,0.09)", borderRadius: 10, color: colors.white, fontFamily: fonts.semibold, fontSize: 9, paddingHorizontal: 9, paddingVertical: 6 },
  bonusProgress: { marginTop: 13 },
  progressBars: { flexDirection: "row", gap: 5 },
  progressBar: { backgroundColor: "rgba(255,255,255,0.14)", borderRadius: 2, flex: 1, height: 4 },
  progressBarActive: { backgroundColor: colors.green400 },
  progressText: { color: "rgba(255,255,255,0.55)", fontFamily: fonts.medium, fontSize: 8.5, marginTop: 6 },
  share: { alignItems: "center", backgroundColor: "#DDF2E9", borderRadius: 11, flexDirection: "row", gap: 7, paddingHorizontal: 13, paddingVertical: 11 },
  shareDisabled: { opacity: 0.58 },
  shareText: { color: colors.green900, fontFamily: fonts.bold, fontSize: 10 },
  sectionHeading: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between", marginBottom: 13, marginTop: 25 },
  section: { color: colors.ink, fontFamily: fonts.bold, fontSize: 16 },
  sectionHint: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 9.5, marginTop: 3 },
  count: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 10, height: 27, justifyContent: "center", width: 27 },
  countText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 10 },
  list: { gap: 10 },
  benefit: { alignItems: "center", backgroundColor: colors.surface, borderColor: "rgba(18,36,28,0.045)", borderRadius: 18, borderWidth: 1, flexDirection: "row", gap: 12, minHeight: 78, padding: 13, ...shadow },
  benefitCopy: { flex: 1 },
  benefitTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 12.5 },
  benefitText: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 9.5, lineHeight: 14, marginTop: 3 },
  benefitEnd: { alignItems: "flex-end", gap: 8 },
  benefitLabel: { color: colors.green700, fontFamily: fonts.bold, fontSize: 7.5, letterSpacing: 0.3 },
  benefitLabelMuted: { color: colors.amber600 },
  supportNote: { alignItems: "center", backgroundColor: colors.green50, borderColor: colors.green100, borderRadius: 15, borderWidth: 1, flexDirection: "row", gap: 9, marginTop: 15, padding: 14 },
  supportText: { color: colors.inkSoft, flex: 1, fontFamily: fonts.medium, fontSize: 9.5 },
  supportLink: { color: colors.green700, fontFamily: fonts.bold, fontSize: 9.5 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
});
