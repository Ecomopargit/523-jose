import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { changeMemberPassword } from "../lib/members";
import { colors, fonts, shadow } from "../theme";

type Props = {
  email: string;
  onClose: () => void;
  visible: boolean;
};

export function ChangePasswordModal({ email, onClose, visible }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function close() {
    if (loading) return;
    setCurrentPassword("");
    setNewPassword("");
    setConfirmation("");
    setError("");
    setShowCurrent(false);
    setShowNew(false);
    onClose();
  }

  async function submit() {
    setError("");
    if (!currentPassword || !newPassword || !confirmation) {
      setError("Preencha todos os campos.");
      return;
    }
    if (newPassword.length < 6) {
      setError("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("A nova senha deve ser diferente da senha atual.");
      return;
    }
    if (newPassword !== confirmation) {
      setError("A confirmação não corresponde à nova senha.");
      return;
    }

    setLoading(true);
    const result = await changeMemberPassword(currentPassword, newPassword);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    close();
    Alert.alert("Senha alterada", "Sua nova senha já está ativa.");
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={close}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <Pressable accessibilityLabel="Fechar modal" onPress={close} style={styles.backdrop} />
        <View accessibilityViewIsModal style={styles.card}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.icon}><Feather color={colors.white} name="lock" size={21} /></View>
            <View style={styles.heading}>
              <Text style={styles.eyebrow}>SEGURANÇA DA CONTA</Text>
              <Text style={styles.title}>Altere sua senha</Text>
            </View>
            <Pressable accessibilityLabel="Fechar" disabled={loading} hitSlop={8} onPress={close} style={styles.close}>
              <Feather color={colors.inkSoft} name="x" size={19} />
            </Pressable>
          </View>
          <Text style={styles.description}>Confirme sua identidade e escolha uma senha nova para {email}.</Text>

          <PasswordField label="Senha atual" onChangeText={setCurrentPassword} onToggle={() => setShowCurrent((value) => !value)} placeholder="Digite sua senha atual" shown={showCurrent} value={currentPassword} />
          <PasswordField label="Nova senha" onChangeText={setNewPassword} onToggle={() => setShowNew((value) => !value)} placeholder="Mínimo de 6 caracteres" shown={showNew} value={newPassword} />
          <PasswordField label="Confirmar nova senha" onChangeText={setConfirmation} onToggle={() => setShowNew((value) => !value)} placeholder="Digite a nova senha novamente" shown={showNew} value={confirmation} />

          {error ? <View style={styles.error}><Feather color={colors.danger} name="alert-circle" size={15} /><Text style={styles.errorText}>{error}</Text></View> : null}
          <View style={styles.hint}><Feather color={colors.green600} name="shield" size={14} /><Text style={styles.hintText}>Use uma combinação difícil de adivinhar e não reutilize senhas.</Text></View>
          <Pressable disabled={loading} onPress={submit} style={({ pressed }) => [styles.saveButton, pressed && !loading && styles.pressed]}>
            {loading ? <ActivityIndicator color={colors.white} /> : <><Text style={styles.saveButtonText}>Salvar nova senha</Text><Feather color={colors.white} name="arrow-right" size={18} /></>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function PasswordField({ label, onChangeText, onToggle, placeholder, shown, value }: { label: string; onChangeText: (value: string) => void; onToggle: () => void; placeholder: string; shown: boolean; value: string }) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.field}>
        <Feather color={colors.inkFaint} name="key" size={16} />
        <TextInput autoCapitalize="none" autoComplete="off" onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.inkFaint} secureTextEntry={!shown} style={styles.input} value={value} />
        <Pressable accessibilityLabel={shown ? "Ocultar senha" : "Mostrar senha"} hitSlop={7} onPress={onToggle}>
          <Feather color={colors.inkFaint} name={shown ? "eye-off" : "eye"} size={17} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1, justifyContent: "flex-end" },
  backdrop: { backgroundColor: "rgba(4, 24, 17, 0.62)", ...StyleSheet.absoluteFillObject },
  card: { backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: Platform.OS === "ios" ? 34 : 24, paddingHorizontal: 22, paddingTop: 10, ...shadow },
  handle: { alignSelf: "center", backgroundColor: colors.line, borderRadius: 2, height: 4, marginBottom: 16, width: 38 },
  header: { alignItems: "center", flexDirection: "row" },
  icon: { alignItems: "center", backgroundColor: colors.green700, borderRadius: 14, height: 46, justifyContent: "center", width: 46 },
  heading: { flex: 1, marginLeft: 12 },
  eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1.15 },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 20, letterSpacing: -0.55, marginTop: 2 },
  close: { alignItems: "center", backgroundColor: colors.background, borderRadius: 11, height: 38, justifyContent: "center", width: 38 },
  description: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 10, lineHeight: 16, marginBottom: 17, marginTop: 13 },
  group: { marginBottom: 12 },
  label: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 10, marginBottom: 6 },
  field: { alignItems: "center", backgroundColor: colors.background, borderColor: colors.line, borderRadius: 13, borderWidth: 1, flexDirection: "row", gap: 9, minHeight: 50, paddingHorizontal: 14 },
  input: { color: colors.ink, flex: 1, fontFamily: fonts.regular, fontSize: 12, paddingVertical: 12 },
  error: { alignItems: "center", backgroundColor: colors.brick100, borderRadius: 11, flexDirection: "row", gap: 8, marginBottom: 11, padding: 10 },
  errorText: { color: colors.danger, flex: 1, fontFamily: fonts.semibold, fontSize: 9, lineHeight: 13 },
  hint: { alignItems: "center", flexDirection: "row", gap: 8, marginBottom: 15, marginTop: 1 },
  hintText: { color: colors.inkFaint, flex: 1, fontFamily: fonts.regular, fontSize: 8.5, lineHeight: 13 },
  saveButton: { alignItems: "center", backgroundColor: colors.green600, borderRadius: 15, flexDirection: "row", gap: 9, height: 53, justifyContent: "center" },
  saveButtonText: { color: colors.white, fontFamily: fonts.bold, fontSize: 13 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
});
