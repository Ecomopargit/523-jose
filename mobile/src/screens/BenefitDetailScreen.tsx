import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenAtmosphere } from "../components/UI";
import { colors, fonts, shadow } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "BenefitDetail">;
type BenefitId = RootStackParamList["BenefitDetail"]["benefitId"];

const benefitContent: Record<BenefitId, {
  icon: keyof typeof Feather.glyphMap;
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  tone: "green" | "amber" | "brick";
  highlights: Array<{ icon: keyof typeof Feather.glyphMap; title: string; text: string }>;
  steps: string[];
  action: string;
  secondary?: string;
}> = {
  financial: {
    icon: "shield",
    eyebrow: "Reserva pessoal",
    title: "Proteção financeira",
    description: "Uma reserva construída com constância para dar mais segurança quando surgirem imprevistos.",
    status: "Incluído",
    tone: "green",
    highlights: [
      { icon: "trending-up", title: "Evolução diária", text: "Parte de cada contribuição fortalece sua reserva pessoal." },
      { icon: "eye", title: "Tudo transparente", text: "Acompanhe saldos disponível, em carência e bônus pelo app." },
      { icon: "unlock", title: "Acesso planejado", text: "Solicite o valor disponível conforme as regras da associação." },
    ],
    steps: ["Faça suas contribuições pelo PIX.", "Acompanhe a composição da reserva.", "Solicite o saldo disponível pela Carteira."],
    action: "Ver minha carteira",
  },
  health: {
    icon: "heart",
    eyebrow: "Cuidado para a família",
    title: "Assistência à saúde",
    description: "Uma rede de apoio pensada para facilitar o acesso a cuidados essenciais para você e sua família.",
    status: "Incluído",
    tone: "brick",
    highlights: [
      { icon: "video", title: "Orientação remota", text: "A proposta inclui atendimento inicial sem sair de casa." },
      { icon: "users", title: "Cuidado familiar", text: "Benefícios planejados para o associado e seus dependentes." },
      { icon: "map-pin", title: "Rede de atendimento", text: "Orientação para encontrar o cuidado adequado na sua região." },
    ],
    steps: ["Mantenha seus dados atualizados.", "Informe quem precisa de atendimento.", "Receba a orientação e consulte as opções disponíveis."],
    action: "Solicitar atendimento",
  },
  legal: {
    icon: "briefcase",
    eyebrow: "Orientação especializada",
    title: "Orientação jurídica",
    description: "Apoio inicial para o motorista entender seus direitos e escolher o melhor caminho em situações do dia a dia.",
    status: "Incluído",
    tone: "amber",
    highlights: [
      { icon: "file-text", title: "Análise inicial", text: "Organize o caso e saiba quais documentos serão necessários." },
      { icon: "truck", title: "Rotina do motorista", text: "Orientação voltada a ocorrências ligadas ao trabalho e ao veículo." },
      { icon: "navigation", title: "Próximos passos", text: "Receba direcionamento claro para resolver a situação." },
    ],
    steps: ["Conte resumidamente o que aconteceu.", "Envie os documentos solicitados.", "Receba a orientação inicial da equipe."],
    action: "Solicitar orientação",
    secondary: "Este benefício oferece orientação inicial. Representação judicial e custos externos dependem de análise.",
  },
  vehicle: {
    icon: "tool",
    eyebrow: "Apoio na estrada",
    title: "Assistência veicular",
    description: "Ajuda para lidar com situações inesperadas e voltar à estrada com mais tranquilidade.",
    status: "Incluído",
    tone: "green",
    highlights: [
      { icon: "map-pin", title: "Localização rápida", text: "Informe onde está e qual problema aconteceu com o veículo." },
      { icon: "phone-call", title: "Triagem do caso", text: "A equipe identifica o tipo de auxílio mais adequado." },
      { icon: "check-circle", title: "Acompanhamento", text: "Veja as orientações e mantenha contato durante o atendimento." },
    ],
    steps: ["Pare em um local seguro.", "Informe localização, veículo e ocorrência.", "Siga as orientações da equipe de assistência."],
    action: "Solicitar assistência",
    secondary: "Em situação de risco imediato, priorize os serviços públicos de emergência da sua região.",
  },
};

const toneColors = {
  green: { soft: colors.green100, strong: colors.green700 },
  amber: { soft: colors.amber100, strong: colors.amber600 },
  brick: { soft: colors.brick100, strong: colors.brick500 },
};

export function BenefitDetailScreen({ navigation, route }: Props) {
  const benefit = benefitContent[route.params.benefitId];
  const tone = toneColors[benefit.tone];

  function handleAction() {
    if (route.params.benefitId === "financial") {
      navigation.navigate("App", { screen: "Carteira" });
      return;
    }
    navigation.navigate("Support");
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <StatusBar style="dark" />
      <ScreenAtmosphere />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.nav}>
          <Pressable accessibilityLabel="Voltar" accessibilityRole="button" onPress={navigation.goBack} style={styles.back}>
            <Feather color={colors.green800} name="arrow-left" size={20} />
          </Pressable>
          <Text style={styles.navTitle}>Detalhes do benefício</Text>
          <View style={styles.navSpacer} />
        </View>

        <LinearGradient colors={["#126248", colors.green900, "#062F23"]} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View pointerEvents="none" style={styles.heroGlow} />
          <View style={[styles.heroIcon, { backgroundColor: `${tone.strong}35` }]}>
            <Feather color={colors.white} name={benefit.icon} size={25} />
          </View>
          <View style={styles.status}><View style={[styles.statusDot, { backgroundColor: tone.strong }]} /><Text style={styles.statusText}>{benefit.status}</Text></View>
          <Text style={styles.eyebrow}>{benefit.eyebrow}</Text>
          <Text style={styles.title}>{benefit.title}</Text>
          <Text style={styles.description}>{benefit.description}</Text>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>O que você encontra</Text>
          <Text style={styles.sectionText}>Uma proposta simples, clara e pensada para a rotina na estrada.</Text>
        </View>

        <View style={styles.highlightList}>
          {benefit.highlights.map((item) => (
            <View key={item.title} style={styles.highlight}>
              <View style={[styles.highlightIcon, { backgroundColor: tone.soft }]}>
                <Feather color={tone.strong} name={item.icon} size={19} />
              </View>
              <View style={styles.highlightCopy}>
                <Text style={styles.highlightTitle}>{item.title}</Text>
                <Text style={styles.highlightText}>{item.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.howCard}>
          <View style={styles.howTop}>
            <View>
              <Text style={styles.howEyebrow}>PASSO A PASSO</Text>
              <Text style={styles.howTitle}>Como funciona</Text>
            </View>
            <Feather color={colors.green600} name="navigation" size={21} />
          </View>
          {benefit.steps.map((step, index) => (
            <View key={step} style={styles.step}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {benefit.secondary ? <Text style={styles.disclaimer}>{benefit.secondary}</Text> : null}

        <Pressable accessibilityRole="button" onPress={handleAction} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <Text style={styles.actionText}>{benefit.action}</Text>
          <Feather color={colors.white} name="arrow-right" size={18} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 20, paddingBottom: 38 },
  nav: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  back: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 13, borderWidth: 1, height: 42, justifyContent: "center", width: 42, ...shadow },
  navTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13 },
  navSpacer: { width: 42 },
  hero: { borderRadius: 26, minHeight: 280, overflow: "hidden", padding: 22, ...shadow },
  heroGlow: { backgroundColor: "rgba(58,182,137,0.15)", borderRadius: 140, height: 270, position: "absolute", right: -125, top: -110, width: 270 },
  heroIcon: { alignItems: "center", borderColor: "rgba(255,255,255,0.14)", borderRadius: 16, borderWidth: 1, height: 54, justifyContent: "center", width: 54 },
  status: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.09)", borderRadius: 14, flexDirection: "row", gap: 6, paddingHorizontal: 10, paddingVertical: 7, position: "absolute", right: 20, top: 21 },
  statusDot: { borderRadius: 4, height: 7, width: 7 },
  statusText: { color: colors.white, fontFamily: fonts.bold, fontSize: 8.5 },
  eyebrow: { color: colors.green400, fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.6, marginTop: 27, textTransform: "uppercase" },
  title: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 28, letterSpacing: -0.9, lineHeight: 34, marginTop: 6 },
  description: { color: "rgba(255,255,255,0.62)", fontFamily: fonts.regular, fontSize: 12, lineHeight: 19, marginTop: 9, maxWidth: 320 },
  sectionHeader: { marginBottom: 14, marginTop: 27 },
  sectionTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 17 },
  sectionText: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 10, lineHeight: 15, marginTop: 3 },
  highlightList: { gap: 10 },
  highlight: { alignItems: "center", backgroundColor: colors.surface, borderColor: "rgba(18,36,28,0.05)", borderRadius: 18, borderWidth: 1, flexDirection: "row", gap: 13, minHeight: 82, padding: 14, ...shadow },
  highlightIcon: { alignItems: "center", borderRadius: 13, height: 45, justifyContent: "center", width: 45 },
  highlightCopy: { flex: 1 },
  highlightTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 12.5 },
  highlightText: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 9.5, lineHeight: 14, marginTop: 3 },
  howCard: { backgroundColor: colors.green50, borderColor: colors.green100, borderRadius: 21, borderWidth: 1, marginTop: 22, padding: 18 },
  howTop: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  howEyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 7.5, letterSpacing: 1.2 },
  howTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 15, marginTop: 2 },
  step: { alignItems: "center", flexDirection: "row", gap: 11, marginTop: 10 },
  stepNumber: { alignItems: "center", backgroundColor: colors.green700, borderRadius: 10, height: 26, justifyContent: "center", width: 26 },
  stepNumberText: { color: colors.white, fontFamily: fonts.bold, fontSize: 9 },
  stepText: { color: colors.inkSoft, flex: 1, fontFamily: fonts.medium, fontSize: 10.5, lineHeight: 15 },
  disclaimer: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 9, lineHeight: 14, marginHorizontal: 5, marginTop: 14 },
  action: { alignItems: "center", backgroundColor: colors.green600, borderRadius: 16, flexDirection: "row", gap: 9, height: 56, justifyContent: "center", marginTop: 19, ...shadow },
  actionText: { color: colors.white, fontFamily: fonts.bold, fontSize: 14 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
});
