import DashboardShell from "@/components/DashboardShell";
import { User, Car, Phone, Mail, MapPin } from "lucide-react";

export default function PerfilPage() {
  return (
    <DashboardShell title="Meu perfil" showBack backHref="/dashboard">
      <div className="card p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
            <User className="w-8 h-8 text-brand" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand">Lucas Silva</h2>
            <p className="text-sm text-muted">Associado desde jan/2024</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { icon: Mail, label: "E-mail", value: "lucas@email.com" },
            { icon: Phone, label: "Telefone", value: "(11) 99999-0000" },
            { icon: MapPin, label: "Cidade", value: "São Paulo - SP" },
            { icon: Car, label: "Veículo", value: "Fiat Argo — ABC-1D23" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-surface">
              <item.icon className="w-5 h-5 text-brand mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted uppercase tracking-wide">{item.label}</p>
                <p className="font-medium text-gray-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted">
        Para atualizar seus dados, entre em contato com o suporte da ECOMOPAR.
      </p>
    </DashboardShell>
  );
}
