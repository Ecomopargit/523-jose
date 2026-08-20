import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BenefitsScreen } from "../screens/BenefitsScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { PaymentsScreen } from "../screens/PaymentsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { WalletScreen } from "../screens/WalletScreen";
import { colors, fonts } from "../theme";
import type { AppTabParamList } from "../types";

const Tab = createBottomTabNavigator<AppTabParamList>();

const icons = {
  Início: "grid",
  Pagamentos: "zap",
  Carteira: "credit-card",
  Benefícios: "heart",
  Perfil: "user",
} as const;

const BAR_HEIGHT = 72;

export function AppTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green700,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.iconShell, focused && styles.iconShellActive]}>
            <Feather color={color} name={icons[route.name]} size={22} />
          </View>
        ),
        tabBarButton: ({ children, onPress, onLongPress, accessibilityState, accessibilityLabel, testID }) => (
          <Pressable
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            accessibilityState={accessibilityState}
            hitSlop={{ top: 14, bottom: 14, left: 10, right: 10 }}
            onLongPress={onLongPress}
            onPress={onPress}
            style={({ pressed }) => [styles.tabButton, pressed && styles.tabButtonPressed]}
            testID={testID}
          >
            {children}
          </Pressable>
        ),
        tabBarStyle: [
          styles.bar,
          {
            bottom: Math.max(insets.bottom, 10),
            height: BAR_HEIGHT,
          },
        ],
        tabBarItemStyle: styles.item,
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Pagamentos" component={PaymentsScreen} />
      <Tab.Screen name="Carteira" component={WalletScreen} />
      <Tab.Screen name="Benefícios" component={BenefitsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderColor: "rgba(18,36,28,0.055)",
    borderRadius: 24,
    borderTopWidth: 1,
    elevation: 12,
    left: 14,
    overflow: "hidden",
    paddingBottom: 4,
    paddingHorizontal: 4,
    paddingTop: 4,
    position: "absolute",
    right: 14,
    shadowColor: colors.green950,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: Platform.OS === "ios" ? 0.13 : 0,
    shadowRadius: 20,
  },
  item: {
    flex: 1,
    height: "100%",
  },
  tabButton: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "center",
    minHeight: 56,
    paddingVertical: 4,
  },
  tabButtonPressed: {
    opacity: 0.72,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 9,
    marginBottom: 2,
    marginTop: 2,
  },
  iconShell: {
    alignItems: "center",
    borderRadius: 14,
    height: 36,
    justifyContent: "center",
    width: 48,
  },
  iconShellActive: {
    backgroundColor: colors.green100,
  },
});
