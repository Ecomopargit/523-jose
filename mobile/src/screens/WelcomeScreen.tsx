import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Logo } from "../components/Logo";
import { colors, fonts } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const assurances = [
  { icon: "shield", label: "Proteção" },
  { icon: "trending-up", label: "Reserva" },
  { icon: "heart", label: "Benefícios" },
] as const;

export function WelcomeScreen({ navigation }: Props) {
  const { height } = useWindowDimensions();
  const compact = height < 750;

  return (
    <LinearGradient
      colors={["#0C5A42", colors.green900, "#062C21"]}
      end={{ x: 0.92, y: 1 }}
      start={{ x: 0.05, y: 0 }}
      style={styles.screen}
    >
      <View pointerEvents="none" style={styles.ambientTop} />
      <View pointerEvents="none" style={styles.ambientBottom} />

      <SafeAreaView style={[styles.safe, compact && styles.safeCompact]}>
        <View style={styles.brandRow}>
          <Logo />
          <View style={styles.brandRule} />
          <Text style={styles.brandNote}>Instituto de apoio{"\n"}ao motorista autônomo</Text>
        </View>

        <View style={[styles.hero, compact && styles.heroCompact]}>
          <View style={[styles.markStage, compact && styles.markStageCompact]}>
            <View style={styles.ringOuter} />
            <View style={styles.ringInner} />
            <View style={styles.markShadow} />
            <Image
              accessibilityLabel="Símbolo ECOMOPAR"
              source={require("../../assets/ecomopar-mark.png")}
              style={[styles.heroMark, compact && styles.heroMarkCompact]}
            />
            <View style={styles.seal}>
              <Feather color={colors.green900} name="check" size={12} />
              <Text style={styles.sealText}>JUNTOS NA ESTRADA</Text>
            </View>
          </View>

          <View style={styles.copy}>
            <View style={styles.kickerRow}>
              <View style={styles.kickerLine} />
              <Text style={styles.kicker}>FEITO PARA QUEM MOVE O BRASIL</Text>
            </View>
            <Text style={[styles.title, compact && styles.titleCompact]}>
              Seu caminho,{"\n"}
              <Text style={styles.titleAccent}>mais seguro.</Text>
            </Text>
            <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
              Reserva financeira e apoio de verdade para você dirigir com mais tranquilidade.
            </Text>
          </View>

          <View style={styles.assuranceBar}>
            {assurances.map((item, index) => (
              <View key={item.label} style={styles.assuranceItem}>
                {index > 0 && <View style={styles.assuranceDivider} />}
                <Feather color={colors.green400} name={item.icon} size={17} />
                <Text style={styles.assuranceText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate("Register")}
            style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
          >
            <View>
              <Text style={styles.primaryText}>Quero me associar</Text>
              <Text style={styles.primaryHint}>Comece seu cadastro agora</Text>
            </View>
            <View style={styles.arrow}>
              <Feather color={colors.white} name="arrow-up-right" size={19} />
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate("Login")}
            style={({ pressed }) => [styles.login, pressed && styles.pressed]}
          >
            <Text style={styles.loginMuted}>Já faz parte? </Text>
            <Text style={styles.loginText}>Entrar na minha conta</Text>
            <Feather color="rgba(255,255,255,0.82)" name="chevron-right" size={16} />
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, overflow: "hidden" },
  ambientTop: {
    backgroundColor: "rgba(58,182,137,0.13)",
    borderRadius: 180,
    height: 330,
    position: "absolute",
    right: -190,
    top: -105,
    transform: [{ rotate: "-18deg" }],
    width: 330,
  },
  ambientBottom: {
    borderColor: "rgba(58,182,137,0.08)",
    borderRadius: 210,
    borderWidth: 55,
    bottom: -235,
    height: 420,
    left: -235,
    position: "absolute",
    width: 420,
  },
  safe: {
    flex: 1,
    paddingBottom: 8,
    paddingHorizontal: 23,
    paddingTop: 10,
  },
  safeCompact: { paddingTop: 5 },
  brandRow: { alignItems: "center", flexDirection: "row" },
  brandRule: {
    backgroundColor: "rgba(255,255,255,0.15)",
    height: 29,
    marginLeft: 16,
    marginRight: 13,
    width: 1,
  },
  brandNote: {
    color: "rgba(255,255,255,0.46)",
    fontFamily: fonts.medium,
    fontSize: 8.5,
    letterSpacing: 0.2,
    lineHeight: 12.5,
  },
  hero: { flex: 1, justifyContent: "center", paddingTop: 6 },
  heroCompact: { paddingTop: 0 },
  markStage: {
    alignItems: "center",
    alignSelf: "center",
    height: 190,
    justifyContent: "center",
    marginBottom: 16,
    width: 230,
  },
  markStageCompact: { height: 145, marginBottom: 8 },
  ringOuter: {
    borderColor: "rgba(255,255,255,0.09)",
    borderRadius: 105,
    borderWidth: 1,
    height: 202,
    position: "absolute",
    width: 202,
  },
  ringInner: {
    borderColor: "rgba(58,182,137,0.19)",
    borderRadius: 78,
    borderWidth: 1,
    height: 156,
    position: "absolute",
    width: 156,
  },
  markShadow: {
    backgroundColor: "rgba(0,0,0,0.24)",
    borderRadius: 34,
    height: 125,
    position: "absolute",
    transform: [{ translateY: 10 }, { rotate: "5deg" }],
    width: 125,
  },
  heroMark: {
    borderRadius: 30,
    height: 124,
    width: 124,
  },
  heroMarkCompact: { borderRadius: 25, height: 102, width: 102 },
  seal: {
    alignItems: "center",
    backgroundColor: "#F4EEE1",
    borderRadius: 20,
    bottom: 2,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: "absolute",
    right: -2,
  },
  sealText: {
    color: colors.green900,
    fontFamily: fonts.extraBold,
    fontSize: 7.5,
    letterSpacing: 0.65,
  },
  copy: { maxWidth: 355 },
  kickerRow: { alignItems: "center", flexDirection: "row", gap: 9, marginBottom: 10 },
  kickerLine: { backgroundColor: colors.green400, height: 1, width: 22 },
  kicker: {
    color: colors.green400,
    fontFamily: fonts.bold,
    fontSize: 9.5,
    letterSpacing: 1.65,
  },
  title: {
    color: colors.white,
    fontFamily: fonts.extraBold,
    fontSize: 42,
    letterSpacing: -1.7,
    lineHeight: 45,
  },
  titleCompact: { fontSize: 36, lineHeight: 39 },
  titleAccent: { color: "#C9EBDD" },
  subtitle: {
    color: "rgba(255,255,255,0.65)",
    fontFamily: fonts.regular,
    fontSize: 14.5,
    lineHeight: 22,
    marginTop: 13,
    maxWidth: 340,
  },
  subtitleCompact: { fontSize: 13.5, lineHeight: 20, marginTop: 9 },
  assuranceBar: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.055)",
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 19,
    minHeight: 50,
    overflow: "hidden",
  },
  assuranceItem: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    position: "relative",
  },
  assuranceDivider: {
    backgroundColor: "rgba(255,255,255,0.10)",
    height: 20,
    left: 0,
    position: "absolute",
    width: 1,
  },
  assuranceText: {
    color: "rgba(255,255,255,0.73)",
    fontFamily: fonts.semibold,
    fontSize: 10,
  },
  actions: { gap: 7, paddingTop: 12 },
  primary: {
    alignItems: "center",
    backgroundColor: "#FAFCFA",
    borderRadius: 18,
    flexDirection: "row",
    height: 64,
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 10,
    shadowColor: "#001A11",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
  },
  primaryText: { color: colors.green900, fontFamily: fonts.bold, fontSize: 14.5 },
  primaryHint: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 9.5, marginTop: 2 },
  arrow: {
    alignItems: "center",
    backgroundColor: colors.green700,
    borderRadius: 14,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  login: {
    alignItems: "center",
    flexDirection: "row",
    height: 43,
    justifyContent: "center",
  },
  loginMuted: {
    color: "rgba(255,255,255,0.47)",
    fontFamily: fonts.regular,
    fontSize: 11.5,
  },
  loginText: { color: colors.white, fontFamily: fonts.bold, fontSize: 11.5 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
});
