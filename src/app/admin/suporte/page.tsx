"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCheck,
  CircleUserRound,
  Headphones,
  Inbox,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
} from "lucide-react";
import AdminShell from "@/components/AdminShell";
import {
  markAdminSupportRead,
  sendAdminSupportMessage,
  setSupportChatStatus,
  subscribeAdminSupportMessages,
  subscribeSupportChats,
  type SupportChat,
  type SupportMessage,
} from "@/lib/support-store";

function formatTime(date: Date | null) {
  if (!date) return "";
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AdminSupportPage() {
  const [chats, setChats] = useState<SupportChat[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const selected = chats.find((chat) => chat.id === selectedId) ?? null;
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return chats;
    return chats.filter(
      (chat) =>
        chat.memberName.toLowerCase().includes(term) ||
        chat.memberEmail.toLowerCase().includes(term),
    );
  }, [chats, search]);
  const pendingCount = chats.reduce((total, chat) => total + chat.unreadByAdmin, 0);

  useEffect(
    () =>
      subscribeSupportChats(
        (nextChats) => {
          setChats(nextChats);
          setSelectedId((current) => current ?? nextChats[0]?.id ?? null);
          setLoading(false);
        },
        () => {
          setError("Não foi possível carregar os atendimentos.");
          setLoading(false);
        },
      ),
    [],
  );

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    void markAdminSupportRead(selectedId).catch(() => undefined);
    return subscribeAdminSupportMessages(
      selectedId,
      (nextMessages) => {
        setMessages(nextMessages);
        requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
      },
      () => setError("Não foi possível carregar esta conversa."),
    );
  }, [selectedId]);

  async function send() {
    if (!selected || !text.trim() || sending) return;
    const pendingText = text;
    setText("");
    setSending(true);
    try {
      await sendAdminSupportMessage(selected, pendingText);
    } catch {
      setText(pendingText);
      setError("Falha ao enviar a mensagem.");
    } finally {
      setSending(false);
    }
  }

  return (
    <AdminShell
      title="Central de atendimento"
      subtitle="Converse em tempo real com os associados"
      headerRight={
        <div className="hidden sm:flex items-center gap-2 rounded-xl bg-green-100 px-3 py-2 text-xs font-semibold text-green-700">
          <MessageCircle className="h-4 w-4" />
          {pendingCount} {pendingCount === 1 ? "mensagem pendente" : "mensagens pendentes"}
        </div>
      }
    >
      <div className="overflow-hidden rounded-[24px] border border-line-soft bg-white shadow-[0_18px_50px_rgba(11,61,44,0.08)]">
        <div className="grid min-h-[680px] lg:grid-cols-[340px_1fr]">
          <aside className="border-b border-line-soft bg-[#f8faf7] lg:border-b-0 lg:border-r">
            <div className="border-b border-line-soft p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">Conversas</p>
                  <p className="mt-0.5 text-[11px] text-ink-faint">{chats.length} atendimentos</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-900 text-white">
                  <Headphones className="h-4 w-4" />
                </div>
              </div>
              <label className="flex items-center gap-2 rounded-xl border border-line bg-white px-3">
                <Search className="h-4 w-4 text-ink-faint" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar associado..."
                  className="h-10 min-w-0 flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-ink-faint"
                />
              </label>
            </div>

            <div className="max-h-[575px] overflow-y-auto p-2">
              {loading && <p className="p-5 text-center text-xs text-ink-faint">Carregando conversas...</p>}
              {!loading && filtered.length === 0 && (
                <div className="p-8 text-center">
                  <Inbox className="mx-auto h-7 w-7 text-green-600" />
                  <p className="mt-3 text-sm font-semibold text-ink">Nenhuma conversa</p>
                  <p className="mt-1 text-xs text-ink-faint">As mensagens dos associados aparecerão aqui.</p>
                </div>
              )}
              {filtered.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setSelectedId(chat.id)}
                  className={`mb-1 flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                    selectedId === chat.id
                      ? "bg-green-900 text-white shadow-md"
                      : "hover:bg-green-50"
                  }`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-xs font-bold ${
                    selectedId === chat.id ? "bg-white/12 text-white" : "bg-green-100 text-green-700"
                  }`}>
                    {initials(chat.memberName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs font-semibold">{chat.memberName}</p>
                      <span className={`text-[9px] ${selectedId === chat.id ? "text-white/50" : "text-ink-faint"}`}>
                        {formatTime(chat.lastMessageAt)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <p className={`flex-1 truncate text-[10px] ${selectedId === chat.id ? "text-white/55" : "text-ink-soft"}`}>
                        {chat.lastMessage}
                      </p>
                      {chat.unreadByAdmin > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-green-400 px-1 text-[9px] font-bold text-green-950">
                          {chat.unreadByAdmin}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="flex min-h-[680px] flex-col bg-[#f3f4f1]">
            {selected ? (
              <>
                <header className="flex items-center gap-3 border-b border-line-soft bg-white px-5 py-4">
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-[14px] bg-green-100 text-xs font-bold text-green-700">
                    {initials(selected.memberName)}
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{selected.memberName}</p>
                    <p className="truncate text-[10px] text-ink-faint">{selected.memberEmail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void setSupportChatStatus(selected.id, selected.status === "open" ? "closed" : "open")}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-semibold ${
                      selected.status === "open"
                        ? "bg-green-100 text-green-700"
                        : "bg-line-soft text-ink-soft"
                    }`}
                  >
                    {selected.status === "open" ? <Check className="h-3.5 w-3.5" /> : <MessageCircle className="h-3.5 w-3.5" />}
                    {selected.status === "open" ? "Encerrar atendimento" : "Reabrir"}
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto p-5">
                  <div className="mx-auto mb-6 flex w-fit items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-green-700">
                    <ShieldCheck className="h-3 w-3" />
                    Conversa protegida
                  </div>
                  {messages.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center pb-24 text-center">
                      <CircleUserRound className="h-9 w-9 text-green-600" />
                      <p className="mt-3 text-sm font-semibold text-ink">Inicie o atendimento</p>
                      <p className="mt-1 max-w-xs text-xs text-ink-faint">Envie uma mensagem para conversar com este associado.</p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const mine = message.senderRole === "admin";
                      return (
                        <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${
                            mine
                              ? "rounded-br-md bg-green-800 text-white"
                              : "rounded-bl-md border border-line-soft bg-white text-ink shadow-sm"
                          }`}>
                            {!mine && <p className="mb-1 text-[9px] font-semibold text-green-700">{selected.memberName}</p>}
                            <p className="whitespace-pre-wrap text-xs leading-relaxed">{message.text}</p>
                            <div className={`mt-1.5 flex items-center justify-end gap-1 text-[8px] ${mine ? "text-white/50" : "text-ink-faint"}`}>
                              {formatTime(message.createdAt)}
                              {mine && <CheckCheck className="h-3 w-3" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div ref={endRef} />
                </div>

                <div className="border-t border-line-soft bg-white p-4">
                  {error && <p className="mb-2 text-center text-[10px] text-brick-600">{error}</p>}
                  <div className="flex items-end gap-2 rounded-2xl border border-line bg-[#f8faf7] p-2 pl-4 focus-within:border-green-400">
                    <textarea
                      rows={1}
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          void send();
                        }
                      }}
                      placeholder="Digite sua resposta..."
                      className="max-h-28 min-h-10 flex-1 resize-none bg-transparent py-2 text-xs text-ink outline-none placeholder:text-ink-faint"
                    />
                    <button
                      type="button"
                      disabled={!text.trim() || sending}
                      onClick={() => void send()}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Enviar mensagem"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                  <Headphones className="h-7 w-7 text-green-700" />
                </div>
                <p className="mt-4 text-base font-semibold text-ink">Central de atendimento</p>
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-ink-faint">
                  Selecione uma conversa para responder ao associado em tempo real.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
