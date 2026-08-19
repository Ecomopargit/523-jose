"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Car,
  CreditCard,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Logo from "@/components/Logo";
import {
  clearCadastroDraft,
  clearCadastroReturn,
  loadCadastroDraft,
  markCadastroReturn,
  saveCadastroDraft,
} from "@/lib/cadastro-draft";
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
import { registerMember } from "@/lib/member-store";
import { ensureReferralProfile } from "@/lib/referral-client";

const ESTADOS = [
  "SP", "RJ", "MG", "RS", "PR", "SC", "BA", "PE", "CE", "DF", "GO", "ES",
  "MT", "MS", "PA", "AM", "MA", "PB", "RN", "AL", "SE", "TO", "RO", "AC", "AP", "RR", "PI",
];

type FormState = {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  tipoVeiculo: string;
  modelo: string;
  carroProprio: "" | "sim" | "nao";
  locadora: string;
  placa: string;
  chavePix: string;
  password: string;
  confirmPassword: string;
  aderiuIndicacao: boolean;
  codigoIndicacao: string;
  aceitaTermos: boolean;
};

const initialForm: FormState = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  dataNascimento: "",
  endereco: "",
  cidade: "",
  estado: "",
  cep: "",
  tipoVeiculo: "",
  modelo: "",
  carroProprio: "",
  locadora: "",
  placa: "",
  chavePix: "",
  password: "",
  confirmPassword: "",
  aderiuIndicacao: false,
  codigoIndicacao: "",
  aceitaTermos: false,
};

const steps = [
  { id: 1, label: "Pessoais", icon: User },
  { id: 2, label: "Veículo", icon: Car },
  { id: 3, label: "Conta", icon: CreditCard },
];

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[13px] font-semibold block mb-1.5 text-ink">
      {children}
      {required && <span className="text-brick-500"> *</span>}
    </label>
  );
}

export default function CadastrarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralFromUrl = (searchParams.get("ref") || searchParams.get("codigo") || "")
    .trim()
    .toUpperCase();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const codigoIndicacao = (form.codigoIndicacao || referralFromUrl).trim().toUpperCase();
  const aderiuIndicacao = form.aderiuIndicacao || Boolean(referralFromUrl);

  const restoreDraft = () => {
    const draft = loadCadastroDraft();
    if (!draft) return;
    setForm({
      ...draft.form,
      cpf: formatCpf(draft.form.cpf),
      telefone: formatPhone(draft.form.telefone),
      cep: formatCep(draft.form.cep),
      dataNascimento: birthDateFromIso(draft.form.dataNascimento),
      placa: formatPlaca(draft.form.placa),
      codigoIndicacao: draft.form.codigoIndicacao.toUpperCase(),
    });
    setStep(draft.step);
  };

  useEffect(() => {
    restoreDraft();
    setDraftReady(true);
  }, []);

  useEffect(() => {
    function handlePageShow() {
      restoreDraft();
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    saveCadastroDraft({ form, step });
  }, [draftReady, form, step]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  function openTerms() {
    saveCadastroDraft({ form, step });
    markCadastroReturn("/cadastrar");
    router.push("/politica-de-privacidade?return=/cadastrar");
  }

  const progress = useMemo(() => ((step - 1) / (steps.length - 1)) * 100, [step]);

  const validateStep = (n: number) => {
    if (n === 1) {
      if (
        !form.nome.trim() ||
        !form.cpf.trim() ||
        !form.dataNascimento ||
        !form.telefone.trim() ||
        !form.email.trim()
      ) {
        setError("Preencha os campos obrigatórios dos dados pessoais.");
        return false;
      }
      if (!isValidCpf(form.cpf)) {
        setError("CPF inválido. Confira os 11 dígitos.");
        return false;
      }
      if (!form.endereco.trim() || !form.cidade.trim() || !form.estado || !form.cep.trim()) {
        setError("Complete o endereço para continuar.");
        return false;
      }
    }
    if (n === 2) {
      if (!form.tipoVeiculo || !form.carroProprio || !form.placa.trim()) {
        setError("Informe tipo, propriedade e placa do veículo.");
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) {
      setStep(1);
      return;
    }
    if (!form.chavePix.trim() || !form.password || !form.aceitaTermos) {
      setError("Informe chave PIX, senha e aceite os termos.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const result = await registerMember({
        nome: form.nome,
        cpf: form.cpf,
        telefone: form.telefone,
        email: form.email,
        dataNascimento: birthDateToIso(form.dataNascimento),
        endereco: form.endereco,
        cidade: form.cidade,
        estado: form.estado,
        cep: form.cep,
        tipoVeiculo: form.tipoVeiculo,
        modelo: form.modelo,
        carroProprio: form.carroProprio,
        locadora: form.locadora,
        placa: form.placa,
        chavePix: form.chavePix,
        aderiuIndicacao,
        codigoIndicacao,
        password: form.password,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      try {
        await ensureReferralProfile({
          referralCode: codigoIndicacao,
          joinCampaign: aderiuIndicacao,
        });
      } catch (referralError) {
        setError(
          referralError instanceof Error
            ? referralError.message
            : "Conta criada, mas não foi possível registrar a indicação.",
        );
        return;
      }

      setDone(true);
      clearCadastroDraft();
      clearCadastroReturn();
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <main className="min-h-dvh bg-bg flex flex-col safe-top">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-md mx-auto w-full">
          <div className="mb-8 animate-fade-up">
            <Logo
              size="lg"
              href="/"
              className="justify-center flex-col items-center text-center [&>div]:flex-col [&>div]:items-center"
            />
          </div>
          <div className="card w-full p-6 sm:p-7 text-center animate-fade-up">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-green-700" />
            </div>
            <h1 className="font-display text-xl font-semibold text-ink mb-2">Conta criada</h1>
            <p className="text-sm text-ink-soft leading-relaxed mb-6">
              Cadastro de <strong className="text-ink">{form.email.trim().toLowerCase()}</strong> pronto.
              Entre com este e-mail e a senha que você definiu.
            </p>
            <button
              type="button"
              className="btn-primary btn-lg w-full"
              onClick={() =>
                router.push(`/login?email=${encodeURIComponent(form.email.trim().toLowerCase())}`)
              }
            >
              Entrar na minha conta
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-bg flex flex-col safe-top">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 max-w-xl mx-auto w-full">
        <div className="mb-6 animate-fade-up">
          <Logo
            size="lg"
            href="/"
            className="justify-center flex-col items-center text-center [&>div]:flex-col [&>div]:items-center"
          />
        </div>

        <div className="card w-full overflow-hidden animate-fade-up">
          <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-line-soft">
            <h1 className="font-display text-xl font-semibold text-ink mb-1">Cadastrar-se</h1>
            <p className="text-sm text-ink-soft mb-5">Crie sua conta ECOMOPAR</p>

            <div className="flex items-center justify-between gap-2 mb-3">
              {steps.map((s) => {
                const active = step === s.id;
                const doneStep = step > s.id;
                return (
                  <div key={s.id} className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 transition-colors ${
                        active || doneStep
                          ? "bg-green-900 text-white"
                          : "bg-green-50 text-ink-faint"
                      }`}
                    >
                      {doneStep ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <s.icon className="w-3.5 h-3.5" strokeWidth={2} />
                      )}
                    </div>
                    <span
                      className={`text-[12px] font-semibold truncate hidden sm:block ${
                        active ? "text-ink" : "text-ink-faint"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-1.5 rounded-full bg-line-soft overflow-hidden">
              <div
                className="h-full rounded-full bg-green-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-7">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-[15px] font-semibold text-ink">Dados pessoais</h2>

                <div>
                  <FieldLabel required>Nome completo</FieldLabel>
                  <input
                    className="field"
                    required
                    value={form.nome}
                    onChange={(e) => set("nome", e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>CPF</FieldLabel>
                    <input
                      className="field font-mono-num"
                      required
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      value={form.cpf}
                      onChange={(e) => set("cpf", formatCpf(e.target.value))}
                    />
                  </div>
                  <div>
                    <FieldLabel required>Nascimento</FieldLabel>
                    <input
                      className="field font-mono-num"
                      required
                      inputMode="numeric"
                      placeholder="DD/MM/AAAA"
                      value={form.dataNascimento}
                      onChange={(e) => set("dataNascimento", formatBirthDate(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Telefone</FieldLabel>
                    <input
                      className="field"
                      required
                      inputMode="tel"
                      placeholder="(11) 90000-0000"
                      value={form.telefone}
                      onChange={(e) => set("telefone", formatPhone(e.target.value))}
                    />
                  </div>
                  <div>
                    <FieldLabel required>E-mail</FieldLabel>
                    <input
                      type="email"
                      className="field"
                      required
                      placeholder="seu@email.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel required>Endereço</FieldLabel>
                  <input
                    className="field"
                    required
                    placeholder="Rua, número, bairro"
                    value={form.endereco}
                    onChange={(e) => set("endereco", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <FieldLabel required>Cidade</FieldLabel>
                    <input
                      className="field"
                      required
                      value={form.cidade}
                      onChange={(e) => set("cidade", e.target.value)}
                    />
                  </div>
                  <div>
                    <FieldLabel required>UF</FieldLabel>
                    <select
                      className="field"
                      required
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
                    <FieldLabel required>CEP</FieldLabel>
                    <input
                      className="field font-mono-num"
                      required
                      inputMode="numeric"
                      placeholder="00000-000"
                      value={form.cep}
                      onChange={(e) => set("cep", formatCep(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display text-[15px] font-semibold text-ink">Dados do veículo</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Tipo</FieldLabel>
                    <select
                      className="field"
                      required
                      value={form.tipoVeiculo}
                      onChange={(e) => set("tipoVeiculo", e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="carro">Carro</option>
                      <option value="moto">Moto</option>
                      <option value="van">Van</option>
                      <option value="caminhao">Caminhão</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Modelo / marca</FieldLabel>
                    <input
                      className="field"
                      placeholder="Ex.: Fiat Argo"
                      value={form.modelo}
                      onChange={(e) => set("modelo", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel required>O veículo é próprio?</FieldLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        { value: "sim" as const, label: "Sim, próprio" },
                        { value: "nao" as const, label: "Alugado" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => set("carroProprio", opt.value)}
                        className={`rounded-[14px] border px-4 py-3.5 text-sm font-semibold text-left transition-all ${
                          form.carroProprio === opt.value
                            ? "border-green-500 bg-green-50 text-green-900"
                            : "border-line-soft bg-surface text-ink hover:border-green-400"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {form.carroProprio === "nao" && (
                  <div>
                    <FieldLabel>Locadora</FieldLabel>
                    <input
                      className="field"
                      placeholder="Nome da locadora"
                      value={form.locadora}
                      onChange={(e) => set("locadora", e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <FieldLabel required>Placa</FieldLabel>
                  <input
                    className="field font-mono-num uppercase"
                    required
                    placeholder="ABC1D23"
                    value={form.placa}
                    onChange={(e) => set("placa", formatPlaca(e.target.value))}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-display text-[15px] font-semibold text-ink">Financeiro e acesso</h2>

                <div>
                  <FieldLabel required>Chave PIX para saques</FieldLabel>
                  <input
                    className="field"
                    required
                    placeholder="CPF, e-mail, telefone ou aleatória"
                    value={form.chavePix}
                    onChange={(e) => set("chavePix", e.target.value)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Senha</FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-ink-faint" />
                      <input
                        type={showPassword ? "text" : "password"}
                        className="field !pl-10 !pr-12"
                        required
                        minLength={6}
                        placeholder="Mín. 6 caracteres"
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint p-1"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label="Mostrar senha"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <FieldLabel required>Confirmar senha</FieldLabel>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="field"
                      required
                      placeholder="Repita a senha"
                      value={form.confirmPassword}
                      onChange={(e) => set("confirmPassword", e.target.value)}
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer rounded-[14px] border border-line-soft p-3.5 hover:bg-green-50/50">
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-green-700"
                    checked={aderiuIndicacao}
                    onChange={(e) => set("aderiuIndicacao", e.target.checked)}
                  />
                  <span className="text-[13px] text-ink-soft leading-relaxed">
                    <strong className="text-ink font-semibold">Indique e ganhe</strong> — R$ 150 a
                    cada 3 parceiros que ativarem o cadastro. Ao aderir, os saques ficam em
                    carência por 90 dias após a ativação.
                  </span>
                </label>

                {(aderiuIndicacao || Boolean(codigoIndicacao)) && (
                  <>
                    <div>
                      <FieldLabel>Código de quem te indicou</FieldLabel>
                      <input
                        className="field"
                        placeholder="Opcional"
                        value={form.codigoIndicacao || referralFromUrl}
                        onChange={(e) => set("codigoIndicacao", e.target.value.toUpperCase())}
                        autoCapitalize="characters"
                        readOnly={Boolean(referralFromUrl)}
                      />
                      {referralFromUrl ? (
                        <p className="mt-1 text-xs text-emerald-700">
                          Código preenchido pelo link de indicação.
                        </p>
                      ) : null}
                    </div>
                    <div className="note-inline !mb-0 !bg-amber-50 !border-amber-100">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-[12.5px] text-ink-soft">
                        Ao aderir à campanha, qualquer solicitação de saque fica bloqueada por
                        90 dias contados da ativação do cadastro.
                      </p>
                    </div>
                  </>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 accent-green-700"
                    checked={form.aceitaTermos}
                    onChange={(e) => set("aceitaTermos", e.target.checked)}
                  />
                  <span className="text-[13px] text-ink-soft">
                    Li e aceito os{" "}
                    <button
                      type="button"
                      onClick={openTerms}
                      className="text-green-700 font-semibold underline"
                    >
                      Termos e a Política de Privacidade
                    </button>
                    .
                  </span>
                </label>
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-[14px] border border-brick-100 bg-brick-100/40 px-3.5 py-3 text-[13px] text-brick-600">
                {error}
              </div>
            )}

            <div className="mt-7 flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep((s) => s - 1);
                  }}
                  className="btn-ghost btn-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
              ) : (
                <Link href="/login" className="btn-ghost btn-md text-ink-soft">
                  Já tenho conta
                </Link>
              )}

              {step < 3 ? (
                <button type="button" onClick={goNext} className="btn-primary btn-md">
                  Continuar
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={submitting} className="btn-primary btn-md">
                  {submitting ? "Criando…" : "Criar minha conta"}
                  {!submitting && <CheckCircle className="w-4 h-4" />}
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft animate-fade-up">
          Já possui conta?{" "}
          <Link href="/login" className="text-green-700 font-semibold underline underline-offset-2">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
