import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackParamList } from "../../types";
import { fonts } from "../../theme";
import { BenefitCard } from "./components/BenefitCard";
import { ContributionCard } from "./components/ContributionCard";
import { OnboardingFooter } from "./components/OnboardingFooter";
import { OnboardingHeader } from "./components/OnboardingHeader";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { ProtectionStage } from "./components/ProtectionStage";
import { ReferralCard } from "./components/ReferralCard";
import { Reveal } from "./components/Reveal";
import { RouteCard } from "./components/RouteCard";
import { useOnboarding } from "./hooks/useOnboarding";
import { markOnboardingCompleted } from "./lib/storage";
import { onboardingColors } from "./styles/tokens";
import type { OnboardingStep } from "./types";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const BENEFITS = [
  { icon: "shield" as const, title: "Franquia do seguro", description: "Apoio em situações previstas." },
  { icon: "heart" as const, title: "Assistência odontológica", description: "Cuidado para o dia a dia." },
  { icon: "bar-chart-2" as const, title: "Orientação jurídica", description: "Suporte quando precisar." },
  { icon: "credit-card" as const, title: "Crédito subsidiado", description: "Sujeito à análise." },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <View style={styles.eyebrowRow}>
      <View style={styles.eyebrowLine} />
      <Text style={styles.eyebrow}>{children}</Text>
    </View>
  );
}

export function OnboardingScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const { step, isLast, reduceMotion, goTo } = useOnboarding(0);
  const pagerRef = useRef<ScrollView>(null);
  const stepRef = useRef<OnboardingStep>(0);
  // Evita que a sincronia com o gesto dispare uma segunda rolagem programática.
  const settledByGesture = useRef(false);

  const narrow = width < 370;
  const compact = height < 760;
  const veryCompact = height < 700;
  const horizontalPadding = narrow ? 16 : 22;
  const pagerWidth = width - horizontalPadding * 2;
  const lastPagerWidth = useRef(pagerWidth);

  const titleSize = veryCompact ? 30 : compact ? 34 : Math.min(42, width * 0.105);
  const titleLineHeight = titleSize * 1.02;

  const [scrollX] = useState(() => new Animated.Value(0));
  const pagerProgress = useMemo(
    () =>
      scrollX.interpolate({
        inputRange: [0, Math.max(1, pagerWidth) * 2],
        outputRange: [0, 2],
        extrapolate: "clamp",
      }),
    [pagerWidth, scrollX],
  );
  const onPagerScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
      }),
    [scrollX],
  );

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // Única fonte de rolagem programática: reage à etapa, exceto quando ela
  // acabou de ser definida pelo próprio gesto do usuário.
  useEffect(() => {
    const widthChanged = lastPagerWidth.current !== pagerWidth;
    lastPagerWidth.current = pagerWidth;

    if (settledByGesture.current && !widthChanged) {
      settledByGesture.current = false;
      return;
    }
    settledByGesture.current = false;
    pagerRef.current?.scrollTo({
      x: step * pagerWidth,
      animated: !reduceMotion && !widthChanged,
    });
  }, [pagerWidth, reduceMotion, step]);

  const scrollToStep = useCallback(
    (nextStep: number) => {
      goTo(Math.max(0, Math.min(2, nextStep)));
    },
    [goTo],
  );

  const onPageSettled = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextStep = Math.max(
        0,
        Math.min(2, Math.round(event.nativeEvent.contentOffset.x / pagerWidth)),
      ) as OnboardingStep;
      if (nextStep === stepRef.current) return;
      settledByGesture.current = true;
      goTo(nextStep);
    },
    [goTo, pagerWidth],
  );

  const completeAnd = useCallback(
    async (route: "Login" | "Register") => {
      await markOnboardingCompleted();
      navigation.navigate(route);
    },
    [navigation],
  );

  const onPrimary = useCallback(() => {
    if (isLast) {
      void completeAnd("Register");
      return;
    }
    scrollToStep(step + 1);
  }, [completeAnd, isLast, scrollToStep, step]);

  return (
    <LinearGradient
      colors={[onboardingColors.bg, onboardingColors.bgDeep]}
      end={{ x: 0.5, y: 1 }}
      start={{ x: 0.5, y: 0 }}
      style={styles.screen}
    >
      <View pointerEvents="none" style={styles.ambientTop} />
      <View pointerEvents="none" style={styles.ambientSide} />
      <View pointerEvents="none" style={styles.gridArc} />

      <SafeAreaView edges={["top", "bottom"]} style={[styles.safe, { paddingHorizontal: horizontalPadding }]}>
        <OnboardingHeader
          onEnter={() => void completeAnd("Login")}
          onSkip={() => scrollToStep(2)}
          showSkip={!isLast}
        />

        <ProgressIndicator
          onSelect={(nextStep) => scrollToStep(nextStep)}
          progress={pagerProgress}
          step={step}
        />

        <Animated.ScrollView
          bounces={false}
          horizontal
          keyboardShouldPersistTaps="handled"
          onMomentumScrollEnd={onPageSettled}
          onScroll={onPagerScroll}
          onScrollEndDrag={onPageSettled}
          pagingEnabled
          ref={pagerRef}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={styles.pager}
        >
          {/* Step 1 */}
          <View style={{ width: pagerWidth }}>
            <ScrollView
              bounces={false}
              contentContainerStyle={[styles.pageContent, compact && styles.pageContentCompact]}
              showsVerticalScrollIndicator={false}
            >
              <Reveal active={step === 0} delay={0} reduceMotion={reduceMotion}>
                <Eyebrow>SUA ROTA FINANCEIRA</Eyebrow>
              </Reveal>
              <Reveal active={step === 0} delay={80} reduceMotion={reduceMotion}>
                <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleLineHeight }]}>
                  Todo dia na rua.{"\n"}
                  <Text style={styles.accent}>Todo dia mais forte.</Text>
                </Text>
              </Reveal>
              <Reveal active={step === 0} delay={160} reduceMotion={reduceMotion}>
                <Text style={[styles.lead, compact && styles.leadCompact]}>
                  Uma contribuição simples que transforma constância em reserva e proteção para sua rotina.
                </Text>
              </Reveal>
              <Reveal active={step === 0} delay={240} reduceMotion={reduceMotion}>
                <RouteCard compact={compact} reduceMotion={reduceMotion} />
              </Reveal>
            </ScrollView>
          </View>

          {/* Step 2 */}
          <View style={{ width: pagerWidth }}>
            <ScrollView
              bounces={false}
              contentContainerStyle={[styles.pageContent, compact && styles.pageContentCompact]}
              showsVerticalScrollIndicator={false}
            >
              <Reveal active={step === 1} delay={0} reduceMotion={reduceMotion}>
                <Eyebrow>CONTRIBUIÇÃO TRANSPARENTE</Eyebrow>
              </Reveal>
              <Reveal active={step === 1} delay={80} reduceMotion={reduceMotion}>
                <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleLineHeight }]}>
                  <Text style={styles.accent}>R$ 7 por dia.</Text>
                  {"\n"}Cada parte tem um propósito.
                </Text>
              </Reveal>
              <Reveal active={step === 1} delay={160} reduceMotion={reduceMotion}>
                <Text style={[styles.lead, compact && styles.leadCompact]}>
                  Você sabe exatamente para onde vai cada valor — sem linguagem complicada e sem surpresas.
                </Text>
              </Reveal>
              <Reveal active={step === 1} delay={240} reduceMotion={reduceMotion}>
                <ContributionCard active={step === 1} compact={compact} reduceMotion={reduceMotion} />
              </Reveal>
            </ScrollView>
          </View>

          {/* Step 3 */}
          <View style={{ width: pagerWidth }}>
            <ScrollView
              bounces={false}
              contentContainerStyle={[
                styles.pageContent,
                styles.finalPageContent,
                compact && styles.pageContentCompact,
              ]}
              showsVerticalScrollIndicator={false}
            >
              <Reveal active={step === 2} delay={0} reduceMotion={reduceMotion}>
                <Eyebrow>UMA REDE AO SEU LADO</Eyebrow>
              </Reveal>
              <Reveal active={step === 2} delay={70} reduceMotion={reduceMotion}>
                <Text
                  style={[
                    styles.title,
                    styles.finalTitle,
                    { fontSize: Math.min(titleSize, compact ? 30 : 36), lineHeight: titleLineHeight * 0.95 },
                  ]}
                >
                  Mais proteção para{"\n"}
                  <Text style={styles.accent}>seguir em frente.</Text>
                </Text>
              </Reveal>
              <Reveal active={step === 2} delay={140} reduceMotion={reduceMotion}>
                <Text style={[styles.lead, styles.finalLead, compact && styles.leadCompact]}>
                  Uma rede pensada para apoiar sua rotina — do imprevisto ao próximo passo.
                </Text>
              </Reveal>
              <Reveal active={step === 2} delay={200} reduceMotion={reduceMotion}>
                <ProtectionStage active={step === 2} compact={compact} reduceMotion={reduceMotion} />
              </Reveal>
              <Reveal active={step === 2} delay={260} reduceMotion={reduceMotion}>
                <View style={styles.benefitsGrid}>
                  {BENEFITS.map((benefit) => (
                    <BenefitCard
                      compact={compact}
                      description={benefit.description}
                      icon={benefit.icon}
                      key={benefit.title}
                      title={benefit.title}
                    />
                  ))}
                </View>
              </Reveal>
              <Reveal active={step === 2} delay={320} reduceMotion={reduceMotion}>
                <ReferralCard active={step === 2} reduceMotion={reduceMotion} />
              </Reveal>
              <Reveal active={step === 2} delay={380} reduceMotion={reduceMotion}>
                <View style={styles.finalNote}>
                  <View style={styles.finalDot} />
                  <Text style={styles.finalNoteText}>
                    Cadastro analisado em até 48 horas úteis • ativação via PIX
                  </Text>
                </View>
              </Reveal>
            </ScrollView>
          </View>
        </Animated.ScrollView>

        <OnboardingFooter
          isLast={isLast}
          onBack={() => scrollToStep(step - 1)}
          onMember={() => void completeAnd("Login")}
          onPrimary={onPrimary}
          reduceMotion={reduceMotion}
          showBack={step > 0}
          step={step}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: "hidden",
  },
  safe: {
    flex: 1,
  },
  ambientTop: {
    backgroundColor: "rgba(217,255,111,0.12)",
    borderRadius: 999,
    height: 280,
    position: "absolute",
    right: -120,
    top: -80,
    width: 280,
  },
  ambientSide: {
    backgroundColor: "rgba(31,128,94,0.18)",
    borderRadius: 999,
    height: 220,
    left: -140,
    position: "absolute",
    top: 220,
    width: 220,
  },
  gridArc: {
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 999,
    borderWidth: 1,
    bottom: -220,
    height: 520,
    position: "absolute",
    right: -180,
    width: 520,
  },
  pager: {
    flex: 1,
    marginTop: 14,
  },
  pageContent: {
    flexGrow: 1,
    gap: 14,
    justifyContent: "center",
    paddingBottom: 8,
    paddingTop: 8,
  },
  pageContentCompact: {
    gap: 10,
    justifyContent: "flex-start",
    paddingTop: 4,
  },
  finalPageContent: {
    gap: 12,
  },
  eyebrowRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  eyebrowLine: {
    backgroundColor: onboardingColors.lime,
    borderRadius: 99,
    height: 3,
    width: 26,
  },
  eyebrow: {
    color: onboardingColors.lime,
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.6,
  },
  title: {
    color: onboardingColors.white,
    fontFamily: fonts.extraBold,
    letterSpacing: -1.2,
    maxWidth: 360,
  },
  finalTitle: {
    maxWidth: 380,
  },
  accent: {
    color: onboardingColors.lime,
  },
  lead: {
    color: onboardingColors.muted,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 360,
  },
  finalLead: {
    maxWidth: 370,
  },
  leadCompact: {
    fontSize: 13,
    lineHeight: 19,
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    justifyContent: "space-between",
  },
  finalNote: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    paddingBottom: 2,
    paddingTop: 2,
  },
  finalDot: {
    backgroundColor: onboardingColors.lime,
    borderRadius: 99,
    height: 5,
    width: 5,
  },
  finalNoteText: {
    color: "#809E93",
    flexShrink: 1,
    fontFamily: fonts.regular,
    fontSize: 9,
    textAlign: "center",
  },
});
