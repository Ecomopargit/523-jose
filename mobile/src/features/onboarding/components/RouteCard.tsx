import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { fonts } from "../../../theme";
import { onboardingColors } from "../styles/tokens";
import { AnimatedCar } from "./AnimatedCar";

type Props = {
  compact?: boolean;
  reduceMotion?: boolean;
};

export function RouteCard({ compact, reduceMotion }: Props) {
  const { width } = useWindowDimensions();
  const cardPad = width < 360 ? 14 : 18;
  const routeHeight = compact ? 118 : width < 370 ? 132 : 150;

  return (
    <View style={[styles.card, compact && styles.cardCompact, { padding: cardPad }]}>
      <View style={styles.top}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>CONSTÂNCIA</Text>
          <Text style={styles.metricValue}>
            R$ 7 <Text style={styles.metricUnit}>por dia</Text>
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>30 dias • R$ 150</Text>
        </View>
      </View>

      <View style={[styles.routeArea, { height: routeHeight }]}>
        <AnimatedCar height={routeHeight} reduceMotion={reduceMotion} width={Math.max(220, width - 64)} />
      </View>

      <Text style={styles.caption}>
        Pequenos passos, todos os dias, construindo uma reserva para você.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.045)",
    borderColor: onboardingColors.line,
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 4,
    minHeight: 230,
    overflow: "hidden",
  },
  cardCompact: {
    borderRadius: 20,
    minHeight: 200,
  },
  top: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metric: {
    flexShrink: 1,
  },
  metricLabel: {
    color: onboardingColors.mutedSoft,
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  metricValue: {
    color: onboardingColors.white,
    fontFamily: fonts.extraBold,
    fontSize: 32,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  metricUnit: {
    color: onboardingColors.white,
    fontFamily: fonts.semibold,
    fontSize: 13,
    letterSpacing: 0,
  },
  badge: {
    backgroundColor: "rgba(217,255,111,0.07)",
    borderColor: "rgba(217,255,111,0.28)",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  badgeText: {
    color: onboardingColors.lime,
    fontFamily: fonts.bold,
    fontSize: 11,
  },
  routeArea: {
    marginLeft: -6,
    marginRight: -6,
    marginTop: 8,
    overflow: "visible",
  },
  caption: {
    color: "#C5D7D0",
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
    maxWidth: 220,
  },
});
