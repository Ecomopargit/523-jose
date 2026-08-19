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

import { buttonShadow, buttonShadowPrimary, colors, fonts, shadow } from "../theme";

type FeatherName = ComponentProps<typeof Feather>["name"];
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "md" | "lg";

export function Button({
  label,
  onPress,
  icon,
  variant = "primary",
  size = "lg",
  loading,
  disabled,
  fullWidth = true,
}: {
  label: string;
  onPress: () => void;
  icon?: FeatherName;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}) {
  const isDisabled = disabled || loading;
  const isPrimary = variant === "primary";
  const iconColor = isPrimary ? colors.green900 : colors.green700;
  const spinnerColor = isPrimary ? colors.white : colors.green700;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[size],
        styles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <>
          <Text
            numberOfLines={1}
            style={[
              styles.buttonText,
              styles[`${size}Text` as "mdText" | "lgText"],
              !isPrimary && styles.buttonTextAlt,
              variant === "outline" && styles.buttonTextOutline,
              variant === "ghost" && styles.buttonTextGhost,
            ]}
          >
            {label}
          </Text>
          {icon ? (
            <View style={[styles.iconChip, isPrimary ? styles.iconChipPrimary : styles.iconChipAlt]}>
              <Feather color={isPrimary ? colors.green400 : iconColor} name={icon} size={size === "lg" ? 18 : 16} />
            </View>
          ) : null}
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
    borderRadius: 18,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  fullWidth: { width: "100%" },
  lg: { minHeight: 58, paddingVertical: 10 },
  md: { minHeight: 52, paddingVertical: 8 },
  primary: {
    backgroundColor: colors.green700,
    ...buttonShadowPrimary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.green100,
    borderWidth: 1.5,
    ...buttonShadow,
  },
  outline: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1.5,
  },
  ghost: {
    backgroundColor: colors.green50,
    borderColor: "rgba(19,97,72,0.12)",
    borderWidth: 1,
  },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.985 }] },
  buttonText: {
    color: colors.white,
    flex: 1,
    fontFamily: fonts.extraBold,
    letterSpacing: -0.2,
  },
  lgText: { fontSize: 16 },
  mdText: { fontSize: 14 },
  buttonTextAlt: { color: colors.green800 },
  buttonTextOutline: { color: colors.ink, fontFamily: fonts.bold },
  buttonTextGhost: { color: colors.green700, fontFamily: fonts.bold },
  iconChip: {
    alignItems: "center",
    borderRadius: 13,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  iconChipPrimary: {
    backgroundColor: colors.green900,
  },
  iconChipAlt: {
    backgroundColor: colors.green100,
  },
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
