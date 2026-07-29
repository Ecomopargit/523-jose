import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { db } from "../lib/firebase";
import { getAdminStats, setMemberStatus } from "../lib/admin";
import { colors, fonts, shadow } from "../theme";
import type { MemberProfile, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "AdminOperations">;
type OperationItem = {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  status: string;
  value?: number;
  member?: MemberProfile;
};

const money = (value = 0) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function AdminOperationsScreen({ navigation, route }: Props) {
  const { section } = route.params;
  const [items, setItems] = useState<OperationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (section === "associados") {
      void getAdminStats()
        .then((stats) => setItems(stats.members.map((member) => ({
          id: member.id,
          title: member.nome || "Associado",
          subtitle: member.email,
          detail: member.telefone || "Telefone não informado",
          status: member.status,
          value: member.saldoDisponivel + member.saldoBloqueado + member.saldoBonus,
          member,
        }))))
        .catch(() => setError("Não foi possível carregar os associados."))
        .finally(() => setLoading(false));
      return;
    }

    const source = section === "saques" ? "withdrawals" : "supportChats";
    const field = section === "saques" ? "requestedAt" : "lastMessageAt";
    return onSnapshot(
      query(collection(db, source), orderBy(field, "desc")),
      (snapshot) => {
        setItems(snapshot.docs.map((record) => {
          const data = record.data();
          return section === "saques" ? {
            id: record.id,
            title: String(data.memberName ?? "Associado"),
            subtitle: String(data.pixKey ?? ""),
            detail: String(data.memberCpf ?? "CPF não informado"),
            status: String(data.status ?? "solicitado"),
            value: Number(data.value ?? 0),
          } : {
            id: record.id,
            title: String(data.memberName ?? "Associado"),
            subtitle: String(data.memberEmail ?? ""),
            detail: String(data.lastMessage ?? "Sem mensagens"),
            status: data.status === "closed" ? "encerrado" : "aberto",
          };
        }));
        setLoading(false);
      },
      () => {
        setError("Não foi possível carregar os dados.");
        setLoading(false);
      },
    );
  }, [section]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? items.filter((item) => `${item.title} ${item.subtitle} ${item.detail}`.toLowerCase().includes(term)) : items;
  }, [items, search]);

  function open(item: OperationItem) {
    if (section === "associados") navigation.navigate("AdminMember", { memberId: item.id });
    else if (section === "saques") navigation.navigate("AdminWithdrawal", { withdrawalId: item.id });
    else navigation.navigate("AdminChat", { chatId: item.id, memberName: item.title, memberEmail: item.subtitle });
  }

  const copy = {
    associados: { title: "Associados", subtitle: "Cadastros e situação financeira", icon: "users" as const },
    saques: { title: "Saques", subtitle: "Solicitações e pagamentos PIX", icon: "trending-down" as const },
    atendimento: { title: "Atendimento", subtitle: "Conversas com associados", icon: "message-circle" as const },
  }[section];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Voltar" onPress={() => navigation.goBack()} style={styles.back}><Feather color={colors.ink} name="arrow-left" size={20} /></Pressable>
        <View style={styles.headerCopy}><Text style={styles.title}>{copy.title}</Text><Text style={styles.subtitle}>{copy.subtitle}</Text></View>
        <View style={styles.headerIcon}><Feather color={colors.green700} name={copy.icon} size={18} /></View>
      </View>

      <View style={styles.search}>
        <Feather color={colors.inkFaint} name="search" size={17} />
        <TextInput autoCapitalize="none" onChangeText={setSearch} placeholder="Buscar..." placeholderTextColor={colors.inkFaint} style={styles.input} value={search} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? <View style={styles.center}><ActivityIndicator color={colors.green600} /><Text style={styles.muted}>Carregando...</Text></View> : null}
        {error ? <View style={styles.error}><Feather color={colors.danger} name="alert-circle" size={18} /><Text style={styles.errorText}>{error}</Text></View> : null}
        {!loading && !error && filtered.length === 0 ? <View style={styles.center}><View style={styles.emptyIcon}><Feather color={colors.green700} name={copy.icon} size={22} /></View><Text style={styles.emptyTitle}>Nenhum registro encontrado</Text><Text style={styles.muted}>Novos registros aparecerão aqui automaticamente.</Text></View> : null}
        {filtered.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}><View style={styles.avatar}><Text style={styles.avatarText}>{item.title.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</Text></View><View style={styles.cardCopy}><Text numberOfLines={1} style={styles.name}>{item.title}</Text><Text numberOfLines={1} style={styles.email}>{item.subtitle}</Text></View><View style={styles.badge}><Text style={styles.badgeText}>{item.status}</Text></View></View>
            <View style={styles.rule} />
            <View style={styles.cardBottom}><View style={styles.detailCopy}><Text numberOfLines={2} style={styles.detail}>{item.detail}</Text>{item.value !== undefined ? <Text style={styles.value}>{money(item.value)}</Text> : null}</View><Pressable onPress={() => open(item)} style={({ pressed }) => [styles.button, pressed && styles.pressed]}><Text style={styles.buttonText}>{section === "atendimento" ? "Conversar" : "Visualizar"}</Text><Feather color={colors.white} name="arrow-right" size={13} /></Pressable></View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  header: { alignItems: "center", flexDirection: "row", gap: 12, paddingHorizontal: 18, paddingTop: 8 },
  back: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 13, borderWidth: 1, height: 43, justifyContent: "center", width: 43 },
  headerCopy: { flex: 1 },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 22, letterSpacing: -0.6 },
  subtitle: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 9, marginTop: 2 },
  headerIcon: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 13, height: 43, justifyContent: "center", width: 43 },
  search: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 15, borderWidth: 1, flexDirection: "row", gap: 9, marginHorizontal: 18, marginTop: 18, paddingHorizontal: 14 },
  input: { color: colors.ink, flex: 1, fontFamily: fonts.medium, fontSize: 11, height: 48 },
  content: { gap: 10, padding: 18, paddingBottom: 40 },
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 70 },
  muted: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 9, marginTop: 9, textAlign: "center" },
  emptyIcon: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 17, height: 54, justifyContent: "center", width: 54 },
  emptyTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 12, marginTop: 12 },
  error: { alignItems: "center", backgroundColor: colors.brick100, borderRadius: 16, flexDirection: "row", gap: 9, padding: 15 },
  errorText: { color: colors.danger, flex: 1, fontFamily: fonts.semibold, fontSize: 10 },
  card: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 18, borderWidth: 1, padding: 14, ...shadow },
  cardTop: { alignItems: "center", flexDirection: "row", gap: 10 },
  avatar: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 12, height: 40, justifyContent: "center", width: 40 },
  avatarText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 9 },
  cardCopy: { flex: 1 },
  name: { color: colors.ink, fontFamily: fonts.bold, fontSize: 11 },
  email: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 8.5, marginTop: 2 },
  badge: { backgroundColor: colors.green50, borderRadius: 9, paddingHorizontal: 8, paddingVertical: 5 },
  badgeText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 7.5, textTransform: "uppercase" },
  rule: { backgroundColor: colors.line, height: 1, marginVertical: 12 },
  cardBottom: { alignItems: "center", flexDirection: "row", gap: 10 },
  detailCopy: { flex: 1 },
  detail: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 9 },
  value: { color: colors.green700, fontFamily: fonts.extraBold, fontSize: 13, marginTop: 4 },
  button: { alignItems: "center", backgroundColor: colors.green700, borderRadius: 10, flexDirection: "row", gap: 5, paddingHorizontal: 13, paddingVertical: 10 },
  buttonDisabled: { backgroundColor: colors.inkFaint, opacity: 0.55 },
  buttonText: { color: colors.white, fontFamily: fonts.bold, fontSize: 8.5 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});
