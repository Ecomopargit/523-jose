import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";

import { fonts } from "../../../theme";
import { onboardingColors } from "../styles/tokens";

type Props = {
  isLast: boolean;
  showBack: boolean;
  step: number;
  onBack: () => void;
  onPrimary: () => void;
  onMember?: () => void;
  reduceMotion?: boolean;
};

export function OnboardingFooter({
  isLast,
  showBack,
  step,
  onBack,
  onPrimary,
  onMember,
  reduceMotion,
}: Props) {
  const [press] = useState(() => new Animated.Value(0));

  const animatePress = (toValue: number) => {
    if (reduceMotion) {
      press.setValue(toValue);
      return;
    }
    Animated.timing(press, {
      toValue,
      duration: toValue === 1 ? 90 : 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const scale = press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.972] });
  const arrowShift = press.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={onBack}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}
          >
            <Feather color={onboardingColors.white} name="chevron-left" size={22} />
          </Pressable>
        ) : (
          <View style={styles.counter}>
            <Text style={styles.counterText}>0{step + 1}</Text>
            <Text style={styles.counterTotal}>/03</Text>
          </View>
        )}

        <Pressable
          accessibilityLabel={isLast ? "Quero me associar" : "Continuar"}
          accessibilityRole="button"
          onPress={onPrimary}
          onPressIn={() => animatePress(1)}
          onPressOut={() => animatePress(0)}
          style={styles.nextHit}
        >
          <Animated.View style={[styles.next, { transform: [{ scale }] }]}>
            <Text numberOfLines={1} style={styles.nextText}>
              {isLast ? "Quero me associar" : "Continuar"}
            </Text>
            <Animated.View style={[styles.arrowChip, { transform: [{ translateX: arrowShift }] }]}>
              <Feather color={onboardingColors.lime} name="arrow-right" size={19} />
            </Animated.View>
          </Animated.View>
        </Pressable>
      </View>

      {isLast && onMember ? (
        <View style={styles.finalLinks}>
          <Pressable accessibilityRole="button" hitSlop={10} onPress={onBack}>
            <Text style={styles.linkMuted}>Voltar</Text>
          </Pressable>
          <Pressable accessibilityRole="button" hitSlop={10} onPress={onMember}>
            <Text style={styles.linkStrong}>Já sou associado</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 10,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  back: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 18,
    borderWidth: 1,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  counter: {
    alignItems: "baseline",
    flexDirection: "row",
    height: 58,
    justifyContent: "center",
    paddingLeft: 2,
    width: 58,
  },
  counterText: {
    color: onboardingColors.white,
    fontFamily: fonts.extraBold,
    fontSize: 17,
    letterSpacing: -0.4,
  },
  counterTotal: {
    color: onboardingColors.mutedSoft,
    fontFamily: fonts.bold,
    fontSize: 11,
  },
  nextHit: {
    flex: 1,
  },
  next: {
    alignItems: "center",
    backgroundColor: onboardingColors.lime,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 58,
    paddingLeft: 20,
    paddingRight: 9,
  },
  nextText: {
    color: onboardingColors.inkDark,
    flexShrink: 1,
    fontFamily: fonts.extraBold,
    fontSize: 16,
    letterSpacing: -0.3,
  },
  arrowChip: {
    alignItems: "center",
    backgroundColor: onboardingColors.inkDark,
    borderRadius: 14,
    height: 40,
    justifyContent: "center",
    marginLeft: 12,
    width: 40,
  },
  finalLinks: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    minHeight: 36,
    paddingHorizontal: 4,
  },
  linkMuted: {
    color: onboardingColors.muted,
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  linkStrong: {
    color: onboardingColors.white,
    fontFamily: fonts.bold,
    fontSize: 12,
    textDecorationLine: "underline",
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
});
