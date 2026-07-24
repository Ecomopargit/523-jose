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
      <div className="profile-card animate-fade-up">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-line-soft">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center font-display font-bold text-lg text-green-700">
            {initialsFromName(member.nome)}
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold truncate">{member.nome}</h2>
            <p className="text-[12.5px] text-ink-soft mt-0.5">
              Associado desde {formatMemberSince(member.createdAt)}
            </p>
            <p className="text-[12px] text-green-700 font-medium mt-1 truncate">{member.email}</p>
          </div>
        </div>

        {rows.map((item) => (
          <div key={item.label} className="info-row last:border-b-0">
            <div className="icon-badge-lg">
              <item.icon className="w-[15px] h-[15px] text-green-700" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-[10.5px] uppercase tracking-wide text-ink-faint font-semibold mb-0.5">
                {item.label}
              </p>
              <p className="text-sm font-medium break-words">{item.value}</p>
            </div>
          </div>
        ))}

        <p className="text-xs text-ink-soft mt-5 text-center">
          Para atualizar dados cadastrais, fale com o suporte ECOMOPAR.
        </p>
      </div>
    </DashboardShell>
  );
}
