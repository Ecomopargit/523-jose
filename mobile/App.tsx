import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
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
import { AppTabs } from "./src/navigation/AppTabs";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { SupportScreen } from "./src/screens/SupportScreen";
import { EditProfileScreen } from "./src/screens/EditProfileScreen";
import { PrivacySecurityScreen } from "./src/screens/PrivacySecurityScreen";
import { PrivacyPolicyScreen } from "./src/screens/PrivacyPolicyScreen";
import { HelpCenterScreen } from "./src/screens/HelpCenterScreen";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import { AdminDashboardScreen } from "./src/screens/AdminDashboardScreen";
import { colors } from "./src/theme";
import type { RootStackParamList } from "./src/types";

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

  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.green500} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
        {user ? (
          member?.role === "admin" ? (
            <Stack.Screen name="Admin" component={AdminDashboardScreen} />
          ) : (
            <>
              <Stack.Screen name="App" component={AppTabs} />
              <Stack.Screen name="Support" component={SupportScreen} options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ animation: "slide_from_right" }} />
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
