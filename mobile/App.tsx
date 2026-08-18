import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { hasCompletedOnboarding } from "./src/features/onboarding";
import { AppTabs } from "./src/navigation/AppTabs";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { SupportScreen } from "./src/screens/SupportScreen";
import { EditProfileScreen } from "./src/screens/EditProfileScreen";
import { PrivacySecurityScreen } from "./src/screens/PrivacySecurityScreen";
import { NotificationSettingsScreen } from "./src/screens/NotificationSettingsScreen";
import { PrivacyPolicyScreen } from "./src/screens/PrivacyPolicyScreen";
import { HelpCenterScreen } from "./src/screens/HelpCenterScreen";
import { BenefitDetailScreen } from "./src/screens/BenefitDetailScreen";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import { AdminDashboardScreen } from "./src/screens/AdminDashboardScreen";
import { AdminOperationsScreen } from "./src/screens/AdminOperationsScreen";
import { AdminMemberScreen } from "./src/screens/AdminMemberScreen";
import { AdminWithdrawalScreen } from "./src/screens/AdminWithdrawalScreen";
import { AdminChatScreen } from "./src/screens/AdminChatScreen";
import { colors } from "./src/theme";
import type { RootStackParamList } from "./src/types";
import { configureNotificationHandler, syncDepositReminderFromStorage } from "./src/lib/notifications";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.ink,
    border: colors.line,
    primary: colors.green600,
  },
};

function RootNavigator() {
  const { user, member, initializing } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    configureNotificationHandler();
  }, []);

  useEffect(() => {
    let active = true;
    void hasCompletedOnboarding().then((done) => {
      if (active) setOnboardingDone(done);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!user || member?.role === "admin") return;
    void syncDepositReminderFromStorage();
  }, [member?.id, member?.role, user]);

  if (initializing || onboardingDone === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.green500} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName={user ? undefined : onboardingDone ? "Login" : "Welcome"}
        screenOptions={{ headerShown: false, animation: "fade" }}
      >
        {user ? (
          member?.role === "admin" ? (
            <>
              <Stack.Screen name="Admin" component={AdminDashboardScreen} />
              <Stack.Screen name="AdminOperations" component={AdminOperationsScreen} options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="AdminMember" component={AdminMemberScreen} options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="AdminWithdrawal" component={AdminWithdrawalScreen} options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="AdminChat" component={AdminChatScreen} options={{ animation: "slide_from_right" }} />
            </>
          ) : (
            <>
              <Stack.Screen name="App" component={AppTabs} />
              <Stack.Screen name="Support" component={SupportScreen} options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="BenefitDetail" component={BenefitDetailScreen} options={{ animation: "slide_from_right" }} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.green500} size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green950,
  },
});
