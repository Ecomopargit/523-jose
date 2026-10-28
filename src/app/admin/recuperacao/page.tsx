import AdminShell from "@/components/AdminShell";
import { CheckCircle2, FileCheck2, HeartPulse, ShieldCheck } from "lucide-react";

const criteria = [
  "Associado com cadastro ativo no momento da solicitação.",
  "Acidente de trânsito com fratura que impeça temporariamente o trabalho.",
  "Ocorrência e documentação confirmadas pela diretoria da ECOMOPAR.",
];

export default function RecuperacaoAdminPage() {
  return (
    <AdminShell title="Bônus Recuperação" subtitle="Critérios operacionais e fluxo de análise">
      <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <div className="card overflow-hidden">
          <div className="bg-green-950 p-6 text-white sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><HeartPulse className="h-6 w-6 text-green-300" /></div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-green-300">Ajuda de custo condicionada</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Até R$ 2.000,00 por ocorrência aprovada.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">Após confirmação da diretoria, o associado recebe R$ 500,00 por semana, durante até quatro semanas.</p>
          </div>
          <div className="p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold">Critérios obrigatórios</h3>
            <div className="mt-4 space-y-3">
              {criteria.map((criterion) => <div key={criterion} className="flex gap-3 rounded-xl bg-green-50 p-3.5 text-sm text-ink-soft"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />{criterion}</div>)}
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="card p-5">
            <ShieldCheck className="h-5 w-5 text-green-700" />
            <h3 className="mt-3 font-display font-semibold">Regra de ativação</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">Benefícios só para parceiros ativos. A ativação diária é o PIX de R$ 7,00 (validade de 24h). Dá para antecipar vários dias no mesmo pagamento (ex.: R$ 49,00 = 7 dias).</p>
          </div>
          <div className="card p-5">
            <FileCheck2 className="h-5 w-5 text-amber-600" />
            <h3 className="mt-3 font-display font-semibold">Análise antes do pagamento</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">O valor não é gerado automaticamente. A equipe deve confirmar o caso, registrar a decisão e orientar o associado pelos canais de atendimento.</p>
          </div>
        </aside>
      </section>
    </AdminShell>
  );
}
