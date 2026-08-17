import { Feather } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";

import { fonts } from "../../../theme";
import { onboardingColors } from "../styles/tokens";

type IconName = ComponentProps<typeof Feather>["name"];

type Props = {
  icon: IconName;
  title: string;
  description: string;
  compact?: boolean;
};

export function BenefitCard({ icon, title, description, compact }: Props) {
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={[styles.icon, compact && styles.iconCompact]}>
        <Feather color={onboardingColors.lime} name={icon} size={compact ? 15 : 17} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
        <Text style={[styles.description, compact && styles.descriptionCompact]}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.035)",
    borderColor: "rgba(255,255,255,0.09)",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 62,
    paddingHorizontal: 12,
    paddingVertical: 11,
    width: "48.5%",
  },
  cardCompact: {
    minHeight: 54,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  icon: {
    alignItems: "center",
    backgroundColor: "rgba(217,255,111,0.09)",
    borderRadius: 12,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  iconCompact: {
    height: 30,
    width: 30,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: onboardingColors.white,
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 14,
  },
  titleCompact: {
    fontSize: 10,
    lineHeight: 13,
  },
  description: {
    color: onboardingColors.mutedSoft,
    fontFamily: fonts.regular,
    fontSize: 9,
    lineHeight: 12,
    marginTop: 3,
  },
  descriptionCompact: {
    fontSize: 8,
    lineHeight: 11,
  },
});
