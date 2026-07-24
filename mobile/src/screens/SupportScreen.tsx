import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext";
import {
  markMemberSupportRead,
  sendMemberSupportMessage,
  subscribeSupportMessages,
  type SupportMessage,
} from "../lib/support";
import { colors, fonts, shadow } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Support">;

export function SupportScreen({ navigation }: Props) {
  const { member, user } = useAuth();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList<SupportMessage>>(null);

  useEffect(() => {
    if (!user) return;
    void markMemberSupportRead(user.uid);
    return subscribeSupportMessages(
      user.uid,
      (nextMessages) => {
        setMessages(nextMessages);
        setLoading(false);
        void markMemberSupportRead(user.uid);
        requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
      },
      () => {
        setLoading(false);
        Alert.alert("Atendimento indisponível", "Não foi possível carregar a conversa agora.");
      },
    );
  }, [user]);

  async function send() {
    if (!text.trim() || !member || sending) return;
    const pendingText = text;
    setText("");
    setSending(true);
    try {
      await sendMemberSupportMessage(member, pendingText);
    } catch {
      setText(pendingText);
      Alert.alert("Mensagem não enviada", "Verifique sua conexão e tente novamente.");
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
        style={styles.keyboard}
      >
        <View style={styles.header}>
          <Pressable onPress={navigation.goBack} style={styles.back}>
            <Feather color={colors.white} name="arrow-left" size={20} />
          </Pressable>
          <View style={styles.agentAvatar}>
            <Feather color={colors.white} name="headphones" size={18} />
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerTitle}>Suporte ECOMOPAR</Text>
            <Text style={styles.headerStatus}>Equipe disponível para ajudar</Text>
          </View>
          <View style={styles.secure}>
            <Feather color={colors.green400} name="shield" size={15} />
          </View>
        </View>

        <View style={styles.conversation}>
          <View style={styles.dayPill}>
            <Text style={styles.dayText}>ATENDIMENTO SEGURO</Text>
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.green600} />
            </View>
          ) : (
            <FlatList
              ref={listRef}
              contentContainerStyle={styles.messages}
              data={messages}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<EmptyChat />}
              onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
              renderItem={({ item }) => <MessageBubble message={item} />}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        <View style={styles.composerWrap}>
          <View style={styles.composer}>
            <TextInput
              multiline
              onChangeText={setText}
              onSubmitEditing={send}
              placeholder="Escreva sua mensagem..."
              placeholderTextColor={colors.inkFaint}
              returnKeyType="send"
              style={styles.input}
              value={text}
            />
            <Pressable
              disabled={!text.trim() || sending}
              onPress={send}
              style={({ pressed }) => [
                styles.send,
                (!text.trim() || sending) && styles.sendDisabled,
                pressed && styles.pressed,
              ]}
            >
              {sending ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Feather color={colors.white} name="send" size={17} />
              )}
            </Pressable>
          </View>
          <Text style={styles.composerHint}>
            Normalmente respondemos em poucos minutos durante o horário comercial.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function EmptyChat() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Feather color={colors.green700} name="message-circle" size={24} />
      </View>
      <Text style={styles.emptyTitle}>Como podemos ajudar?</Text>
      <Text style={styles.emptyText}>
        Conte sua dúvida ou dificuldade. Sua mensagem será enviada diretamente para nossa equipe.
      </Text>
      <View style={styles.welcomeBubble}>
        <Text style={styles.welcomeText}>
          Olá! Você está falando com o suporte ECOMOPAR. Envie uma mensagem para iniciar o atendimento.
        </Text>
        <Text style={styles.welcomeTime}>Agora</Text>
      </View>
    </View>
  );
}

function MessageBubble({ message }: { message: SupportMessage }) {
  const mine = message.senderRole === "member";
  const time = message.createdAt?.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <View style={[styles.messageRow, mine && styles.messageRowMine]}>
      {!mine && (
        <View style={styles.miniAvatar}>
          <Feather color={colors.white} name="headphones" size={12} />
        </View>
      )}
      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleAdmin]}>
        {!mine && <Text style={styles.agentName}>Suporte ECOMOPAR</Text>}
        <Text style={[styles.messageText, mine && styles.messageTextMine]}>{message.text}</Text>
        <View style={styles.messageMeta}>
          <Text style={[styles.messageTime, mine && styles.messageTimeMine]}>{time || "Enviando"}</Text>
          {mine && <Feather color="rgba(255,255,255,0.6)" name="check" size={11} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.green900, flex: 1 },
  keyboard: { flex: 1 },
  header: {
    alignItems: "center",
    backgroundColor: colors.green900,
    flexDirection: "row",
    gap: 10,
    paddingBottom: 16,
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  back: { alignItems: "center", height: 38, justifyContent: "center", width: 30 },
  agentAvatar: {
    alignItems: "center",
    backgroundColor: colors.green500,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 15,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  onlineDot: {
    backgroundColor: "#6FE2B5",
    borderColor: colors.green900,
    borderRadius: 5,
    borderWidth: 2,
    bottom: -1,
    height: 10,
    position: "absolute",
    right: -1,
    width: 10,
  },
  headerCopy: { flex: 1 },
  headerTitle: { color: colors.white, fontFamily: fonts.bold, fontSize: 14 },
  headerStatus: { color: "rgba(255,255,255,0.54)", fontFamily: fonts.regular, fontSize: 9.5, marginTop: 2 },
  secure: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 11, height: 36, justifyContent: "center", width: 36 },
  conversation: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flex: 1,
    overflow: "hidden",
  },
  dayPill: { alignSelf: "center", backgroundColor: colors.green100, borderRadius: 12, marginTop: 12, paddingHorizontal: 10, paddingVertical: 5 },
  dayText: { color: colors.green700, fontFamily: fonts.bold, fontSize: 7.5, letterSpacing: 0.9 },
  center: { alignItems: "center", flex: 1, justifyContent: "center" },
  messages: { flexGrow: 1, paddingBottom: 20, paddingHorizontal: 16, paddingTop: 12 },
  empty: { alignItems: "center", flex: 1, justifyContent: "center", minHeight: 430, paddingHorizontal: 12 },
  emptyIcon: { alignItems: "center", backgroundColor: colors.green100, borderRadius: 19, height: 62, justifyContent: "center", width: 62 },
  emptyTitle: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 19, letterSpacing: -0.4, marginTop: 15 },
  emptyText: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 11.5, lineHeight: 18, marginTop: 6, maxWidth: 290, textAlign: "center" },
  welcomeBubble: { alignSelf: "flex-start", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 17, borderTopLeftRadius: 5, borderWidth: 1, marginTop: 24, maxWidth: "88%", padding: 13, ...shadow },
  welcomeText: { color: colors.ink, fontFamily: fonts.regular, fontSize: 11, lineHeight: 17 },
  welcomeTime: { color: colors.inkFaint, fontFamily: fonts.medium, fontSize: 8, marginTop: 5, textAlign: "right" },
  messageRow: { alignItems: "flex-end", flexDirection: "row", gap: 7, marginVertical: 4 },
  messageRowMine: { justifyContent: "flex-end" },
  miniAvatar: { alignItems: "center", backgroundColor: colors.green600, borderRadius: 10, height: 28, justifyContent: "center", width: 28 },
  bubble: { borderRadius: 17, maxWidth: "79%", paddingHorizontal: 13, paddingVertical: 10 },
  bubbleMine: { backgroundColor: colors.green700, borderBottomRightRadius: 5 },
  bubbleAdmin: { backgroundColor: colors.surface, borderBottomLeftRadius: 5, borderColor: colors.line, borderWidth: 1 },
  agentName: { color: colors.green700, fontFamily: fonts.bold, fontSize: 8.5, marginBottom: 3 },
  messageText: { color: colors.ink, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18 },
  messageTextMine: { color: colors.white },
  messageMeta: { alignItems: "center", flexDirection: "row", gap: 3, justifyContent: "flex-end", marginTop: 4 },
  messageTime: { color: colors.inkFaint, fontFamily: fonts.medium, fontSize: 7.5 },
  messageTimeMine: { color: "rgba(255,255,255,0.52)" },
  composerWrap: { backgroundColor: colors.surface, paddingBottom: 5, paddingHorizontal: 14, paddingTop: 10 },
  composer: { alignItems: "flex-end", backgroundColor: colors.background, borderColor: colors.line, borderRadius: 18, borderWidth: 1, flexDirection: "row", minHeight: 52, padding: 5, paddingLeft: 14 },
  input: { color: colors.ink, flex: 1, fontFamily: fonts.regular, fontSize: 12, maxHeight: 100, minHeight: 40, paddingVertical: 10 },
  send: { alignItems: "center", backgroundColor: colors.green600, borderRadius: 14, height: 42, justifyContent: "center", width: 42 },
  sendDisabled: { backgroundColor: colors.inkFaint, opacity: 0.42 },
  composerHint: { color: colors.inkFaint, fontFamily: fonts.regular, fontSize: 7.5, marginTop: 6, textAlign: "center" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
});
