import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { createDepositPayment, getDepositPayment, type DepositPayment } from "../lib/deposits";
import { auth } from "../lib/firebase";
import { colors, fonts, shadow } from "../theme";

export type TransactionFlow = "deposit" | "withdraw";
type Step = "amount" | "review" | "processing" | "pix" | "success";
type Props = { availableBalance: number; flow: TransactionFlow | null; onClose: () => void; pixKey: string; onCompleted?: () => Promise<void> | void };

const money = (value = 0) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const quickValues = [7, 35, 70, 150];

export function TransactionFlowModal({ availableBalance, flow, onClose, pixKey, onCompleted }: Props) {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<Step>("amount");
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<DepositPayment | null>(null);
  const [copied, setCopied] = useState(false);
  const isDeposit = flow === "deposit";
  const value = Number(amount.replace(",", "."));

  useEffect(() => {
    if (!flow) return;
    const timer = setTimeout(() => { setAmount(""); setStep("amount"); setError(""); setPayment(null); setCopied(false); }, 0);
    return () => clearTimeout(timer);
  }, [flow]);

  useEffect(() => {
    if (!flow || step !== "pix" || !payment?.id || payment.status !== "pending") return;
    let cancelled = false;
    const check = async () => {
      try {
        const next = await getDepositPayment(payment.id);
        if (cancelled) return;
        setPayment(next);
        if (next.status === "approved") { await onCompleted?.(); setStep("success"); }
        if (["expired", "rejected", "cancelled"].includes(next.status)) { setError("Este PIX expirou ou foi recusado. Gere uma nova cobrança."); setStep("amount"); }
      } catch { /* mantém o polling */ }
    };
    const timer = setInterval(() => void check(), 4000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [flow, step, payment?.id, payment?.status, onCompleted]);

  function validate() {
    setError("");
    if (!Number.isFinite(value) || value <= 0) return setError("Informe um valor maior que zero.");
    if (isDeposit && value > 5000) return setError("O depósito máximo por operação é R$ 5.000,00.");
    if (!isDeposit && value < 10) return setError("O saque mínimo é de R$ 10,00.");
    if (!isDeposit && value > availableBalance) return setError(`O valor máximo disponível é ${money(availableBalance)}.`);
    if (!isDeposit && !pixKey) return setError("Cadastre uma chave PIX no seu perfil antes de solicitar o saque.");
    setStep("review");
  }

  async function confirm() {
    setStep("processing"); setError("");
    try {
      if (isDeposit) {
        setPayment(await createDepositPayment(value));
        setStep("pix");
        return;
      }
      const user = auth.currentUser;
      if (!user) throw new Error("Faça login para continuar.");
      const api = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
      if (!api) throw new Error("Servidor não configurado.");
      const response = await fetch(`${api}/api/withdrawals`, {
        method: "POST",
        headers: { Authorization: `Bearer ${await user.getIdToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ value, pixKey }),
      });
      const data = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Não foi possível solicitar o saque.");
      await onCompleted?.(); setStep("success");
    } catch (err) { setError(err instanceof Error ? err.message : "Falha na operação."); setStep("review"); }
  }

  async function copyPix() {
    if (!payment?.qrCode) return;
    await Clipboard.setStringAsync(payment.qrCode); setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function checkNow() {
    if (!payment?.id) return;
    setStep("processing");
    try {
      const next = await getDepositPayment(payment.id); setPayment(next);
      if (next.status === "approved") { await onCompleted?.(); setStep("success"); }
      else { setError("Pagamento ainda não identificado. Aguarde alguns segundos."); setStep("pix"); }
    } catch (err) { setError(err instanceof Error ? err.message : "Falha ao consultar o PIX."); setStep("pix"); }
  }

  const close = () => { if (step !== "processing") onClose(); };
  const expires = payment?.expiresAt ? new Date(payment.expiresAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : null;

  return (
    <Modal animationType="fade" onRequestClose={close} presentationStyle="overFullScreen" statusBarTranslucent transparent visible={Boolean(flow)}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <Pressable accessibilityLabel="Fechar" onPress={close} style={styles.backdrop} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.headerIcon}><Feather color={colors.white} name={isDeposit ? "plus" : "arrow-down"} size={21} /></View>
            <View style={{ flex: 1 }}><Text style={styles.eyebrow}>{isDeposit ? "DEPÓSITO VIA PIX" : "RESGATE DA RESERVA"}</Text><Text style={styles.title}>{isDeposit ? "Adicionar saldo" : "Solicitar saque"}</Text></View>
            <Pressable accessibilityLabel="Fechar" onPress={close} style={styles.close}><Feather color={colors.inkSoft} name="x" size={19} /></Pressable>
          </View>

          <ScrollView bounces={false} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {step === "amount" ? <View>
              <Text style={styles.description}>{isDeposit ? "Escolha quanto deseja adicionar à sua reserva." : `Você tem ${money(availableBalance)} disponível para saque.`}</Text>
              <Text style={styles.label}>Valor da operação</Text>
              <View style={styles.amountField}><Text style={styles.currency}>R$</Text><TextInput autoFocus keyboardType="decimal-pad" onChangeText={(text) => setAmount(text.replace(/[^0-9,.]/g, ""))} placeholder="0,00" placeholderTextColor={colors.inkFaint} style={styles.amountInput} value={amount} /></View>
              {isDeposit ? <View style={styles.quickRow}>{quickValues.map((item) => <Pressable key={item} onPress={() => setAmount(String(item))} style={[styles.quickChip, value === item && styles.quickActive]}><Text style={[styles.quickText, value === item && { color: colors.white }]}>{money(item).replace(",00", "")}</Text></Pressable>)}</View> : null}
              {error ? <ErrorMessage text={error} /> : null}<PrimaryButton label="Continuar" onPress={validate} />
            </View> : null}

            {step === "review" ? <View>
              <Text style={styles.description}>{isDeposit ? "O Mercado Pago gerará um QR Code PIX para este depósito." : "Confira o valor e a chave PIX antes de solicitar."}</Text>
              <View style={styles.summary}><Summary label="Operação" value={isDeposit ? "Depósito PIX" : "Saque via PIX"} /><View style={styles.rule} /><Summary label="Valor" value={money(value)} strong /><View style={styles.rule} /><Summary label={isDeposit ? "Crédito" : "Chave PIX"} value={isDeposit ? "Após confirmação" : pixKey} /><View style={styles.rule} /><Summary label="Taxa ECOMOPAR" value={money(0)} /></View>
              {error ? <ErrorMessage text={error} /> : null}<PrimaryButton label={isDeposit ? "Gerar PIX" : "Confirmar solicitação"} onPress={() => void confirm()} /><Pressable onPress={() => setStep("amount")} style={styles.backAction}><Text style={styles.backText}>Voltar e editar</Text></Pressable>
            </View> : null}

            {step === "pix" && payment ? <View>
              <Text style={styles.amountTitle}>{money(payment.amount)}</Text>
              {payment.simulated ? <View style={styles.testNotice}><Feather color={colors.amber600} name="zap" size={16} /><Text style={styles.testNoticeText}>Ambiente de teste: não use o app do seu banco. Este PIX é fictício e será aprovado automaticamente em alguns segundos.</Text></View> : null}
              {!payment.simulated && payment.qrCodeBase64 ? <View style={styles.qrWrap}><Image accessibilityLabel="QR Code PIX" source={{ uri: `data:image/png;base64,${payment.qrCodeBase64}` }} style={styles.qr} /></View> : null}
              {!payment.simulated ? <View><Text style={styles.label}>PIX copia e cola</Text><Text numberOfLines={3} selectable style={styles.pixCode}>{payment.qrCode}</Text>
              <Pressable onPress={() => void copyPix()} style={styles.copyButton}><Feather color={colors.green700} name={copied ? "check" : "copy"} size={16} /><Text style={styles.copyText}>{copied ? "Código copiado" : "Copiar código PIX"}</Text></Pressable></View> : null}
              {expires && !payment.simulated ? <Text style={styles.expires}>Válido até {expires}</Text> : null}{error ? <ErrorMessage text={error} /> : null}<PrimaryButton label={payment.simulated ? "Verificar aprovação" : "Já paguei, verificar"} onPress={() => void checkNow()} />
            </View> : null}

            {step === "processing" ? <View style={styles.center}><ActivityIndicator color={colors.green600} size="large" /><Text style={styles.stateTitle}>Consultando pagamento</Text><Text style={styles.stateText}>A confirmação pode levar alguns segundos.</Text></View> : null}
            {step === "success" ? <View style={styles.center}><View style={styles.success}><Feather color={colors.white} name="check" size={30} /></View><Text style={styles.stateTitle}>{isDeposit ? "Depósito confirmado" : "Saque solicitado"}</Text><Text style={styles.amountTitle}>{money(value)}</Text><Text style={styles.stateText}>{isDeposit ? "O valor já foi adicionado à sua reserva." : "Acompanhe a solicitação pelo seu extrato."}</Text><PrimaryButton label="Concluir" onPress={close} /></View> : null}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) { return <Pressable onPress={onPress} style={styles.primary}><Text style={styles.primaryText}>{label}</Text><Feather color={colors.white} name="arrow-right" size={17} /></Pressable>; }
function Summary({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <View style={styles.summaryRow}><Text style={styles.summaryLabel}>{label}</Text><Text numberOfLines={1} style={[styles.summaryValue, strong && styles.summaryStrong]}>{value}</Text></View>; }
function ErrorMessage({ text }: { text: string }) { return <View style={styles.error}><Feather color={colors.danger} name="alert-circle" size={15} /><Text style={styles.errorText}>{text}</Text></View>; }

const styles = StyleSheet.create({
  keyboard: { flex: 1, justifyContent: "flex-end" }, backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(4,24,17,.64)" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "92%", paddingBottom: 28, paddingHorizontal: 22, paddingTop: 10, ...shadow },
  handle: { alignSelf: "center", backgroundColor: colors.line, borderRadius: 2, height: 4, marginBottom: 16, width: 38 }, header: { alignItems: "center", flexDirection: "row", gap: 12, marginBottom: 5 },
  headerIcon: { alignItems: "center", backgroundColor: colors.green600, borderRadius: 14, height: 46, justifyContent: "center", width: 46 }, eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1.1 }, title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 20 }, close: { padding: 9 },
  description: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, marginBottom: 18, marginTop: 14 }, label: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 11, marginBottom: 7 },
  amountField: { alignItems: "center", backgroundColor: colors.background, borderColor: colors.line, borderRadius: 17, borderWidth: 1, flexDirection: "row", height: 68, paddingHorizontal: 17 }, currency: { color: colors.green700, fontFamily: fonts.bold, fontSize: 16, marginRight: 8 }, amountInput: { color: colors.ink, flex: 1, fontFamily: fonts.extraBold, fontSize: 29 },
  quickRow: { flexDirection: "row", gap: 7, marginTop: 10 }, quickChip: { alignItems: "center", backgroundColor: colors.green50, borderRadius: 10, flex: 1, paddingVertical: 9 }, quickActive: { backgroundColor: colors.green700 }, quickText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 9 },
  primary: { alignItems: "center", backgroundColor: colors.green600, borderRadius: 15, flexDirection: "row", gap: 9, height: 53, justifyContent: "center", marginTop: 17 }, primaryText: { color: colors.white, fontFamily: fonts.bold, fontSize: 13 },
  summary: { backgroundColor: colors.background, borderRadius: 15, padding: 14 }, summaryRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }, summaryLabel: { color: colors.inkFaint, fontFamily: fonts.medium, fontSize: 10 }, summaryValue: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 11, maxWidth: "64%" }, summaryStrong: { color: colors.green700, fontFamily: fonts.extraBold, fontSize: 15 }, rule: { backgroundColor: colors.line, height: 1, marginVertical: 10 },
  backAction: { alignItems: "center", paddingTop: 14 }, backText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 10 }, error: { alignItems: "center", backgroundColor: colors.brick100, borderRadius: 11, flexDirection: "row", gap: 8, marginTop: 11, padding: 10 }, errorText: { color: colors.danger, flex: 1, fontFamily: fonts.semibold, fontSize: 10 },
  testNotice: { alignItems: "center", backgroundColor: colors.amber100, borderRadius: 12, flexDirection: "row", gap: 8, marginBottom: 12, padding: 11 }, testNoticeText: { color: colors.amber600, flex: 1, fontFamily: fonts.semibold, fontSize: 10, lineHeight: 15 },
  amountTitle: { color: colors.green800, fontFamily: fonts.extraBold, fontSize: 30, marginBottom: 12, marginTop: 10, textAlign: "center" }, qrWrap: { alignItems: "center", alignSelf: "center", backgroundColor: colors.white, borderColor: colors.line, borderRadius: 18, borderWidth: 1, marginBottom: 14, padding: 12 }, qr: { height: 210, width: 210 }, pixCode: { backgroundColor: colors.green50, borderRadius: 12, color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 10, lineHeight: 15, padding: 12 }, copyButton: { alignItems: "center", borderColor: colors.green100, borderRadius: 13, borderWidth: 1, flexDirection: "row", gap: 8, justifyContent: "center", marginTop: 10, padding: 12 }, copyText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 12 }, expires: { color: colors.inkFaint, fontFamily: fonts.medium, fontSize: 10, marginTop: 8, textAlign: "center" },
  center: { alignItems: "center", minHeight: 315, paddingTop: 48 }, success: { alignItems: "center", backgroundColor: colors.green500, borderRadius: 30, height: 60, justifyContent: "center", width: 60 }, stateTitle: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 19, marginTop: 16 }, stateText: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 11, lineHeight: 17, marginTop: 7, textAlign: "center" },
});
