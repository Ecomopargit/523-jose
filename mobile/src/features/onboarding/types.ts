export type OnboardingStep = 0 | 1 | 2;

export type OnboardingBenefit = {
  id: string;
  title: string;
  description: string;
  icon: "shield" | "heart" | "activity" | "credit-card";
};
