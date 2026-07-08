"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { CheckCircle, Info } from "lucide-react";

const saldoDisponivel = 1850.0;

export default function SaquePage() {
  const [valor, setValor] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [observacao, setObservacao] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <DashboardShell title="Solicitar Saque">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-brand to-brand-dark rounded-2xl p-6 text-white mb-6">
          <p className="text-gray-300 text-sm">Saldo disponível para saque</p>
          <p className="text-3xl sm:text-4xl font-bold">
            R$ {saldoDisponivel.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {enviado ? (
          <div className="card p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-brand mb-4">Saque Solicitado!</h2>
            <p className="text-gray-600 mb-6">
              Sua solicitação de saque foi recebida e está em análise. O prazo de
              processamento é de até 3 dias úteis.
            </p>
            <Link href="/dashboard" className="btn-primary btn-md">
              Voltar ao Painel
            </Link>
          </div>
        ) : (
          <div className="card p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Saque *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <input
                    type="number"
                    required
                    min="10"
                    max={saldoDisponivel}
                    step="0.01"
                    className="field !pl-12"
                    placeholder="0,00"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo: R$ 10,00 | Máximo: R$ {saldoDisponivel.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chave PIX para Recebimento *
                </label>
                <input
                  type="text"
                  required
                  className="field"
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observação (opcional)
                </label>
                <textarea
                  rows={3}
                  className="field resize-none"
                  placeholder="Alguma informação adicional..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Importante</p>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• O prazo de processamento é de até 3 dias úteis</li>
                    <li>• Verifique se a chave PIX está correta</li>
                    <li>• O valor será depositado na conta vinculada à chave PIX</li>
                  </ul>
                </div>
              </div>

              <button type="submit" className="btn-primary btn-md w-full">
                Confirmar Solicitação de Saque
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
