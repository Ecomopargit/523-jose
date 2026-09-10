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
import { auth, db } from "@/lib/firebase";
import { notifySupportPush } from "@/lib/support-push-client";

export type SupportChat = {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  status: "open" | "closed";
  lastMessage: string;
  lastMessageAt: Date | null;
  unreadByAdmin: number;
  unreadByMember: number;
};

export type SupportMessage = {
  id: string;
  senderId: string;
  senderRole: "member" | "admin";
  text: string;
  createdAt: Date | null;
};

function toDate(value: unknown) {
  const timestamp = value as Timestamp | undefined;
  return typeof timestamp?.toDate === "function" ? timestamp.toDate() : null;
}

export function subscribeSupportChats(
  callback: (chats: SupportChat[]) => void,
  onError?: (error: Error) => void,
) {
  const chatsQuery = query(collection(db, "supportChats"), orderBy("lastMessageAt", "desc"));
  return onSnapshot(
    chatsQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((chat) => {
          const data = chat.data();
          return {
            id: chat.id,
            memberId: String(data.memberId ?? chat.id),
            memberName: String(data.memberName ?? "Associado"),
            memberEmail: String(data.memberEmail ?? ""),
            status: data.status === "closed" ? "closed" : "open",
            lastMessage: String(data.lastMessage ?? ""),
            lastMessageAt: toDate(data.lastMessageAt),
            unreadByAdmin: Number(data.unreadByAdmin ?? 0),
            unreadByMember: Number(data.unreadByMember ?? 0),
          };
        }),
      );
    },
    (error) => onError?.(error),
  );
}

export function subscribeAdminSupportMessages(
  chatId: string,
  callback: (messages: SupportMessage[]) => void,
  onError?: (error: Error) => void,
) {
  const messagesQuery = query(
    collection(db, "supportChats", chatId, "messages"),
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

export async function sendAdminSupportMessage(chat: SupportChat, rawText: string) {
  const text = rawText.trim();
  const user = auth.currentUser;
  if (!text || !user) return;

  const chatRef = doc(db, "supportChats", chat.id);
  await setDoc(
    chatRef,
    {
      status: "open",
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      unreadByMember: increment(1),
      unreadByAdmin: 0,
    },
    { merge: true },
  );
  await addDoc(collection(chatRef, "messages"), {
    senderId: user.uid,
    senderRole: "admin",
    text,
    createdAt: serverTimestamp(),
  });

  void notifySupportPush({
    direction: "admin_to_member",
    chatId: chat.id,
    preview: text,
    memberName: chat.memberName,
  });
}

export async function markAdminSupportRead(chatId: string) {
  await updateDoc(doc(db, "supportChats", chatId), { unreadByAdmin: 0 });
}

export async function setSupportChatStatus(chatId: string, status: "open" | "closed") {
  await updateDoc(doc(db, "supportChats", chatId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeMemberSupportMessages(
  memberId: string,
  callback: (messages: SupportMessage[]) => void,
  onError?: (error: Error) => void,
) {
  return subscribeAdminSupportMessages(memberId, callback, onError);
}

export async function sendMemberSupportMessage(
  member: { id: string; nome: string; email: string },
  rawText: string,
) {
  const text = rawText.trim();
  const user = auth.currentUser;
  if (!text || !user || user.uid !== member.id) return;

  const chatRef = doc(db, "supportChats", member.id);
  await setDoc(
    chatRef,
    {
      memberId: member.id,
      memberName: member.nome || "Associado ECOMOPAR",
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

  void notifySupportPush({
    direction: "member_to_admin",
    chatId: member.id,
    preview: text,
    memberName: member.nome || "Associado",
  });
}

export async function markMemberSupportRead(memberId: string) {
  try {
    await updateDoc(doc(db, "supportChats", memberId), { unreadByMember: 0 });
  } catch {
    /* chat ainda pode não existir */
  }
}
