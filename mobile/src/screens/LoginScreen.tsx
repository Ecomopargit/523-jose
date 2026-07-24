import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Field } from "../components/UI";
import { login, resetPassword } from "../lib/members";
import { colors, fonts } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email || !password) return Alert.alert("Dados incompletos", "Preencha e-mail e senha.");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) Alert.alert("Não foi possível entrar", result.error);
  }

  async function recover() {
    if (!email) return Alert.alert("Digite seu e-mail", "Preencha o e-mail acima para recuperar sua senha.");
    const result = await resetPassword(email);
    Alert.alert(result.ok ? "E-mail enviado" : "Não foi possível enviar", result.ok ? "Confira sua caixa de entrada." : result.error);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable onPress={navigation.goBack} style={styles.back}>
            <Feather color={colors.green800} name="arrow-left" size={21} />
          </Pressable>
          <View style={styles.intro}>
            <Text style={styles.eyebrow}>ÁREA DO ASSOCIADO</Text>
            <Text style={styles.title}>Bom ter você{"\n"}por aqui.</Text>
            <Text style={styles.subtitle}>Acesse sua reserva e acompanhe sua jornada ECOMOPAR.</Text>
          </View>
          <View style={styles.form}>
            <Field icon="mail" keyboardType="email-address" label="E-mail" onChangeText={setEmail} placeholder="voce@email.com" value={email} />
            <Field icon="lock" label="Senha" onChangeText={setPassword} placeholder="Sua senha" secureTextEntry value={password} />
            <Pressable onPress={recover}><Text style={styles.forgot}>Esqueci minha senha</Text></Pressable>
            <Button icon="arrow-right" label="Entrar" loading={loading} onPress={submit} />
          </View>
          <View style={styles.registerRow}>
            <Text style={styles.muted}>Ainda não é associado?</Text>
            <Pressable onPress={() => navigation.navigate("Register")}><Text style={styles.link}> Cadastre-se</Text></Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  content: { flexGrow: 1, padding: 24 },
  back: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 13, borderWidth: 1, height: 44, justifyContent: "center", width: 44 },
  intro: { marginBottom: 40, marginTop: 44 },
  eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 2 },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 39, letterSpacing: -1.4, lineHeight: 44, marginTop: 9 },
  subtitle: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, marginTop: 13, maxWidth: 330 },
  form: { gap: 17 },
  forgot: { color: colors.green700, fontFamily: fonts.semibold, fontSize: 13, marginTop: -4, textAlign: "right" },
  registerRow: { flexDirection: "row", justifyContent: "center", marginTop: 32 },
  muted: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 13 },
  link: { color: colors.green700, fontFamily: fonts.bold, fontSize: 13 },
});
