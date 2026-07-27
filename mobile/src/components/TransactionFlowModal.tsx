import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, fonts, shadow } from "../theme";

export type TransactionFlow = "deposit" | "withdraw";

type Props = {
  availableBalance: number;
  flow: TransactionFlow | null;
  onClose: () => void;
  pixKey: string;
};

const money = (value = 0) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const quickValues = [7, 35, 70, 150];

export function TransactionFlowModal({ availableBalance, flow, onClose, pixKey }: Props) {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"amount" | "review" | "processing" | "success">("amount");
  const [error, setError] = useState("");
  const isDeposit = flow === "deposit";
  const numericAmount = Number(amount.replace(",", "."));

  useEffect(() => {
    if (!flow) return;
    setAmount("");
    setStep("amount");
    setError("");
  }, [flow]);

  function close() {
    if (step === "processing") return;
    onClose();
  }

  function continueFlow() {
    setError("");
    if (!numericAmount || numericAmount <= 0) {
      setError("Informe um valor maior que zero.");
      return;
    }
    if (!isDeposit && numericAmount > availableBalance) {
      setError(`O valor máximo disponível é ${money(availableBalance)}.`);
      return;
    }
    if (!isDeposit && !pixKey) {
      setError("Cadastre uma chave PIX no seu perfil antes de solicitar o saque.");
      return;
    }
    setStep("review");
  }

  function simulateGateway() {
    setStep("processing");
    setTimeout(() => setStep("success"), 900);
  }

  return (
    <Modal animationType="fade" onRequestClose={close} presentationStyle="overFullScreen" statusBarTranslucent transparent visible={Boolean(flow)}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <Pressable accessibilityLabel="Fechar modal" onPress={close} style={styles.backdrop} />
        <View accessibilityViewIsModal style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={[styles.headerIcon, !isDeposit && styles.headerIconWithdraw]}>
              <Feather color={colors.white} name={isDeposit ? "plus" : "arrow-down"} size={21} />
            </View>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>{isDeposit ? "DEPÓSITO VIA PIX" : "RESGATE DA RESERVA"}</Text>
              <Text style={styles.title}>{isDeposit ? "Adicionar saldo" : "Solicitar saque"}</Text>
            </View>
            <Pressable accessibilityLabel="Fechar" disabled={step === "processing"} hitSlop={8} onPress={close} style={styles.close}>
              <Feather color={colors.inkSoft} name="x" size={19} />
            </Pressable>
          </View>

          <ScrollView bounces={false} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {step === "amount" && (
              <View>
                <Text style={styles.description}>
                  {isDeposit ? "Escolha quanto deseja adicionar à sua reserva." : `Você tem ${money(availableBalance)} disponível para saque.`}
                </Text>
                <Text style={styles.label}>Valor da operação</Text>
                <View style={styles.amountField}>
                  <Text style={styles.currency}>R$</Text>
                  <TextInput
                    autoFocus
                    keyboardType="decimal-pad"
                    onChangeText={(value) => setAmount(value.replace(/[^0-9,.]/g, ""))}
                    placeholder="0,00"
                    placeholderTextColor={colors.inkFaint}
                    style={styles.amountInput}
                    value={amount}
                  />
                </View>
                {isDeposit && (
                  <View style={styles.quickRow}>
                    {quickValues.map((value) => (
                      <Pressable key={value} onPress={() => setAmount(String(value))} style={({ pressed }) => [styles.quickChip, numericAmount === value && styles.quickChipActive, pressed && styles.pressed]}>
                        <Text style={[styles.quickText, numericAmount === value && styles.quickTextActive]}>{money(value).replace(",00", "")}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
                {!isDeposit && pixKey ? (
                  <View style={styles.destination}>
                    <View style={styles.destinationIcon}><Feather color={colors.green700} name="send" size={15} /></View>
                    <View style={styles.destinationCopy}><Text style={styles.destinationLabel}>DESTINO DO SAQUE</Text><Text numberOfLines={1} style={styles.destinationValue}>{pixKey}</Text></View>
                    <Feather color={colors.green500} name="check-circle" size={16} />
                  </View>
                ) : null}
                {error ? <ErrorMessage text={error} /> : null}
                <PrimaryButton label="Continuar" onPress={continueFlow} />
              </View>
            )}

            {step === "review" && (
              <View>
                {isDeposit ? (
                  <>
                    <Text style={styles.description}>Use o código abaixo no aplicativo do seu banco. Nesta versão, o pagamento é apenas uma simulação.</Text>
                    <View style={styles.qrMock}>
                      <View style={styles.qrCorners}><Feather color={colors.green900} name="grid" size={76} /></View>
                      <View style={styles.mockBadge}><Text style={styles.mockBadgeText}>PIX MOCK</Text></View>
                    </View>
                    <View style={styles.pixCode}><Text numberOfLines={1} style={styles.pixCodeText}>00020126...ECOMOPAR...{numericAmount.toFixed(2)}</Text><Feather color={colors.green700} name="copy" size={16} /></View>
                  </>
                ) : (
                  <Text style={styles.description}>Confira os dados antes de enviar sua solicitação de saque.</Text>
                )}
                <View style={styles.summary}>
                  <Summary label="Operação" value={isDeposit ? "Depósito PIX" : "Saque via PIX"} />
                  <View style={styles.rule} />
                  <Summary label="Valor" value={money(numericAmount)} strong />
                  <View style={styles.rule} />
                  <Summary label={isDeposit ? "Disponibilidade" : "Chave PIX"} value={isDeposit ? "Após confirmação" : pixKey} />
                  <View style={styles.rule} />
                  <Summary label="Taxa" value={money(0)} />
                </View>
                <View style={styles.mockNotice}><Feather color={colors.amber600} name="info" size={15} /><Text style={styles.mockNoticeText}>Demonstração: nenhuma transação financeira será realizada.</Text></View>
                <PrimaryButton label={isDeposit ? "Simular pagamento" : "Confirmar solicitação"} onPress={simulateGateway} />
                <Pressable onPress={() => setStep("amount")} style={styles.backAction}><Text style={styles.backActionText}>Voltar e editar</Text></Pressable>
              </View>
            )}

            {step === "processing" && (
              <View style={styles.centerState}>
                <ActivityIndicator color={colors.green600} size="large" />
                <Text style={styles.stateTitle}>Processando simulação</Text>
                <Text style={styles.stateText}>Preparando o retorno que futuramente virá do gateway.</Text>
              </View>
            )}

            {step === "success" && (
              <View style={styles.centerState}>
                <View style={styles.successIcon}><Feather color={colors.white} name="check" size={30} /></View>
                <Text style={styles.stateTitle}>{isDeposit ? "Pagamento simulado" : "Saque solicitado"}</Text>
                <Text style={styles.successAmount}>{money(numericAmount)}</Text>
                <Text style={styles.stateText}>{isDeposit ? "O fluxo PIX está pronto para receber a integração real." : "A solicitação mockada foi concluída e não alterou seu saldo."}</Text>
                <PrimaryButton label="Concluir" onPress={close} />
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><Text style={styles.primaryButtonText}>{label}</Text><Feather color={colors.white} name="arrow-right" size={17} /></Pressable>;
}

function Summary({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <View style={styles.summaryRow}><Text style={styles.summaryLabel}>{label}</Text><Text numberOfLines={1} style={[styles.summaryValue, strong && styles.summaryStrong]}>{value}</Text></View>;
}

function ErrorMessage({ text }: { text: string }) {
  return <View style={styles.error}><Feather color={colors.danger} name="alert-circle" size={15} /><Text style={styles.errorText}>{text}</Text></View>;
}

const styles = StyleSheet.create({
  keyboard: { flex: 1, justifyContent: "flex-end" },
  backdrop: { backgroundColor: "rgba(4,24,17,0.64)", ...StyleSheet.absoluteFillObject },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "92%", paddingBottom: Platform.OS === "ios" ? 34 : 24, paddingHorizontal: 22, paddingTop: 10, ...shadow },
  handle: { alignSelf: "center", backgroundColor: colors.line, borderRadius: 2, height: 4, marginBottom: 16, width: 38 },
  header: { alignItems: "center", flexDirection: "row", marginBottom: 4 },
  headerIcon: { alignItems: "center", backgroundColor: colors.green600, borderRadius: 14, height: 46, justifyContent: "center", width: 46 },
  headerIconWithdraw: { backgroundColor: colors.green900 },
  headerCopy: { flex: 1, marginLeft: 12 },
  eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1.1 },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 20, letterSpacing: -0.6, marginTop: 2 },
  close: { alignItems: "center", backgroundColor: colors.background, borderRadius: 11, height: 38, justifyContent: "center", width: 38 },
  description: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 10, lineHeight: 16, marginBottom: 18, marginTop: 14 },
  label: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 10, marginBottom: 7 },
  amountField: { alignItems: "center", backgroundColor: colors.background, borderColor: colors.line, borderRadius: 17, borderWidth: 1, flexDirection: "row", height: 68, paddingHorizontal: 17 },
  currency: { color: colors.green700, fontFamily: fonts.bold, fontSize: 16, marginRight: 8 },
  amountInput: { color: colors.ink, flex: 1, fontFamily: fonts.extraBold, fontSize: 29, letterSpacing: -0.8 },
  quickRow: { flexDirection: "row", gap: 7, marginTop: 10 },
  quickChip: { alignItems: "center", backgroundColor: colors.green50, borderColor: colors.green100, borderRadius: 11, borderWidth: 1, flex: 1, paddingVertical: 9 },
  quickChipActive: { backgroundColor: colors.green700, borderColor: colors.green700 },
  quickText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 9 },
  quickTextActive: { color: colors.white },
  destination: { alignItems: "center", backgroundColor: colors.green50, borderRadius: 14, flexDirection: "row", gap: 10, marginTop: 11, padding: 12 },
  destinationIcon: { alignItems: "center", backgroundColor: colors.surface, borderRadius: 9, height: 34, justifyContent: "center", width: 34 },
  destinationCopy: { flex: 1 },
  destinationLabel: { color: colors.green600, fontFamily: fonts.bold, fontSize: 7, letterSpacing: 0.8 },
  destinationValue: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 10, marginTop: 2 },
  error: { alignItems: "center", backgroundColor: colors.brick100, borderRadius: 11, flexDirection: "row", gap: 8, marginTop: 11, padding: 10 },
  errorText: { color: colors.danger, flex: 1, fontFamily: fonts.semibold, fontSize: 9 },
  primaryButton: { alignItems: "center", backgroundColor: colors.green600, borderRadius: 15, flexDirection: "row", gap: 9, height: 53, justifyContent: "center", marginTop: 17 },
  primaryButtonText: { color: colors.white, fontFamily: fonts.bold, fontSize: 13 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.985 }] },
  qrMock: { alignItems: "center", alignSelf: "center", backgroundColor: colors.green50, borderColor: colors.green100, borderRadius: 20, borderWidth: 1, height: 152, justifyContent: "center", marginBottom: 12, width: 152 },
  qrCorners: { opacity: 0.82 },
  mockBadge: { backgroundColor: colors.green900, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, position: "absolute" },
  mockBadgeText: { color: colors.white, fontFamily: fonts.bold, fontSize: 7, letterSpacing: 0.8 },
  pixCode: { alignItems: "center", backgroundColor: colors.background, borderRadius: 12, flexDirection: "row", gap: 9, marginBottom: 12, padding: 12 },
  pixCodeText: { color: colors.inkSoft, flex: 1, fontFamily: fonts.medium, fontSize: 9 },
  summary: { backgroundColor: colors.background, borderRadius: 15, padding: 14 },
  summaryRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { color: colors.inkFaint, fontFamily: fonts.medium, fontSize: 9 },
  summaryValue: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 10, marginLeft: 16, maxWidth: "62%" },
  summaryStrong: { color: colors.green700, fontFamily: fonts.extraBold, fontSize: 14 },
  rule: { backgroundColor: colors.line, height: 1, marginVertical: 10 },
  mockNotice: { alignItems: "center", backgroundColor: colors.amber100, borderRadius: 11, flexDirection: "row", gap: 8, marginTop: 12, padding: 10 },
  mockNoticeText: { color: colors.amber600, flex: 1, fontFamily: fonts.semibold, fontSize: 8.5, lineHeight: 13 },
  backAction: { alignItems: "center", paddingTop: 14 },
  backActionText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 10 },
  centerState: { alignItems: "center", minHeight: 330, paddingTop: 50 },
  successIcon: { alignItems: "center", backgroundColor: colors.green500, borderRadius: 29, height: 58, justifyContent: "center", width: 58 },
  stateTitle: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 18, letterSpacing: -0.5, marginTop: 17 },
  successAmount: { color: colors.green700, fontFamily: fonts.extraBold, fontSize: 27, letterSpacing: -0.8, marginTop: 5 },
  stateText: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 10, lineHeight: 16, marginTop: 7, maxWidth: 270, textAlign: "center" },
});
