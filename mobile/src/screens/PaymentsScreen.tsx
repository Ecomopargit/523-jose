import { Feather } from "@expo/vector-icons";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import * as Clipboard from "expo-clipboard";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import { IconBadge, ScreenAtmosphere, ScreenHeader } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import {
  createDepositPayment,
  getDepositPayment,
  listMyDepositPayments,
  type DepositPayment,
} from "../lib/deposits";
import { colors, fonts, shadow } from "../theme";
import type { AppTabParamList } from "../types";

type Props = BottomTabScreenProps<AppTabParamList, "Pagamentos">;
type Step = "form" | "pix" | "success";

const money = (value = 0) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const quickValues = [7, 35, 70, 150];

const statusLabel: Record<DepositPayment["status"], string> = {
  pending: "Aguardando PIX",
  approved: "Confirmado",
  rejected: "Recusado",
  cancelled: "Cancelado",
  expired: "Expirado",
};

export function PaymentsScreen({ navigation }: Props) {
  const { member, refresh } = useAuth();
  const [amount, setAmount] = useState("7");
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [payment, setPayment] = useState<DepositPayment | null>(null);
  const [history, setHistory] = useState<DepositPayment[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const value = Number(amount.replace(",", "."));
  const isActive = member?.status === "ativo";

  const loadHistory = useCallback(async () => {
    try {
      setHistory(await listMyDepositPayments());
    } catch {
      setHistory([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadHistory();
    }, [loadHistory]),
  );

  useEffect(() => {
    if (step !== "pix" || !payment?.id || payment.status !== "pending") return;
    let cancelled = false;
    const timer = setInterval(() => {
      void (async () => {
        try {
          const next = await getDepositPayment(payment.id);
          if (cancelled) return;
          setPayment(next);
          if (next.status === "approved") {
            await refresh();
            await loadHistory();
            setStep("success");
          }
          if (["expired", "rejected", "cancelled"].includes(next.status)) {
            setError("Este PIX expirou ou foi recusado. Gere uma nova cobrança.");
            setStep("form");
            setPayment(null);
          }
        } catch {
          /* mantém polling */
        }
      })();
    }, 4000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [step, payment?.id, payment?.status, refresh, loadHistory]);

  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([refresh(), loadHistory()]);
    setRefreshing(false);
  }

  async function generatePix() {
    setError("");
    if (!isActive) {
      setError("Ative seu cadastro antes de fazer depósitos.");
      return;
    }
    if (!Number.isFinite(value) || value < 1) {
      setError("Informe um valor de no mínimo R$ 1,00.");
      return;
    }
    if (value > 5000) {
      setError("O depósito máximo por operação é R$ 5.000,00.");
      return;
    }
    setLoading(true);
    try {
      const created = await createDepositPayment(value);
      setPayment(created);
      setStep("pix");
      void loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível gerar o PIX.");
    } finally {
      setLoading(false);
    }
  }

  async function copyPix() {
    if (!payment?.qrCode) return;
    await Clipboard.setStringAsync(payment.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function checkNow() {
    if (!payment?.id) return;
    setLoading(true);
    setError("");
    try {
      const next = await getDepositPayment(payment.id);
      setPayment(next);
      if (next.status === "approved") {
        await refresh();
        await loadHistory();
        setStep("success");
      } else {
        setError("Pagamento ainda não identificado. Aguarde alguns segundos.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao consultar o PIX.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setStep("form");
    setPayment(null);
    setError("");
    setCopied(false);
  }

  const expires = payment?.expiresAt
    ? new Date(payment.expiresAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <StatusBar style="dark" />
      <ScreenAtmosphere />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl colors={[colors.green600]} onRefresh={() => void onRefresh()} refreshing={refreshing} tintColor={colors.green600} />
        }
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader eyebrow="PIX da reserva" title="Pagamentos" />

        {!isActive ? (
          <Pressable
            onPress={() => navigation.navigate("Início")}
            style={({ pressed }) => [styles.warningCard, pressed && styles.pressed]}
          >
            <IconBadge name="alert-circle" tone="amber" />
            <View style={{ flex: 1 }}>
              <Text style={styles.warningTitle}>Cadastro ainda não ativo</Text>
              <Text style={styles.warningText}>Ative sua conta pelo PIX de R$ 7 na tela inicial para liberar depósitos.</Text>
            </View>
            <Feather color={colors.green700} name="chevron-right" size={18} />
          </Pressable>
        ) : null}

        <View style={styles.card}>
          {step === "form" ? (
            <>
              <Text style={styles.cardEyebrow}>NOVO DEPÓSITO</Text>
              <Text style={styles.cardTitle}>Escolha o valor do PIX</Text>
              <Text style={styles.cardHint}>Gere o QR Code ou o código copia e cola para pagar no app do seu banco.</Text>

              <Text style={styles.label}>Valor</Text>
              <View style={styles.amountField}>
                <Text style={styles.currency}>R$</Text>
                <TextInput
                  keyboardType="decimal-pad"
                  onChangeText={(text) => setAmount(text.replace(/[^0-9,.]/g, ""))}
                  placeholder="0,00"
                  placeholderTextColor={colors.inkFaint}
                  style={styles.amountInput}
                  value={amount}
                />
              </View>

              <View style={styles.quickRow}>
                {quickValues.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => setAmount(String(item))}
                    style={[styles.quickChip, value === item && styles.quickActive]}
                  >
                    <Text style={[styles.quickText, value === item && styles.quickTextActive]}>
                      {money(item).replace(",00", "")}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {error ? (
                <View style={styles.error}>
                  <Feather color={colors.danger} name="alert-circle" size={15} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                disabled={loading || !isActive}
                onPress={() => void generatePix()}
                style={({ pressed }) => [
                  styles.primary,
                  (!isActive || loading) && styles.primaryDisabled,
                  pressed && styles.pressed,
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <Text style={styles.primaryText}>Gerar PIX</Text>
                    <Feather color={colors.white} name="arrow-right" size={17} />
                  </>
                )}
              </Pressable>
            </>
          ) : null}

          {step === "pix" && payment ? (
            <>
              <Text style={styles.cardEyebrow}>PIX GERADO</Text>
              <Text style={styles.pixAmount}>{money(payment.amount)}</Text>
              <Text style={styles.cardHint}>Pague com QR Code ou copie o código abaixo.</Text>

              {payment.qrCodeBase64 ? (
                <View style={styles.qrWrap}>
                  <Image
                    accessibilityLabel="QR Code PIX"
                    source={{ uri: `data:image/png;base64,${payment.qrCodeBase64}` }}
                    style={styles.qr}
                  />
                </View>
              ) : null}

              <Text style={styles.label}>PIX copia e cola</Text>
              <Text numberOfLines={4} selectable style={styles.pixCode}>
                {payment.qrCode || "Código indisponível"}
              </Text>
              <Pressable onPress={() => void copyPix()} style={({ pressed }) => [styles.copyButton, pressed && styles.pressed]}>
                <Feather color={colors.green700} name={copied ? "check" : "copy"} size={16} />
                <Text style={styles.copyText}>{copied ? "Código copiado" : "Copiar código PIX"}</Text>
              </Pressable>

              {expires ? <Text style={styles.expires}>Válido até {expires}</Text> : null}

              {error ? (
                <View style={styles.error}>
                  <Feather color={colors.danger} name="alert-circle" size={15} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                disabled={loading}
                onPress={() => void checkNow()}
                style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <Text style={styles.primaryText}>Já paguei, verificar</Text>
                    <Feather color={colors.white} name="refresh-cw" size={16} />
                  </>
                )}
              </Pressable>
              <Pressable onPress={resetForm} style={styles.secondary}>
                <Text style={styles.secondaryText}>Gerar outro valor</Text>
              </Pressable>
            </>
          ) : null}

          {step === "success" ? (
            <View style={styles.successBox}>
              <View style={styles.successIcon}>
                <Feather color={colors.white} name="check" size={28} />
              </View>
              <Text style={styles.successTitle}>Depósito confirmado</Text>
              <Text style={styles.pixAmount}>{money(payment?.amount || value)}</Text>
              <Text style={styles.cardHint}>O valor já entrou na sua reserva ECOMOPAR.</Text>
              <Pressable onPress={resetForm} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
                <Text style={styles.primaryText}>Fazer novo pagamento</Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.section}>Suas transferências</Text>
            <Text style={styles.sectionHint}>Depósitos PIX realizados nesta conta</Text>
          </View>
        </View>

        <View style={styles.historyCard}>
          {history.length ? (
            history.map((item, index) => (
              <View key={item.id}>
                {index > 0 ? <View style={styles.rule} /> : null}
                <View style={styles.historyRow}>
                  <IconBadge
                    name={item.status === "approved" ? "check-circle" : item.status === "pending" ? "clock" : "x-circle"}
                    tone={item.status === "approved" ? "green" : item.status === "pending" ? "amber" : "brick"}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyTitle}>Depósito PIX</Text>
                    <Text style={styles.historyMeta}>
                      {statusLabel[item.status]}
                      {item.createdAt
                        ? ` · ${new Date(item.createdAt).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : ""}
                    </Text>
                  </View>
                  <Text style={styles.historyValue}>{money(item.amount)}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Feather color={colors.green700} name="inbox" size={22} />
              </View>
              <Text style={styles.emptyTitle}>Nenhuma transferência ainda</Text>
              <Text style={styles.emptyText}>Quando você gerar e pagar um PIX, ele aparece aqui.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 20, paddingBottom: 120 },
  pressed: { opacity: 0.82 },
  warningCard: {
    alignItems: "center",
    backgroundColor: colors.amber100,
    borderRadius: 18,
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
    padding: 14,
  },
  warningTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13 },
  warningText: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 11, lineHeight: 16, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    ...shadow,
  },
  cardEyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.2 },
  cardTitle: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 22, letterSpacing: -0.5, marginTop: 6 },
  cardHint: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, marginTop: 6 },
  label: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 12, marginBottom: 8, marginTop: 18 },
  amountField: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    height: 64,
    paddingHorizontal: 16,
  },
  currency: { color: colors.green700, fontFamily: fonts.bold, fontSize: 16, marginRight: 8 },
  amountInput: { color: colors.ink, flex: 1, fontFamily: fonts.extraBold, fontSize: 28 },
  quickRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  quickChip: {
    alignItems: "center",
    backgroundColor: colors.green50,
    borderRadius: 12,
    flex: 1,
    paddingVertical: 10,
  },
  quickActive: { backgroundColor: colors.green700 },
  quickText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 11 },
  quickTextActive: { color: colors.white },
  primary: {
    alignItems: "center",
    backgroundColor: colors.green600,
    borderRadius: 15,
    flexDirection: "row",
    gap: 8,
    height: 52,
    justifyContent: "center",
    marginTop: 18,
  },
  primaryDisabled: { opacity: 0.45 },
  primaryText: { color: colors.white, fontFamily: fonts.bold, fontSize: 14 },
  secondary: { alignItems: "center", paddingTop: 14 },
  secondaryText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 12 },
  error: {
    alignItems: "center",
    backgroundColor: colors.brick100,
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    padding: 11,
  },
  errorText: { color: colors.danger, flex: 1, fontFamily: fonts.semibold, fontSize: 11 },
  pixAmount: {
    color: colors.green800,
    fontFamily: fonts.extraBold,
    fontSize: 30,
    marginTop: 8,
    textAlign: "center",
  },
  qrWrap: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 16,
    padding: 12,
  },
  qr: { height: 210, width: 210 },
  pixCode: {
    backgroundColor: colors.green50,
    borderRadius: 12,
    color: colors.inkSoft,
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 16,
    padding: 12,
  },
  copyButton: {
    alignItems: "center",
    borderColor: colors.green100,
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 10,
    padding: 12,
  },
  copyText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 13 },
  expires: { color: colors.inkFaint, fontFamily: fonts.medium, fontSize: 11, marginTop: 10, textAlign: "center" },
  successBox: { alignItems: "center", paddingVertical: 12 },
  successIcon: {
    alignItems: "center",
    backgroundColor: colors.green500,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  successTitle: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 20, marginTop: 14 },
  sectionHeading: { marginBottom: 12, marginTop: 26 },
  section: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 17 },
  sectionHint: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 12, marginTop: 2 },
  historyCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 6,
    ...shadow,
  },
  historyRow: { alignItems: "center", flexDirection: "row", gap: 12, paddingVertical: 14 },
  historyTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13 },
  historyMeta: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 11, marginTop: 2 },
  historyValue: { color: colors.green700, fontFamily: fonts.extraBold, fontSize: 13 },
  rule: { backgroundColor: colors.line, height: StyleSheet.hairlineWidth },
  empty: { alignItems: "center", paddingHorizontal: 18, paddingVertical: 28 },
  emptyIcon: {
    alignItems: "center",
    backgroundColor: colors.green50,
    borderRadius: 16,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  emptyTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 14, marginTop: 12 },
  emptyText: {
    color: colors.inkSoft,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    textAlign: "center",
  },
});
