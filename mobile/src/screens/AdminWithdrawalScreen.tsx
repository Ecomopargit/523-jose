import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, doc, onSnapshot, query, runTransaction, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { db } from "../lib/firebase";
import { colors, fonts, shadow } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "AdminWithdrawal">;
type Withdrawal = { id: string; memberId: string; memberName: string; memberCpf: string; pixKey: string; note: string; adminNote: string; value: number; status: string; requestedAt: Date | null; updatedAt: Date | null };
const money = (value = 0) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function AdminWithdrawalScreen({ navigation, route }: Props) {
  const [items, setItems] = useState<Withdrawal[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [openedAt] = useState(() => Date.now());
  const memberId = route.params.memberId;
  const withdrawalId = route.params.withdrawalId;

  useEffect(() => {
    const trackedIds: { current: string[] | null } = { current: null };
    const apply = (next: Withdrawal[]) => {
      const openIds = next.filter((entry) => entry.status === "solicitado" || entry.status === "processando").map((entry) => entry.id);
      if (!trackedIds.current) trackedIds.current = openIds.length ? openIds : next.slice(0, 1).map((entry) => entry.id);
      else trackedIds.current = [...new Set([...trackedIds.current, ...openIds])];
      const visible = next.filter((entry) => trackedIds.current?.includes(entry.id));
      setItems(visible);
      setNote((current) => current || visible[0]?.adminNote || "");
    };
    const map = (id: string, data: Record<string, unknown>): Withdrawal => {
      const date = (value: unknown) => {
        if (!value || typeof value !== "object" || !("toDate" in value) || typeof value.toDate !== "function") return null;
        return value.toDate();
      };
      return {
        id,
        memberId: String(data.memberId ?? ""),
        memberName: String(data.memberName ?? "Associado"),
        memberCpf: String(data.memberCpf ?? ""),
        pixKey: String(data.pixKey ?? ""),
        note: String(data.note ?? ""),
        adminNote: String(data.adminNote ?? ""),
        value: Number(data.value ?? 0),
        status: String(data.status ?? "solicitado"),
        requestedAt: date(data.requestedAt),
        updatedAt: date(data.updatedAt),
      };
    };

    if (memberId) {
      return onSnapshot(query(collection(db, "withdrawals"), where("memberId", "==", memberId)), (snapshot) => {
        apply(snapshot.docs.map((record) => map(record.id, record.data() as Record<string, unknown>)).sort((a, b) => (b.requestedAt?.getTime() ?? 0) - (a.requestedAt?.getTime() ?? 0)));
      });
    }
    if (!withdrawalId) return;
    return onSnapshot(doc(db, "withdrawals", withdrawalId), (snapshot) => {
      if (!snapshot.exists()) return;
      apply([map(snapshot.id, snapshot.data() as Record<string, unknown>)]);
    });
  }, [memberId, withdrawalId]);

  const item = items[0] ?? null;
  const total = items.reduce((sum, entry) => sum + entry.value, 0);
  const openItems = items.filter((entry) => entry.status === "solicitado" || entry.status === "processando");
  const status = items.length && items.every((entry) => entry.status === "pago")
    ? "pago"
    : items.length && items.every((entry) => entry.status === "rejeitado")
      ? "rejeitado"
      : openItems.every((entry) => entry.status === "processando") && openItems.length
        ? "processando"
        : "solicitado";

  async function change(nextStatus: "processando" | "pago" | "rejeitado") {
    if (!item || busy || !openItems.length) return;
    setBusy(true);
    try {
      if (nextStatus === "pago") {
        await runTransaction(db, async (transaction) => {
          const memberRef = doc(db, "users", item.memberId);
          const memberSnapshot = await transaction.get(memberRef);
          const snapshots = await Promise.all(openItems.map((entry) => transaction.get(doc(db, "withdrawals", entry.id))));
          if (!memberSnapshot.exists()) throw new Error("Associado não encontrado.");
          const payable = snapshots.filter((snapshot) => snapshot.exists() && !["pago", "rejeitado"].includes(String(snapshot.data()?.status ?? "")));
          const amount = payable.reduce((sum, snapshot) => sum + Number(snapshot.data()?.value ?? 0), 0);
          const available = Number(memberSnapshot.data().saldoDisponivel ?? 0);
          const bonus = Number(memberSnapshot.data().saldoBonus ?? 0);
          if (available + bonus < amount) throw new Error("O associado não possui saldo suficiente.");
          const debitAvailable = Math.min(available, amount);
          transaction.update(memberRef, {
            saldoDisponivel: available - debitAvailable,
            saldoBonus: bonus - (amount - debitAvailable),
            updatedAt: serverTimestamp(),
          });
          payable.forEach((snapshot) => transaction.update(snapshot.ref, { status: nextStatus, adminNote: note.trim(), updatedAt: serverTimestamp() }));
        });
      } else {
        await Promise.all(openItems.map((entry) => updateDoc(doc(db, "withdrawals", entry.id), { status: nextStatus, adminNote: note.trim(), updatedAt: serverTimestamp() })));
      }
    } catch (error) {
      Alert.alert("Não foi possível concluir", error instanceof Error ? error.message : "Tente novamente.");
    } finally { setBusy(false); }
  }

  if (!item) return <SafeAreaView style={styles.safe}><View style={styles.loading}><ActivityIndicator color={colors.green600} /></View></SafeAreaView>;
  const elapsed = item.requestedAt ? Math.max(0, Math.floor((openedAt - item.requestedAt.getTime()) / 86400000)) : 0;
  const terminal = openItems.length === 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Pressable onPress={() => navigation.goBack()} style={styles.back}><Feather color={colors.ink} name="arrow-left" size={20} /></Pressable><View style={styles.headerCopy}><Text style={styles.eyebrow}>ANÁLISE FINANCEIRA</Text><Text style={styles.title}>Solicitação de saque</Text></View><View style={styles.dayBadge}><Text style={styles.dayValue}>{elapsed}</Text><Text style={styles.dayLabel}>{elapsed === 1 ? "dia" : "dias"}</Text></View></View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}><Text style={styles.heroLabel}>{items.length > 1 ? `SOMA DE ${items.length} PEDIDOS` : "VALOR SOLICITADO"}</Text><Text style={styles.heroValue}>{money(total)}</Text><View style={styles.heroRule} /><View style={styles.heroFooter}><View><Text style={styles.metaLabel}>STATUS</Text><Text style={styles.metaValue}>{status.toUpperCase()}</Text></View><View><Text style={styles.metaLabel}>SOLICITADO EM</Text><Text style={styles.metaValue}>{item.requestedAt?.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) ?? "Agora"}</Text></View></View></View>

        <Text style={styles.sectionTitle}>Solicitante</Text>
        <View style={styles.card}><Row icon="user" label="Associado" value={item.memberName} /><Row icon="credit-card" label="CPF" value={item.memberCpf || "Não informado"} /><Row icon="key" label="Chave PIX" value={item.pixKey} last /></View>

        <Text style={styles.sectionTitle}>Linha do tempo</Text>
        <View style={styles.timeline}>
          <Step done title="Solicitação recebida" text={item.requestedAt?.toLocaleString("pt-BR") ?? "Agora"} />
          <Step done={["processando", "pago"].includes(status)} title="Análise administrativa" text={status === "solicitado" ? "Aguardando início" : "Análise registrada"} />
          <Step done={status === "pago"} danger={status === "rejeitado"} title={status === "rejeitado" ? "Solicitação negada" : "Pagamento via PIX"} text={terminal ? item.updatedAt?.toLocaleString("pt-BR") ?? "Concluído" : "Pendente"} last />
        </View>

        {items.length > 1 ? <><Text style={styles.sectionTitle}>Pedidos incluídos</Text><View style={styles.card}>{items.map((entry, index) => <Row key={entry.id} icon="file-text" label={entry.requestedAt?.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) ?? "Pedido"} value={money(entry.value)} last={index === items.length - 1} />)}</View></> : null}
        {item.note ? <><Text style={styles.sectionTitle}>Observação do associado</Text><View style={styles.note}><Text style={styles.noteText}>{item.note}</Text></View></> : null}
        <Text style={styles.sectionTitle}>Nota administrativa</Text>
        <TextInput editable={!terminal} multiline onChangeText={setNote} placeholder="Registre comprovante, motivo ou observação interna..." placeholderTextColor={colors.inkFaint} style={styles.input} value={note} />

        {!terminal ? <View style={styles.actions}>
          {status === "solicitado" ? <Pressable disabled={busy} onPress={() => void change("processando")} style={styles.primary}><Feather color={colors.white} name="shield" size={16} /><Text style={styles.primaryText}>{items.length > 1 ? "Processar todos" : "Iniciar processamento"}</Text></Pressable> : null}
          {status === "processando" ? <Pressable disabled={busy} onPress={() => Alert.alert("Confirmar pagamento?", `${money(total)} será pago em um único PIX e debitado do saldo do associado.`, [{ text: "Cancelar", style: "cancel" }, { text: "Confirmar pagamento", onPress: () => void change("pago") }])} style={styles.primary}><Feather color={colors.white} name="check" size={16} /><Text style={styles.primaryText}>Liberar PIX de {money(total)}</Text></Pressable> : null}
          <Pressable disabled={busy} onPress={() => Alert.alert("Negar solicitação?", "Informe o motivo na nota administrativa antes de continuar.", [{ text: "Cancelar", style: "cancel" }, { text: "Negar", style: "destructive", onPress: () => void change("rejeitado") }])} style={styles.danger}><Feather color={colors.danger} name="x-circle" size={16} /><Text style={styles.dangerText}>{items.length > 1 ? "Negar todos" : "Negar solicitação"}</Text></Pressable>
        </View> : <View style={styles.complete}><Feather color={status === "pago" ? colors.green700 : colors.danger} name={status === "pago" ? "check-circle" : "x-circle"} size={19} /><Text style={styles.completeText}>Processo {status === "pago" ? "pago e concluído" : "negado e encerrado"}</Text></View>}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ icon, label, value, last = false }: { icon: keyof typeof Feather.glyphMap; label: string; value: string; last?: boolean }) { return <View style={[styles.row, !last && styles.rowRule]}><View style={styles.rowIcon}><Feather color={colors.green700} name={icon} size={15} /></View><View style={styles.rowCopy}><Text style={styles.rowLabel}>{label}</Text><Text style={styles.rowValue}>{value}</Text></View></View>; }
function Step({ done = false, danger = false, title, text, last = false }: { done?: boolean; danger?: boolean; title: string; text: string; last?: boolean }) { const color = danger ? colors.danger : done ? colors.green600 : colors.inkFaint; return <View style={styles.step}><View style={styles.stepRail}><View style={[styles.stepDot, { backgroundColor: color }]}>{done || danger ? <Feather color={colors.white} name={danger ? "x" : "check"} size={10} /> : null}</View>{!last ? <View style={[styles.stepLine, { backgroundColor: done ? colors.green100 : colors.line }]} /> : null}</View><View style={styles.stepCopy}><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepText}>{text}</Text></View></View>; }

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 }, loading: { alignItems: "center", flex: 1, justifyContent: "center" }, header: { alignItems: "center", flexDirection: "row", gap: 11, padding: 18 }, back: { alignItems: "center", backgroundColor: colors.surface, borderRadius: 13, height: 43, justifyContent: "center", width: 43 }, headerCopy: { flex: 1 }, eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 7, letterSpacing: 1 }, title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 18, marginTop: 2 }, dayBadge: { alignItems: "center", backgroundColor: colors.amber100, borderRadius: 12, minWidth: 45, padding: 7 }, dayValue: { color: colors.amber600, fontFamily: fonts.extraBold, fontSize: 13 }, dayLabel: { color: colors.amber600, fontFamily: fonts.bold, fontSize: 6, textTransform: "uppercase" }, content: { padding: 18, paddingBottom: 40, paddingTop: 0 }, hero: { backgroundColor: colors.green950, borderRadius: 23, padding: 20, ...shadow }, heroLabel: { color: "rgba(255,255,255,.45)", fontFamily: fonts.bold, fontSize: 7, letterSpacing: 1.1 }, heroValue: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 31, marginTop: 5 }, heroRule: { backgroundColor: "rgba(255,255,255,.1)", height: 1, marginVertical: 17 }, heroFooter: { flexDirection: "row", justifyContent: "space-between" }, metaLabel: { color: "rgba(255,255,255,.4)", fontFamily: fonts.bold, fontSize: 6.5 }, metaValue: { color: colors.white, fontFamily: fonts.bold, fontSize: 8.5, marginTop: 3 }, sectionTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13, marginBottom: 10, marginTop: 23 }, card: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 19, borderWidth: 1, paddingHorizontal: 15, ...shadow }, row: { alignItems: "center", flexDirection: "row", gap: 10, paddingVertical: 13 }, rowRule: { borderBottomColor: colors.line, borderBottomWidth: 1 }, rowIcon: { alignItems: "center", backgroundColor: colors.green50, borderRadius: 9, height: 34, justifyContent: "center", width: 34 }, rowCopy: { flex: 1 }, rowLabel: { color: colors.inkFaint, fontFamily: fonts.bold, fontSize: 7, textTransform: "uppercase" }, rowValue: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 10, marginTop: 2 }, timeline: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 19, borderWidth: 1, padding: 16 }, step: { flexDirection: "row", minHeight: 62 }, stepRail: { alignItems: "center", width: 26 }, stepDot: { alignItems: "center", borderRadius: 11, height: 22, justifyContent: "center", width: 22 }, stepLine: { flex: 1, width: 2 }, stepCopy: { flex: 1, paddingLeft: 8, paddingTop: 2 }, stepTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 10 }, stepText: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 8, marginTop: 3 }, note: { backgroundColor: colors.amber100, borderRadius: 16, padding: 15 }, noteText: { color: colors.ink, fontFamily: fonts.medium, fontSize: 9.5, lineHeight: 15 }, input: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 16, borderWidth: 1, color: colors.ink, fontFamily: fonts.regular, fontSize: 10, minHeight: 100, padding: 15, textAlignVertical: "top" }, actions: { gap: 9, marginTop: 18 }, primary: { alignItems: "center", backgroundColor: colors.green700, borderRadius: 14, flexDirection: "row", gap: 7, justifyContent: "center", minHeight: 50 }, primaryText: { color: colors.white, fontFamily: fonts.bold, fontSize: 10 }, danger: { alignItems: "center", backgroundColor: colors.brick100, borderRadius: 14, flexDirection: "row", gap: 7, justifyContent: "center", minHeight: 48 }, dangerText: { color: colors.danger, fontFamily: fonts.bold, fontSize: 10 }, complete: { alignItems: "center", backgroundColor: colors.surface, borderRadius: 15, flexDirection: "row", gap: 9, justifyContent: "center", marginTop: 17, padding: 16 }, completeText: { color: colors.ink, fontFamily: fonts.bold, fontSize: 10 },
});
