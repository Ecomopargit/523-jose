import { adminDb } from "@/lib/firebase-admin";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export type SupportPushPayload = {
  to: string | string[];
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: "default" | null;
  channelId?: string;
  priority?: "default" | "normal" | "high";
};

function normalizeTokens(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter((token) => token.startsWith("ExponentPushToken"));
  }
  if (typeof value === "string" && value.startsWith("ExponentPushToken")) {
    return [value];
  }
  return [];
}

export async function getUserPushTokens(uid: string) {
  const snap = await adminDb.collection("users").doc(uid).get();
  if (!snap.exists) return [] as string[];
  const data = snap.data() || {};
  const fromArray = normalizeTokens(data.expoPushTokens);
  const single = normalizeTokens(data.expoPushToken);
  return [...new Set([...fromArray, ...single])];
}

export async function getAdminPushTokens() {
  const snap = await adminDb.collection("users").where("role", "==", "admin").get();
  const tokens = new Set<string>();
  for (const doc of snap.docs) {
    const data = doc.data();
    for (const token of [
      ...normalizeTokens(data.expoPushTokens),
      ...normalizeTokens(data.expoPushToken),
    ]) {
      tokens.add(token);
    }
  }
  return [...tokens];
}

export async function sendExpoPush(messages: SupportPushPayload[]) {
  if (!messages.length) return { ok: true, sent: 0 };

  const chunks: SupportPushPayload[] = [];
  for (const message of messages) {
    const recipients = Array.isArray(message.to) ? message.to : [message.to];
    for (let i = 0; i < recipients.length; i += 100) {
      chunks.push({
        ...message,
        to: recipients.slice(i, i + 100),
      });
    }
  }

  let sent = 0;
  for (const chunk of chunks) {
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chunk),
      cache: "no-store",
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(detail || "Falha ao enviar push via Expo.");
    }
    const targets = Array.isArray(chunk.to) ? chunk.to.length : 1;
    sent += targets;
  }

  return { ok: true, sent };
}
