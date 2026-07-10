import DashboardShell from "@/components/DashboardShell";
import { Car, Mail, MapPin, Phone } from "lucide-react";

const campos = [
  { icon: Mail, label: "E-mail", value: "lucas@email.com" },
  { icon: Phone, label: "Telefone", value: "(11) 99999-0000" },
  { icon: MapPin, label: "Cidade", value: "São Paulo — SP" },
  { icon: Car, label: "Veículo", value: "Fiat Argo — ABC-1D23" },
];

export default function PerfilPage() {
  return (
    <DashboardShell showBack backHref="/dashboard">
      <div className="profile-card">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-line-soft">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center font-display font-bold text-lg text-green-700">
            LS
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Lucas Silva</h2>
            <p className="text-[12.5px] text-ink-soft mt-0.5">Associado desde jan/2024</p>
          </div>
        </div>

        {campos.map((item) => (
          <div key={item.label} className="info-row last:border-b-0">
            <div className="icon-badge-lg">
              <item.icon className="w-[15px] h-[15px] text-green-700" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10.5px] uppercase tracking-wide text-ink-faint font-semibold mb-0.5">
                {item.label}
              </p>
              <p className="text-sm font-medium">{item.value}</p>
            </div>
          </div>
        ))}

        <p className="text-xs text-ink-soft mt-5 text-center">
          Para atualizar seus dados, entre em contato com o suporte da ECOMOPAR.
        </p>
      </div>
    </DashboardShell>
  );
}
