import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { ScreenAtmosphere, ScreenHeader } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { colors, fonts, shadow } from "../theme";

export function ProfileScreen() {
  const navigation = useNavigation();
  const { member, logout } = useAuth();
  const initials = member?.nome.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "EC";
  const memberId = member?.id.slice(0, 8).toUpperCase() || "NOVO";

  function confirmLogout() {
    Alert.alert("Sair da conta?", "Você precisará entrar novamente para acessar sua reserva.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout },
    ]);
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <StatusBar style="dark" />
      <ScreenAtmosphere />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Sua conta" title="Perfil" action={<Pressable onPress={() => navigation.getParent()?.navigate("PrivacySecurity" as never)} style={styles.settings}><Feather color={colors.green700} name="settings" size={18} /></Pressable>} />

        <LinearGradient colors={["#105D45", colors.green900, "#062F23"]} end={{ x: 1, y: 1 }} style={styles.identity}>
          <View pointerEvents="none" style={styles.identityGlow} />
          <Image source={require("../../assets/ecomopar-mark.png")} style={styles.identityWatermark} />
          <View style={styles.identityTop}>
            <Pressable onPress={() => navigation.getParent()?.navigate("EditProfile" as never)} style={styles.avatar}>
              {member?.photoURL ? <Image source={{ uri: member.photoURL }} style={styles.avatarImage} /> : <Text style={styles.avatarText}>{initials}</Text>}
              <View style={styles.cameraBadge}><Feather color={colors.green900} name="camera" size={9} /></View>
              <View style={styles.avatarStatus} />
            </Pressable>
            <View style={styles.memberChip}><Feather color={colors.green400} name="shield" size={11} /><Text style={styles.memberChipText}>ASSOCIADO</Text></View>
          </View>
          <Text style={styles.name}>{member?.nome || "Associado ECOMOPAR"}</Text>
          <Text style={styles.email}>{member?.email || "Cadastro em andamento"}</Text>
          <View style={styles.identityRule} />
          <View style={styles.identityFooter}>
            <View><Text style={styles.metaLabel}>NÚMERO DO ASSOCIADO</Text><Text style={styles.metaValue}>#{memberId}</Text></View>
            <View style={styles.status}><View style={[styles.dot, member?.status !== "ativo" && { backgroundColor: colors.amber500 }]} /><Text style={styles.statusText}>{member?.status || "pendente"}</Text></View>
          </View>
        </LinearGradient>

        <View style={styles.sectionHeading}><View><Text style={styles.section}>Dados pessoais</Text><Text style={styles.sectionHint}>Informações da sua conta</Text></View><Pressable onPress={() => navigation.getParent()?.navigate("EditProfile" as never)} style={styles.edit}><Feather color={colors.green700} name="edit-3" size={13} /><Text style={styles.editText}>Editar</Text></Pressable></View>
        <View style={styles.infoCard}>
          <Info icon="file-text" label="CPF" value={member?.cpf || "Não informado"} />
          <Info icon="phone" label="Telefone" value={member?.telefone || "Não informado"} />
          <Info icon="truck" label="Veículo" value={[member?.modelo, member?.placa].filter(Boolean).join(" • ") || "Não informado"} />
          <Info icon="zap" label="Chave PIX" value={member?.chavePix || "Não cadastrada"} last />
        </View>

        <View style={styles.sectionHeading}><View><Text style={styles.section}>Atendimento</Text><Text style={styles.sectionHint}>Estamos ao seu lado</Text></View></View>
        <View style={styles.menuCard}>
          <Menu
            icon="message-circle"
            label="Falar com o suporte"
            onPress={() => navigation.getParent()?.navigate("Support" as never)}
            subtitle="Converse com nossa equipe"
          />
          <Menu icon="shield" label="Privacidade e segurança" onPress={() => navigation.getParent()?.navigate("PrivacySecurity" as never)} subtitle="Seus dados protegidos" />
          <Menu icon="help-circle" label="Central de ajuda" onPress={() => navigation.getParent()?.navigate("HelpCenter" as never)} subtitle="Dúvidas frequentes" last />
        </View>

        <Pressable onPress={confirmLogout} style={({ pressed }) => [styles.logout, pressed && styles.pressed]}><View style={styles.logoutIcon}><Feather color={colors.danger} name="log-out" size={16} /></View><Text style={styles.logoutText}>Sair da conta</Text><Feather color="rgba(164,61,45,0.45)" name="chevron-right" size={17} /></Pressable>
        <View style={styles.footerBrand}><Image source={require("../../assets/ecomopar-mark.png")} style={styles.footerMark} /><Text style={styles.version}>ECOMOPAR Mobile  •  versão 1.0.0</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Info({ icon, label, value, last }: { icon: keyof typeof Feather.glyphMap; label: string; value: string; last?: boolean }) {
  return <View style={[styles.info, !last && styles.infoBorder]}><View style={styles.infoIcon}><Feather color={colors.green700} name={icon} size={16} /></View><View style={{ flex: 1 }}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View><View style={styles.verified}><Feather color={colors.green600} name="check" size={9} /></View></View>;
}

function Menu({ icon, label, subtitle, last, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; subtitle: string; last?: boolean; onPress?: () => void }) {
  return <Pressable onPress={onPress ?? (() => Alert.alert(label, "Este canal será conectado na próxima etapa."))} style={({ pressed }) => [styles.menu, !last && styles.menuBorder, pressed && styles.pressed]}><View style={styles.menuIcon}><Feather color={colors.green700} name={icon} size={17} /></View><View style={{ flex: 1 }}><Text style={styles.menuLabel}>{label}</Text><Text style={styles.menuSubtitle}>{subtitle}</Text></View><View style={styles.menuArrow}><Feather color={colors.inkFaint} name="arrow-up-right" size={15} /></View></Pressable>;
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 20, paddingBottom: 112 },
  settings: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 13, borderWidth: 1, height: 42, justifyContent: "center", width: 42, ...shadow },
  identity: { borderRadius: 25, overflow: "hidden", padding: 20, ...shadow },
  identityGlow: { backgroundColor: "rgba(58,182,137,0.16)", borderRadius: 120, height: 230, position: "absolute", right: -120, top: -105, width: 230 },
  identityWatermark: { bottom: -35, height: 155, opacity: 0.045, position: "absolute", right: -20, width: 155 },
  identityTop: { alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between" },
  avatar: { alignItems: "center", backgroundColor: colors.green500, borderColor: "rgba(255,255,255,0.22)", borderRadius: 19, borderWidth: 2, height: 61, justifyContent: "center", width: 61 },
  avatarImage: { borderRadius: 17, height: "100%", width: "100%" },
  avatarText: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 17 },
  cameraBadge: { alignItems: "center", backgroundColor: colors.white, borderColor: colors.green900, borderRadius: 8, borderWidth: 2, bottom: -5, height: 20, justifyContent: "center", left: -4, position: "absolute", width: 20 },
  avatarStatus: { backgroundColor: colors.green400, borderColor: colors.green900, borderRadius: 6, borderWidth: 2, bottom: -2, height: 12, position: "absolute", right: -2, width: 12 },
  memberChip: { alignItems: "center", backgroundColor: "rgba(58,182,137,0.13)", borderColor: "rgba(58,182,137,0.20)", borderRadius: 15, borderWidth: 1, flexDirection: "row", gap: 5, paddingHorizontal: 9, paddingVertical: 6 },
  memberChipText: { color: colors.green400, fontFamily: fonts.bold, fontSize: 7.5, letterSpacing: 0.8 },
  name: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 20, letterSpacing: -0.5, marginTop: 14 },
  email: { color: "rgba(255,255,255,0.53)", fontFamily: fonts.regular, fontSize: 10.5, marginTop: 3 },
  identityRule: { backgroundColor: "rgba(255,255,255,0.10)", height: 1, marginVertical: 16 },
  identityFooter: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between" },
  metaLabel: { color: "rgba(255,255,255,0.36)", fontFamily: fonts.bold, fontSize: 7, letterSpacing: 1 },
  metaValue: { color: colors.white, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 0.7, marginTop: 3 },
  status: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 14, flexDirection: "row", gap: 6, paddingHorizontal: 9, paddingVertical: 6 },
  dot: { backgroundColor: colors.green400, borderRadius: 3, height: 6, width: 6 },
  statusText: { color: colors.white, fontFamily: fonts.semibold, fontSize: 8.5, textTransform: "capitalize" },
  sectionHeading: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between", marginBottom: 12, marginTop: 24 },
  section: { color: colors.ink, fontFamily: fonts.bold, fontSize: 15.5 },
  sectionHint: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 9.5, marginTop: 3 },
  edit: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 12, flexDirection: "row", gap: 5, paddingHorizontal: 9, paddingVertical: 7 },
  editText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 8.5 },
  infoCard: { backgroundColor: colors.surface, borderColor: "rgba(18,36,28,0.045)", borderRadius: 20, borderWidth: 1, paddingHorizontal: 16, ...shadow },
  info: { alignItems: "center", flexDirection: "row", gap: 11, minHeight: 67 },
  infoBorder: { borderBottomColor: colors.line, borderBottomWidth: StyleSheet.hairlineWidth },
  infoIcon: { alignItems: "center", backgroundColor: colors.green50, borderRadius: 10, height: 36, justifyContent: "center", width: 36 },
  infoLabel: { color: colors.inkFaint, fontFamily: fonts.medium, fontSize: 8.5 },
  infoValue: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 11.5, marginTop: 2 },
  verified: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 8, height: 17, justifyContent: "center", width: 17 },
  menuCard: { backgroundColor: colors.surface, borderColor: "rgba(18,36,28,0.045)", borderRadius: 20, borderWidth: 1, paddingHorizontal: 15, ...shadow },
  menu: { alignItems: "center", flexDirection: "row", gap: 11, minHeight: 70 },
  menuBorder: { borderBottomColor: colors.line, borderBottomWidth: StyleSheet.hairlineWidth },
  menuIcon: { alignItems: "center", backgroundColor: colors.green50, borderRadius: 11, height: 39, justifyContent: "center", width: 39 },
  menuLabel: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 11.5 },
  menuSubtitle: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 8.5, marginTop: 2 },
  menuArrow: { alignItems: "center", borderColor: colors.line, borderRadius: 9, borderWidth: 1, height: 28, justifyContent: "center", width: 28 },
  logout: { alignItems: "center", backgroundColor: colors.brick100, borderColor: "rgba(181,80,47,0.08)", borderRadius: 16, borderWidth: 1, flexDirection: "row", gap: 10, height: 56, marginTop: 20, paddingHorizontal: 12 },
  logoutIcon: { alignItems: "center", backgroundColor: "rgba(181,80,47,0.09)", borderRadius: 10, height: 35, justifyContent: "center", width: 35 },
  logoutText: { color: colors.danger, flex: 1, fontFamily: fonts.bold, fontSize: 11.5 },
  footerBrand: { alignItems: "center", flexDirection: "row", gap: 6, justifyContent: "center", marginTop: 16 },
  footerMark: { borderRadius: 4, height: 16, opacity: 0.38, width: 16 },
  version: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 8.5 },
  pressed: { opacity: 0.68, transform: [{ scale: 0.99 }] },
});
