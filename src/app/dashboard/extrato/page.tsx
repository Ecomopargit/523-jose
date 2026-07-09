import DashboardShell from "@/components/DashboardShell";
import { Calendar } from "lucide-react";

const transacoes = [
  { data: "15/01/2024", tipo: "Depósito", valorTotal: 7.0, valorReserva: 5.0, valorAdmin: 2.0, status: "Confirmado" },
  { data: "14/01/2024", tipo: "Depósito", valorTotal: 7.0, valorReserva: 5.0, valorAdmin: 2.0, status: "Confirmado" },
  { data: "13/01/2024", tipo: "Depósito", valorTotal: 7.0, valorReserva: 5.0, valorAdmin: 2.0, status: "Confirmado" },
  { data: "12/01/2024", tipo: "Depósito", valorTotal: 7.0, valorReserva: 5.0, valorAdmin: 2.0, status: "Confirmado" },
  { data: "11/01/2024", tipo: "Depósito", valorTotal: 7.0, valorReserva: 5.0, valorAdmin: 2.0, status: "Confirmado" },
  { data: "10/01/2024", tipo: "Bônus", valorTotal: 150.0, valorReserva: 0, valorAdmin: 0, status: "Pago" },
  { data: "09/01/2024", tipo: "Depósito", valorTotal: 7.0, valorReserva: 5.0, valorAdmin: 2.0, status: "Confirmado" },
  { data: "08/01/2024", tipo: "Depósito", valorTotal: 7.0, valorReserva: 5.0, valorAdmin: 2.0, status: "Confirmado" },
];

export default function ExtratoPage() {
  return (
    <DashboardShell title="Extrato" showBack backHref="/dashboard">
      <div className="card p-4 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Período:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input type="date" className="field !py-2 w-auto" />
            <span className="text-gray-500">até</span>
            <input type="date" className="field !py-2 w-auto" />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Valor Total</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Reserva</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transacoes.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{t.data}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        t.tipo === "Depósito"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {t.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-brand whitespace-nowrap">
                    R$ {t.valorTotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-600 whitespace-nowrap">
                    {t.valorReserva > 0 && `+R$ ${t.valorReserva.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {t.valorAdmin > 0 && `R$ ${t.valorAdmin.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
