import { Feather } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { fonts } from "../../../theme";
import { onboardingColors } from "../styles/tokens";
import { resetOnboarding } from "../lib/storage";

type Props = {
  showSkip: boolean;
  onSkip: () => void;
  onEnter: () => void;
};

export function OnboardingHeader({ showSkip, onSkip, onEnter }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel="ECOMOPAR"
        accessibilityRole="image"
        hitSlop={8}
        onLongPress={() => {
          if (__DEV__) {
            void resetOnboarding();
          }
        }}
        style={styles.brand}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={require("../../../../assets/ecomopar-logo.png")}
          style={styles.logo}
        />
      </Pressable>

      <View style={styles.actions}>
        {showSkip ? (
          <Pressable
            accessibilityLabel="Pular onboarding"
            accessibilityRole="button"
            hitSlop={10}
            onPress={onSkip}
            style={({ pressed }) => [styles.skipHit, pressed && styles.pressed]}
          >
            <Text style={styles.skip}>Pular</Text>
          </Pressable>
        ) : (
          <View style={styles.skipPlaceholder} />
        )}

        <Pressable
          accessibilityLabel="Entrar na conta"
          accessibilityRole="button"
          onPress={onEnter}
          style={({ pressed }) => [styles.login, pressed && styles.pressed]}
        >
          <Feather color={onboardingColors.white} name="user" size={14} />
          <Text style={styles.loginText}>Entrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
  },
  brand: {
    flexShrink: 1,
    maxWidth: "52%",
  },
  logo: {
    height: 36,
    maxWidth: "100%",
    width: 148,
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  skipHit: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  skipPlaceholder: {
    width: 8,
  },
  skip: {
    color: onboardingColors.muted,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  login: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  loginText: {
    color: onboardingColors.white,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },
});
