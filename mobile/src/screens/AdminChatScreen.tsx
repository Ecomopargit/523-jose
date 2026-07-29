import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addDoc, collection, doc, increment, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "../lib/firebase";
import { colors, fonts, shadow } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "AdminChat">;
type Message = { id: string; role: "admin" | "member"; text: string; date: Date | null };

export function AdminChatScreen({ navigation, route }: Props) {
  const { chatId, memberName, memberEmail } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"open" | "closed">("open");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const unsubscribeChat = onSnapshot(doc(db, "supportChats", chatId), (snapshot) => {
      if (snapshot.exists()) setStatus(snapshot.data().status === "closed" ? "closed" : "open");
    });
    const unsubscribeMessages = onSnapshot(query(collection(db, "supportChats", chatId, "messages"), orderBy("createdAt", "asc")), (snapshot) => {
      setMessages(snapshot.docs.map((record) => {
        const data = record.data();
        return { id: record.id, role: data.senderRole === "admin" ? "admin" : "member", text: String(data.text ?? ""), date: data.createdAt?.toDate?.() ?? null };
      }));
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    });
    void updateDoc(doc(db, "supportChats", chatId), { unreadByAdmin: 0 }).catch(() => undefined);
    return () => { unsubscribeChat(); unsubscribeMessages(); };
  }, [chatId]);

  async function send() {
    const clean = text.trim();
    const user = auth.currentUser;
    if (!clean || !user || sending) return;
    setText("");
    setSending(true);
    try {
      const chatRef = doc(db, "supportChats", chatId);
      await setDoc(chatRef, { status: "open", lastMessage: clean, lastMessageAt: serverTimestamp(), updatedAt: serverTimestamp(), unreadByMember: increment(1), unreadByAdmin: 0 }, { merge: true });
      await addDoc(collection(chatRef, "messages"), { senderId: user.uid, senderRole: "admin", text: clean, createdAt: serverTimestamp() });
    } catch { setText(clean); } finally { setSending(false); }
  }

  async function toggleStatus() {
    await updateDoc(doc(db, "supportChats", chatId), { status: status === "open" ? "closed" : "open", updatedAt: serverTimestamp() });
  }

  const initials = memberName.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.back}><Feather color={colors.ink} name="arrow-left" size={20} /></Pressable>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text><View style={styles.online} /></View>
          <View style={styles.headerCopy}><Text numberOfLines={1} style={styles.name}>{memberName}</Text><Text numberOfLines={1} style={styles.email}>{memberEmail}</Text></View>
          <Pressable onPress={() => void toggleStatus()} style={[styles.status, status === "closed" && styles.statusClosed]}><Feather color={status === "open" ? colors.green700 : colors.inkSoft} name={status === "open" ? "check-circle" : "refresh-cw"} size={13} /><Text style={[styles.statusText, status === "closed" && styles.statusTextClosed]}>{status === "open" ? "Encerrar" : "Reabrir"}</Text></Pressable>
        </View>

        <View style={styles.security}><Feather color={colors.green700} name="shield" size={12} /><Text style={styles.securityText}>Atendimento simultâneo e protegido em tempo real</Text></View>

        <ScrollView ref={scrollRef} contentContainerStyle={styles.messages} keyboardShouldPersistTaps="handled" onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })} showsVerticalScrollIndicator={false}>
          {!messages.length ? <View style={styles.empty}><View style={styles.emptyIcon}><Feather color={colors.green700} name="message-circle" size={23} /></View><Text style={styles.emptyTitle}>Inicie a conversa</Text><Text style={styles.emptyText}>As mensagens serão sincronizadas instantaneamente nos dois dispositivos.</Text></View> : null}
          {messages.map((message, index) => {
            const mine = message.role === "admin";
            const showDay = index === 0 || messages[index - 1]?.date?.toDateString() !== message.date?.toDateString();
            return <View key={message.id}>{showDay ? <Text style={styles.day}>{message.date?.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" }) ?? "Hoje"}</Text> : null}<View style={[styles.messageRow, mine && styles.mineRow]}><View style={[styles.bubble, mine ? styles.mineBubble : styles.theirBubble]}>{!mine ? <Text style={styles.sender}>{memberName}</Text> : null}<Text style={[styles.messageText, mine && styles.mineText]}>{message.text}</Text><View style={styles.timeRow}><Text style={[styles.time, mine && styles.mineTime]}>{message.date?.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) ?? "Agora"}</Text>{mine ? <Feather color="rgba(255,255,255,.5)" name="check-circle" size={10} /> : null}</View></View></View></View>;
          })}
        </ScrollView>

        <View style={styles.composer}>
          {status === "closed" ? <Pressable onPress={() => void toggleStatus()} style={styles.reopen}><Text style={styles.reopenText}>Atendimento encerrado · toque para reabrir</Text></Pressable> :
          <View style={styles.inputShell}><TextInput multiline onChangeText={setText} placeholder="Digite sua resposta..." placeholderTextColor={colors.inkFaint} style={styles.input} value={text} /><Pressable disabled={!text.trim() || sending} onPress={() => void send()} style={[styles.send, (!text.trim() || sending) && styles.sendDisabled]}>{sending ? <ActivityIndicator color={colors.white} size="small" /> : <Feather color={colors.white} name="send" size={17} />}</Pressable></View>}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 }, flex: { flex: 1 }, header: { alignItems: "center", backgroundColor: colors.surface, borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: "row", gap: 10, padding: 14 }, back: { alignItems: "center", borderRadius: 12, height: 40, justifyContent: "center", width: 36 }, avatar: { alignItems: "center", backgroundColor: colors.green900, borderRadius: 14, height: 45, justifyContent: "center", width: 45 }, avatarText: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 10 }, online: { backgroundColor: colors.green400, borderColor: colors.white, borderRadius: 6, borderWidth: 2, bottom: -1, height: 12, position: "absolute", right: -1, width: 12 }, headerCopy: { flex: 1 }, name: { color: colors.ink, fontFamily: fonts.bold, fontSize: 12 }, email: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 8, marginTop: 2 }, status: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 11, flexDirection: "row", gap: 4, paddingHorizontal: 9, paddingVertical: 8 }, statusClosed: { backgroundColor: colors.line }, statusText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 7.5 }, statusTextClosed: { color: colors.inkSoft }, security: { alignItems: "center", alignSelf: "center", backgroundColor: colors.green100, borderRadius: 20, flexDirection: "row", gap: 5, marginTop: 10, paddingHorizontal: 11, paddingVertical: 6 }, securityText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 7 }, messages: { flexGrow: 1, padding: 16, paddingBottom: 26 }, empty: { alignItems: "center", flex: 1, justifyContent: "center", paddingVertical: 100 }, emptyIcon: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 18, height: 58, justifyContent: "center", width: 58 }, emptyTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13, marginTop: 13 }, emptyText: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 9, lineHeight: 15, marginTop: 4, maxWidth: 260, textAlign: "center" }, day: { alignSelf: "center", color: colors.inkFaint, fontFamily: fonts.bold, fontSize: 7, marginBottom: 14, marginTop: 8, textTransform: "uppercase" }, messageRow: { alignItems: "flex-start", marginBottom: 9 }, mineRow: { alignItems: "flex-end" }, bubble: { maxWidth: "82%", paddingHorizontal: 14, paddingVertical: 11 }, theirBubble: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 17, borderBottomLeftRadius: 5, borderWidth: 1, ...shadow }, mineBubble: { backgroundColor: colors.green800, borderRadius: 17, borderBottomRightRadius: 5 }, sender: { color: colors.green700, fontFamily: fonts.bold, fontSize: 7, marginBottom: 4 }, messageText: { color: colors.ink, fontFamily: fonts.medium, fontSize: 10, lineHeight: 16 }, mineText: { color: colors.white }, timeRow: { alignItems: "center", alignSelf: "flex-end", flexDirection: "row", gap: 3, marginTop: 5 }, time: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 6.5 }, mineTime: { color: "rgba(255,255,255,.5)" }, composer: { backgroundColor: colors.surface, borderTopColor: colors.line, borderTopWidth: 1, padding: 12, paddingBottom: Platform.OS === "ios" ? 8 : 12 }, inputShell: { alignItems: "flex-end", backgroundColor: colors.background, borderColor: colors.line, borderRadius: 18, borderWidth: 1, flexDirection: "row", gap: 8, padding: 6, paddingLeft: 14 }, input: { color: colors.ink, flex: 1, fontFamily: fonts.medium, fontSize: 10, maxHeight: 100, minHeight: 42, paddingVertical: 11, textAlignVertical: "center" }, send: { alignItems: "center", backgroundColor: colors.green700, borderRadius: 14, height: 42, justifyContent: "center", width: 42 }, sendDisabled: { opacity: .38 }, reopen: { alignItems: "center", backgroundColor: colors.line, borderRadius: 14, padding: 14 }, reopenText: { color: colors.inkSoft, fontFamily: fonts.bold, fontSize: 9 },
});
