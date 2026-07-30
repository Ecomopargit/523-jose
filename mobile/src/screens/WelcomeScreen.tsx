import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
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

const highlights = [
  {
    icon: "shield",
    tag: "PROTEÇÃO DIÁRIA",
    title: "R$ 7 por dia, tranquilidade o mês inteiro",
    text: "R$ 5 viram sua reserva pessoal e R$ 2 custeiam a associação.",
  },
  {
    icon: "trending-up",
    tag: "RESERVA QUE CRESCE",
    title: "R$ 150 guardados a cada 30 dias",
    text: "Acompanhe seu saldo pelo app e saque conforme as regras.",
  },
  {
    icon: "gift",
    tag: "INDIQUE E GANHE",
    title: "R$ 150 a cada 3 parceiros ativados",
    text: "Compartilhe seu link e acompanhe suas indicações em tempo real.",
  },
] as const;

const AUTOPLAY_MS = 4200;

export function WelcomeScreen({ navigation }: Props) {
  const { height, width } = useWindowDimensions();
  const compact = height < 750;
  const cardWidth = width - 46;

  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);
  const paused = useRef(false);
  const [entrance] = useState(() => new Animated.Value(0));
  const [pulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [entrance, pulse]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (paused.current) return;
      const next = (indexRef.current + 1) % highlights.length;
      indexRef.current = next;
      setIndex(next);
      scrollRef.current?.scrollTo({ x: next * cardWidth, animated: true });
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [cardWidth]);

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
    indexRef.current = next;
    setIndex(next);
    paused.current = false;
  };

  const goTo = (target: number) => {
    indexRef.current = target;
    setIndex(target);
    scrollRef.current?.scrollTo({ x: target * cardWidth, animated: true });
  };

  const rise = (distance: number) => ({
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [distance, 0],
        }),
      },
    ],
  });

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
        <Animated.View style={[styles.brandRow, rise(-10)]}>
          <Logo />
          <View style={styles.brandRule} />
          <Text style={styles.brandNote}>Instituto de apoio{"\n"}ao motorista autônomo</Text>
        </Animated.View>

        <View style={[styles.hero, compact && styles.heroCompact]}>
          <Animated.View style={[styles.markStage, compact && styles.markStageCompact, rise(18)]}>
            <Animated.View
              style={[
                styles.ringOuter,
                {
                  opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }),
                  transform: [
                    { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.ringInner,
                {
                  transform: [
                    { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }) },
                  ],
                },
              ]}
            />
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
          </Animated.View>

          <Animated.View style={[styles.copy, rise(22)]}>
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
          </Animated.View>

          <Animated.View style={rise(26)}>
            <ScrollView
              decelerationRate="fast"
              horizontal
              onMomentumScrollEnd={onMomentumEnd}
              onScrollBeginDrag={() => {
                paused.current = true;
              }}
              ref={scrollRef}
              showsHorizontalScrollIndicator={false}
              snapToInterval={cardWidth}
              style={[styles.pager, compact && styles.pagerCompact]}
            >
              {highlights.map((item) => (
                <View key={item.tag} style={{ width: cardWidth }}>
                  <View style={styles.highlightInner}>
                    <View style={styles.highlightIcon}>
                      <Feather color={colors.green400} name={item.icon} size={18} />
                    </View>
                    <View style={styles.highlightCopy}>
                      <Text style={styles.highlightTag}>{item.tag}</Text>
                      <Text numberOfLines={2} style={styles.highlightTitle}>
                        {item.title}
                      </Text>
                      <Text numberOfLines={2} style={styles.highlightText}>
                        {item.text}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.dots}>
              {highlights.map((item, dotIndex) => (
                <Pressable
                  accessibilityLabel={`Ver destaque ${dotIndex + 1}`}
                  accessibilityRole="button"
                  hitSlop={10}
                  key={item.tag}
                  onPress={() => goTo(dotIndex)}
                  style={[styles.dot, dotIndex === index && styles.dotActive]}
                />
              ))}
            </View>
          </Animated.View>
        </View>

        <Animated.View style={[styles.actions, rise(30)]}>
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
        </Animated.View>
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
  markStageCompact: { height: 140, marginBottom: 4 },
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
  heroMarkCompact: { borderRadius: 25, height: 100, width: 100 },
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
  titleCompact: { fontSize: 34, lineHeight: 37 },
  titleAccent: { color: "#C9EBDD" },
  subtitle: {
    color: "rgba(255,255,255,0.65)",
    fontFamily: fonts.regular,
    fontSize: 14.5,
    lineHeight: 22,
    marginTop: 13,
    maxWidth: 340,
  },
  subtitleCompact: { fontSize: 13, lineHeight: 19, marginTop: 8 },
  pager: { marginTop: 18 },
  pagerCompact: { marginTop: 12 },
  highlightInner: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.055)",
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 82,
    padding: 14,
  },
  highlightIcon: {
    alignItems: "center",
    backgroundColor: "rgba(58,182,137,0.14)",
    borderColor: "rgba(58,182,137,0.22)",
    borderRadius: 13,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  highlightCopy: { flex: 1 },
  highlightTag: {
    color: colors.green400,
    fontFamily: fonts.bold,
    fontSize: 7.5,
    letterSpacing: 1.2,
  },
  highlightTitle: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 12.5,
    lineHeight: 17,
    marginTop: 4,
  },
  highlightText: {
    color: "rgba(255,255,255,0.55)",
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
  },
  dots: { alignSelf: "center", flexDirection: "row", gap: 6, marginTop: 11 },
  dot: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 3,
    height: 5,
    width: 5,
  },
  dotActive: { backgroundColor: colors.green400, width: 18 },
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
