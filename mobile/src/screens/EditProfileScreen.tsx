import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Field, ScreenAtmosphere } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import {
  updateMemberProfile,
  type MemberProfileUpdate,
} from "../lib/members";
import { chooseAndUploadProfilePhoto, removeProfilePhoto } from "../lib/profile-photo";
import { colors, fonts, shadow } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "EditProfile">;

const emptyForm: MemberProfileUpdate = {
  nome: "",
  cpf: "",
  telefone: "",
  dataNascimento: "",
  endereco: "",
  cidade: "",
  estado: "",
  cep: "",
  tipoVeiculo: "",
  modelo: "",
  placa: "",
  chavePix: "",
};

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function isValidCpf(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  const calculateDigit = (length: number) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      sum += Number(digits[index]) * (length + 1 - index);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calculateDigit(9) === Number(digits[9]) && calculateDigit(10) === Number(digits[10]);
}

export function EditProfileScreen({ navigation }: Props) {
  const { member, refresh } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localPhoto, setLocalPhoto] = useState("");

  useEffect(() => {
    if (!member) return;
    const timer = setTimeout(() => {
      setForm({
        nome: member.nome,
        cpf: formatCpf(member.cpf),
        telefone: member.telefone,
        dataNascimento: member.dataNascimento,
        endereco: member.endereco,
        cidade: member.cidade,
        estado: member.estado,
        cep: member.cep,
        tipoVeiculo: member.tipoVeiculo,
        modelo: member.modelo,
        placa: member.placa,
        chavePix: member.chavePix,
      });
      setLocalPhoto(member.photoURL);
    }, 0);
    return () => clearTimeout(timer);
  }, [member]);

  const set = (key: keyof MemberProfileUpdate) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function choosePhoto(source: "library" | "camera") {
    setUploading(true);
    try {
      const result = await chooseAndUploadProfilePhoto(source);
      if ("cancelled" in result && result.cancelled) return;
      if (!result.ok) {
        setLocalPhoto(member?.photoURL || "");
        Alert.alert("Foto não atualizada", result.error);
        return;
      }
      setLocalPhoto(result.photoURL);
      await refresh();
      Alert.alert("Foto atualizada", "Sua imagem de perfil foi salva com sucesso.");
    } catch (error) {
      setLocalPhoto(member?.photoURL || "");
      Alert.alert(
        "Foto não atualizada",
        error instanceof Error ? error.message : "Não foi possível enviar a foto.",
      );
    } finally {
      setUploading(false);
    }
  }

  function openPhotoOptions() {
    Alert.alert("Foto de perfil", "Como deseja adicionar sua foto?", [
      { text: "Galeria", onPress: () => void choosePhoto("library") },
      { text: "Câmera", onPress: () => void choosePhoto("camera") },
      member?.photoURL
        ? {
            text: "Remover foto",
            style: "destructive",
            onPress: () => {
              void (async () => {
                setUploading(true);
                const removed = await removeProfilePhoto();
                setUploading(false);
                if (!removed.ok) {
                  Alert.alert("Erro", removed.error);
                  return;
                }
                setLocalPhoto("");
                await refresh();
              })();
            },
          }
        : undefined,
      { text: "Cancelar", style: "cancel" },
    ].filter(Boolean) as Parameters<typeof Alert.alert>[2]);
  }

  async function save() {
    if (!form.nome.trim() || !form.cpf.trim() || !form.telefone.trim()) {
      Alert.alert("Dados incompletos", "Nome, CPF e telefone são obrigatórios.");
      return;
    }
    if (!isValidCpf(form.cpf)) {
      Alert.alert("CPF inválido", "Confira os 11 dígitos do CPF antes de salvar.");
      return;
    }
    setSaving(true);
    const result = await updateMemberProfile(form);
    setSaving(false);
    if (!result.ok) {
      Alert.alert("Não foi possível salvar", result.error);
      return;
    }
    await refresh();
    Alert.alert("Perfil atualizado", "Seus dados foram salvos com sucesso.", [
      { text: "Concluir", onPress: navigation.goBack },
    ]);
  }

  const initials =
    form.nome.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "EC";

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
      <StatusBar style="dark" />
      <ScreenAtmosphere />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={navigation.goBack} style={styles.back}>
            <Feather color={colors.green800} name="arrow-left" size={19} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>MINHA CONTA</Text>
            <Text style={styles.title}>Editar perfil</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.photoCard}>
            <View style={styles.avatar}>
              {localPhoto ? (
                <Image source={{ uri: localPhoto }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
              {uploading && <View style={styles.photoLoading}><ActivityIndicator color={colors.white} /></View>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.photoTitle}>Foto de perfil</Text>
              <Text style={styles.photoHint}>Use uma foto nítida e de frente.</Text>
            </View>
            <Pressable disabled={uploading} onPress={openPhotoOptions} style={styles.photoButton}>
              <Feather color={colors.green700} name="camera" size={16} />
              <Text style={styles.photoButtonText}>{localPhoto ? "Alterar" : "Adicionar"}</Text>
            </Pressable>
          </View>

          <Section title="Dados pessoais" subtitle="Informações principais da sua conta">
            <Field autoCapitalize="words" icon="user" label="Nome completo" onChangeText={set("nome")} value={form.nome} />
            <Field icon="file-text" keyboardType="numeric" label="CPF" onChangeText={(value) => set("cpf")(formatCpf(value))} placeholder="000.000.000-00" value={form.cpf} />
            <Field icon="phone" keyboardType="phone-pad" label="Telefone / WhatsApp" onChangeText={set("telefone")} value={form.telefone} />
            <Field icon="calendar" label="Data de nascimento" onChangeText={set("dataNascimento")} placeholder="DD/MM/AAAA" value={form.dataNascimento} />
            <ReadOnly label="E-mail de acesso" value={member?.email || ""} />
          </Section>

          <Section title="Endereço" subtitle="Onde podemos localizar você">
            <Field autoCapitalize="words" icon="map-pin" label="Endereço" onChangeText={set("endereco")} value={form.endereco} />
            <Field autoCapitalize="words" icon="navigation" label="Cidade" onChangeText={set("cidade")} value={form.cidade} />
            <View style={styles.twoColumns}>
              <View style={{ flex: 1 }}><Field autoCapitalize="characters" label="Estado" onChangeText={set("estado")} placeholder="UF" value={form.estado} /></View>
              <View style={{ flex: 1.5 }}><Field keyboardType="numeric" label="CEP" onChangeText={set("cep")} value={form.cep} /></View>
            </View>
          </Section>

          <Section title="Veículo e pagamento" subtitle="Dados usados nos seus benefícios">
            <Field autoCapitalize="words" icon="truck" label="Tipo de veículo" onChangeText={set("tipoVeiculo")} placeholder="Carro, moto, van..." value={form.tipoVeiculo} />
            <Field autoCapitalize="words" icon="tag" label="Modelo" onChangeText={set("modelo")} value={form.modelo} />
            <Field autoCapitalize="characters" icon="hash" label="Placa" onChangeText={set("placa")} value={form.placa} />
            <Field icon="zap" label="Chave PIX" onChangeText={set("chavePix")} value={form.chavePix} />
          </Section>

          <Button icon="check" label="Salvar alterações" loading={saving} onPress={save} />
          <Text style={styles.legal}>Confira seu CPF antes de salvar. O e-mail de acesso continua protegido e só pode ser alterado pelo suporte.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      <View style={styles.fields}>{children}</View>
    </View>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.readOnly}>
      <View style={styles.lockIcon}><Feather color={colors.green700} name="lock" size={14} /></View>
      <View style={{ flex: 1 }}><Text style={styles.readOnlyLabel}>{label}</Text><Text style={styles.readOnlyValue}>{value}</Text></View>
      <Feather color={colors.green500} name="check-circle" size={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  header: { alignItems: "center", flexDirection: "row", gap: 13, paddingHorizontal: 20, paddingVertical: 12 },
  back: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 12, borderWidth: 1, height: 40, justifyContent: "center", width: 40, ...shadow },
  eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1.4 },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 22, letterSpacing: -0.7, marginTop: 1 },
  content: { padding: 20, paddingBottom: 40 },
  photoCard: { alignItems: "center", backgroundColor: colors.green900, borderRadius: 21, flexDirection: "row", gap: 13, overflow: "hidden", padding: 16, ...shadow },
  avatar: { alignItems: "center", backgroundColor: colors.green500, borderColor: "rgba(255,255,255,0.22)", borderRadius: 22, borderWidth: 2, height: 68, justifyContent: "center", overflow: "hidden", width: 68 },
  avatarImage: { height: "100%", width: "100%" },
  avatarText: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 19 },
  photoLoading: { alignItems: "center", backgroundColor: "rgba(8,42,31,0.62)", bottom: 0, justifyContent: "center", left: 0, position: "absolute", right: 0, top: 0 },
  photoTitle: { color: colors.white, fontFamily: fonts.bold, fontSize: 13 },
  photoHint: { color: "rgba(255,255,255,0.5)", fontFamily: fonts.regular, fontSize: 8.5, marginTop: 3 },
  photoButton: { alignItems: "center", backgroundColor: colors.white, borderRadius: 11, flexDirection: "row", gap: 5, paddingHorizontal: 10, paddingVertical: 9 },
  photoButtonText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 8.5 },
  section: { marginTop: 24 },
  sectionTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 15 },
  sectionSubtitle: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 9, marginTop: 2 },
  fields: { gap: 14, marginTop: 13 },
  twoColumns: { flexDirection: "row", gap: 10 },
  readOnly: { alignItems: "center", backgroundColor: colors.green50, borderColor: colors.green100, borderRadius: 14, borderWidth: 1, flexDirection: "row", gap: 10, minHeight: 54, paddingHorizontal: 12 },
  lockIcon: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 9, height: 31, justifyContent: "center", width: 31 },
  readOnlyLabel: { color: colors.inkFaint, fontFamily: fonts.medium, fontSize: 8 },
  readOnlyValue: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 10.5, marginTop: 2 },
  legal: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 8.5, lineHeight: 13, marginTop: 12, paddingHorizontal: 18, textAlign: "center" },
});
