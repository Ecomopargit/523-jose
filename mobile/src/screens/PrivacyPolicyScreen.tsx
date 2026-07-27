import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenAtmosphere } from "../components/UI";
import { colors, fonts, shadow } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "PrivacyPolicy">;
type FeatherName = keyof typeof Feather.glyphMap;

const sections: Array<{
  icon: FeatherName;
  number: string;
  title: string;
  text: string;
}> = [
  {
    icon: "database",
    number: "01",
    title: "Dados coletados",
    text: "Coletamos informações fornecidas no cadastro, como nome, e-mail, telefone, documentos e dados do veículo. Também registramos depósitos via PIX, histórico de saques e dados de uso do aplicativo.",
  },
  {
    icon: "activity",
    number: "02",
    title: "Uso dos dados",
    text: "Utilizamos seus dados para a gestão da associação, processamento de pagamentos, liberação de benefícios, comunicação com o associado e cumprimento de obrigações legais.",
  },
  {
    icon: "share-2",
    number: "03",
    title: "Compartilhamento",
    text: "A ECOMOPAR não vende seus dados. Informações podem ser compartilhadas somente com prestadores de serviços essenciais, como pagamentos, hospedagem e suporte, ou quando exigido por lei.",
  },
  {
    icon: "user-check",
    number: "04",
    title: "Seus direitos",
    text: "Você pode solicitar acesso, correção ou exclusão dos seus dados pessoais entrando em contato com a ECOMOPAR pelo e-mail indicado abaixo.",
  },
];

export function PrivacyPolicyScreen({ navigation }: Props) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <StatusBar style="dark" />
      <ScreenAtmosphere />

      <View style={styles.header}>
        <Pressable accessibilityLabel="Voltar" onPress={navigation.goBack} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <Feather color={colors.green800} name="arrow-left" size={19} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>TRANSPARÊNCIA E CUIDADO</Text>
          <Text style={styles.title}>Política de privacidade</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <Feather color={colors.white} name="shield" size={24} />
            </View>
            <View style={styles.privateTag}>
              <View style={styles.tagDot} />
              <Text style={styles.privateTagText}>SEUS DADOS, SEU CONTROLE</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Privacidade começa com clareza.</Text>
          <Text style={styles.heroText}>
            A ECOMOPAR — Instituto de Apoio ao Motorista Autônomo — respeita a privacidade dos associados e visitantes. Aqui explicamos como coletamos, usamos e protegemos seus dados pessoais.
          </Text>
          <View style={styles.heroRule} />
          <View style={styles.heroFooter}>
            <Feather color={colors.green400} name="lock" size={13} />
            <Text style={styles.heroFooterText}>Informações tratadas com acesso controlado</Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.introLabel}>COMO CUIDAMOS DAS SUAS INFORMAÇÕES</Text>
          <Text style={styles.introText}>Conheça os princípios que orientam o uso dos dados dentro da associação.</Text>
        </View>

        {sections.map((section) => (
          <View key={section.number} style={styles.sectionCard}>
            <View style={styles.sectionRail}>
              <Text style={styles.sectionNumber}>{section.number}</Text>
              <View style={styles.sectionLine} />
            </View>
            <View style={styles.sectionBody}>
              <View style={styles.sectionHeading}>
                <View style={styles.sectionIcon}>
                  <Feather color={colors.green700} name={section.icon} size={17} />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Text style={styles.sectionText}>{section.text}</Text>
            </View>
          </View>
        ))}

        <View style={styles.contactCard}>
          <View style={styles.contactIcon}>
            <Feather color={colors.green800} name="mail" size={21} />
          </View>
          <View style={styles.contactBody}>
            <Text style={styles.contactEyebrow}>CANAL DE PRIVACIDADE</Text>
            <Text style={styles.contactTitle}>Fale com a ECOMOPAR</Text>
            <Text selectable style={styles.contactEmail}>contato@ecomopar.org</Text>
          </View>
        </View>

        <View style={styles.finalNote}>
          <Feather color={colors.green600} name="check-circle" size={15} />
          <Text style={styles.finalNoteText}>Ao utilizar o aplicativo, você pode consultar esta política a qualquer momento nesta área.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  header: { alignItems: "center", flexDirection: "row", gap: 13, padding: 20 },
  back: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 12, borderWidth: 1, height: 40, justifyContent: "center", width: 40, ...shadow },
  pressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  headerText: { flex: 1 },
  eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1.3 },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 20, letterSpacing: -0.7, marginTop: 2 },
  content: { paddingBottom: 44, paddingHorizontal: 20, paddingTop: 3 },
  hero: { backgroundColor: colors.green900, borderRadius: 24, overflow: "hidden", padding: 22, ...shadow },
  heroTop: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  heroIcon: { alignItems: "center", backgroundColor: colors.green500, borderRadius: 15, height: 50, justifyContent: "center", width: 50 },
  privateTag: { alignItems: "center", backgroundColor: "rgba(58,182,137,0.12)", borderRadius: 20, flexDirection: "row", gap: 6, paddingHorizontal: 10, paddingVertical: 7 },
  tagDot: { backgroundColor: colors.green400, borderRadius: 3, height: 6, width: 6 },
  privateTagText: { color: colors.green400, fontFamily: fonts.bold, fontSize: 7, letterSpacing: 0.65 },
  heroTitle: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 23, letterSpacing: -0.8, lineHeight: 28, marginTop: 22, maxWidth: 270 },
  heroText: { color: "rgba(255,255,255,0.64)", fontFamily: fonts.regular, fontSize: 10, lineHeight: 17, marginTop: 10 },
  heroRule: { backgroundColor: "rgba(255,255,255,0.09)", height: 1, marginVertical: 17 },
  heroFooter: { alignItems: "center", flexDirection: "row", gap: 7 },
  heroFooterText: { color: "rgba(255,255,255,0.54)", fontFamily: fonts.medium, fontSize: 8.5 },
  intro: { marginBottom: 16, marginTop: 27 },
  introLabel: { color: colors.green600, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1.15 },
  introText: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 17, letterSpacing: -0.45, lineHeight: 22, marginTop: 6, maxWidth: 310 },
  sectionCard: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 19, borderWidth: 1, flexDirection: "row", marginBottom: 11, overflow: "hidden", padding: 17, ...shadow },
  sectionRail: { alignItems: "center", marginRight: 14, width: 26 },
  sectionNumber: { color: colors.green500, fontFamily: fonts.extraBold, fontSize: 9, letterSpacing: 0.5 },
  sectionLine: { backgroundColor: colors.green100, flex: 1, marginTop: 9, width: 1 },
  sectionBody: { flex: 1 },
  sectionHeading: { alignItems: "center", flexDirection: "row", gap: 9 },
  sectionIcon: { alignItems: "center", backgroundColor: colors.green50, borderRadius: 10, height: 36, justifyContent: "center", width: 36 },
  sectionTitle: { color: colors.ink, flex: 1, fontFamily: fonts.bold, fontSize: 13 },
  sectionText: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 9.5, lineHeight: 16, marginTop: 11 },
  contactCard: { alignItems: "center", backgroundColor: colors.green100, borderColor: "rgba(23,122,89,0.12)", borderRadius: 19, borderWidth: 1, flexDirection: "row", marginTop: 8, padding: 17 },
  contactIcon: { alignItems: "center", backgroundColor: colors.surface, borderRadius: 13, height: 45, justifyContent: "center", width: 45 },
  contactBody: { flex: 1, marginLeft: 12 },
  contactEyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 7, letterSpacing: 1 },
  contactTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 12, marginTop: 3 },
  contactEmail: { color: colors.green700, fontFamily: fonts.semibold, fontSize: 10, marginTop: 2 },
  finalNote: { alignItems: "flex-start", flexDirection: "row", gap: 8, marginTop: 18, paddingHorizontal: 5 },
  finalNoteText: { color: colors.inkFaint, flex: 1, fontFamily: fonts.regular, fontSize: 8.5, lineHeight: 14 },
});
