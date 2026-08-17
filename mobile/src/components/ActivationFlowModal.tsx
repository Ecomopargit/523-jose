import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  createActivationPayment,
  fetchActivationReceipt,
  getActivationPayment,
  replaceActivationPayment,
  type PublicActivationPayment,
} from "../lib/activation";
import { colors, fonts, shadow } from "../theme";

type Props = {
  visible: boolean;
  memberEmail?: string;
  onClose: () => void;
  onActivated: () => Promise<void> | void;
};

const money = (value = 0) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return globalThis.btoa(binary);
}

export function ActivationFlowModal({ visible, memberEmail, onClose, onActivated }: Props) {
  const [payment, setPayment] = useState<PublicActivationPayment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleActivated = useCallback(async () => {
    await onActivated();
  }, [onActivated]);

  useEffect(() => {
    if (!visible) {
      setPayment(null);
      setError("");
      setLoading(false);
      setCopied(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");
    void createActivationPayment()
      .then((created) => {
        if (!cancelled) setPayment(created);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Falha ao gerar PIX.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible || !payment?.id || payment.status !== "pending") return;

    let cancelled = false;
    const tick = async () => {
      try {
        const next = await getActivationPayment(payment.id);
        if (cancelled) return;
        setPayment(next);
        if (next.status === "approved") {
          await handleActivated();
        }
      } catch {
        /* keep polling */
      }
    };

    void tick();
    const id = setInterval(() => void tick(), 4000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [visible, payment?.id, payment?.status, handleActivated]);

  async function copyPix() {
    if (!payment?.qrCode) return;
    await Clipboard.setStringAsync(payment.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function checkPayment() {
    if (!payment?.id) return;
    setChecking(true);
    setError("");
    try {
      const next = await getActivationPayment(payment.id);
      setPayment(next);
      if (next.status === "approved") await handleActivated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao consultar o PIX.");
    } finally {
      setChecking(false);
    }
  }

  async function generateAnotherPix() {
    if (!payment?.id) return;
    setLoading(true);
    setError("");
    try {
      setPayment(await replaceActivationPayment(payment.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar outro PIX.");
    } finally {
      setLoading(false);
    }
  }

  async function shareReceipt() {
    if (!payment?.id) return;
    setSharing(true);
    setError("");
    try {
      const buffer = await fetchActivationReceipt(payment.id);
      const base64 = arrayBufferToBase64(buffer);
      const directory = FileSystem.cacheDirectory || FileSystem.documentDirectory;
      if (!directory) throw new Error("Armazenamento local indisponível neste dispositivo.");
      const path = `${directory}comprovante-ativacao-${payment.id}.pdf`;
      await FileSystem.writeAsStringAsync(path, base64, { encoding: "base64" });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, {
          mimeType: "application/pdf",
          dialogTitle: "Comprovante de ativação",
        });
      } else {
        setError("Compartilhamento indisponível neste dispositivo. O PDF foi enviado ao seu e-mail.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao abrir comprovante.");
    } finally {
      setSharing(false);
    }
  }

  const approved = payment?.status === "approved";
  const failed = payment?.status === "expired" || payment?.status === "rejected" || payment?.status === "cancelled";
  const expiresAt = payment?.expiresAt
    ? new Date(payment.expiresAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <Modal animationType="fade" onRequestClose={onClose} presentationStyle="overFullScreen" statusBarTranslucent transparent visible={visible}>
      <View style={styles.keyboard}>
        <Pressable accessibilityLabel="Fechar modal" onPress={onClose} style={styles.backdrop} />
        <View accessibilityViewIsModal style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Feather color={colors.white} name="zap" size={21} />
            </View>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>ATIVAÇÃO DO CADASTRO</Text>
              <Text style={styles.title}>{approved ? "Cadastro ativado" : "Pagar PIX de ativação"}</Text>
            </View>
            <Pressable accessibilityLabel="Fechar" hitSlop={8} onPress={onClose} style={styles.close}>
              <Feather color={colors.inkSoft} name="x" size={19} />
            </Pressable>
          </View>

          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator color={colors.green600} size="large" />
                <Text style={styles.muted}>Gerando cobrança PIX…</Text>
              </View>
            ) : approved ? (
              <View>
                <View style={styles.successIcon}>
                  <Feather color={colors.green700} name="check" size={28} />
                </View>
                <Text style={styles.successTitle}>Pagamento confirmado</Text>
                <Text style={styles.description}>
                  Enviamos o comprovante para {memberEmail || "seu e-mail"}.
                </Text>
                <Text style={styles.feeNote}>
                  R$ 2,00 deste valor correspondem à taxa por transação (já incluídos nos {money(7)}).
                </Text>
                <Pressable onPress={() => void shareReceipt()} style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}>
                  {sharing ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryBtnText}>Visualizar / compartilhar PDF</Text>}
                </Pressable>
                <Pressable onPress={onClose} style={styles.ghostBtn}>
                  <Text style={styles.ghostBtnText}>Fechar</Text>
                </Pressable>
              </View>
            ) : payment && failed ? (
              <View style={styles.center}>
                <View style={styles.failedIcon}>
                  <Feather color={colors.brick500} name="clock" size={26} />
                </View>
                <Text style={styles.successTitle}>Este PIX não está mais válido</Text>
                <Text style={styles.description}>Gere uma nova cobrança para concluir a ativação do cadastro.</Text>
                <Pressable onPress={() => void generateAnotherPix()} style={({ pressed }) => [styles.primaryBtn, styles.fullButton, pressed && styles.pressed]}>
                  <Text style={styles.primaryBtnText}>Gerar novo PIX</Text>
                </Pressable>
              </View>
            ) : payment ? (
              <View>
                <Text style={styles.amount}>{money(payment.amount)}</Text>
                <Text style={styles.feeNote}>
                  R$ 2,00 deste valor correspondem à taxa por transação (já incluídos).
                </Text>

                {payment.qrCodeBase64 ? (
                  <View style={styles.qrWrap}>
                    <Image
                      source={{ uri: `data:image/png;base64,${payment.qrCodeBase64}` }}
                      style={styles.qr}
                    />
                  </View>
                ) : null}

                <Text style={styles.label}>PIX copia e cola</Text>
                <Text selectable style={styles.pixCode}>
                  {payment.qrCode}
                </Text>
                <Pressable onPress={() => void copyPix()} style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}>
                  <Feather color={colors.green700} name={copied ? "check" : "copy"} size={16} />
                  <Text style={styles.secondaryBtnText}>{copied ? "Código copiado" : "Copiar código PIX"}</Text>
                </Pressable>

                {expiresAt ? <Text style={styles.expiration}>Código válido até {expiresAt}</Text> : null}

                <View style={styles.waiting}>
                  <ActivityIndicator color={colors.amber500} />
                  <Text style={styles.waitingText}>Aguardando confirmação do pagamento…</Text>
                </View>
                <Pressable disabled={checking} onPress={() => void checkPayment()} style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}>
                  {checking ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryBtnText}>Já paguei, verificar agora</Text>}
                </Pressable>
              </View>
            ) : (
              <Text style={styles.description}>Não foi possível iniciar a ativação.</Text>
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(8,26,20,0.45)" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "92%",
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    ...shadow,
  },
  handle: { alignSelf: "center", backgroundColor: colors.line, borderRadius: 99, height: 5, marginBottom: 14, width: 42 },
  header: { alignItems: "center", flexDirection: "row", gap: 12, marginBottom: 16 },
  headerIcon: { alignItems: "center", backgroundColor: colors.green700, borderRadius: 14, height: 44, justifyContent: "center", width: 44 },
  headerCopy: { flex: 1 },
  eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1.1 },
  title: { color: colors.ink, fontFamily: fonts.bold, fontSize: 18, marginTop: 2 },
  close: { padding: 6 },
  center: { alignItems: "center", gap: 12, paddingVertical: 40 },
  muted: { color: colors.inkSoft, fontFamily: fonts.medium, fontSize: 13 },
  amount: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 32, letterSpacing: -0.8 },
  feeNote: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, marginBottom: 14, marginTop: 6 },
  qrWrap: { alignItems: "center", backgroundColor: colors.white, borderColor: colors.line, borderRadius: 18, borderWidth: 1, marginBottom: 14, padding: 14 },
  qr: { height: 210, width: 210 },
  label: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 13, marginBottom: 8 },
  pixCode: { backgroundColor: colors.green50, borderColor: colors.line, borderRadius: 14, borderWidth: 1, color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 11, lineHeight: 16, padding: 12 },
  secondaryBtn: { alignItems: "center", borderColor: colors.green100, borderRadius: 14, borderWidth: 1, flexDirection: "row", gap: 8, justifyContent: "center", marginTop: 12, paddingVertical: 13 },
  secondaryBtnText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 13 },
  waiting: { alignItems: "center", backgroundColor: colors.amber100, borderRadius: 14, flexDirection: "row", gap: 10, marginTop: 16, padding: 14 },
  waitingText: { color: colors.inkSoft, flex: 1, fontFamily: fonts.medium, fontSize: 12.5 },
  primaryBtn: { alignItems: "center", backgroundColor: colors.green700, borderRadius: 16, justifyContent: "center", marginTop: 8, minHeight: 52 },
  primaryBtnText: { color: colors.white, fontFamily: fonts.bold, fontSize: 14 },
  ghostBtn: { alignItems: "center", marginTop: 10, paddingVertical: 12 },
  ghostBtnText: { color: colors.inkSoft, fontFamily: fonts.semibold, fontSize: 13 },
  successIcon: { alignItems: "center", alignSelf: "center", backgroundColor: colors.green100, borderRadius: 40, height: 64, justifyContent: "center", marginBottom: 14, width: 64 },
  failedIcon: { alignItems: "center", backgroundColor: colors.brick100, borderRadius: 40, height: 64, justifyContent: "center", marginBottom: 2, width: 64 },
  fullButton: { alignSelf: "stretch", width: "100%" },
  expiration: { color: colors.inkFaint, fontFamily: fonts.medium, fontSize: 10.5, marginTop: 8, textAlign: "center" },
  successTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 20, textAlign: "center" },
  description: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, marginTop: 8, textAlign: "center" },
  error: { color: colors.danger, fontFamily: fonts.medium, fontSize: 12.5, marginTop: 14 },
  pressed: { opacity: 0.75 },
});
