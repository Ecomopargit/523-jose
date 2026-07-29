import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { doc, onSnapshot, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
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
  const [item, setItem] = useState<Withdrawal | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [openedAt] = useState(() => Date.now());

  useEffect(() => onSnapshot(doc(db, "withdrawals", route.params.withdrawalId), (snapshot) => {
    if (!snapshot.exists()) return;
    const data = snapshot.data();
    const next = { id: snapshot.id, memberId: String(data.memberId ?? ""), memberName: String(data.memberName ?? "Associado"), memberCpf: String(data.memberCpf ?? ""), pixKey: String(data.pixKey ?? ""), note: String(data.note ?? ""), adminNote: String(data.adminNote ?? ""), value: Number(data.value ?? 0), status: String(data.status ?? "solicitado"), requestedAt: data.requestedAt?.toDate?.() ?? null, updatedAt: data.updatedAt?.toDate?.() ?? null };
    setItem(next);
    setNote(next.adminNote);
  }), [route.params.withdrawalId]);

  async function change(status: "processando" | "pago" | "rejeitado") {
    if (!item || busy) return;
    setBusy(true);
    try {
      if (status === "pago" && item.status !== "pago") {
        await runTransaction(db, async (transaction) => {
          const memberRef = doc(db, "users", item.memberId);
          const memberSnapshot = await transaction.get(memberRef);
          if (!memberSnapshot.exists()) throw new Error("Associado não encontrado.");
          const available = Number(memberSnapshot.data().saldoDisponivel ?? 0);
          if (available < item.value) throw new Error("O associado não possui saldo disponível suficiente.");
          transaction.update(memberRef, { saldoDisponivel: available - item.value, updatedAt: serverTimestamp() });
          transaction.update(doc(db, "withdrawals", item.id), { status, adminNote: note.trim(), updatedAt: serverTimestamp() });
        });
      } else await updateDoc(doc(db, "withdrawals", item.id), { status, adminNote: note.trim(), updatedAt: serverTimestamp() });
    } catch (error) {
      Alert.alert("Não foi possível concluir", error instanceof Error ? error.message : "Tente novamente.");
    } finally { setBusy(false); }
  }

  if (!item) return <SafeAreaView style={styles.safe}><View style={styles.loading}><ActivityIndicator color={colors.green600} /></View></SafeAreaView>;
  const elapsed = item.requestedAt ? Math.max(0, Math.floor((openedAt - item.requestedAt.getTime()) / 86400000)) : 0;
  const terminal = ["pago", "rejeitado"].includes(item.status);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Pressable onPress={() => navigation.goBack()} style={styles.back}><Feather color={colors.ink} name="arrow-left" size={20} /></Pressable><View style={styles.headerCopy}><Text style={styles.eyebrow}>ANÁLISE FINANCEIRA</Text><Text style={styles.title}>Solicitação de saque</Text></View><View style={styles.dayBadge}><Text style={styles.dayValue}>{elapsed}</Text><Text style={styles.dayLabel}>{elapsed === 1 ? "dia" : "dias"}</Text></View></View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}><Text style={styles.heroLabel}>VALOR SOLICITADO</Text><Text style={styles.heroValue}>{money(item.value)}</Text><View style={styles.heroRule} /><View style={styles.heroFooter}><View><Text style={styles.metaLabel}>STATUS</Text><Text style={styles.metaValue}>{item.status.toUpperCase()}</Text></View><View><Text style={styles.metaLabel}>SOLICITADO EM</Text><Text style={styles.metaValue}>{item.requestedAt?.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) ?? "Agora"}</Text></View></View></View>

        <Text style={styles.sectionTitle}>Solicitante</Text>
        <View style={styles.card}><Row icon="user" label="Associado" value={item.memberName} /><Row icon="credit-card" label="CPF" value={item.memberCpf || "Não informado"} /><Row icon="key" label="Chave PIX" value={item.pixKey} last /></View>

        <Text style={styles.sectionTitle}>Linha do tempo</Text>
        <View style={styles.timeline}>
          <Step done title="Solicitação recebida" text={item.requestedAt?.toLocaleString("pt-BR") ?? "Agora"} />
          <Step done={["processando", "pago"].includes(item.status)} title="Análise administrativa" text={item.status === "solicitado" ? "Aguardando início" : "Análise registrada"} />
          <Step done={item.status === "pago"} danger={item.status === "rejeitado"} title={item.status === "rejeitado" ? "Solicitação negada" : "Pagamento via PIX"} text={terminal ? item.updatedAt?.toLocaleString("pt-BR") ?? "Concluído" : "Pendente"} last />
        </View>

        {item.note ? <><Text style={styles.sectionTitle}>Observação do associado</Text><View style={styles.note}><Text style={styles.noteText}>{item.note}</Text></View></> : null}
        <Text style={styles.sectionTitle}>Nota administrativa</Text>
        <TextInput editable={!terminal} multiline onChangeText={setNote} placeholder="Registre comprovante, motivo ou observação interna..." placeholderTextColor={colors.inkFaint} style={styles.input} value={note} />

        {!terminal ? <View style={styles.actions}>
          {item.status === "solicitado" ? <Pressable disabled={busy} onPress={() => void change("processando")} style={styles.primary}><Feather color={colors.white} name="shield" size={16} /><Text style={styles.primaryText}>Iniciar processamento</Text></Pressable> : null}
          {item.status === "processando" ? <Pressable disabled={busy} onPress={() => Alert.alert("Confirmar pagamento?", `${money(item.value)} será debitado do saldo disponível do associado.`, [{ text: "Cancelar", style: "cancel" }, { text: "Confirmar pagamento", onPress: () => void change("pago") }])} style={styles.primary}><Feather color={colors.white} name="check" size={16} /><Text style={styles.primaryText}>Liberar pagamento</Text></Pressable> : null}
          <Pressable disabled={busy} onPress={() => Alert.alert("Negar solicitação?", "Informe o motivo na nota administrativa antes de continuar.", [{ text: "Cancelar", style: "cancel" }, { text: "Negar", style: "destructive", onPress: () => void change("rejeitado") }])} style={styles.danger}><Feather color={colors.danger} name="x-circle" size={16} /><Text style={styles.dangerText}>Negar solicitação</Text></Pressable>
        </View> : <View style={styles.complete}><Feather color={item.status === "pago" ? colors.green700 : colors.danger} name={item.status === "pago" ? "check-circle" : "x-circle"} size={19} /><Text style={styles.completeText}>Processo {item.status === "pago" ? "pago e concluído" : "negado e encerrado"}</Text></View>}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ icon, label, value, last = false }: { icon: keyof typeof Feather.glyphMap; label: string; value: string; last?: boolean }) { return <View style={[styles.row, !last && styles.rowRule]}><View style={styles.rowIcon}><Feather color={colors.green700} name={icon} size={15} /></View><View style={styles.rowCopy}><Text style={styles.rowLabel}>{label}</Text><Text style={styles.rowValue}>{value}</Text></View></View>; }
function Step({ done = false, danger = false, title, text, last = false }: { done?: boolean; danger?: boolean; title: string; text: string; last?: boolean }) { const color = danger ? colors.danger : done ? colors.green600 : colors.inkFaint; return <View style={styles.step}><View style={styles.stepRail}><View style={[styles.stepDot, { backgroundColor: color }]}>{done || danger ? <Feather color={colors.white} name={danger ? "x" : "check"} size={10} /> : null}</View>{!last ? <View style={[styles.stepLine, { backgroundColor: done ? colors.green100 : colors.line }]} /> : null}</View><View style={styles.stepCopy}><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepText}>{text}</Text></View></View>; }

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 }, loading: { alignItems: "center", flex: 1, justifyContent: "center" }, header: { alignItems: "center", flexDirection: "row", gap: 11, padding: 18 }, back: { alignItems: "center", backgroundColor: colors.surface, borderRadius: 13, height: 43, justifyContent: "center", width: 43 }, headerCopy: { flex: 1 }, eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 7, letterSpacing: 1 }, title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 18, marginTop: 2 }, dayBadge: { alignItems: "center", backgroundColor: colors.amber100, borderRadius: 12, minWidth: 45, padding: 7 }, dayValue: { color: colors.amber600, fontFamily: fonts.extraBold, fontSize: 13 }, dayLabel: { color: colors.amber600, fontFamily: fonts.bold, fontSize: 6, textTransform: "uppercase" }, content: { padding: 18, paddingBottom: 40, paddingTop: 0 }, hero: { backgroundColor: colors.green950, borderRadius: 23, padding: 20, ...shadow }, heroLabel: { color: "rgba(255,255,255,.45)", fontFamily: fonts.bold, fontSize: 7, letterSpacing: 1.1 }, heroValue: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 31, marginTop: 5 }, heroRule: { backgroundColor: "rgba(255,255,255,.1)", height: 1, marginVertical: 17 }, heroFooter: { flexDirection: "row", justifyContent: "space-between" }, metaLabel: { color: "rgba(255,255,255,.4)", fontFamily: fonts.bold, fontSize: 6.5 }, metaValue: { color: colors.white, fontFamily: fonts.bold, fontSize: 8.5, marginTop: 3 }, sectionTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13, marginBottom: 10, marginTop: 23 }, card: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 19, borderWidth: 1, paddingHorizontal: 15, ...shadow }, row: { alignItems: "center", flexDirection: "row", gap: 10, paddingVertical: 13 }, rowRule: { borderBottomColor: colors.line, borderBottomWidth: 1 }, rowIcon: { alignItems: "center", backgroundColor: colors.green50, borderRadius: 9, height: 34, justifyContent: "center", width: 34 }, rowCopy: { flex: 1 }, rowLabel: { color: colors.inkFaint, fontFamily: fonts.bold, fontSize: 7, textTransform: "uppercase" }, rowValue: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 10, marginTop: 2 }, timeline: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 19, borderWidth: 1, padding: 16 }, step: { flexDirection: "row", minHeight: 62 }, stepRail: { alignItems: "center", width: 26 }, stepDot: { alignItems: "center", borderRadius: 11, height: 22, justifyContent: "center", width: 22 }, stepLine: { flex: 1, width: 2 }, stepCopy: { flex: 1, paddingLeft: 8, paddingTop: 2 }, stepTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 10 }, stepText: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 8, marginTop: 3 }, note: { backgroundColor: colors.amber100, borderRadius: 16, padding: 15 }, noteText: { color: colors.ink, fontFamily: fonts.medium, fontSize: 9.5, lineHeight: 15 }, input: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 16, borderWidth: 1, color: colors.ink, fontFamily: fonts.regular, fontSize: 10, minHeight: 100, padding: 15, textAlignVertical: "top" }, actions: { gap: 9, marginTop: 18 }, primary: { alignItems: "center", backgroundColor: colors.green700, borderRadius: 14, flexDirection: "row", gap: 7, justifyContent: "center", minHeight: 50 }, primaryText: { color: colors.white, fontFamily: fonts.bold, fontSize: 10 }, danger: { alignItems: "center", backgroundColor: colors.brick100, borderRadius: 14, flexDirection: "row", gap: 7, justifyContent: "center", minHeight: 48 }, dangerText: { color: colors.danger, fontFamily: fonts.bold, fontSize: 10 }, complete: { alignItems: "center", backgroundColor: colors.surface, borderRadius: 15, flexDirection: "row", gap: 9, justifyContent: "center", marginTop: 17, padding: 16 }, completeText: { color: colors.ink, fontFamily: fonts.bold, fontSize: 10 },
});
