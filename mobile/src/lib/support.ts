import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";
import type { MemberProfile } from "../types";

export type SupportMessage = {
  id: string;
  senderId: string;
  senderRole: "member" | "admin";
  text: string;
  createdAt: Date | null;
};

function toDate(value: unknown): Date | null {
  const timestamp = value as Timestamp | undefined;
  return typeof timestamp?.toDate === "function" ? timestamp.toDate() : null;
}

export function subscribeSupportMessages(
  memberId: string,
  callback: (messages: SupportMessage[]) => void,
  onError?: (error: Error) => void,
) {
  const messagesQuery = query(
    collection(db, "supportChats", memberId, "messages"),
    orderBy("createdAt", "asc"),
  );

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((message) => {
          const data = message.data();
          return {
            id: message.id,
            senderId: String(data.senderId ?? ""),
            senderRole: data.senderRole === "admin" ? "admin" : "member",
            text: String(data.text ?? ""),
            createdAt: toDate(data.createdAt),
          };
        }),
      );
    },
    (error) => onError?.(error),
  );
}

export async function sendMemberSupportMessage(member: MemberProfile, rawText: string) {
  const text = rawText.trim();
  const user = auth.currentUser;
  if (!text || !user) return;

  const chatRef = doc(db, "supportChats", user.uid);
  await setDoc(
    chatRef,
    {
      memberId: user.uid,
      memberName: member.nome || user.displayName || "Associado ECOMOPAR",
      memberEmail: member.email || user.email || "",
      status: "open",
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      unreadByAdmin: increment(1),
      unreadByMember: 0,
    },
    { merge: true },
  );

  await addDoc(collection(chatRef, "messages"), {
    senderId: user.uid,
    senderRole: "member",
    text,
    createdAt: serverTimestamp(),
  });
}

export async function markMemberSupportRead(memberId: string) {
  try {
    await updateDoc(doc(db, "supportChats", memberId), {
      unreadByMember: 0,
    });
  } catch {
    // A conversa ainda pode não existir.
  }
}
