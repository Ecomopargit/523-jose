import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing } from "react-native";

type Props = {
  children: ReactNode;
  delay?: number;
  active?: boolean;
  reduceMotion?: boolean;
};

export function Reveal({ children, delay = 0, active = true, reduceMotion }: Props) {
  const progress = useRef(new Animated.Value(reduceMotion || active ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(1);
      return;
    }
    if (!active) {
      progress.setValue(0);
      return;
    }
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      delay,
      duration: 560,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [active, delay, progress, reduceMotion]);

  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}
