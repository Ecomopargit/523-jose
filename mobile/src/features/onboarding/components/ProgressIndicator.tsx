import { Animated, Pressable, StyleSheet, View } from "react-native";

import { onboardingColors } from "../styles/tokens";
import type { OnboardingStep } from "../types";

type Props = {
  step: OnboardingStep;
  onSelect: (step: OnboardingStep) => void;
  /** Posição contínua do pager (0 a 2), para o traço acompanhar o dedo. */
  progress: Animated.AnimatedInterpolation<number>;
};

const STEPS: OnboardingStep[] = [0, 1, 2];

export function ProgressIndicator({ step, onSelect, progress }: Props) {
  return (
    <View
      accessibilityLabel={`Etapa ${step + 1} de 3`}
      accessibilityRole="progressbar"
      style={styles.wrap}
    >
      {STEPS.map((item) => (
        <Pressable
          accessibilityLabel={`Ir para etapa ${item + 1}`}
          accessibilityRole="button"
          accessibilityState={{ selected: item === step }}
          hitSlop={14}
          key={item}
          onPress={() => onSelect(item)}
          style={styles.segment}
        >
          <Animated.View
            style={[
              styles.fill,
              {
                transform: [
                  {
                    scaleX: progress.interpolate({
                      inputRange: [item - 1, item],
                      outputRange: [0, 1],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  segment: {
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 999,
    flex: 1,
    height: 4,
    overflow: "hidden",
  },
  fill: {
    backgroundColor: onboardingColors.lime,
    borderRadius: 999,
    height: "100%",
    transformOrigin: "left",
    width: "100%",
  },
});
