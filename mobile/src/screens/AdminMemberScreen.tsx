import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, doc, onSnapshot, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { activateMember, setMemberStatus } from "../lib/admin";
import {
  getMemberReferralDossier,
  REFERRAL_BONUS,
  REFERRALS_PER_BONUS,
  type AdminReferralDossier,
  type AdminReferredPerson,
} from "../lib/referrals-admin";
import { db } from "../lib/firebase";
import { getMember } from "../lib/members";
import { colors, fonts, shadow } from "../theme";
import type { MemberProfile, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "AdminMember">;
type HistoryItem = { id: string; status: string; value: number; date: Date | null };
const money = (value = 0) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function AdminMemberScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [referrals, setReferrals] = useState<AdminReferralDossier | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(false);
  const [adjustMode, setAdjustMode] = useState<"credit" | "debit">("credit");
  const [amount, setAmount] = useState("");
  const [savingBalance, setSavingBalance] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    void getMember(route.params.memberId)
      .then(async (loaded) => {
        setMember(loaded);
        if (loaded) {
          setReferrals(await getMemberReferralDossier(loaded.id, loaded));
        }
      })
      .finally(() => setLoading(false));
    return onSnapshot(collection(db, "withdrawals"), (snapshot) => {
      setHistory(snapshot.docs.flatMap((record) => {
        const data = record.data();
        if (data.memberId !== route.params.memberId) return [];
        return [{ id: record.id, status: String(data.status ?? "solicitado"), value: Number(data.value ?? 0), date: data.requestedAt?.toDate?.() ?? null }];
      }).sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0)));
    });
  }, [route.params.memberId]);

  async function reloadMember(memberId: string) {
    const loaded = await getMember(memberId);
    if (!loaded) return null;
    setMember(loaded);
    setReferrals(await getMemberReferralDossier(loaded.id, loaded));
    return loaded;
  }

  async function activateAccount() {
    if (!member || statusUpdating || member.status === "ativo") return;
    setStatusUpdating(true);
    try {
      const result = await activateMember(member.id);
      if (!result.ok) throw new Error(result.error);
      await reloadMember(member.id);
      Alert.alert("Conta ativada", `${member.nome} agora está ativo na plataforma.`);
    } catch (error) {
      Alert.alert(
        "Não foi possível ativar",
        error instanceof Error ? error.message : "Verifique sua conexão e tente novamente.",
      );
    } finally {
      setStatusUpdating(false);
    }
  }

  async function blockAccount() {
    if (!member || statusUpdating) return;
    setStatusUpdating(true);
    try {
      await setMemberStatus(member.id, "bloqueado");
      await reloadMember(member.id);
      Alert.alert("Conta bloqueada", `${member.nome} não poderá acessar o app.`);
    } catch (error) {
      Alert.alert(
        "Não foi possível bloquear",
        error instanceof Error ? error.message : "Verifique sua conexão e tente novamente.",
      );
    } finally {
      setStatusUpdating(false);
    }
  }

  async function addBalance() {
    if (!member || savingBalance) return;
    const normalized = amount.trim().replace(/\s/g, "").replace(/^R\$/, "").replace(/\./g, "").replace(",", ".");
    const value = Number(normalized);
    if (!Number.isFinite(value) || value <= 0) return Alert.alert("Valor inválido", "Informe um valor maior que zero.");
    setSavingBalance(true);
    try {
      const nextBalance = await runTransaction(db, async (transaction) => {
        const memberRef = doc(db, "users", member.id);
        const snapshot = await transaction.get(memberRef);
        if (!snapshot.exists()) throw new Error("O cadastro do associado não foi encontrado.");
        const currentBalance = Number(snapshot.data().saldoDisponivel ?? 0);
        if (adjustMode === "debit" && value > currentBalance) throw new Error(`Saldo insuficiente. Disponível: ${money(currentBalance)}.`);
        const next = adjustMode === "credit" ? currentBalance + value : currentBalance - value;
        transaction.update(memberRef, { saldoDisponivel: next, updatedAt: serverTimestamp() });
        return next;
      });
      setMember((current) => current ? { ...current, saldoDisponivel: nextBalance } : current);
      setAdjusting(false);
      setAmount("");
      Alert.alert(adjustMode === "credit" ? "Valor liberado" : "Saque realizado", `${money(value)} foi processado com sucesso.`);
    } catch (error) {
      const code = (error as { code?: string }).code;
      const message = code === "permission-denied" || code === "firestore/permission-denied"
        ? "O Firebase recusou a operação. Saia e entre novamente na conta administrativa para renovar a sessão."
        : error instanceof Error ? error.message : "Não foi possível atualizar o saldo.";
      Alert.alert("Operação não concluída", message);
    } finally {
      setSavingBalance(false);
    }
  }

  function closeAdjust() {
    if (savingBalance) return;
    setAdjusting(false);
    setAmount("");
  }

  if (loading || !member) return <SafeAreaView style={styles.safe}><View style={styles.loading}><ActivityIndicator color={colors.green600} /></View></SafeAreaView>;
  const total = member.saldoDisponivel + member.saldoBloqueado + member.saldoBonus;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Pressable onPress={() => navigation.goBack()} style={styles.back}><Feather color={colors.ink} name="arrow-left" size={20} /></Pressable><View style={styles.headerCopy}><Text style={styles.eyebrow}>DOSSIÊ DO ASSOCIADO</Text><Text numberOfLines={1} style={styles.headerTitle}>{member.nome}</Text></View><View style={[styles.status, member.status === "ativo" ? styles.statusActive : styles.statusWarn]}><Text style={styles.statusText}>{member.status}</Text></View></View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{member.nome.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</Text></View>
          <View style={styles.heroCopy}><Text style={styles.name}>{member.nome}</Text><Text style={styles.email}>{member.email}</Text><Text style={styles.since}>Associado desde {new Date(member.createdAt).toLocaleDateString("pt-BR")}</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Posição financeira</Text>
        <View style={styles.balanceHero}><Text style={styles.balanceLabel}>PATRIMÔNIO TOTAL</Text><Text style={styles.balanceValue}>{money(total)}</Text><View style={styles.balanceRow}><Balance label="Disponível" value={member.saldoDisponivel} /><Balance label="Bloqueado" value={member.saldoBloqueado} /><Balance label="Bônus" value={member.saldoBonus} /></View></View>
        <View style={styles.moneyActions}>
          <Pressable onPress={() => { setAdjustMode("credit"); setAmount(""); setAdjusting(true); }} style={[styles.primary, styles.moneyButton]}><Feather color={colors.white} name="plus-circle" size={16} /><Text style={styles.primaryText}>Liberar valor</Text></Pressable>
          <Pressable onPress={() => { setAdjustMode("debit"); setAmount(""); setAdjusting(true); }} style={[styles.withdraw, styles.moneyButton]}><Feather color={colors.green700} name="arrow-up-right" size={16} /><Text style={styles.withdrawText}>Realizar saque</Text></Pressable>
        </View>

        <Text style={styles.sectionTitle}>Dados cadastrais</Text>
        <View style={styles.card}>
          <Info icon="credit-card" label="CPF" value={member.cpf || "Não informado"} />
          <Info icon="phone" label="Telefone" value={member.telefone || "Não informado"} />
          <Info icon="map-pin" label="Endereço" value={[member.endereco, member.cidade, member.estado, member.cep].filter(Boolean).join(" · ") || "Não informado"} />
          <Info icon="truck" label="Veículo" value={[member.modelo || member.tipoVeiculo, member.placa].filter(Boolean).join(" · ") || "Não informado"} />
          <Info icon="key" label="Chave PIX" value={member.chavePix || "Não informada"} last />
        </View>

        <Text style={styles.sectionTitle}>Programa de indicação</Text>
        {referrals ? (
          <>
            <View style={styles.referralHero}>
              <View style={styles.referralHeroTop}>
                <View style={styles.referralHeroIcon}><Feather color={colors.green400} name="gift" size={18} /></View>
                <View style={styles.referralHeroCopy}>
                  <Text style={styles.referralHeroLabel}>CÓDIGO DO ASSOCIADO</Text>
                  <Text style={styles.referralHeroCode}>{referrals.referralCode || "—"}</Text>
                </View>
              </View>
              <View style={styles.referralStats}>
                <ReferralStat label="Válidas" value={String(referrals.validCount)} />
                <ReferralStat label="Pendentes" value={String(referrals.pendingCount)} />
                <ReferralStat label="Bônus pago" value={money(referrals.bonusPaid)} />
              </View>
              <View style={styles.referralProgress}>
                <View style={styles.referralProgressHead}>
                  <Text style={styles.referralProgressLabel}>Progresso para R$ {REFERRAL_BONUS}</Text>
                  <Text style={styles.referralProgressValue}>{referrals.progressToNextBonus}/{REFERRALS_PER_BONUS}</Text>
                </View>
                <View style={styles.referralProgressTrack}>
                  {[0, 1, 2].map((slot) => (
                    <View key={slot} style={[styles.referralProgressDot, slot < referrals.progressToNextBonus && styles.referralProgressDotFilled]} />
                  ))}
                </View>
                <Text style={styles.referralProgressHint}>
                  {referrals.remainingForBonus === 0
                    ? "Próximo grupo completo — bônus liberado ao ativar mais indicações."
                    : `Faltam ${referrals.remainingForBonus} indicação${referrals.remainingForBonus === 1 ? "" : "ões"} ativa${referrals.remainingForBonus === 1 ? "" : "s"} para o bônus de ${money(REFERRAL_BONUS)}.`}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionSubtitle}>Foi indicado por alguém?</Text>
            <View style={styles.card}>
              {referrals.wasReferred && referrals.referredBy ? (
                <>
                  <Info icon="user-check" label="Indicado por" value={referrals.referredBy.nome} />
                  <Info icon="mail" label="E-mail do indicador" value={referrals.referredBy.email || "—"} />
                  <Info icon="tag" label="Código usado" value={referrals.referredBy.code || member.referredByCode || "—"} last />
                </>
              ) : (
                <Text style={styles.empty}>Este associado não utilizou código de indicação no cadastro.</Text>
              )}
            </View>

            <Text style={styles.sectionSubtitle}>Pessoas que indicou ({referrals.totalReferrals})</Text>
            <View style={styles.card}>
              {referrals.madeReferrals.length ? referrals.madeReferrals.map((person, index) => (
                <ReferredRow key={person.id} last={index === referrals.madeReferrals.length - 1} person={person} />
              )) : (
                <Text style={styles.empty}>Ainda não indicou ninguém.</Text>
              )}
            </View>
          </>
        ) : (
          <View style={styles.card}><Text style={styles.empty}>Carregando indicações…</Text></View>
        )}

        <Text style={styles.sectionTitle}>Histórico de saques</Text>
        <View style={styles.card}>{history.length ? history.map((item, index) => <View key={item.id} style={[styles.history, index < history.length - 1 && styles.withRule]}><View style={styles.historyIcon}><Feather color={colors.green700} name="arrow-up-right" size={15} /></View><View style={styles.historyCopy}><Text style={styles.historyValue}>{money(item.value)}</Text><Text style={styles.historyDate}>{item.date?.toLocaleString("pt-BR") ?? "Agora"}</Text></View><Text style={styles.historyStatus}>{item.status}</Text></View>) : <Text style={styles.empty}>Nenhuma movimentação registrada.</Text>}</View>

        <Text style={styles.sectionTitle}>Controle de acesso</Text>
        <View style={styles.actions}>
          <Pressable
            disabled={statusUpdating || member.status === "ativo"}
            onPress={() => void activateAccount()}
            style={({ pressed }) => [
              styles.action,
              styles.activate,
              (statusUpdating || member.status === "ativo") && styles.actionDisabled,
              pressed && !statusUpdating && member.status !== "ativo" && styles.pressed,
            ]}
          >
            {statusUpdating ? (
              <ActivityIndicator color={colors.green700} size="small" />
            ) : (
              <>
                <Feather color={colors.green700} name="check-circle" size={18} />
                <Text style={styles.activateText}>{member.status === "ativo" ? "Conta ativa" : "Ativar conta"}</Text>
              </>
            )}
          </Pressable>
          <Pressable
            disabled={statusUpdating}
            onPress={() => Alert.alert("Bloquear associado?", "O usuário não poderá acessar a conta.", [
              { text: "Cancelar", style: "cancel" },
              { text: "Bloquear", style: "destructive", onPress: () => void blockAccount() },
            ])}
            style={({ pressed }) => [styles.action, styles.block, statusUpdating && styles.actionDisabled, pressed && !statusUpdating && styles.pressed]}
          >
            <Feather color={colors.danger} name="slash" size={18} />
            <Text style={styles.blockText}>Bloquear</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={closeAdjust}
        presentationStyle="overFullScreen"
        statusBarTranslucent
        transparent
        visible={adjusting}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
          style={styles.modalRoot}
        >
          <Pressable accessibilityLabel="Fechar" onPress={closeAdjust} style={styles.modalBackdrop} />
          <View accessibilityViewIsModal style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderCopy}>
                <Text style={styles.sheetTitle}>{adjustMode === "credit" ? "Liberar saldo" : "Realizar saque"}</Text>
                <Text style={styles.sheetText}>
                  {adjustMode === "credit"
                    ? `O valor ficará disponível imediatamente para ${member.nome}.`
                    : `O valor será debitado do saldo disponível de ${member.nome}. Saldo atual: ${money(member.saldoDisponivel)}.`}
                </Text>
              </View>
              <Pressable accessibilityLabel="Fechar" disabled={savingBalance} onPress={closeAdjust} style={styles.sheetClose}>
                <Feather color={colors.inkSoft} name="x" size={18} />
              </Pressable>
            </View>
            <ScrollView bounces={false} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={styles.amountLabel}>Valor da operação</Text>
              <TextInput
                editable={!savingBalance}
                keyboardType="decimal-pad"
                onChangeText={(text) => setAmount(text.replace(/[^0-9,.]/g, ""))}
                placeholder="R$ 0,00"
                placeholderTextColor={colors.inkFaint}
                returnKeyType="done"
                style={styles.amount}
                value={amount}
              />
              <Pressable disabled={savingBalance} onPress={() => void addBalance()} style={styles.sheetPrimary}>
                {savingBalance ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.primaryText}>{adjustMode === "credit" ? "Confirmar liberação" : "Confirmar saque"}</Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function Balance({ label, value }: { label: string; value: number }) { return <View style={styles.balanceItem}><Text style={styles.balanceItemLabel}>{label}</Text><Text style={styles.balanceItemValue}>{money(value)}</Text></View>; }
function ReferralStat({ label, value }: { label: string; value: string }) { return <View style={styles.referralStat}><Text style={styles.referralStatLabel}>{label}</Text><Text style={styles.referralStatValue}>{value}</Text></View>; }
function Info({ icon, label, value, last = false }: { icon: keyof typeof Feather.glyphMap; label: string; value: string; last?: boolean }) { return <View style={[styles.info, !last && styles.withRule]}><View style={styles.infoIcon}><Feather color={colors.green700} name={icon} size={15} /></View><View style={styles.infoCopy}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View></View>; }

function ReferredRow({ person, last }: { person: AdminReferredPerson; last: boolean }) {
  const statusLabel = person.isValid ? "Válida" : "Pendente";
  const activityLabel = person.isDepositing
    ? `${person.depositosCount} dia${person.depositosCount === 1 ? "" : "s"} depositando`
    : person.isActive
      ? "Ativo · sem depósitos"
      : person.memberStatus.charAt(0).toUpperCase() + person.memberStatus.slice(1);
  return (
    <View style={[styles.referredRow, !last && styles.withRule]}>
      <View style={styles.referredIcon}><Feather color={person.isValid ? colors.green700 : colors.amber600} name={person.isValid ? "check-circle" : "clock"} size={15} /></View>
      <View style={styles.referredCopy}>
        <Text style={styles.referredName}>{person.nome}</Text>
        <Text style={styles.referredMeta}>{person.email}</Text>
        <Text style={styles.referredMeta}>{activityLabel}</Text>
      </View>
      <View style={[styles.referredBadge, person.isValid ? styles.referredBadgeValid : styles.referredBadgePending]}>
        <Text style={[styles.referredBadgeText, person.isValid ? styles.referredBadgeTextValid : styles.referredBadgeTextPending]}>{statusLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 }, loading: { alignItems: "center", flex: 1, justifyContent: "center" }, header: { alignItems: "center", flexDirection: "row", gap: 11, padding: 18 }, back: { alignItems: "center", backgroundColor: colors.surface, borderRadius: 13, height: 43, justifyContent: "center", width: 43 }, headerCopy: { flex: 1 }, eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 7, letterSpacing: 1.1 }, headerTitle: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 18, marginTop: 2 }, status: { borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6 }, statusActive: { backgroundColor: colors.green100 }, statusWarn: { backgroundColor: colors.amber100 }, statusText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 7, textTransform: "uppercase" }, content: { padding: 18, paddingBottom: 44, paddingTop: 0 }, hero: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 22, borderWidth: 1, flexDirection: "row", gap: 14, padding: 18, ...shadow }, avatar: { alignItems: "center", backgroundColor: colors.green900, borderRadius: 18, height: 58, justifyContent: "center", width: 58 }, avatarText: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 14 }, heroCopy: { flex: 1 }, name: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 16 }, email: { color: colors.inkSoft, fontFamily: fonts.medium, fontSize: 9, marginTop: 3 }, since: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 8, marginTop: 6 }, sectionTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13, marginBottom: 10, marginTop: 23 }, sectionSubtitle: { color: colors.inkSoft, fontFamily: fonts.bold, fontSize: 10, marginBottom: 8, marginTop: 14, textTransform: "uppercase" }, referralHero: { backgroundColor: colors.green950, borderRadius: 22, padding: 18 }, referralHeroTop: { alignItems: "center", flexDirection: "row", gap: 12 }, referralHeroIcon: { alignItems: "center", backgroundColor: "rgba(255,255,255,.08)", borderRadius: 14, height: 42, justifyContent: "center", width: 42 }, referralHeroCopy: { flex: 1 }, referralHeroLabel: { color: "rgba(255,255,255,.45)", fontFamily: fonts.bold, fontSize: 7, letterSpacing: 1 }, referralHeroCode: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 16, marginTop: 3 }, referralStats: { borderTopColor: "rgba(255,255,255,.1)", borderTopWidth: 1, flexDirection: "row", marginTop: 16, paddingTop: 14 }, referralStat: { flex: 1 }, referralStatLabel: { color: "rgba(255,255,255,.45)", fontFamily: fonts.medium, fontSize: 7 }, referralStatValue: { color: colors.white, fontFamily: fonts.bold, fontSize: 10, marginTop: 3 }, referralProgress: { marginTop: 16 }, referralProgressHead: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }, referralProgressLabel: { color: "rgba(255,255,255,.65)", fontFamily: fonts.medium, fontSize: 8 }, referralProgressValue: { color: colors.green400, fontFamily: fonts.bold, fontSize: 9 }, referralProgressTrack: { flexDirection: "row", gap: 8, marginTop: 10 }, referralProgressDot: { backgroundColor: "rgba(255,255,255,.12)", borderRadius: 6, flex: 1, height: 8 }, referralProgressDotFilled: { backgroundColor: colors.green400 }, referralProgressHint: { color: "rgba(255,255,255,.45)", fontFamily: fonts.regular, fontSize: 7.5, lineHeight: 12, marginTop: 8 }, referredRow: { alignItems: "center", flexDirection: "row", gap: 11, paddingVertical: 13 }, referredIcon: { alignItems: "center", backgroundColor: colors.green50, borderRadius: 9, height: 34, justifyContent: "center", width: 34 }, referredCopy: { flex: 1 }, referredName: { color: colors.ink, fontFamily: fonts.bold, fontSize: 10 }, referredMeta: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 7.5, marginTop: 2 }, referredBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5 }, referredBadgeValid: { backgroundColor: colors.green100 }, referredBadgePending: { backgroundColor: colors.amber100 }, referredBadgeText: { fontFamily: fonts.bold, fontSize: 7, textTransform: "uppercase" }, referredBadgeTextValid: { color: colors.green700 }, referredBadgeTextPending: { color: colors.amber600 }, balanceHero: { backgroundColor: colors.green950, borderRadius: 22, padding: 19 }, balanceLabel: { color: "rgba(255,255,255,.45)", fontFamily: fonts.bold, fontSize: 7, letterSpacing: 1 }, balanceValue: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 28, marginTop: 4 }, balanceRow: { borderTopColor: "rgba(255,255,255,.1)", borderTopWidth: 1, flexDirection: "row", marginTop: 16, paddingTop: 14 }, balanceItem: { flex: 1 }, balanceItemLabel: { color: "rgba(255,255,255,.45)", fontFamily: fonts.medium, fontSize: 7 }, balanceItemValue: { color: colors.white, fontFamily: fonts.bold, fontSize: 9, marginTop: 3 }, moneyActions: { flexDirection: "row", gap: 9 }, moneyButton: { flex: 1 }, primary: { alignItems: "center", backgroundColor: colors.green700, borderRadius: 13, flexDirection: "row", gap: 7, justifyContent: "center", marginTop: 10, minHeight: 48 }, primaryText: { color: colors.white, fontFamily: fonts.bold, fontSize: 10 }, withdraw: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 13, flexDirection: "row", gap: 7, justifyContent: "center", marginTop: 10, minHeight: 48 }, withdrawText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 10 }, card: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 19, borderWidth: 1, paddingHorizontal: 15, ...shadow }, info: { alignItems: "center", flexDirection: "row", gap: 11, paddingVertical: 13 }, withRule: { borderBottomColor: colors.line, borderBottomWidth: 1 }, infoIcon: { alignItems: "center", backgroundColor: colors.green50, borderRadius: 9, height: 34, justifyContent: "center", width: 34 }, infoCopy: { flex: 1 }, infoLabel: { color: colors.inkFaint, fontFamily: fonts.bold, fontSize: 7, textTransform: "uppercase" }, infoValue: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 9.5, marginTop: 2 }, history: { alignItems: "center", flexDirection: "row", paddingVertical: 13 }, historyIcon: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 9, height: 34, justifyContent: "center", width: 34 }, historyCopy: { flex: 1, marginLeft: 10 }, historyValue: { color: colors.ink, fontFamily: fonts.bold, fontSize: 10 }, historyDate: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 7.5, marginTop: 2 }, historyStatus: { color: colors.green700, fontFamily: fonts.bold, fontSize: 7, textTransform: "uppercase" }, empty: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 9, paddingVertical: 20, textAlign: "center" }, actions: { flexDirection: "row", gap: 9 }, action: { alignItems: "center", borderRadius: 14, flex: 1, flexDirection: "row", gap: 7, justifyContent: "center", minHeight: 48 }, activate: { backgroundColor: colors.green100 }, block: { backgroundColor: colors.brick100 }, actionDisabled: { opacity: 0.55 }, pressed: { opacity: 0.82 }, activateText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 9 }, blockText: { color: colors.danger, fontFamily: fonts.bold, fontSize: 9 }, modalRoot: { flex: 1, justifyContent: "flex-end" }, modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(8,42,31,.48)" }, sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "88%", paddingHorizontal: 22, paddingTop: 10, ...shadow }, sheetHeader: { alignItems: "flex-start", flexDirection: "row", gap: 12, marginBottom: 6 }, sheetHeaderCopy: { flex: 1 }, sheetClose: { alignItems: "center", backgroundColor: colors.background, borderRadius: 11, height: 38, justifyContent: "center", width: 38 }, amountLabel: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 10, marginBottom: 8, marginTop: 8 }, sheetPrimary: { alignItems: "center", backgroundColor: colors.green700, borderRadius: 13, justifyContent: "center", marginTop: 14, minHeight: 48 }, handle: { alignSelf: "center", backgroundColor: colors.line, borderRadius: 3, height: 4, marginBottom: 18, width: 40 }, sheetTitle: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 20 }, sheetText: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 10, lineHeight: 16, marginTop: 5 }, amount: { backgroundColor: colors.background, borderColor: colors.line, borderRadius: 15, borderWidth: 1, color: colors.ink, fontFamily: fonts.extraBold, fontSize: 22, height: 60, paddingHorizontal: 16 },
});
