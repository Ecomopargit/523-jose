"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { useMemberSession } from "@/hooks/useMemberSession";
import {
  formatMemberSince,
  initialsFromName,
  updateMemberSelf,
  vehicleLabel,
  type MemberProfile,
  type MemberSelfUpdateInput,
} from "@/lib/member-store";
import {
  birthDateFromIso,
  birthDateToIso,
  formatBirthDate,
  formatCep,
  formatCpf,
  formatPhone,
  formatPlaca,
  isValidCpf,
} from "@/lib/input-format";
import { removeMemberPhotoWeb, uploadMemberPhotoWeb } from "@/lib/profile-photo";
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
  Pencil,
  X,
  Check,
  Camera,
  Trash2,
} from "lucide-react";

const ESTADOS = [
  "SP", "RJ", "MG", "RS", "PR", "SC", "BA", "PE", "CE", "DF", "GO", "ES",
  "MT", "MS", "PA", "AM", "MA", "PB", "RN", "AL", "SE", "TO", "RO", "AC", "AP", "RR", "PI",
];

function toForm(member: MemberProfile): MemberSelfUpdateInput {
  return {
    nome: member.nome,
    cpf: formatCpf(member.cpf),
    telefone: formatPhone(member.telefone),
    dataNascimento: birthDateFromIso(member.dataNascimento),
    endereco: member.endereco,
    cidade: member.cidade,
    estado: member.estado,
    cep: formatCep(member.cep),
    tipoVeiculo: member.tipoVeiculo,
    modelo: member.modelo,
    carroProprio: member.carroProprio,
    locadora: member.locadora,
    placa: formatPlaca(member.placa),
    chavePix: member.chavePix,
  };
}

export default function PerfilPage() {
  const { member, ready, refresh } = useMemberSession();
  const [form, setForm] = useState<MemberSelfUpdateInput | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const set = <K extends keyof MemberSelfUpdateInput>(
    key: K,
    value: MemberSelfUpdateInput[K],
  ) => {
    setForm((current) => (current ? { ...current, [key]: value } : current));
    setError("");
  };

  const startEdit = () => {
    setForm(toForm(member));
    setError("");
    setSaved(false);
  };

  const cancelEdit = () => {
    setForm(null);
    setError("");
  };

  const handleSave = async () => {
    if (!form) return;
    if (!form.nome.trim()) return setError("Informe seu nome completo.");
    if (!isValidCpf(form.cpf)) return setError("CPF inválido. Confira os 11 dígitos.");
    if (!form.telefone.trim()) return setError("Informe um telefone para contato.");

    setSaving(true);
    setError("");
    const result = await updateMemberSelf({
      ...form,
      dataNascimento: birthDateToIso(form.dataNascimento),
    });
    setSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    await refresh();
    setForm(null);
    setSaved(true);
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setPhotoBusy(true);
    setPhotoError("");
    const result = await uploadMemberPhotoWeb(file);
    setPhotoBusy(false);

    if (!result.ok) {
      setPhotoError(result.error);
      return;
    }
    await refresh();
  };

  const handleRemovePhoto = async () => {
    setPhotoBusy(true);
    setPhotoError("");
    const result = await removeMemberPhotoWeb();
    setPhotoBusy(false);
    if (!result.ok) {
      setPhotoError(result.error);
      return;
    }
    await refresh();
  };

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
        ? member.referralCode
          ? `Aderiu · seu código ${member.referralCode}`
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
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-[24px] bg-white/12 border border-white/15 flex items-center justify-center font-display font-bold text-2xl text-white shadow-inner overflow-hidden">
                  {member.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt="" className="h-full w-full object-cover" src={member.photoURL} />
                  ) : (
                    initialsFromName(member.nome)
                  )}
                </div>
                <button
                  type="button"
                  disabled={photoBusy}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-green-500 text-white shadow-md transition hover:bg-green-400 disabled:opacity-60"
                  aria-label="Adicionar foto de perfil"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => void handlePhotoChange(event)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={photoBusy}
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-green-100 hover:text-white disabled:opacity-60"
                >
                  {photoBusy ? "Enviando…" : member.photoURL ? "Alterar foto" : "Adicionar foto"}
                </button>
                {member.photoURL ? (
                  <button
                    type="button"
                    disabled={photoBusy}
                    onClick={() => void handleRemovePhoto()}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white/45 hover:text-white/75 disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remover
                  </button>
                ) : null}
              </div>
              {photoError ? <p className="text-xs text-red-200 text-center max-w-[220px]">{photoError}</p> : null}
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
            {form ? (
              <button type="button" onClick={cancelEdit} className="btn-ghost btn-sm text-ink-soft shrink-0">
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Cancelar</span>
              </button>
            ) : (
              <button type="button" onClick={startEdit} className="btn-outline btn-sm shrink-0">
                <Pencil className="w-4 h-4" />
                <span>Editar</span>
              </button>
            )}
          </div>

          {saved && !form ? (
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
              <Check className="w-4 h-4 shrink-0" />
              Dados atualizados com sucesso.
            </div>
          ) : null}

          {form ? (
            <form
              className="mt-6 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSave();
              }}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="perfil-nome" className="text-[13px] font-semibold block mb-1.5">
                    Nome completo
                  </label>
                  <input
                    id="perfil-nome"
                    className="field"
                    value={form.nome}
                    onChange={(e) => set("nome", e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="perfil-cpf" className="text-[13px] font-semibold block mb-1.5">
                    CPF
                  </label>
                  <input
                    id="perfil-cpf"
                    className="field font-mono-num"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={(e) => set("cpf", formatCpf(e.target.value))}
                  />
                </div>

                <div>
                  <label htmlFor="perfil-telefone" className="text-[13px] font-semibold block mb-1.5">
                    Telefone / WhatsApp
                  </label>
                  <input
                    id="perfil-telefone"
                    className="field"
                    inputMode="tel"
                    placeholder="(11) 90000-0000"
                    value={form.telefone}
                    onChange={(e) => set("telefone", formatPhone(e.target.value))}
                  />
                </div>

                <div>
                  <label htmlFor="perfil-nascimento" className="text-[13px] font-semibold block mb-1.5">
                    Data de nascimento
                  </label>
                  <input
                    id="perfil-nascimento"
                    className="field font-mono-num"
                    inputMode="numeric"
                    placeholder="DD/MM/AAAA"
                    value={form.dataNascimento}
                    onChange={(e) => set("dataNascimento", formatBirthDate(e.target.value))}
                  />
                </div>

                <div>
                  <label htmlFor="perfil-pix" className="text-[13px] font-semibold block mb-1.5">
                    Chave PIX
                  </label>
                  <input
                    id="perfil-pix"
                    className="field"
                    value={form.chavePix}
                    onChange={(e) => set("chavePix", e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="perfil-endereco" className="text-[13px] font-semibold block mb-1.5">
                    Endereço
                  </label>
                  <input
                    id="perfil-endereco"
                    className="field"
                    value={form.endereco}
                    onChange={(e) => set("endereco", e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="perfil-cidade" className="text-[13px] font-semibold block mb-1.5">
                    Cidade
                  </label>
                  <input
                    id="perfil-cidade"
                    className="field"
                    value={form.cidade}
                    onChange={(e) => set("cidade", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="perfil-estado" className="text-[13px] font-semibold block mb-1.5">
                      Estado
                    </label>
                    <select
                      id="perfil-estado"
                      className="field"
                      value={form.estado}
                      onChange={(e) => set("estado", e.target.value)}
                    >
                      <option value="">UF</option>
                      {ESTADOS.map((uf) => (
                        <option key={uf} value={uf}>
                          {uf}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="perfil-cep" className="text-[13px] font-semibold block mb-1.5">
                      CEP
                    </label>
                    <input
                      id="perfil-cep"
                      className="field font-mono-num"
                      inputMode="numeric"
                      placeholder="00000-000"
                      value={form.cep}
                      onChange={(e) => set("cep", formatCep(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="perfil-tipo" className="text-[13px] font-semibold block mb-1.5">
                    Tipo de veículo
                  </label>
                  <input
                    id="perfil-tipo"
                    className="field"
                    placeholder="Carro, moto, van…"
                    value={form.tipoVeiculo}
                    onChange={(e) => set("tipoVeiculo", e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="perfil-modelo" className="text-[13px] font-semibold block mb-1.5">
                    Modelo
                  </label>
                  <input
                    id="perfil-modelo"
                    className="field"
                    value={form.modelo}
                    onChange={(e) => set("modelo", e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="perfil-placa" className="text-[13px] font-semibold block mb-1.5">
                    Placa
                  </label>
                  <input
                    id="perfil-placa"
                    className="field font-mono-num uppercase"
                    placeholder="ABC1D23"
                    value={form.placa}
                    onChange={(e) => set("placa", formatPlaca(e.target.value))}
                  />
                </div>

                <div>
                  <label htmlFor="perfil-propriedade" className="text-[13px] font-semibold block mb-1.5">
                    Propriedade do veículo
                  </label>
                  <select
                    id="perfil-propriedade"
                    className="field"
                    value={form.carroProprio}
                    onChange={(e) =>
                      set("carroProprio", e.target.value as MemberProfile["carroProprio"])
                    }
                  >
                    <option value="">Não informado</option>
                    <option value="sim">Veículo próprio</option>
                    <option value="nao">Alugado</option>
                  </select>
                </div>

                {form.carroProprio === "nao" ? (
                  <div className="sm:col-span-2">
                    <label htmlFor="perfil-locadora" className="text-[13px] font-semibold block mb-1.5">
                      Locadora
                    </label>
                    <input
                      id="perfil-locadora"
                      className="field"
                      value={form.locadora}
                      onChange={(e) => set("locadora", e.target.value)}
                    />
                  </div>
                ) : null}
              </div>

              {error ? (
                <div className="rounded-[14px] border border-brick-100 bg-brick-100/40 px-3.5 py-3 text-[13px] text-brick-600">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" disabled={saving} className="btn-primary btn-md sm:w-auto">
                  {saving ? "Salvando…" : "Salvar alterações"}
                </button>
                <button type="button" onClick={cancelEdit} className="btn-outline btn-md sm:w-auto">
                  Cancelar
                </button>
              </div>

              <p className="text-xs text-ink-faint">
                O e-mail de acesso e os saldos não podem ser alterados por aqui.
              </p>
            </form>
          ) : (
            <>
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
                  <p className="text-xs text-ink-soft mt-1">
                    Use o botão Editar para atualizar CPF, contato, endereço e veículo.
                  </p>
                </div>
                <button type="button" onClick={startEdit} className="btn-outline btn-sm shrink-0">
                  Editar dados
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
