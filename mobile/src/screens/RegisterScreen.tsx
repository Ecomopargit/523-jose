import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Field } from "../components/UI";
import { register } from "../lib/members";
import { colors, fonts } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const initial = { nome: "", email: "", password: "", cpf: "", telefone: "", tipoVeiculo: "carro", modelo: "", placa: "", codigoIndicacao: "" };

export function RegisterScreen({ navigation }: Props) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const set = (key: keyof typeof initial) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function submit() {
    if (!form.nome || !form.email || !form.password || !form.cpf || !form.telefone) {
      return Alert.alert("Complete seu cadastro", "Nome, e-mail, senha, CPF e telefone são obrigatórios.");
    }
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (!result.ok) {
      Alert.alert("Não foi possível cadastrar", result.error);
    } else if ("warning" in result) {
      Alert.alert(
        "Conta criada",
        `${result.warning} Você poderá tentar novamente na área de Benefícios.`,
      );
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.top}>
            <Pressable onPress={navigation.goBack} style={styles.back}><Feather color={colors.green800} name="arrow-left" size={21} /></Pressable>
            <Text style={styles.step}>CADASTRO DIGITAL</Text>
          </View>
          <Text style={styles.title}>Comece sua{"\n"}jornada.</Text>
          <Text style={styles.subtitle}>Leva só alguns minutos. Seus dados ficam protegidos.</Text>
          <View style={styles.form}>
            <Text style={styles.section}>Seus dados</Text>
            <Field autoCapitalize="words" icon="user" label="Nome completo" onChangeText={set("nome")} value={form.nome} />
            <Field icon="mail" keyboardType="email-address" label="E-mail" onChangeText={set("email")} value={form.email} />
            <Field icon="lock" label="Crie uma senha" onChangeText={set("password")} placeholder="Mínimo de 6 caracteres" secureTextEntry value={form.password} />
            <Field icon="file-text" keyboardType="numeric" label="CPF" onChangeText={set("cpf")} value={form.cpf} />
            <Field icon="phone" keyboardType="phone-pad" label="Telefone / WhatsApp" onChangeText={set("telefone")} value={form.telefone} />
            <Text style={styles.section}>Seu veículo</Text>
            <Field autoCapitalize="words" icon="truck" label="Modelo" onChangeText={set("modelo")} placeholder="Ex.: Chevrolet Onix" value={form.modelo} />
            <Field autoCapitalize="characters" icon="hash" label="Placa" onChangeText={set("placa")} placeholder="ABC1D23" value={form.placa} />
            <Text style={styles.section}>Indicação</Text>
            <Field autoCapitalize="characters" icon="gift" label="Código (opcional)" onChangeText={set("codigoIndicacao")} value={form.codigoIndicacao} />
            <Button icon="check" label="Finalizar cadastro" loading={loading} onPress={submit} />
            <Text style={styles.legal}>Ao continuar, você concorda com os termos de uso e a política de privacidade da ECOMOPAR.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 24, paddingBottom: 42 },
  top: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  back: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 13, borderWidth: 1, height: 44, justifyContent: "center", width: 44 },
  step: { color: colors.green600, fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.6 },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 38, letterSpacing: -1.4, lineHeight: 43, marginTop: 35 },
  subtitle: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 14, lineHeight: 22, marginTop: 10 },
  form: { gap: 16, marginTop: 31 },
  section: { color: colors.green800, fontFamily: fonts.bold, fontSize: 15, marginBottom: -3, marginTop: 9 },
  legal: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 10.5, lineHeight: 16, paddingHorizontal: 16, textAlign: "center" },
});
