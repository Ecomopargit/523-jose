import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenAtmosphere } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { resetPassword } from "../lib/members";
import { colors, fonts, shadow } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "PrivacySecurity">;

export function PrivacySecurityScreen({ navigation }: Props) {
  const { member, user } = useAuth();

  async function changePassword() {
    const email = member?.email || user?.email;
    if (!email) return;
    const result = await resetPassword(email);
    Alert.alert(
      result.ok ? "E-mail enviado" : "Não foi possível enviar",
      result.ok
        ? `Enviamos as instruções de alteração de senha para ${email}.`
        : result.error,
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <StatusBar style="dark" />
      <ScreenAtmosphere />
      <View style={styles.header}>
        <Pressable onPress={navigation.goBack} style={styles.back}><Feather color={colors.green800} name="arrow-left" size={19} /></Pressable>
        <View><Text style={styles.eyebrow}>PROTEÇÃO DA CONTA</Text><Text style={styles.title}>Privacidade e segurança</Text></View>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}><Feather color={colors.white} name="shield" size={25} /></View>
          <Text style={styles.heroTitle}>Seus dados estão protegidos</Text>
          <Text style={styles.heroText}>Usamos autenticação segura e regras de acesso para que somente você possa ver sua conta.</Text>
          <View style={styles.securityStatus}><View style={styles.dot} /><Text style={styles.securityStatusText}>PROTEÇÃO ATIVA</Text></View>
        </View>

        <Text style={styles.section}>Segurança de acesso</Text>
        <View style={styles.card}>
          <SecurityRow icon="key" title="Alterar minha senha" subtitle="Receba um link seguro por e-mail" onPress={changePassword} />
          <SecurityRow icon="mail" title="E-mail de acesso" subtitle={member?.email || user?.email || ""} />
          <SecurityRow icon="smartphone" title="Sessão atual" subtitle="Este iPhone está conectado" last />
        </View>

        <Text style={styles.section}>Privacidade</Text>
        <View style={styles.card}>
          <SecurityRow icon="database" title="Uso dos seus dados" subtitle="Utilizados somente para operar sua associação" />
          <SecurityRow icon="eye" title="Quem pode acessar" subtitle="Você e administradores autorizados" />
          <SecurityRow icon="file-text" title="Política de privacidade" subtitle="Conheça como protegemos suas informações" last onPress={() => Alert.alert("Política de privacidade", "A política completa está disponível no site oficial da ECOMOPAR.")} />
        </View>

        <View style={styles.note}><Feather color={colors.green700} name="info" size={17} /><Text style={styles.noteText}>Nunca compartilhe sua senha ou códigos recebidos por e-mail. A ECOMOPAR nunca solicitará sua senha pelo chat.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SecurityRow({ icon, title, subtitle, onPress, last }: { icon: keyof typeof Feather.glyphMap; title: string; subtitle: string; onPress?: () => void; last?: boolean }) {
  return <Pressable disabled={!onPress} onPress={onPress} style={({ pressed }) => [styles.row, !last && styles.rowBorder, pressed && styles.pressed]}><View style={styles.rowIcon}><Feather color={colors.green700} name={icon} size={16} /></View><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowSubtitle}>{subtitle}</Text></View>{onPress ? <Feather color={colors.inkFaint} name="chevron-right" size={17} /> : <Feather color={colors.green500} name="check-circle" size={15} />}</Pressable>;
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  header: { alignItems: "center", flexDirection: "row", gap: 13, padding: 20 },
  back: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 12, borderWidth: 1, height: 40, justifyContent: "center", width: 40, ...shadow },
  eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1.3 },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 20, letterSpacing: -0.7, marginTop: 2 },
  content: { padding: 20, paddingBottom: 40, paddingTop: 3 },
  hero: { alignItems: "center", backgroundColor: colors.green900, borderRadius: 23, overflow: "hidden", padding: 22, ...shadow },
  heroIcon: { alignItems: "center", backgroundColor: colors.green500, borderRadius: 18, height: 58, justifyContent: "center", width: 58 },
  heroTitle: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 17, marginTop: 13 },
  heroText: { color: "rgba(255,255,255,0.56)", fontFamily: fonts.regular, fontSize: 10, lineHeight: 16, marginTop: 5, maxWidth: 300, textAlign: "center" },
  securityStatus: { alignItems: "center", backgroundColor: "rgba(58,182,137,0.13)", borderRadius: 14, flexDirection: "row", gap: 6, marginTop: 14, paddingHorizontal: 9, paddingVertical: 6 },
  dot: { backgroundColor: colors.green400, borderRadius: 3, height: 6, width: 6 },
  securityStatusText: { color: colors.green400, fontFamily: fonts.bold, fontSize: 7.5, letterSpacing: 0.8 },
  section: { color: colors.ink, fontFamily: fonts.bold, fontSize: 14.5, marginBottom: 11, marginTop: 23 },
  card: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 19, borderWidth: 1, paddingHorizontal: 14, ...shadow },
  row: { alignItems: "center", flexDirection: "row", gap: 11, minHeight: 68 },
  rowBorder: { borderBottomColor: colors.line, borderBottomWidth: StyleSheet.hairlineWidth },
  rowIcon: { alignItems: "center", backgroundColor: colors.green50, borderRadius: 10, height: 37, justifyContent: "center", width: 37 },
  rowTitle: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 11 },
  rowSubtitle: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 8.5, marginTop: 2 },
  note: { backgroundColor: colors.green50, borderColor: colors.green100, borderRadius: 15, borderWidth: 1, flexDirection: "row", gap: 10, marginTop: 18, padding: 14 },
  noteText: { color: colors.inkSoft, flex: 1, fontFamily: fonts.regular, fontSize: 9, lineHeight: 14 },
  pressed: { opacity: 0.68 },
});
