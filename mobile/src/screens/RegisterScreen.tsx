import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChoiceRow } from "../features/intake/ChoiceRow";
import {
  birthDateToIso,
  formatBirthDate,
  formatCep,
  formatCpf,
  formatPhone,
  isValidCpf,
} from "../features/intake/format";
import { INTAKE_PHASES, OPTIONAL_PHASES, PHASE_COPY, VEHICLE_TYPES, type IntakePhase } from "../features/intake/types";
import { Button, Field } from "../components/UI";
import { register } from "../lib/members";
import { colors, fonts, shadow } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const initial = {
  nome: "",
  dataNascimento: "",
  cpf: "",
  telefone: "",
  endereco: "",
  cidade: "",
  estado: "",
  cep: "",
  tipoVeiculo: "",
  modelo: "",
  placa: "",
  carroProprio: "" as "" | "sim" | "nao",
  locadora: "",
  chavePix: "",
  codigoIndicacao: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterScreen({ navigation }: Props) {
  const [phase, setPhase] = useState<IntakePhase>("intro");
  const [form, setForm] = useState(initial);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (key: keyof typeof initial) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const copy = PHASE_COPY[phase];
  const optionalIndex = OPTIONAL_PHASES.indexOf(phase);
  const showSkipAll = phase !== "account";
  const showSkipPhase = OPTIONAL_PHASES.includes(phase);

  const missingAccount = useMemo(() => {
    const gaps: string[] = [];
    if (!form.nome.trim()) gaps.push("nome");
    if (!form.cpf.replace(/\D/g, "")) gaps.push("CPF");
    if (!form.telefone.trim()) gaps.push("telefone");
    if (!form.email.trim()) gaps.push("e-mail");
    if (!form.password) gaps.push("senha");
    return gaps;
  }, [form.cpf, form.email, form.nome, form.password, form.telefone]);

  function goTo(next: IntakePhase) {
    setPhase(next);
  }

  function goBack() {
    const index = INTAKE_PHASES.indexOf(phase);
    if (index > 0) {
      goTo(INTAKE_PHASES[index - 1]);
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate("Welcome");
  }

  function skipAll() {
    goTo("account");
  }

  function skipPhase() {
    const index = INTAKE_PHASES.indexOf(phase);
    goTo(INTAKE_PHASES[Math.min(INTAKE_PHASES.length - 1, index + 1)]);
  }

  function continuePhase() {
    if (phase === "intro") {
      goTo("you");
      return;
    }
    if (phase === "you" && form.cpf && !isValidCpf(form.cpf)) {
      Alert.alert("CPF inválido", "Confira os números e tente de novo.");
      return;
    }
    skipPhase();
  }

  async function submit() {
    if (missingAccount.length) {
      Alert.alert(
        "Complete o acesso",
        `Para criar a conta, ainda falta: ${missingAccount.join(", ")}.`,
      );
      return;
    }
    if (form.password.length < 6) {
      Alert.alert("Senha curta", "Use no mínimo 6 caracteres.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert("Senhas diferentes", "A confirmação precisa ser igual à senha.");
      return;
    }
    if (form.cpf && !isValidCpf(form.cpf)) {
      Alert.alert("CPF inválido", "Confira os números e tente de novo.");
      return;
    }
    if (!accepted) {
      Alert.alert("Termos", "Para continuar, aceite os termos de uso e a política de privacidade.");
      return;
    }

    setLoading(true);
    const result = await register({
      nome: form.nome,
      email: form.email,
      password: form.password,
      cpf: form.cpf,
      telefone: form.telefone,
      dataNascimento: birthDateToIso(form.dataNascimento),
      endereco: form.endereco,
      cidade: form.cidade,
      estado: form.estado,
      cep: form.cep,
      tipoVeiculo: form.tipoVeiculo,
      modelo: form.modelo,
      placa: form.placa,
      carroProprio: form.carroProprio,
      locadora: form.carroProprio === "nao" ? form.locadora : "",
      chavePix: form.chavePix,
      codigoIndicacao: form.codigoIndicacao,
    });
    setLoading(false);
    if (!result.ok) {
      Alert.alert("Não foi possível cadastrar", result.error);
      return;
    }
    if ("warning" in result) {
      Alert.alert("Conta criada", `${result.warning} Você poderá tentar novamente na área de Benefícios.`);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.top}>
          <Pressable accessibilityLabel="Voltar" onPress={goBack} style={styles.back}>
            <Feather color={colors.green800} name="arrow-left" size={21} />
          </Pressable>
          {phase !== "intro" ? (
            <View style={styles.progressTrack}>
              {OPTIONAL_PHASES.map((item, index) => (
                <View
                  key={item}
                  style={[
                    styles.progressBar,
                    (optionalIndex > index || phase === "account") && styles.progressDone,
                    optionalIndex === index && styles.progressActive,
                  ]}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.stepLabel}>CADASTRO DIGITAL</Text>
          )}
          {showSkipAll ? (
            <Pressable accessibilityLabel="Pular tudo" hitSlop={8} onPress={skipAll}>
              <Text style={styles.skipAll}>Pular tudo</Text>
            </Pressable>
          ) : (
            <View style={styles.skipPlaceholder} />
          )}
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.intro}>
            <View style={styles.iconWrap}>
              <Feather color={colors.green700} name={copy.icon} size={18} />
            </View>
            <Text style={styles.eyebrow}>{copy.eyebrow.toUpperCase()}</Text>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
          </View>

          {phase === "intro" ? (
            <View style={styles.preview}>
              {[
                { icon: "user" as const, label: "Você", detail: "Nome, idade e contato" },
                { icon: "map-pin" as const, label: "Cidade", detail: "Endereço da rotina" },
                { icon: "truck" as const, label: "Veículo", detail: "Tipo, placa e propriedade" },
                { icon: "zap" as const, label: "PIX", detail: "Chave da reserva" },
              ].map((item) => (
                <View key={item.label} style={styles.previewRow}>
                  <View style={styles.previewIcon}>
                    <Feather color={colors.green700} name={item.icon} size={16} />
                  </View>
                  <View>
                    <Text style={styles.previewLabel}>{item.label}</Text>
                    <Text style={styles.previewDetail}>{item.detail}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {phase === "you" ? (
            <View style={styles.form}>
              <Field autoCapitalize="words" icon="user" label="Nome completo" onChangeText={set("nome")} placeholder="Como está no documento" value={form.nome} />
              <Field icon="calendar" keyboardType="numeric" label="Data de nascimento" onChangeText={(value) => set("dataNascimento")(formatBirthDate(value))} placeholder="DD/MM/AAAA" value={form.dataNascimento} />
              <Field icon="file-text" keyboardType="numeric" label="CPF" onChangeText={(value) => set("cpf")(formatCpf(value))} placeholder="000.000.000-00" value={form.cpf} />
              <Field icon="phone" keyboardType="phone-pad" label="Telefone / WhatsApp" onChangeText={(value) => set("telefone")(formatPhone(value))} placeholder="(11) 90000-0000" value={form.telefone} />
            </View>
          ) : null}

          {phase === "home" ? (
            <View style={styles.form}>
              <Field autoCapitalize="words" icon="home" label="Endereço" onChangeText={set("endereco")} placeholder="Rua, número, bairro" value={form.endereco} />
              <Field autoCapitalize="words" icon="navigation" label="Cidade" onChangeText={set("cidade")} value={form.cidade} />
              <View style={styles.columns}>
                <View style={{ flex: 1 }}>
                  <Field autoCapitalize="characters" label="UF" onChangeText={(value) => set("estado")(value.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase())} placeholder="SP" value={form.estado} />
                </View>
                <View style={{ flex: 1.6 }}>
                  <Field icon="hash" keyboardType="numeric" label="CEP" onChangeText={(value) => set("cep")(formatCep(value))} placeholder="00000-000" value={form.cep} />
                </View>
              </View>
            </View>
          ) : null}

          {phase === "vehicle" ? (
            <View style={styles.form}>
              <Text style={styles.fieldLabel}>Tipo de veículo</Text>
              <ChoiceRow
                onChange={set("tipoVeiculo")}
                options={VEHICLE_TYPES}
                value={form.tipoVeiculo}
              />
              <Field autoCapitalize="words" icon="tag" label="Modelo / marca" onChangeText={set("modelo")} placeholder="Ex.: Chevrolet Onix" value={form.modelo} />
              <Text style={styles.fieldLabel}>O veículo é próprio?</Text>
              <ChoiceRow
                onChange={(value) => set("carroProprio")(value as "sim" | "nao")}
                options={[
                  { value: "sim", label: "Sim, próprio" },
                  { value: "nao", label: "Alugado" },
                ]}
                value={form.carroProprio}
              />
              {form.carroProprio === "nao" ? (
                <Field autoCapitalize="words" icon="briefcase" label="Locadora" onChangeText={set("locadora")} placeholder="Nome da locadora" value={form.locadora} />
              ) : null}
              <Field autoCapitalize="characters" icon="hash" label="Placa" onChangeText={(value) => set("placa")(value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 7).toUpperCase())} placeholder="ABC1D23" value={form.placa} />
            </View>
          ) : null}

          {phase === "pix" ? (
            <View style={styles.form}>
              <Field icon="zap" label="Chave PIX" onChangeText={set("chavePix")} placeholder="CPF, e-mail, telefone ou aleatória" value={form.chavePix} />
              <Field autoCapitalize="characters" icon="gift" label="Código de indicação (opcional)" onChangeText={(value) => set("codigoIndicacao")(value.toUpperCase())} value={form.codigoIndicacao} />
            </View>
          ) : null}

          {phase === "account" ? (
            <View style={styles.form}>
              {!form.nome.trim() ? (
                <Field autoCapitalize="words" icon="user" label="Nome completo" onChangeText={set("nome")} value={form.nome} />
              ) : null}
              {!form.cpf.replace(/\D/g, "") ? (
                <Field icon="file-text" keyboardType="numeric" label="CPF" onChangeText={(value) => set("cpf")(formatCpf(value))} placeholder="000.000.000-00" value={form.cpf} />
              ) : null}
              {!form.telefone.trim() ? (
                <Field icon="phone" keyboardType="phone-pad" label="Telefone / WhatsApp" onChangeText={(value) => set("telefone")(formatPhone(value))} value={form.telefone} />
              ) : null}
              <Field icon="mail" keyboardType="email-address" label="E-mail" onChangeText={set("email")} placeholder="voce@email.com" value={form.email} />
              <Field icon="lock" label="Crie uma senha" onChangeText={set("password")} placeholder="Mínimo de 6 caracteres" secureTextEntry value={form.password} />
              <Field icon="lock" label="Confirme a senha" onChangeText={set("confirmPassword")} secureTextEntry value={form.confirmPassword} />
              <Pressable onPress={() => setAccepted((current) => !current)} style={styles.termsRow}>
                <View style={[styles.checkbox, accepted && styles.checkboxOn]}>
                  {accepted ? <Feather color={colors.white} name="check" size={14} /> : null}
                </View>
                <Text style={styles.termsText}>
                  Li e aceito os termos de uso e a política de privacidade da ECOMOPAR.
                </Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          {phase === "intro" ? (
            <>
              <Button icon="arrow-right" label="Começar" onPress={() => goTo("you")} />
              <Pressable onPress={skipAll} style={styles.skipPhaseHit}>
                <Text style={styles.skipPhase}>Pular tudo e só criar a conta</Text>
              </Pressable>
            </>
          ) : phase === "account" ? (
            <Button icon="check" label="Criar conta" loading={loading} onPress={() => void submit()} />
          ) : (
            <View style={styles.footerRow}>
              {showSkipPhase ? (
                <Pressable onPress={skipPhase} style={({ pressed }) => [styles.skipBtn, pressed && styles.pressed]}>
                  <Text style={styles.skipBtnText}>Pular</Text>
                </Pressable>
              ) : null}
              <View style={{ flex: 1 }}>
                <Button icon="arrow-right" label="Continuar" onPress={continuePhase} />
              </View>
            </View>
          )}
          {phase === "account" ? (
            <Text style={styles.legal}>Cadastro analisado em até 48 horas úteis. Ativação via PIX de R$ 7 por dia.</Text>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  top: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  back: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 13,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
    ...shadow,
  },
  stepLabel: {
    color: colors.green600,
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.6,
  },
  progressTrack: { flex: 1, flexDirection: "row", gap: 6 },
  progressBar: { backgroundColor: colors.line, borderRadius: 99, flex: 1, height: 4 },
  progressDone: { backgroundColor: colors.green400 },
  progressActive: { backgroundColor: colors.green600 },
  skipAll: { color: colors.inkSoft, fontFamily: fonts.semibold, fontSize: 13 },
  skipPlaceholder: { width: 72 },
  content: { paddingHorizontal: 24, paddingBottom: 16, paddingTop: 12 },
  intro: { marginBottom: 22 },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.green100,
    borderRadius: 12,
    height: 36,
    justifyContent: "center",
    marginBottom: 14,
    width: 36,
  },
  eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.8 },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 32, letterSpacing: -1.2, lineHeight: 36, marginTop: 8 },
  subtitle: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, marginTop: 10, maxWidth: 340 },
  preview: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 20, borderWidth: 1, gap: 4, padding: 8, ...shadow },
  previewRow: { alignItems: "center", flexDirection: "row", gap: 12, paddingHorizontal: 10, paddingVertical: 10 },
  previewIcon: { alignItems: "center", backgroundColor: colors.green50, borderRadius: 12, height: 36, justifyContent: "center", width: 36 },
  previewLabel: { color: colors.ink, fontFamily: fonts.bold, fontSize: 14 },
  previewDetail: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 12, marginTop: 1 },
  form: { gap: 16 },
  fieldLabel: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 13, marginBottom: -6 },
  columns: { flexDirection: "row", gap: 10 },
  termsRow: { alignItems: "flex-start", flexDirection: "row", gap: 10, paddingTop: 4 },
  checkbox: {
    alignItems: "center",
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1.5,
    height: 22,
    justifyContent: "center",
    marginTop: 1,
    width: 22,
  },
  checkboxOn: { backgroundColor: colors.green600, borderColor: colors.green600 },
  termsText: { color: colors.inkSoft, flex: 1, fontFamily: fonts.regular, fontSize: 13, lineHeight: 19 },
  footer: { gap: 10, paddingHorizontal: 24, paddingBottom: 12, paddingTop: 8 },
  footerRow: { flexDirection: "row", gap: 10 },
  skipBtn: {
    alignItems: "center",
    borderColor: colors.line,
    borderRadius: 15,
    borderWidth: 1,
    height: 54,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  skipBtnText: { color: colors.ink, fontFamily: fonts.bold, fontSize: 14 },
  skipPhaseHit: { minHeight: 44, justifyContent: "center" },
  skipPhase: { color: colors.green700, fontFamily: fonts.semibold, fontSize: 14, textAlign: "center" },
  legal: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 11, lineHeight: 16, textAlign: "center" },
  pressed: { opacity: 0.8 },
});
