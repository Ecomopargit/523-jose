import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { fonts } from "../../../theme";
import { onboardingColors } from "../styles/tokens";

type Props = {
  active: boolean;
  reduceMotion?: boolean;
};

function Step({ delay, active, reduceMotion }: { delay: number; active: boolean; reduceMotion?: boolean }) {
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      fill.setValue(0);
      return;
    }
    Animated.timing(fill, {
      toValue: 1,
      delay: reduceMotion ? 0 : delay,
      duration: reduceMotion ? 1 : 900,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [active, delay, fill, reduceMotion]);

  return (
    <View style={styles.step}>
      <Animated.View style={[styles.stepFill, { transform: [{ scaleX: fill }] }]} />
    </View>
  );
}

export function ReferralCard({ active, reduceMotion }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.copy}>
          <Text style={styles.kicker}>INDIQUE E GANHE</Text>
          <Text style={styles.title}>3 indicações válidas e ativadas</Text>
        </View>
        <Text style={styles.bonus}>+ R$ 150</Text>
      </View>

      <View style={styles.progress}>
        <Step active={active} delay={0} reduceMotion={reduceMotion} />
        <Step active={active} delay={120} reduceMotion={reduceMotion} />
        <Step active={active} delay={240} reduceMotion={reduceMotion} />
      </View>

      <View style={styles.foot}>
        <Text style={styles.stepsLabel}>1 indicação → 2 indicações → 3 indicações</Text>
        <Text style={styles.hint}>bônus liberado após validação</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(246,184,74,0.06)",
    borderColor: "rgba(246,184,74,0.26)",
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  top: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  kicker: {
    color: "#9BB2A9",
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: {
    color: onboardingColors.white,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  bonus: {
    color: onboardingColors.gold,
    fontFamily: fonts.extraBold,
    fontSize: 20,
    letterSpacing: -0.5,
  },
  progress: {
    flexDirection: "row",
    gap: 7,
    marginTop: 12,
  },
  step: {
    backgroundColor: "rgba(255,255,255,0.09)",
    borderRadius: 999,
    flex: 1,
    height: 5,
    overflow: "hidden",
  },
  stepFill: {
    backgroundColor: onboardingColors.lime,
    height: "100%",
    transformOrigin: "left",
    width: "100%",
  },
  foot: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    marginTop: 8,
  },
  stepsLabel: {
    color: "#D5E3DC",
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 9,
  },
  hint: {
    color: "#8DA69C",
    fontFamily: fonts.regular,
    fontSize: 9,
  },
});
