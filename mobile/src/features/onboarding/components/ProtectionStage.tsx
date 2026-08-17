import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { fonts } from "../../../theme";
import { onboardingColors } from "../styles/tokens";

type Props = {
  active: boolean;
  compact?: boolean;
  reduceMotion?: boolean;
};

function OrbitChip({
  icon,
  style,
  delay,
  reduceMotion,
  label,
}: {
  icon: "shield" | "heart" | "bar-chart-2" | "credit-card";
  style: object;
  delay: number;
  reduceMotion?: boolean;
  label: string;
}) {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(bob, {
          toValue: -5,
          duration: 1450,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1450,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [bob, delay, reduceMotion]);

  return (
    <Animated.View
      accessibilityLabel={label}
      style={[styles.orbitChip, style, { transform: [{ translateY: bob }] }]}
    >
      <Feather color={onboardingColors.lime} name={icon} size={16} />
    </Animated.View>
  );
}

const SHIELD_OUTER =
  "M39 2 L71.8 14.5 L67.1 56.9 L39 84 L10.9 56.9 L6.2 14.5 Z";
const SHIELD_INNER =
  "M39 9 L66.5 19.2 L62.5 55 L39 76 L15.5 55 L11.5 19.2 Z";

export function ProtectionStage({ active, compact, reduceMotion }: Props) {
  const float = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active || reduceMotion) {
      float.setValue(0);
      ring.setValue(0);
      return;
    }

    const floatAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: -4,
          duration: 1550,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1550,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const ringAnim = Animated.loop(
      Animated.timing(ring, {
        toValue: 1,
        duration: 4800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    floatAnim.start();
    ringAnim.start();
    return () => {
      floatAnim.stop();
      ringAnim.stop();
    };
  }, [active, float, reduceMotion, ring]);

  return (
    <View style={[styles.stage, compact && styles.stageCompact]}>
      <View style={styles.titleBlock}>
        <Text style={styles.kicker}>PROTEÇÃO ECOMOPAR</Text>
        <Text style={styles.title}>Benefícios que acompanham você</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>apoio real</Text>
      </View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.ringOuter,
          {
            transform: [
              {
                rotate: ring.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ringInner,
          {
            transform: [
              {
                rotate: ring.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "-360deg"],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View style={[styles.shieldCore, { transform: [{ translateY: float }] }]}>
        <Svg height={86} viewBox="0 0 78 86" width={78}>
          <Defs>
            <LinearGradient id="shieldOuterGrad" x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0" stopColor="#E5FF83" />
              <Stop offset="0.55" stopColor="#BDE94D" />
              <Stop offset="1" stopColor="#8DBF32" />
            </LinearGradient>
            <LinearGradient id="shieldInnerGrad" x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0" stopColor="#0F5B48" />
              <Stop offset="1" stopColor="#073A30" />
            </LinearGradient>
          </Defs>
          <Path d={SHIELD_OUTER} fill="url(#shieldOuterGrad)" />
          <Path d={SHIELD_INNER} fill="url(#shieldInnerGrad)" />
          <Path
            d="M39 28 L52 33.5 V44.5 C52 52.5 46.5 58.5 39 62.5 C31.5 58.5 26 52.5 26 44.5 V33.5 L39 28 Z"
            fill="none"
            stroke={onboardingColors.lime}
            strokeWidth={1.8}
          />
          <Path
            d="M33.5 45.5 L37.2 49.2 L45.5 40.5"
            fill="none"
            stroke={onboardingColors.lime}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
          />
        </Svg>
      </Animated.View>

      <OrbitChip delay={100} icon="shield" label="Franquia do seguro" reduceMotion={reduceMotion} style={styles.orbit1} />
      <OrbitChip delay={450} icon="heart" label="Assistência odontológica" reduceMotion={reduceMotion} style={styles.orbit2} />
      <OrbitChip delay={800} icon="bar-chart-2" label="Orientação jurídica" reduceMotion={reduceMotion} style={styles.orbit3} />
      <OrbitChip delay={1000} icon="credit-card" label="Crédito subsidiado" reduceMotion={reduceMotion} style={styles.orbit4} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 150,
    overflow: "hidden",
  },
  stageCompact: {
    borderRadius: 20,
    minHeight: 132,
  },
  titleBlock: {
    left: 16,
    maxWidth: "62%",
    position: "absolute",
    top: 14,
    zIndex: 3,
  },
  kicker: {
    color: onboardingColors.mutedSoft,
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 1.3,
    marginBottom: 3,
  },
  title: {
    color: onboardingColors.white,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  badge: {
    backgroundColor: "rgba(217,255,111,0.08)",
    borderColor: "rgba(217,255,111,0.22)",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 6,
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 3,
  },
  badgeText: {
    color: onboardingColors.lime,
    fontFamily: fonts.bold,
    fontSize: 10,
  },
  ringOuter: {
    borderColor: "rgba(217,255,111,0.14)",
    borderRadius: 999,
    borderWidth: 1,
    height: 170,
    position: "absolute",
    width: 170,
  },
  ringInner: {
    borderColor: "rgba(217,255,111,0.2)",
    borderRadius: 999,
    borderWidth: 1,
    height: 118,
    position: "absolute",
    width: 118,
  },
  shieldCore: {
    alignItems: "center",
    height: 86,
    justifyContent: "center",
    width: 78,
    zIndex: 2,
  },
  orbitChip: {
    alignItems: "center",
    backgroundColor: "rgba(4,47,39,0.86)",
    borderColor: "rgba(255,255,255,0.11)",
    borderRadius: 13,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    minWidth: 36,
    position: "absolute",
    zIndex: 3,
  },
  orbit1: { left: 42, top: 74 },
  orbit2: { right: 42, top: 70 },
  orbit3: { bottom: 12, left: 72 },
  orbit4: { bottom: 12, right: 72 },
});
