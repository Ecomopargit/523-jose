import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BenefitsScreen } from "../screens/BenefitsScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { WalletScreen } from "../screens/WalletScreen";
import { colors, fonts } from "../theme";
import type { AppTabParamList } from "../types";

const Tab = createBottomTabNavigator<AppTabParamList>();

const icons = {
  Início: "grid",
  Carteira: "credit-card",
  Benefícios: "heart",
  Perfil: "user",
} as const;

export function AppTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green700,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.iconShell, focused && styles.iconShellActive]}>
            <Feather color={color} name={icons[route.name]} size={20} />
          </View>
        ),
        tabBarStyle: [
          styles.bar,
          {
            bottom: Math.max(insets.bottom, 8),
            height: 67,
          },
        ],
        tabBarItemStyle: styles.item,
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
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
    borderRadius: 23,
    borderTopWidth: 1,
    elevation: 12,
    left: 14,
    paddingHorizontal: 7,
    position: "absolute",
    right: 14,
    shadowColor: colors.green950,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: Platform.OS === "ios" ? 0.13 : 0,
    shadowRadius: 20,
  },
  item: { paddingVertical: 6 },
  label: { fontFamily: fonts.bold, fontSize: 9, marginTop: -2 },
  iconShell: { alignItems: "center", borderRadius: 11, height: 31, justifyContent: "center", width: 39 },
  iconShellActive: { backgroundColor: colors.green100 },
});
