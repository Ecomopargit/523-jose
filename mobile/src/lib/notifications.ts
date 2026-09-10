import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import {
  getReminderSettings,
  getScheduledNotificationId,
  parseReminderTime,
  saveScheduledNotificationId,
} from "./notification-settings";

export const DEPOSIT_REMINDER_CHANNEL_ID = "deposit-reminder";
export const SUPPORT_MESSAGES_CHANNEL_ID = "support-messages";

const REMINDER_COPY = {
  title: "Hora do seu depósito diário",
  body: "Faça seu PIX de R$ 7,00 e mantenha R$ 5,00 na reserva. Não perca o dia!",
};

let handlerConfigured = false;

export function configureNotificationHandler() {
  if (handlerConfigured) return;
  handlerConfigured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(DEPOSIT_REMINDER_CHANNEL_ID, {
    name: "Lembretes de depósito",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 120, 250],
    lightColor: "#0B3D2C",
    sound: "default",
  });
  await Notifications.setNotificationChannelAsync(SUPPORT_MESSAGES_CHANNEL_ID, {
    name: "Mensagens de suporte",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 120, 250],
    lightColor: "#0B3D2C",
    sound: "default",
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
}

export async function getNotificationPermissionStatus() {
  configureNotificationHandler();
  const settings = await Notifications.getPermissionsAsync();
  return settings.status;
}

export async function requestNotificationPermissions() {
  configureNotificationHandler();
  await ensureAndroidChannel();

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });
  return requested.granted;
}

export async function cancelDepositReminder() {
  const storedId = await getScheduledNotificationId();
  if (storedId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(storedId);
    } catch {
      /* ignore stale ids */
    }
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => item.content.data?.type === "deposit_reminder")
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)),
  );

  await saveScheduledNotificationId(null);
}

export async function scheduleDepositReminder(time?: string) {
  configureNotificationHandler();
  await ensureAndroidChannel();

  const settings = await getReminderSettings();
  const parsed = parseReminderTime(time || settings.time);
  if (!parsed) {
    throw new Error("Horário inválido. Use o formato HH:MM.");
  }

  await cancelDepositReminder();

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: REMINDER_COPY.title,
      body: REMINDER_COPY.body,
      sound: "default",
      data: { type: "deposit_reminder" },
      ...(Platform.OS === "android" ? { channelId: DEPOSIT_REMINDER_CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: parsed.hour,
      minute: parsed.minute,
    },
  });

  await saveScheduledNotificationId(identifier);
  return identifier;
}

export async function sendTestDepositReminder() {
  configureNotificationHandler();
  await ensureAndroidChannel();

  const granted = await requestNotificationPermissions();
  if (!granted) {
    throw new Error("Permita notificações nas configurações do celular para testar.");
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Teste — lembrete ECOMOPAR",
      body: "Se você viu isso, seus lembretes diários estão funcionando.",
      sound: "default",
      data: { type: "deposit_reminder_test" },
      ...(Platform.OS === "android" ? { channelId: DEPOSIT_REMINDER_CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}

export async function syncDepositReminderFromStorage() {
  const settings = await getReminderSettings();
  if (!settings.enabled) {
    await cancelDepositReminder();
    return;
  }

  const status = await getNotificationPermissionStatus();
  if (status !== "granted") return;

  await scheduleDepositReminder(settings.time);
}

export async function enableDepositReminder(time: string) {
  const granted = await requestNotificationPermissions();
  if (!granted) {
    throw new Error("Ative as notificações do ECOMOPAR nas configurações do celular.");
  }
  await scheduleDepositReminder(time);
}
