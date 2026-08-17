import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { fonts } from "../../../theme";
import { onboardingColors } from "../styles/tokens";

type Props = {
  active: boolean;
  compact?: boolean;
  reduceMotion?: boolean;
};

export function ContributionCard({ active, compact, reduceMotion }: Props) {
  const me = useRef(new Animated.Value(0)).current;
  const network = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      me.setValue(0);
      network.setValue(0);
      return;
    }
    const duration = reduceMotion ? 1 : 900;
    Animated.sequence([
      Animated.delay(reduceMotion ? 0 : 180),
      Animated.parallel([
        Animated.timing(me, {
          toValue: 1,
          duration,
          easing: Easing.bezier(0.2, 0.8, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(reduceMotion ? 0 : 180),
          Animated.timing(network, {
            toValue: 1,
            duration,
            easing: Easing.bezier(0.2, 0.8, 0.2, 1),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [active, me, network, reduceMotion]);

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.head}>
        <View>
          <Text style={styles.label}>Sua reserva em 30 dias</Text>
          <Text style={styles.total}>R$ 150</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Transparente</Text>
        </View>
      </View>

      <View style={styles.barTrack}>
        <View style={styles.barMeSlot}>
          <Animated.View style={[styles.barMe, { transform: [{ scaleX: me }] }]} />
        </View>
        <View style={styles.barNetworkSlot}>
          <Animated.View style={[styles.barNetwork, { transform: [{ scaleX: network }] }]} />
        </View>
      </View>

      <View style={styles.splitGrid}>
        <View style={styles.splitItem}>
          <Text style={styles.amount}>R$ 5</Text>
          <Text style={styles.splitLabel}>para sua reserva</Text>
          <View style={styles.mini}>
            <View style={styles.dot} />
            <Text style={styles.miniText}>cresce com a constância</Text>
          </View>
        </View>
        <View style={styles.splitItem}>
          <Text style={styles.amount}>R$ 2</Text>
          <Text style={styles.splitLabel}>para a rede de apoio</Text>
          <View style={styles.mini}>
            <View style={[styles.dot, styles.dotAlt]} />
            <Text style={styles.miniText}>mantém os benefícios</Text>
          </View>
        </View>
      </View>

      <View style={styles.monthResult}>
        <Text style={styles.monthLabel}>Em 30 dias de contribuição</Text>
        <Text style={styles.monthValue}>R$ 150 para você</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.045)",
    borderColor: onboardingColors.line,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  cardCompact: {
    borderRadius: 20,
    padding: 14,
  },
  head: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  label: {
    color: onboardingColors.mutedSoft,
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.3,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  total: {
    color: onboardingColors.white,
    fontFamily: fonts.extraBold,
    fontSize: 40,
    letterSpacing: -1,
    lineHeight: 42,
  },
  pill: {
    backgroundColor: "rgba(217,255,111,0.1)",
    borderColor: "rgba(217,255,111,0.24)",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  pillText: {
    color: onboardingColors.lime,
    fontFamily: fonts.bold,
    fontSize: 11,
  },
  barTrack: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    flexDirection: "row",
    height: 10,
    marginBottom: 16,
    overflow: "hidden",
  },
  barMeSlot: {
    flex: 5,
    height: "100%",
    overflow: "hidden",
  },
  barNetworkSlot: {
    flex: 2,
    height: "100%",
    overflow: "hidden",
  },
  barMe: {
    backgroundColor: onboardingColors.lime,
    height: "100%",
    transformOrigin: "left",
    width: "100%",
  },
  barNetwork: {
    backgroundColor: "#4F8975",
    height: "100%",
    transformOrigin: "left",
    width: "100%",
  },
  splitGrid: {
    flexDirection: "row",
    gap: 10,
  },
  splitItem: {
    backgroundColor: "rgba(0,0,0,0.12)",
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minHeight: 96,
    padding: 13,
  },
  amount: {
    color: onboardingColors.white,
    fontFamily: fonts.extraBold,
    fontSize: 28,
    letterSpacing: -0.6,
  },
  splitLabel: {
    color: onboardingColors.muted,
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 2,
  },
  mini: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginTop: 12,
  },
  dot: {
    backgroundColor: onboardingColors.lime,
    borderRadius: 99,
    height: 7,
    width: 7,
  },
  dotAlt: {
    backgroundColor: "#78B69D",
  },
  miniText: {
    color: "#749488",
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 10,
  },
  monthResult: {
    alignItems: "center",
    backgroundColor: "rgba(217,255,111,0.08)",
    borderColor: "rgba(217,255,111,0.18)",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  monthLabel: {
    color: "#B9D1C7",
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  monthValue: {
    color: onboardingColors.lime,
    fontFamily: fonts.bold,
    fontSize: 14,
  },
});
