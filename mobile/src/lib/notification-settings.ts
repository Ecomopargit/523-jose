import AsyncStorage from "@react-native-async-storage/async-storage";

const ENABLED_KEY = "@ecomopar/deposit_reminder_enabled_v1";
const TIME_KEY = "@ecomopar/deposit_reminder_time_v1";
const NOTIF_ID_KEY = "@ecomopar/deposit_reminder_notif_id_v1";
const PROMPT_SEEN_KEY = "@ecomopar/deposit_reminder_prompt_seen_v1";

export const DEFAULT_REMINDER_TIME = "09:00";

export type ReminderSettings = {
  enabled: boolean;
  time: string;
  promptSeen: boolean;
};

export function parseReminderTime(value: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export function formatReminderTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function reminderTimeLabel(time: string) {
  const parsed = parseReminderTime(time);
  if (!parsed) return time;
  const date = new Date();
  date.setHours(parsed.hour, parsed.minute, 0, 0);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export async function getReminderSettings(): Promise<ReminderSettings> {
  try {
    const [enabledRaw, timeRaw, promptSeenRaw] = await Promise.all([
      AsyncStorage.getItem(ENABLED_KEY),
      AsyncStorage.getItem(TIME_KEY),
      AsyncStorage.getItem(PROMPT_SEEN_KEY),
    ]);
    return {
      enabled: enabledRaw === "1",
      time: timeRaw || DEFAULT_REMINDER_TIME,
      promptSeen: promptSeenRaw === "1",
    };
  } catch {
    return { enabled: false, time: DEFAULT_REMINDER_TIME, promptSeen: false };
  }
}

export async function setReminderEnabled(enabled: boolean) {
  await AsyncStorage.setItem(ENABLED_KEY, enabled ? "1" : "0");
}

export async function setReminderTime(time: string) {
  await AsyncStorage.setItem(TIME_KEY, time);
}

export async function markReminderPromptSeen() {
  await AsyncStorage.setItem(PROMPT_SEEN_KEY, "1");
}

export async function getScheduledNotificationId() {
  try {
    return await AsyncStorage.getItem(NOTIF_ID_KEY);
  } catch {
    return null;
  }
}

export async function saveScheduledNotificationId(id: string | null) {
  if (!id) {
    await AsyncStorage.removeItem(NOTIF_ID_KEY);
    return;
  }
  await AsyncStorage.setItem(NOTIF_ID_KEY, id);
}
