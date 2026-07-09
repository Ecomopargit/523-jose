import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { Banknote, Camera, ChevronRight } from "lucide-react";

const dados = {
  nome: "Lucas",
  saldo: 0,
};

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-6 animate-fade-up">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Olá, {dados.nome}
        </h2>

        {/* Saldo */}
        <div className="balance-bar">
          <span className="text-white/90 font-semibold">Saldo atual:</span>
          <span className="text-xl">{brl(dados.saldo)}</span>
        </div>

        {/* CTA principal */}
        <Link href="/dashboard/ativar-cadastro" className="btn-primary btn-lg w-full">
          Ativar cadastro
        </Link>

        {/* Banner / destaque */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 border border-brand/10 aspect-[16/9] flex items-end p-5">
          <div className="relative z-10">
            <p className="text-brand font-bold text-lg leading-tight">
              Sua reserva cresce R$ 5,00 por dia
            </p>
            <p className="text-muted text-sm mt-1">
              Com depósitos diários de R$ 7,00 via PIX
            </p>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,138,61,0.15),transparent_60%)]" />
        </div>

        {/* Atalhos */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-brand font-bold">Atalhos:</h3>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/saque" className="shortcut-tile">
              <Banknote className="w-8 h-8" strokeWidth={1.5} />
              <span className="text-center leading-tight">Solicitar saque</span>
            </Link>
            <Link href="/dashboard/pagamentos" className="shortcut-tile">
              <Camera className="w-8 h-8" strokeWidth={1.5} />
              <span className="text-center leading-tight">Envio de pagamento</span>
            </Link>
          </div>
        </div>

        {/* Benefícios rápidos */}
        <div className="card p-5 space-y-3">
          <p className="font-bold text-brand">Seus benefícios ECOMOPAR</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-brand shrink-0" />
              Reserva financeira para imprevistos
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-brand shrink-0" />
              Empréstimo subsidiado
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-brand shrink-0" />
              Assistência odontológica e jurídica
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-brand shrink-0" />
              Seguro da franquia em sinistros
            </li>
          </ul>
          <Link
            href="/dashboard/beneficios"
            className="inline-flex items-center gap-1 text-brand font-bold text-sm"
          >
            Ver todos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
