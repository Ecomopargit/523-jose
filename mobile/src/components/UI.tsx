import { Feather } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from "react-native";

import { colors, fonts, shadow } from "../theme";

type FeatherName = ComponentProps<typeof Feather>["name"];

export function Button({
  label,
  onPress,
  icon,
  variant = "primary",
  loading,
}: {
  label: string;
  onPress: () => void;
  icon?: FeatherName;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
}) {
  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [styles.button, styles[variant], pressed && styles.pressed]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.white : colors.green700} />
      ) : (
        <>
          <Text style={[styles.buttonText, variant !== "primary" && styles.buttonTextAlt]}>{label}</Text>
          {icon && <Feather color={variant === "primary" ? colors.white : colors.green700} name={icon} size={18} />}
        </>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
  icon,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  icon?: FeatherName;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.field}>
        {icon && <Feather color={colors.inkFaint} name={icon} size={18} />}
        <TextInput
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.inkFaint}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          value={value}
        />
      </View>
    </View>
  );
}

export function ScreenHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        {eyebrow && (
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowLine} />
            <Text style={styles.eyebrow}>{eyebrow}</Text>
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

export function ScreenAtmosphere() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.atmosphereOne} />
      <View style={styles.atmosphereTwo} />
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function IconBadge({ name, tone = "green" }: { name: FeatherName; tone?: "green" | "amber" | "brick" }) {
  const tones = {
    green: [colors.green100, colors.green700],
    amber: [colors.amber100, colors.amber600],
    brick: [colors.brick100, colors.brick500],
  };
  return (
    <View style={[styles.badge, { backgroundColor: tones[tone][0] }]}>
      <Feather color={tones[tone][1]} name={name} size={19} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 15,
    flexDirection: "row",
    gap: 9,
    height: 54,
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  primary: { backgroundColor: colors.green600 },
  secondary: { backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1 },
  ghost: { backgroundColor: colors.green50 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.985 }] },
  buttonText: { color: colors.white, fontFamily: fonts.bold, fontSize: 15 },
  buttonTextAlt: { color: colors.green700 },
  fieldGroup: { gap: 7 },
  label: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 13 },
  field: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 15,
  },
  input: { color: colors.ink, flex: 1, fontFamily: fonts.regular, fontSize: 15, paddingVertical: 13 },
  header: { alignItems: "flex-end", flexDirection: "row", marginBottom: 21 },
  eyebrowRow: { alignItems: "center", flexDirection: "row", gap: 7, marginBottom: 5 },
  eyebrowLine: { backgroundColor: colors.green500, height: 1.5, width: 18 },
  eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 9.5, letterSpacing: 1.65, textTransform: "uppercase" },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 29, letterSpacing: -1 },
  card: {
    backgroundColor: colors.surface,
    borderColor: "rgba(18,36,28,0.045)",
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    ...shadow,
  },
  badge: { alignItems: "center", borderRadius: 12, height: 42, justifyContent: "center", width: 42 },
  atmosphereOne: { backgroundColor: "rgba(30,155,107,0.055)", borderRadius: 140, height: 280, position: "absolute", right: -155, top: -105, width: 280 },
  atmosphereTwo: { borderColor: "rgba(19,97,72,0.035)", borderRadius: 160, borderWidth: 34, height: 320, left: -230, position: "absolute", top: 390, width: 320 },
});
