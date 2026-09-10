import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { arrayRemove, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Platform } from "react-native";

import { auth, db } from "./firebase";
import {
  configureNotificationHandler,
  requestNotificationPermissions,
  SUPPORT_MESSAGES_CHANNEL_ID,
} from "./notifications";

function projectId() {
  return (
    Constants.easConfig?.projectId ||
    (Constants.expoConfig?.extra?.eas as { projectId?: string } | undefined)?.projectId ||
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID ||
    "581d3c92-f5cb-4960-86df-e7c12a6a04da"
  );
}

export async function ensureSupportNotificationChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(SUPPORT_MESSAGES_CHANNEL_ID, {
    name: "Mensagens de suporte",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 120, 250],
    lightColor: "#0B3D2C",
    sound: "default",
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
}

export async function registerExpoPushToken() {
  configureNotificationHandler();
  await ensureSupportNotificationChannel();

  if (!Device.isDevice) {
    return null;
  }

  const granted = await requestNotificationPermissions();
  if (!granted) return null;

  const user = auth.currentUser;
  if (!user) return null;

  const tokenResult = await Notifications.getExpoPushTokenAsync({
    projectId: projectId(),
  });
  const token = tokenResult.data;
  if (!token) return null;

  await updateDoc(doc(db, "users", user.uid), {
    expoPushToken: token,
    expoPushTokens: arrayUnion(token),
    expoPushTokenUpdatedAt: serverTimestamp(),
    pushPlatform: Platform.OS,
  });

  return token;
}

export async function unregisterExpoPushToken() {
  const user = auth.currentUser;
  if (!user) return;
  try {
    const tokenResult = await Notifications.getExpoPushTokenAsync({
      projectId: projectId(),
    }).catch(() => null);
    const token = tokenResult?.data;
    await updateDoc(doc(db, "users", user.uid), {
      expoPushToken: null,
      ...(token ? { expoPushTokens: arrayRemove(token) } : {}),
      expoPushTokenUpdatedAt: serverTimestamp(),
    });
  } catch {
    /* ignore logout cleanup failures */
  }
}

function apiBase() {
  return (process.env.EXPO_PUBLIC_API_URL || "https://ecomopar.netlify.app").replace(/\/$/, "");
}

export async function notifySupportPush(input: {
  direction: "member_to_admin" | "admin_to_member";
  chatId: string;
  preview: string;
  memberName?: string;
}) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await fetch(`${apiBase()}/api/notifications/support`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch (error) {
    console.warn("Falha ao disparar push de suporte.", error);
  }
}
