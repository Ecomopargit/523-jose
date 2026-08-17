import { useCallback, useEffect, useRef, useState } from "react";
import { AccessibilityInfo, BackHandler } from "react-native";

import type { OnboardingStep } from "../types";

const LAST_STEP: OnboardingStep = 2;

export function useOnboarding(initialStep: OnboardingStep = 0) {
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [reduceMotion, setReduceMotion] = useState(false);
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(Boolean(enabled));
    });
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  const goTo = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(LAST_STEP, next)) as OnboardingStep;
    setStep(clamped);
  }, []);

  const next = useCallback(() => {
    goTo(stepRef.current + 1);
  }, [goTo]);

  const back = useCallback(() => {
    goTo(stepRef.current - 1);
  }, [goTo]);

  const skip = useCallback(() => {
    goTo(LAST_STEP);
  }, [goTo]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (stepRef.current === 0) return false;
      goTo(stepRef.current - 1);
      return true;
    });
    return () => subscription.remove();
  }, [goTo]);

  return {
    step,
    isLast: step === LAST_STEP,
    reduceMotion,
    goTo,
    next,
    back,
    skip,
  };
}
