"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { useAdminSession } from "@/hooks/useAdminSession";
import { brl } from "@/lib/dashboard-meta";
import {
  deleteMemberAdmin,
  initialsFromName,
  saldoTotal,
  updateMemberAdmin,
  vehicleLabel,
  type MemberProfile,
  type MemberStatus,
} from "@/lib/member-store";
import {
  Search,
  Filter,
  X,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Car,
  KeyRound,
  Trash2,
  Save,
  Users,
  UserCheck,
  UserRoundX,
  LoaderCircle,
  Gift,
  Share2,
  CheckCircle2,
} from "lucide-react";
import {
  getMemberReferralDossier,
  REFERRAL_BONUS,
  REFERRALS_PER_BONUS,
  type AdminReferralDossier,
  type AdminReferredPerson,
} from "@/lib/referral-admin";

const statusOptions: { value: MemberStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendente", label: "Pendentes" },
  { value: "ativo", label: "Ativos" },
  { value: "inadimplente", label: "Inadimplentes" },
  { value: "bloqueado", label: "Bloqueados" },
];

function statusBadge(status: MemberStatus) {
  if (status === "ativo") return "badge-confirmado";
  if (status === "pendente") return "badge-pago";
  if (status === "inadimplente") {
    return "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700";
  }
  return "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brick-100 text-brick-600";
}

function StatusIcon({ status }: { status: MemberStatus }) {
  if (status === "ativo") return <CheckCircle className="w-3 h-3" />;
  if (status === "pendente") return <Clock className="w-3 h-3" />;
  if (status === "inadimplente") return <AlertTriangle className="w-3 h-3" />;
  return <XCircle className="w-3 h-3" />;
}

export default function AssociadosPage() {
  const { members, refresh, ready } = useAdminSession();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<MemberStatus | "todos">("todos");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (filtroStatus !== "todos" && m.status !== filtroStatus) return false;
      if (!busca.trim()) return true;
      const q = busca.toLowerCase();
      return (
        m.nome.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.cpf.includes(q) ||
        m.telefone.includes(q) ||
        m.placa?.toLowerCase().includes(q)
      );
    });
  }, [members, busca, filtroStatus]);

  const selected = members.find((m) => m.id === selectedId) ?? null;

  return (
    <AdminShell
      title="Associados"
      subtitle={`${members.length} cadastrado${members.length === 1 ? "" : "s"} na plataforma`}
    >
      <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Base total", value: members.length, icon: Users },
          { label: "Ativos", value: members.filter((m) => m.status === "ativo").length, icon: UserCheck },
          { label: "Pendentes", value: members.filter((m) => m.status === "pendente").length, icon: Clock },
          { label: "Com atenção", value: members.filter((m) => m.status === "inadimplente" || m.status === "bloqueado").length, icon: UserRoundX },
        ].map((item) => (
          <div key={item.label} className="admin-metric">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-ink-faint">{item.label}</p>
                <p className="mt-2 font-display text-2xl font-semibold">{item.value}</p>
              </div>
              <span className="admin-metric-icon"><item.icon className="h-4 w-4" /></span>
            </div>
          </div>
        ))}
      </section>
      <div className="card p-4 sm:p-5 mb-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Buscar nome, e-mail, CPF, placa..."
              className="field !pl-10"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ink-soft shrink-0" />
            <select
              className="field md:w-auto"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as MemberStatus | "todos")}
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!ready ? (
        <div className="card flex min-h-64 items-center justify-center text-sm text-ink-soft">
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-green-700" /> Carregando associados...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-display font-semibold text-ink mb-1">Nenhum associado encontrado</p>
          <p className="text-sm text-ink-soft">
            Quando alguém se cadastrar em /cadastrar, aparece aqui automaticamente.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead className="admin-table-head">
                <tr>
                  {["Associado", "Contato", "Status", "Reserva", "Cadastro", ""].map((h) => (
                    <th
                      key={h || "actions"}
                      className="px-5 py-3.5 text-left text-[10.5px] font-semibold text-ink-faint uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {filtered.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-green-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedId(m.id)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {initialsFromName(m.nome)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink text-sm truncate">{m.nome}</p>
                          <p className="text-[12px] text-ink-soft font-mono-num">{m.cpf || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-ink truncate max-w-[180px]">{m.email}</p>
                      <p className="text-[12.5px] text-ink-soft">{m.telefone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={statusBadge(m.status)}>
                        <StatusIcon status={m.status} />
                        {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono-num font-semibold text-green-700 text-sm whitespace-nowrap">
                      {brl(saldoTotal(m))}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-ink-soft whitespace-nowrap">
                      {new Date(m.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        className="text-[13px] font-semibold text-green-700 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(m.id);
                        }}
                      >
                        Gerenciar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <MemberDrawer
          member={selected}
          onClose={() => setSelectedId(null)}
          onSaved={() => refresh()}
        />
      )}
    </AdminShell>
  );
}

function MemberDrawer({
  member,
  onClose,
  onSaved,
}: {
  member: MemberProfile;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const [status, setStatus] = useState<MemberStatus>(member.status);
  const [saldoDisponivel, setSaldoDisponivel] = useState(String(member.saldoDisponivel));
  const [saldoBloqueado, setSaldoBloqueado] = useState(String(member.saldoBloqueado));
  const [saldoBonus, setSaldoBonus] = useState(String(member.saldoBonus));
  const [depositosCount, setDepositosCount] = useState(String(member.depositosCount));
  const [notasAdmin, setNotasAdmin] = useState(member.notasAdmin);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- synchronize editable draft when drawer target changes */
    setStatus(member.status);
    setSaldoDisponivel(String(member.saldoDisponivel));
    setSaldoBloqueado(String(member.saldoBloqueado));
    setSaldoBonus(String(member.saldoBonus));
    setDepositosCount(String(member.depositosCount));
    setNotasAdmin(member.notasAdmin);
    setMsg("");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [member]);

  const save = async () => {
    setMsg("");
    const result = await updateMemberAdmin(member.id, {
      status,
      saldoDisponivel: Number(saldoDisponivel.replace(",", ".")),
      saldoBloqueado: Number(saldoBloqueado.replace(",", ".")),
      saldoBonus: Number(saldoBonus.replace(",", ".")),
      depositosCount: Number(depositosCount),
      notasAdmin,
    });
    if (!result.ok) {
      setMsg(result.error);
      return;
    }
    setMsg("Alterações salvas.");
    await onSaved();
  };

  const remove = async () => {
    if (!confirm(`Remover o cadastro de ${member.nome}? Esta ação não pode ser desfeita.`)) return;
    const result = await deleteMemberAdmin(member.id);
    if (!result.ok) {
      setMsg(result.error);
      return;
    }
    await onSaved();
    onClose();
  };

  return (
    <div className="admin-member-overlay">
      <button type="button" className="admin-member-scrim" aria-label="Fechar" onClick={onClose} />
      <aside className="admin-member-sheet" role="dialog" aria-modal="true" aria-labelledby="admin-member-title">
        <div className="admin-member-sheet-glow" aria-hidden="true" />

        <header className="admin-member-head">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="admin-member-avatar">{initialsFromName(member.nome)}</div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-green-700/80">Ficha do associado</p>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <h2 id="admin-member-title" className="font-display text-[1.35rem] font-semibold tracking-tight text-ink truncate leading-none">
                  {member.nome}
                </h2>
                <span className={statusBadge(member.status)}>
                  <StatusIcon status={member.status} />
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </span>
              </div>
              <p className="mt-1.5 text-[12.5px] text-ink-soft truncate">{member.email}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="admin-member-close" aria-label="Fechar">
            <X className="w-[18px] h-[18px]" />
          </button>
        </header>

        <div className="admin-member-body">
          <div className="admin-member-balances">
            <div>
              <p>Disponível</p>
              <strong className="text-green-700">{brl(member.saldoDisponivel)}</strong>
            </div>
            <div>
              <p>Bloqueado</p>
              <strong className="text-brick-600">{brl(member.saldoBloqueado)}</strong>
            </div>
            <div>
              <p>Bônus</p>
              <strong className="text-amber-700">{brl(member.saldoBonus)}</strong>
            </div>
          </div>

          <section className="admin-member-block">
            <div className="admin-member-block-title">
              <h3>Dados cadastrais</h3>
              <span>Cadastro</span>
            </div>
            <div className="admin-member-info-list">
              <InfoLine icon={Mail} label="E-mail" value={member.email} />
              <InfoLine icon={Phone} label="Telefone" value={member.telefone || "—"} />
              <InfoLine
                icon={MapPin}
                label="Endereço"
                value={[member.endereco, member.cidade && `${member.cidade}-${member.estado}`, member.cep]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              />
              <InfoLine icon={Car} label="Veículo" value={vehicleLabel(member)} />
              <InfoLine icon={KeyRound} label="Chave PIX" value={member.chavePix || "—"} />
            </div>
          </section>

          <ReferralAdminSection member={member} />

          <section className="admin-member-block">
            <div className="admin-member-block-title">
              <h3>Gestão</h3>
              <span>Controles</span>
            </div>

            <div>
              <label className="text-[13px] font-semibold block mb-1.5">Status</label>
              <select className="field" value={status} onChange={(e) => setStatus(e.target.value as MemberStatus)}>
                <option value="pendente">Pendente</option>
                <option value="ativo">Ativo</option>
                <option value="inadimplente">Inadimplente</option>
                <option value="bloqueado">Bloqueado</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-semibold block mb-1.5">Saldo disponível (R$)</label>
                <input className="field font-mono-num" value={saldoDisponivel} onChange={(e) => setSaldoDisponivel(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-semibold block mb-1.5">Saldo bloqueado (R$)</label>
                <input className="field font-mono-num" value={saldoBloqueado} onChange={(e) => setSaldoBloqueado(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-semibold block mb-1.5">Saldo bônus (R$)</label>
                <input className="field font-mono-num" value={saldoBonus} onChange={(e) => setSaldoBonus(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-semibold block mb-1.5">Nº depósitos</label>
                <input className="field font-mono-num" value={depositosCount} onChange={(e) => setDepositosCount(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-semibold block mb-1.5">Notas internas</label>
              <textarea
                className="field min-h-[90px]"
                placeholder="Observações do admin..."
                value={notasAdmin}
                onChange={(e) => setNotasAdmin(e.target.value)}
              />
            </div>

            {msg ? (
              <p className="text-[13px] text-green-700 bg-green-50 border border-line-soft rounded-[12px] px-3 py-2">
                {msg}
              </p>
            ) : null}
          </section>
        </div>

        <footer className="admin-member-foot">
          <button type="button" onClick={save} className="btn-primary btn-md flex-1">
            <Save className="w-4 h-4" />
            Salvar alterações
          </button>
          <button
            type="button"
            onClick={remove}
            className="btn-outline btn-md text-brick-600 border-brick-100 hover:bg-brick-100/40"
          >
            <Trash2 className="w-4 h-4" />
            Remover
          </button>
        </footer>
      </aside>
    </div>
  );
}

function ReferralAdminSection({ member }: { member: MemberProfile }) {
  const [dossier, setDossier] = useState<AdminReferralDossier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void getMemberReferralDossier(member.id, member)
      .then((data) => {
        if (active) setDossier(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [member]);

  if (loading) {
    return (
      <section className="admin-member-block">
        <div className="admin-member-block-title">
          <h3>Programa de indicação</h3>
          <span>Indique</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-soft py-1">
          <LoaderCircle className="w-4 h-4 animate-spin shrink-0" />
          Carregando indicações…
        </div>
      </section>
    );
  }

  if (!dossier) return null;

  return (
    <section className="space-y-3">
      <div className="admin-member-block !pb-4">
        <div className="admin-member-block-title">
          <h3>Programa de indicação</h3>
          <span>Indique</span>
        </div>

        <div className="rounded-[1.15rem] bg-gradient-to-br from-green-800 to-green-950 text-white p-3.5 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/12 border border-white/10 flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.12em] text-white/55 font-semibold">Código do associado</p>
              <p className="font-mono-num text-base font-semibold tracking-wide truncate">
                {dossier.referralCode || "—"}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">
              {dossier.totalReferrals} indicação{dossier.totalReferrals === 1 ? "" : "ões"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-white/8 border border-white/8 px-2.5 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-wide text-white/50 font-semibold">Válidas</p>
              <p className="mt-1 font-display text-xl font-semibold leading-none">{dossier.validCount}</p>
            </div>
            <div className="rounded-xl bg-white/8 border border-white/8 px-2.5 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-wide text-white/50 font-semibold">Pendentes</p>
              <p className="mt-1 font-display text-xl font-semibold leading-none">{dossier.pendingCount}</p>
            </div>
            <div className="rounded-xl bg-white/8 border border-white/8 px-2.5 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-wide text-white/50 font-semibold">Bônus pago</p>
              <p className="mt-1 font-mono-num text-sm font-semibold leading-none">{brl(dossier.bonusPaid)}</p>
            </div>
          </div>

          <div className="rounded-xl bg-black/15 border border-white/8 px-3 py-3">
            <div className="flex items-center justify-between gap-3 text-[12px] mb-2">
              <span className="text-white/70">Próximo bônus {brl(REFERRAL_BONUS)}</span>
              <span className="font-semibold tabular-nums">
                {dossier.progressToNextBonus}/{REFERRALS_PER_BONUS}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((slot) => (
                <div
                  key={slot}
                  className={`h-1.5 flex-1 rounded-full ${
                    slot < dossier.progressToNextBonus ? "bg-[#d7ef77]" : "bg-white/15"
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-white/55 mt-2 leading-relaxed">
              {dossier.remainingForBonus === 0
                ? "Grupo completo — bônus liberado ao ativar mais indicações."
                : `Faltam ${dossier.remainingForBonus} indicação${dossier.remainingForBonus === 1 ? "" : "ões"} ativa${dossier.remainingForBonus === 1 ? "" : "s"} para liberar ${brl(REFERRAL_BONUS)}.`}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-line-soft bg-[#f7faf7] px-3.5 py-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-faint mb-2">
            Foi indicado por alguém?
          </p>
          {dossier.wasReferred && dossier.referredBy ? (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-[11px] font-bold shrink-0">
                {initialsFromName(dossier.referredBy.nome)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{dossier.referredBy.nome}</p>
                <p className="text-[12px] text-ink-soft truncate">{dossier.referredBy.email}</p>
                <p className="text-[12px] text-ink-faint mt-0.5">
                  Código usado:{" "}
                  <span className="font-mono-num text-ink-soft">
                    {dossier.referredBy.code || member.referredByCode || "—"}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-[13px] text-ink-soft leading-relaxed">
              Não usou código de indicação no cadastro.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-line-soft overflow-hidden bg-white/72">
        <div className="px-3.5 py-2.5 border-b border-line-soft bg-[#f7faf7]/80 flex items-center justify-between gap-2">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
            Pessoas que indicou
          </p>
          <span className="text-[11px] font-semibold text-ink-soft tabular-nums">
            {dossier.totalReferrals}
          </span>
        </div>
        {dossier.madeReferrals.length === 0 ? (
          <p className="px-3.5 py-3.5 text-[13px] text-ink-soft">Ainda não indicou ninguém.</p>
        ) : (
          <div className="divide-y divide-line-soft">
            {dossier.madeReferrals.map((person) => (
              <ReferredAdminRow key={person.id} person={person} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ReferredAdminRow({ person }: { person: AdminReferredPerson }) {
  const activityLabel = person.isDepositing
    ? `${person.depositosCount} dia${person.depositosCount === 1 ? "" : "s"} depositando`
    : person.isActive
      ? "Ativo · sem depósitos"
      : person.memberStatus.charAt(0).toUpperCase() + person.memberStatus.slice(1);

  return (
    <div className="flex items-center gap-3 px-3.5 py-3">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
          person.isValid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
        }`}
      >
        {person.isValid ? <CheckCircle2 className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate text-ink">{person.nome}</p>
        <p className="text-[12px] text-ink-soft truncate">{person.email}</p>
        <p className="text-[11px] text-ink-faint mt-0.5">{activityLabel}</p>
      </div>
      <span className={person.isValid ? "badge-confirmado shrink-0" : "badge-pago shrink-0"}>
        {person.isValid ? "Válida" : "Pendente"}
      </span>
    </div>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="admin-member-info-row">
      <div className="admin-member-info-icon">
        <Icon className="w-[15px] h-[15px]" />
      </div>
      <div className="min-w-0">
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
