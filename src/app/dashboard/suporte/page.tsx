"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Headphones, Loader2, Send, Shield } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import { useMemberSession } from "@/hooks/useMemberSession";
import {
  markMemberSupportRead,
  sendMemberSupportMessage,
  subscribeMemberSupportMessages,
  type SupportMessage,
} from "@/lib/support-store";

function formatTime(date: Date | null) {
  if (!date) return "Agora";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function DashboardSuportePage() {
  const { member, ready } = useMemberSession();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!member) return;
    setLoading(true);
    void markMemberSupportRead(member.id);
    return subscribeMemberSupportMessages(
      member.id,
      (next) => {
        setMessages(next);
        setLoading(false);
        setError("");
        void markMemberSupportRead(member.id);
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
      },
      () => {
        setLoading(false);
        setError("Não foi possível carregar a conversa agora.");
      },
    );
  }, [member]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!member || !text.trim() || sending) return;
    const pending = text;
    setText("");
    setSending(true);
    setError("");
    try {
      await sendMemberSupportMessage(
        { id: member.id, nome: member.nome, email: member.email },
        pending,
      );
    } catch {
      setText(pending);
      setError("Mensagem não enviada. Verifique a conexão e tente novamente.");
    } finally {
      setSending(false);
    }
  }

  if (!ready) {
    return (
      <DashboardShell showBack>
        <div className="card p-8 text-center text-sm text-ink-soft">Carregando…</div>
      </DashboardShell>
    );
  }

  if (!member) {
    return (
      <DashboardShell showBack>
        <div className="card mx-auto max-w-lg p-8 text-center">
          <h2 className="mb-2 font-display text-lg font-semibold">Faça login para falar com o suporte</h2>
          <p className="mb-5 text-sm text-ink-soft">
            Entre com a mesma conta do app para enviar e receber mensagens.
          </p>
          <Link href="/login" className="btn-primary btn-md">
            Fazer login
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell showBack>
      <div className="mx-auto flex h-[min(720px,calc(100dvh-8.5rem))] max-w-3xl flex-col overflow-hidden rounded-[22px] border border-line bg-surface shadow-sm">
        <div className="flex items-center gap-3 border-b border-line bg-green-950 px-4 py-3.5 text-white">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12">
            <Headphones className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-green-950 bg-green-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Suporte ECOMOPAR</p>
            <p className="text-[11px] text-white/55">Equipe disponível para ajudar</p>
          </div>
          <Shield className="h-4 w-4 text-green-300" />
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-[#F4F7F5] px-4 py-4">
          <div className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-[9px] font-bold tracking-[0.14em] text-green-700 shadow-sm">
            ATENDIMENTO SEGURO
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-line bg-white p-5 text-center">
              <p className="text-sm font-semibold text-ink">Como podemos ajudar?</p>
              <p className="mt-1.5 text-xs leading-5 text-ink-soft">
                Envie sua dúvida sobre depósito, saque, indicação ou cadastro. Nossa equipe responde por aqui.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const mine = message.senderRole === "member";
              return (
                <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 ${
                      mine
                        ? "rounded-br-md bg-green-700 text-white"
                        : "rounded-bl-md border border-line bg-white text-ink"
                    }`}
                  >
                    {!mine ? (
                      <p className="mb-1 text-[10px] font-semibold text-green-700">Suporte ECOMOPAR</p>
                    ) : null}
                    <p className="whitespace-pre-wrap text-[13px] leading-5">{message.text}</p>
                    <p className={`mt-1 text-right text-[10px] ${mine ? "text-white/55" : "text-ink-faint"}`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {error ? (
          <p className="border-t border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-800">{error}</p>
        ) : null}

        <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-line bg-white p-3">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={1}
            placeholder="Digite sua mensagem…"
            className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border border-line bg-[#F7FAF8] px-3 py-2.5 text-sm outline-none ring-green-600/20 focus:ring-2"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-700 text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Enviar mensagem"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}
