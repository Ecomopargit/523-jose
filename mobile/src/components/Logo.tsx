import { Image, StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "../theme";

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <View style={styles.row}>
      <View style={[styles.mark, light && styles.markLight]}>
        <Image
          source={require("../../assets/ecomopar-mark.png")}
          style={styles.markImage}
        />
      </View>
      {!compact && (
        <View>
          <Text style={[styles.name, light && styles.light]}>ECOMOPAR</Text>
          <Text style={[styles.tagline, light && styles.taglineLight]}>AO SEU LADO, TODO DIA</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", flexDirection: "row", gap: 10 },
  mark: {
    borderRadius: 12,
    height: 44,
    overflow: "hidden",
    width: 44,
  },
  markLight: { backgroundColor: colors.white },
  markImage: { height: "100%", width: "100%" },
  name: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 17, letterSpacing: 0.8 },
  light: { color: colors.green900 },
  tagline: { color: "rgba(255,255,255,0.52)", fontFamily: fonts.bold, fontSize: 7, letterSpacing: 1.65 },
  taglineLight: { color: colors.inkSoft },
});
