import { Feather } from "@expo/vector-icons";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, ScreenAtmosphere } from "../components/UI";
import {
  DEFAULT_REMINDER_TIME,
  formatReminderTime,
  getReminderSettings,
  markReminderPromptSeen,
  parseReminderTime,
  reminderTimeLabel,
  setReminderEnabled,
  setReminderTime,
} from "../lib/notification-settings";
import {
  cancelDepositReminder,
  enableDepositReminder,
  getNotificationPermissionStatus,
  sendTestDepositReminder,
} from "../lib/notifications";
import { colors, fonts, shadow } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "NotificationSettings">;

const PRESET_TIMES = ["07:00", "09:00", "12:00", "18:00", "20:00"];

function timeToDate(time: string) {
  const parsed = parseReminderTime(time) || parseReminderTime(DEFAULT_REMINDER_TIME)!;
  const date = new Date();
  date.setHours(parsed.hour, parsed.minute, 0, 0);
  return date;
}

export function NotificationSettingsScreen({ navigation }: Props) {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState(DEFAULT_REMINDER_TIME);
  const [permission, setPermission] = useState<string>("undetermined");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [testing, setTesting] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"settings" | "setup">("settings");
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [draftTime, setDraftTime] = useState(DEFAULT_REMINDER_TIME);

  const timeLabel = useMemo(() => reminderTimeLabel(time), [time]);
  const draftTimeLabel = useMemo(() => reminderTimeLabel(draftTime), [draftTime]);

  const openTimePicker = (target: "settings" | "setup") => {
    setPickerTarget(target);
    setDraftTime(target === "setup" ? draftTime : time);
    setTimePickerOpen(true);
  };

  const closeTimePicker = () => {
    setTimePickerOpen(false);
  };

  const savePickerTime = async () => {
    const parsed = parseReminderTime(draftTime);
    if (!parsed) {
      Alert.alert("Horário inválido", "Escolha um horário entre 00:00 e 23:59.");
      return;
    }
    const normalized = formatReminderTime(parsed.hour, parsed.minute);
    setDraftTime(normalized);
    closeTimePicker();

    if (pickerTarget === "settings") {
      await applyTime(normalized);
    }
  };

  const onPickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      closeTimePicker();
      if (event.type !== "set" || !date) return;

      const normalized = formatReminderTime(date.getHours(), date.getMinutes());
      setDraftTime(normalized);
      if (pickerTarget === "settings") {
        void applyTime(normalized);
      }
      return;
    }

    if (date) {
      setDraftTime(formatReminderTime(date.getHours(), date.getMinutes()));
    }
  };

  const refresh = useCallback(async () => {
    const [settings, status] = await Promise.all([
      getReminderSettings(),
      getNotificationPermissionStatus(),
    ]);
    setEnabled(settings.enabled);
    setTime(settings.time);
    setDraftTime(settings.time);
    setPermission(status);
    setLoading(false);

    if (!settings.promptSeen) {
      setSetupModalOpen(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const applyTime = async (nextTime: string) => {
    const parsed = parseReminderTime(nextTime);
    if (!parsed) {
      Alert.alert("Horário inválido", "Escolha um horário entre 00:00 e 23:59.");
      return;
    }
    const normalized = formatReminderTime(parsed.hour, parsed.minute);
    setBusy(true);
    try {
      await setReminderTime(normalized);
      setTime(normalized);
      setDraftTime(normalized);
      if (enabled) {
        await enableDepositReminder(normalized);
      }
    } catch (error) {
      Alert.alert("Não foi possível salvar", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setBusy(false);
    }
  };

  const toggleReminder = async (nextEnabled: boolean) => {
    setBusy(true);
    try {
      if (nextEnabled) {
        await enableDepositReminder(time);
        await setReminderEnabled(true);
        setEnabled(true);
        setPermission("granted");
      } else {
        await cancelDepositReminder();
        await setReminderEnabled(false);
        setEnabled(false);
      }
    } catch (error) {
      Alert.alert(
        nextEnabled ? "Ative as notificações" : "Erro",
        error instanceof Error ? error.message : "Não foi possível atualizar o lembrete.",
      );
    } finally {
      setBusy(false);
    }
  };

  const confirmSetup = async () => {
    setBusy(true);
    try {
      await applyTime(draftTime);
      await markReminderPromptSeen();
      setSetupModalOpen(false);
      Alert.alert(
        "Horário salvo",
        `Vamos te lembrar todos os dias às ${reminderTimeLabel(draftTime)}.`,
      );
    } finally {
      setBusy(false);
    }
  };

  const runTest = async () => {
    setTesting(true);
    try {
      await sendTestDepositReminder();
      Alert.alert("Teste enviado", "A notificação deve aparecer em alguns segundos.");
      setPermission("granted");
    } catch (error) {
      Alert.alert("Falha no teste", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <StatusBar style="dark" />
      <ScreenAtmosphere />

      <View style={styles.header}>
        <Pressable onPress={navigation.goBack} style={styles.back}>
          <Feather color={colors.green800} name="arrow-left" size={19} />
        </Pressable>
        <View>
          <Text style={styles.eyebrow}>PREFERÊNCIAS</Text>
          <Text style={styles.title}>Lembretes diários</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Feather color={colors.white} name="bell" size={24} />
          </View>
          <Text style={styles.heroTitle}>Não perca seu depósito diário</Text>
          <Text style={styles.heroText}>
            Receba um lembrete no horário que você escolher para fazer o PIX de R$ 7,00 e manter sua reserva em dia.
          </Text>
          <View style={styles.statusChip}>
            <View style={[styles.dot, permission !== "granted" && styles.dotMuted]} />
            <Text style={styles.statusChipText}>
              {permission === "granted" ? "NOTIFICAÇÕES PERMITIDAS" : "PERMISSÃO PENDENTE"}
            </Text>
          </View>
        </View>

        <Text style={styles.section}>Configurações</Text>
        <View style={styles.card}>
          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowIcon}>
              <Feather color={colors.green700} name="bell" size={16} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Lembrete diário de depósito</Text>
              <Text style={styles.rowSubtitle}>Aviso automático todos os dias</Text>
            </View>
            <Switch
              disabled={busy || loading}
              onValueChange={(value) => void toggleReminder(value)}
              thumbColor={colors.white}
              trackColor={{ false: colors.line, true: colors.green400 }}
              value={enabled}
            />
          </View>

          <Pressable
            disabled={busy || loading}
            onPress={() => openTimePicker("settings")}
            style={({ pressed }) => [styles.row, styles.rowBorder, pressed && styles.pressed]}
          >
            <View style={styles.rowIcon}>
              <Feather color={colors.green700} name="clock" size={16} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Melhor horário para você</Text>
              <Text style={styles.rowSubtitle}>Quando prefere ser lembrado</Text>
            </View>
            <Text style={styles.timeValue}>{timeLabel}</Text>
            <Feather color={colors.inkFaint} name="chevron-right" size={17} />
          </Pressable>

          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Feather color={colors.green700} name="smartphone" size={16} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Status no dispositivo</Text>
              <Text style={styles.rowSubtitle}>
                {enabled ? `Ativo • ${timeLabel} todos os dias` : "Desativado no app"}
              </Text>
            </View>
            <Feather color={enabled ? colors.green500 : colors.inkFaint} name={enabled ? "check-circle" : "minus-circle"} size={15} />
          </View>
        </View>

        <Text style={styles.section}>Horários sugeridos</Text>
        <View style={styles.presets}>
          {PRESET_TIMES.map((preset) => {
            const active = preset === time;
            return (
              <Pressable
                key={preset}
                disabled={busy}
                onPress={() => void applyTime(preset)}
                style={[styles.preset, active && styles.presetActive]}
              >
                <Text style={[styles.presetText, active && styles.presetTextActive]}>
                  {reminderTimeLabel(preset)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.testCard}>
          <Text style={styles.testTitle}>Testar notificação</Text>
          <Text style={styles.testText}>
            Envie um aviso de teste agora para confirmar que o celular está recebendo os lembretes.
          </Text>
          <Button
            icon="send"
            label={testing ? "Enviando…" : "Enviar notificação de teste"}
            loading={testing}
            onPress={() => void runTest()}
            variant="secondary"
          />
        </View>

        <View style={styles.note}>
          <Feather color={colors.green700} name="info" size={17} />
          <Text style={styles.noteText}>
            Os lembretes são locais no seu celular. Mantenha as notificações do ECOMOPAR ativas nas configurações do sistema.
          </Text>
        </View>
      </ScrollView>

      {timePickerOpen && Platform.OS === "android" ? (
        <DateTimePicker
          display="default"
          is24Hour
          mode="time"
          onChange={onPickerChange}
          value={timeToDate(draftTime)}
        />
      ) : null}

      <Modal
        animationType="fade"
        transparent
        visible={setupModalOpen && !timePickerOpen}
        onRequestClose={() => setSetupModalOpen(false)}
      >
        <View style={styles.setupBackdrop}>
          <View style={styles.setupCard}>
            <View style={styles.setupIcon}>
              <Feather color={colors.white} name="clock" size={22} />
            </View>
            <Text style={styles.setupTitle}>Qual o melhor horário?</Text>
            <Text style={styles.setupText}>
              Escolha o momento do dia em que você prefere receber o lembrete do depósito diário de R$ 7,00.
            </Text>

            <Pressable onPress={() => openTimePicker("setup")} style={styles.setupTimeButton}>
              <Feather color={colors.green700} name="clock" size={18} />
              <Text style={styles.setupTimeText}>{draftTimeLabel}</Text>
              <Feather color={colors.inkFaint} name="chevron-down" size={16} />
            </Pressable>

            <View style={styles.presets}>
              {PRESET_TIMES.map((preset) => (
                <Pressable
                  key={`setup-${preset}`}
                  onPress={() => setDraftTime(preset)}
                  style={[styles.preset, draftTime === preset && styles.presetActive]}
                >
                  <Text style={[styles.presetText, draftTime === preset && styles.presetTextActive]}>
                    {reminderTimeLabel(preset)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Button label={busy ? "Salvando…" : "Confirmar horário"} loading={busy} onPress={() => void confirmSetup()} />
            <Pressable
              disabled={busy}
              onPress={async () => {
                await markReminderPromptSeen();
                setSetupModalOpen(false);
              }}
              style={styles.setupSkip}
            >
              <Text style={styles.setupSkipText}>Definir depois</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {timePickerOpen && Platform.OS === "ios" ? (
        <Modal animationType="slide" transparent visible onRequestClose={closeTimePicker}>
          <View style={styles.pickerBackdrop}>
            <Pressable style={styles.pickerBackdropTap} onPress={closeTimePicker} />
            <View style={styles.pickerSheet}>
              <View style={styles.pickerHeader}>
                <Pressable onPress={closeTimePicker}>
                  <Text style={styles.pickerActionMuted}>Cancelar</Text>
                </Pressable>
                <Text style={styles.pickerTitle}>Escolher horário</Text>
                <Pressable onPress={() => void savePickerTime()}>
                  <Text style={styles.pickerAction}>Salvar</Text>
                </Pressable>
              </View>
              <DateTimePicker
                display="spinner"
                is24Hour
                locale="pt-BR"
                mode="time"
                onChange={onPickerChange}
                value={timeToDate(draftTime)}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  header: { alignItems: "center", flexDirection: "row", gap: 13, padding: 20 },
  back: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
    ...shadow,
  },
  eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1.3 },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 20, letterSpacing: -0.7, marginTop: 2 },
  content: { padding: 20, paddingBottom: 40, paddingTop: 3 },
  hero: {
    alignItems: "center",
    backgroundColor: colors.green900,
    borderRadius: 23,
    overflow: "hidden",
    padding: 22,
    ...shadow,
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: colors.green500,
    borderRadius: 18,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  heroTitle: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 17, marginTop: 13, textAlign: "center" },
  heroText: {
    color: "rgba(255,255,255,0.56)",
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5,
    maxWidth: 320,
    textAlign: "center",
  },
  statusChip: {
    alignItems: "center",
    backgroundColor: "rgba(58,182,137,0.13)",
    borderRadius: 14,
    flexDirection: "row",
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  dot: { backgroundColor: colors.green400, borderRadius: 3, height: 6, width: 6 },
  dotMuted: { backgroundColor: colors.amber500 },
  statusChipText: { color: colors.green400, fontFamily: fonts.bold, fontSize: 7.5, letterSpacing: 0.8 },
  section: { color: colors.ink, fontFamily: fonts.bold, fontSize: 14.5, marginBottom: 11, marginTop: 23 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 19,
    borderWidth: 1,
    paddingHorizontal: 14,
    ...shadow,
  },
  row: { alignItems: "center", flexDirection: "row", gap: 11, minHeight: 68 },
  rowBorder: { borderBottomColor: colors.line, borderBottomWidth: StyleSheet.hairlineWidth },
  rowIcon: {
    alignItems: "center",
    backgroundColor: colors.green50,
    borderRadius: 10,
    height: 37,
    justifyContent: "center",
    width: 37,
  },
  rowTitle: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 11 },
  rowSubtitle: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 8.5, marginTop: 2 },
  timeValue: { color: colors.green700, fontFamily: fonts.bold, fontSize: 11.5, marginRight: 2 },
  presets: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  preset: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  presetActive: { backgroundColor: colors.green100, borderColor: colors.green400 },
  presetText: { color: colors.inkSoft, fontFamily: fonts.semibold, fontSize: 10 },
  presetTextActive: { color: colors.green800 },
  testCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 19,
    borderWidth: 1,
    gap: 10,
    marginTop: 22,
    padding: 16,
    ...shadow,
  },
  testTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13.5 },
  testText: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 9.5, lineHeight: 14 },
  note: {
    backgroundColor: colors.green50,
    borderColor: colors.green100,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    padding: 14,
  },
  noteText: { color: colors.inkSoft, flex: 1, fontFamily: fonts.regular, fontSize: 9, lineHeight: 14 },
  pressed: { opacity: 0.68 },
  pickerBackdrop: { backgroundColor: "rgba(0,0,0,0.35)", flex: 1, justifyContent: "flex-end" },
  pickerBackdropTap: { flex: 1 },
  pickerSheet: { backgroundColor: colors.surface, borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingBottom: 24 },
  pickerHeader: {
    alignItems: "center",
    borderBottomColor: colors.line,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  pickerTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 12 },
  pickerAction: { color: colors.green700, fontFamily: fonts.bold, fontSize: 12 },
  pickerActionMuted: { color: colors.inkFaint, fontFamily: fonts.semibold, fontSize: 12 },
  setupBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(6,47,35,0.55)",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  setupCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    gap: 12,
    padding: 22,
    width: "100%",
    ...shadow,
  },
  setupIcon: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.green600,
    borderRadius: 16,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  setupTitle: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 18, textAlign: "center" },
  setupText: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 10.5, lineHeight: 16, textAlign: "center" },
  setupTimeButton: {
    alignItems: "center",
    backgroundColor: colors.green50,
    borderColor: colors.green100,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  setupTimeText: { color: colors.green800, flex: 1, fontFamily: fonts.bold, fontSize: 16, textAlign: "center" },
  setupSkip: { alignItems: "center", paddingVertical: 4 },
  setupSkipText: { color: colors.inkFaint, fontFamily: fonts.semibold, fontSize: 10.5 },
});
