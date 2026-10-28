"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { brl } from "@/lib/dashboard-meta";
import {
  subscribeWithdrawals,
  updateWithdrawalsBatch,
  type Withdrawal,
  type WithdrawalStatus,
} from "@/lib/withdrawal-store";
import {
  ArrowDownToLine,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  LoaderCircle,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

const statusLabels: Record<WithdrawalStatus, string> = {
  solicitado: "Solicitado",
  processando: "Em processamento",
  pago: "Pago",
  rejeitado: "Rejeitado",
};

type WithdrawalGroup = {
  key: string;
  memberName: string;
  memberCpf: string;
  pixKey: string;
  pixKeys: string[];
  value: number;
  status: WithdrawalStatus;
  requestedAt: Date | null;
  count: number;
  items: Withdrawal[];
};

const openStatuses: WithdrawalStatus[] = ["solicitado", "processando"];

function isOpen(item: Withdrawal) {
  return openStatuses.includes(item.status);
}

function groupWithdrawals(items: Withdrawal[], status: WithdrawalStatus | "todos", search: string) {
  const term = search.trim().toLowerCase();
  const matches = (item: Withdrawal) =>
    !term ||
    item.memberName.toLowerCase().includes(term) ||
    item.memberCpf.includes(term) ||
    item.pixKey.toLowerCase().includes(term);

  const visible = items.filter(matches);
  const openByMember = new Map<string, Withdrawal[]>();
  for (const item of visible.filter(isOpen)) {
    const current = openByMember.get(item.memberId) ?? [];
    current.push(item);
    openByMember.set(item.memberId, current);
  }

  const groups: WithdrawalGroup[] = [...openByMember.entries()].map(([memberId, group]) => {
    const sorted = [...group].sort((a, b) => (b.requestedAt?.getTime() ?? 0) - (a.requestedAt?.getTime() ?? 0));
    const latest = sorted[0]!;
    const pixKeys = [...new Set(sorted.map((item) => item.pixKey).filter(Boolean))];
    const groupStatus: WithdrawalStatus = sorted.every((item) => item.status === "processando") ? "processando" : "solicitado";
    return {
      key: `open-${memberId}`,
      memberName: latest.memberName,
      memberCpf: latest.memberCpf,
      pixKey: latest.pixKey,
      pixKeys,
      value: sorted.reduce((sum, item) => sum + item.value, 0),
      status: groupStatus,
      requestedAt: latest.requestedAt,
      count: sorted.length,
      items: sorted,
    };
  });

  const closed: WithdrawalGroup[] = visible.filter((item) => !isOpen(item)).map((item) => ({
    key: item.id,
    memberName: item.memberName,
    memberCpf: item.memberCpf,
    pixKey: item.pixKey,
    pixKeys: item.pixKey ? [item.pixKey] : [],
    value: item.value,
    status: item.status,
    requestedAt: item.requestedAt,
    count: 1,
    items: [item],
  }));

  return [...groups, ...closed]
    .filter((group) => status === "todos" || group.items.some((item) => item.status === status))
    .sort((a, b) => (b.requestedAt?.getTime() ?? 0) - (a.requestedAt?.getTime() ?? 0));
}

function StatusBadge({ status }: { status: WithdrawalStatus }) {
  const styles = {
    solicitado: "bg-amber-100 text-amber-600",
    processando: "bg-[#e8eef8] text-[#345a91]",
    pago: "bg-green-100 text-green-700",
    rejeitado: "bg-brick-100 text-brick-600",
  };
  const Icon = status === "pago" ? CheckCircle2 : status === "rejeitado" ? XCircle : Clock3;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}>
      <Icon className="h-3 w-3" />
      {statusLabels[status]}
    </span>
  );
}

export default function SaquesPage() {
  const [items, setItems] = useState<Withdrawal[]>([]);
  const [status, setStatus] = useState<WithdrawalStatus | "todos">("todos");
  const [search, setSearch] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(
    () =>
      subscribeWithdrawals(
        (next) => {
          setItems(next);
          setLoading(false);
        },
        () => {
          setError("Não foi possível carregar as solicitações.");
          setLoading(false);
        },
      ),
    [],
  );

  const filtered = useMemo(() => groupWithdrawals(items, status, search), [items, search, status]);
  const selected = filtered.find((group) => group.key === selectedKey) ?? null;

  const pending = items.filter((item) => item.status === "solicitado");
  const processing = items.filter((item) => item.status === "processando");
  const paidThisMonth = items.filter((item) => {
    if (item.status !== "pago" || !item.updatedAt) return false;
    const now = new Date();
    return item.updatedAt.getMonth() === now.getMonth() && item.updatedAt.getFullYear() === now.getFullYear();
  });

  return (
    <AdminShell title="Saques" subtitle="Aprovação e rastreio das transferências PIX">
      <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Aguardando análise", value: String(new Set(pending.map((item) => item.memberId)).size), note: `${pending.length} pedidos · ${brl(pending.reduce((sum, item) => sum + item.value, 0))}`, icon: Clock3 },
          { label: "Em processamento", value: String(new Set(processing.map((item) => item.memberId)).size), note: `${processing.length} pedidos · ${brl(processing.reduce((sum, item) => sum + item.value, 0))}`, icon: LoaderCircle },
          { label: "Pagos no mês", value: brl(paidThisMonth.reduce((sum, item) => sum + item.value, 0)), note: `${paidThisMonth.length} transferências`, icon: CheckCircle2 },
          { label: "Volume total", value: brl(items.reduce((sum, item) => sum + item.value, 0)), note: `${items.length} solicitações`, icon: ArrowDownToLine },
        ].map((card) => (
          <div key={card.label} className="admin-metric">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">{card.label}</p>
                <p className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">{card.value}</p>
                <p className="mt-1 text-[11px] text-ink-soft">{card.note}</p>
              </div>
              <span className="admin-metric-icon"><card.icon className="h-4 w-4" /></span>
            </div>
          </div>
        ))}
      </section>

      <div className="card mb-4 p-3.5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input className="field !pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar associado, CPF ou chave PIX" />
          </label>
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-[#eef1ec] p-1">
            {(["todos", "solicitado", "processando", "pago", "rejeitado"] as const).map((value) => (
              <button key={value} type="button" onClick={() => setStatus(value)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-semibold transition ${status === value ? "bg-white text-green-800 shadow-sm" : "text-ink-soft hover:text-ink"}`}>
                {value === "todos" ? "Todos" : statusLabels[value]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-brick-100 bg-brick-100/50 p-4 text-sm text-brick-600">{error}</div> :
      loading ? <div className="card flex min-h-60 items-center justify-center"><LoaderCircle className="h-5 w-5 animate-spin text-green-700" /><span className="ml-2 text-sm text-ink-soft">Carregando saques...</span></div> :
      filtered.length === 0 ? (
        <div className="card flex min-h-64 flex-col items-center justify-center p-8 text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100"><ArrowDownToLine className="h-5 w-5 text-green-700" /></span>
          <h2 className="font-display font-semibold">Nenhuma solicitação encontrada</h2>
          <p className="mt-1 max-w-sm text-sm text-ink-soft">Novos pedidos dos associados aparecerão aqui para análise.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="admin-table-head"><tr>{["Associado", "Valor", "Chave PIX", "Último pedido", "Status", ""].map((label) => <th key={label || "action"}>{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-line-soft">
                {filtered.map((item) => (
                  <tr key={item.key} className="admin-table-row" onClick={() => setSelectedKey(item.key)}>
                    <td>
                      <p className="font-semibold text-ink">{item.memberName}</p>
                      <p className="mt-0.5 text-xs text-ink-faint">{item.count > 1 ? `${item.count} pedidos em aberto` : item.memberCpf || "CPF não informado"}</p>
                    </td>
                    <td className="font-mono-num text-base font-semibold text-green-800">{brl(item.value)}</td>
                    <td><p className="max-w-[210px] truncate text-sm">{item.pixKey}</p></td>
                    <td className="text-sm text-ink-soft">{item.requestedAt ? item.requestedAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Agora"}</td>
                    <td><StatusBadge status={item.status} /></td>
                    <td><button type="button" className="rounded-lg px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50" onClick={(event) => { event.stopPropagation(); setSelectedKey(item.key); }}>Analisar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected ? <WithdrawalDrawer key={selected.key} item={selected} onClose={() => setSelectedKey(null)} /> : null}
    </AdminShell>
  );
}

function WithdrawalDrawer({ item, onClose }: { item: WithdrawalGroup; onClose: () => void }) {
  const [note, setNote] = useState(item.items[0]?.adminNote ?? "");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const openItems = item.items.filter(isOpen);
  const canProcess = openItems.some((entry) => entry.status === "solicitado");
  const canPay = openItems.length > 0 && openItems.every((entry) => entry.status === "processando");
  const canReject = openItems.length > 0;

  async function changeStatus(next: WithdrawalStatus) {
    setBusy(true);
    setFeedback("");
    const result = await updateWithdrawalsBatch(openItems.length ? openItems : item.items, next, note);
    setBusy(false);
    if (!result.ok) return setFeedback(result.error);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button type="button" className="absolute inset-0 bg-green-950/45 backdrop-blur-[2px]" aria-label="Fechar painel" onClick={onClose} />
      <aside className="relative h-full w-full max-w-md overflow-y-auto border-l border-white/20 bg-surface shadow-2xl animate-fade-up">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line-soft bg-white/95 px-5 py-4 backdrop-blur">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Saque do associado</p><p className="mt-1 font-display font-semibold">{item.memberName}</p></div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-ink-soft hover:bg-green-50" aria-label="Fechar"><X className="h-5 w-5" /></button>
        </header>
        <div className="space-y-5 p-5">
          <div className="rounded-[20px] bg-green-950 p-5 text-white">
            <p className="text-xs text-white/55">{item.count > 1 ? `Soma de ${item.count} pedidos em aberto` : "Valor solicitado"}</p>
            <p className="mt-2 font-display font-mono-num text-3xl font-semibold">{brl(item.value)}</p>
            <div className="mt-4 border-t border-white/10 pt-4"><StatusBadge status={item.status} /></div>
          </div>
          <section className="space-y-3">
            <Data label="CPF" value={item.memberCpf || "Não informado"} />
            <div className="rounded-2xl border border-line-soft p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Chave PIX</p>
              <div className="mt-1.5 flex items-center gap-2"><p className="min-w-0 flex-1 break-all text-sm font-semibold">{item.pixKey}</p><button type="button" onClick={() => void navigator.clipboard.writeText(item.pixKey)} className="rounded-lg p-2 text-green-700 hover:bg-green-50" aria-label="Copiar chave PIX"><Copy className="h-4 w-4" /></button></div>
              {item.pixKeys.length > 1 ? <p className="mt-2 text-xs text-amber-700">Este associado usou chaves diferentes. O PIX único deve sair para a chave do pedido mais recente.</p> : null}
            </div>
            {item.count > 1 ? (
              <div className="rounded-2xl border border-line-soft p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Pedidos incluídos</p>
                <ul className="mt-2 space-y-2">
                  {item.items.map((entry) => (
                    <li key={entry.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-ink-soft">{entry.requestedAt ? entry.requestedAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Agora"}</span>
                      <span className="font-mono-num font-semibold">{brl(entry.value)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {item.items.some((entry) => entry.note) ? <Data label="Observação do associado" value={item.items.map((entry) => entry.note).filter(Boolean).join(" · ")} /> : null}
          </section>
          <div>
            <label className="mb-1.5 block text-xs font-semibold">Nota interna</label>
            <textarea className="field min-h-24" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ex.: comprovante enviado, motivo da rejeição..." />
          </div>
          {feedback ? <p className="rounded-xl bg-brick-100 px-3 py-2 text-xs text-brick-600">{feedback}</p> : null}
          <div className="space-y-2">
            {canProcess ? <button disabled={busy} type="button" onClick={() => void changeStatus("processando")} className="btn-primary btn-md w-full"><ShieldCheck className="h-4 w-4" />Iniciar processamento de todos</button> : null}
            {canPay ? <button disabled={busy} type="button" onClick={() => void changeStatus("pago")} className="btn-primary btn-md w-full"><Check className="h-4 w-4" />Confirmar PIX de {brl(item.value)}</button> : null}
            {canReject ? <button disabled={busy} type="button" onClick={() => void changeStatus("rejeitado")} className="btn-outline btn-md w-full !text-brick-600"><XCircle className="h-4 w-4" />Rejeitar todos os pedidos</button> : null}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Data({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-line-soft p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">{label}</p><p className="mt-1.5 text-sm font-medium">{value}</p></div>;
}
