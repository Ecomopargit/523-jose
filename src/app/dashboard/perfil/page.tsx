"use client";

import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { useMemberSession } from "@/hooks/useMemberSession";
import {
  formatMemberSince,
  initialsFromName,
  vehicleLabel,
} from "@/lib/member-store";
import {
  Car,
  CreditCard,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Building2,
  KeyRound,
} from "lucide-react";

export default function PerfilPage() {
  const { member, ready } = useMemberSession();

  if (!ready) {
    return (
      <DashboardShell showBack backHref="/dashboard">
        <div className="card p-8 text-center text-ink-soft text-sm">Carregando perfil…</div>
      </DashboardShell>
    );
  }

  if (!member) {
    return (
      <DashboardShell showBack backHref="/dashboard">
        <div className="card p-8 text-center max-w-lg">
          <h2 className="font-display text-lg font-semibold mb-2">Nenhuma sessão ativa</h2>
          <p className="text-sm text-ink-soft mb-5">
            Entre com o e-mail que você usou no cadastro para ver seus dados.
          </p>
          <Link href="/login" className="btn-primary btn-md">
            Fazer login
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const rows = [
    { icon: Mail, label: "E-mail", value: member.email },
    { icon: Phone, label: "Telefone", value: member.telefone || "—" },
    { icon: IdCard, label: "CPF", value: member.cpf || "—" },
    {
      icon: Calendar,
      label: "Nascimento",
      value: member.dataNascimento
        ? new Date(member.dataNascimento + "T12:00:00").toLocaleDateString("pt-BR")
        : "—",
    },
    {
      icon: MapPin,
      label: "Endereço",
      value: [member.endereco, member.cidade && member.estado ? `${member.cidade} — ${member.estado}` : member.cidade, member.cep]
        .filter(Boolean)
        .join(" · ") || "—",
    },
    { icon: Car, label: "Veículo", value: vehicleLabel(member) },
    {
      icon: Building2,
      label: "Propriedade",
      value:
        member.carroProprio === "sim"
          ? "Veículo próprio"
          : member.carroProprio === "nao"
            ? member.locadora
              ? `Alugado — ${member.locadora}`
              : "Alugado"
            : "—",
    },
    { icon: KeyRound, label: "Chave PIX", value: member.chavePix || "—" },
    {
      icon: CreditCard,
      label: "Indique e ganhe",
      value: member.aderiuIndicacao
        ? member.codigoIndicacao
          ? `Aderiu · código ${member.codigoIndicacao}`
          : "Aderiu ao plano"
        : "Não aderiu",
    },
  ];

  return (
    <DashboardShell showBack backHref="/dashboard">
      <div className="grid xl:grid-cols-[360px_1fr] gap-6 items-start animate-fade-up">
        <aside className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-green-800 via-green-900 to-green-950 p-7 text-white shadow-lg xl:sticky xl:top-28">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[38px] border-white/5" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-green-100">
              Perfil verificado
            </span>
            <div className="mt-8 w-20 h-20 rounded-[24px] bg-white/12 border border-white/15 flex items-center justify-center font-display font-bold text-2xl text-white shadow-inner">
              {initialsFromName(member.nome)}
            </div>
            <h2 className="font-display text-2xl font-semibold tracking-tight mt-5 break-words">{member.nome}</h2>
            <p className="text-sm text-white/58 mt-1.5">
              Associado desde {formatMemberSince(member.createdAt)}
            </p>
            <div className="mt-7 pt-6 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-[0.13em] text-white/40 font-semibold">Contato principal</p>
              <p className="text-sm text-green-100 font-medium mt-2 break-all">{member.email}</p>
            </div>
          </div>
        </aside>

        <div className="profile-card">
          <div className="flex items-start justify-between gap-4 mb-2 pb-6 border-b border-line-soft">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-600 mb-2">Dados cadastrais</p>
              <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">Suas informações</h3>
              <p className="text-sm text-ink-soft mt-1">Dados utilizados na sua conta e nos serviços ECOMOPAR.</p>
            </div>
            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-green-50 border border-green-100 items-center justify-center">
              <IdCard className="w-5 h-5 text-green-700" strokeWidth={1.8} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 md:gap-x-8">
            {rows.map((item) => (
              <div key={item.label} className={`info-row ${item.label === "Endereço" ? "md:col-span-2" : ""}`}>
                <div className="icon-badge-lg">
                  <item.icon className="w-[16px] h-[16px] text-green-700" strokeWidth={1.9} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10.5px] uppercase tracking-[0.09em] text-ink-faint font-semibold mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold break-words text-ink">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-2xl border border-green-100 bg-green-50/70 px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">Precisa corrigir alguma informação?</p>
              <p className="text-xs text-ink-soft mt-1">A equipe pode atualizar seus dados cadastrais com segurança.</p>
            </div>
            <span className="hidden sm:inline-flex text-xs font-semibold text-green-700 whitespace-nowrap">Fale com o suporte</span>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
