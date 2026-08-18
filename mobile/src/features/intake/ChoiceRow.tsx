import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "../../theme";

type Option = { value: string; label: string };

export function ChoiceRow({
  options,
  value,
  onChange,
}: {
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = value === option.value;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.pressed]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  chipActive: {
    backgroundColor: colors.green50,
    borderColor: colors.green500,
  },
  label: {
    color: colors.ink,
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  labelActive: {
    color: colors.green800,
  },
  pressed: {
    opacity: 0.82,
  },
});
