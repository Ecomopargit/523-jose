import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type WithdrawalStatus = "solicitado" | "processando" | "pago" | "rejeitado";

export type Withdrawal = {
  id: string;
  memberId: string;
  memberName: string;
  memberCpf: string;
  value: number;
  pixKey: string;
  note: string;
  status: WithdrawalStatus;
  requestedAt: Date | null;
  updatedAt: Date | null;
  adminNote: string;
};

function toDate(value: unknown) {
  const timestamp = value as Timestamp | undefined;
  return typeof timestamp?.toDate === "function" ? timestamp.toDate() : null;
}

export function subscribeWithdrawals(
  callback: (items: Withdrawal[]) => void,
  onError?: (error: Error) => void,
) {
  const withdrawalsQuery = query(collection(db, "withdrawals"), orderBy("requestedAt", "desc"));
  return onSnapshot(
    withdrawalsQuery,
    (snapshot) =>
      callback(
        snapshot.docs.map((item) => {
          const data = item.data();
          return {
            id: item.id,
            memberId: String(data.memberId ?? ""),
            memberName: String(data.memberName ?? "Associado"),
            memberCpf: String(data.memberCpf ?? ""),
            value: Number(data.value ?? 0),
            pixKey: String(data.pixKey ?? ""),
            note: String(data.note ?? ""),
            status: (data.status as WithdrawalStatus) ?? "solicitado",
            requestedAt: toDate(data.requestedAt),
            updatedAt: toDate(data.updatedAt),
            adminNote: String(data.adminNote ?? ""),
          };
        }),
      ),
    (error) => onError?.(error),
  );
}

export async function requestWithdrawal(input: {
  memberId: string;
  memberName: string;
  memberCpf: string;
  value: number;
  pixKey: string;
  note?: string;
}) {
  if (!auth.currentUser || auth.currentUser.uid !== input.memberId) {
    return { ok: false as const, error: "Sessão inválida." };
  }
  if (!Number.isFinite(input.value) || input.value < 10) {
    return { ok: false as const, error: "O saque mínimo é de R$ 10,00." };
  }
  if (!input.pixKey.trim()) {
    return { ok: false as const, error: "Informe uma chave PIX." };
  }

  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch("/api/withdrawals", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: input.value,
        pixKey: input.pixKey.trim(),
        note: input.note?.trim() ?? "",
      }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      return { ok: false as const, error: data.error || "Não foi possível registrar o saque." };
    }
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Não foi possível registrar o saque.",
    };
  }
}

export async function updateWithdrawalStatus(
  withdrawal: Withdrawal,
  nextStatus: WithdrawalStatus,
  adminNote = "",
) {
  return updateWithdrawalsBatch([withdrawal], nextStatus, adminNote);
}

export async function updateWithdrawalsBatch(
  withdrawals: Withdrawal[],
  nextStatus: WithdrawalStatus,
  adminNote = "",
) {
  const pending = withdrawals.filter((item) => item.status !== "pago" && item.status !== "rejeitado");
  if (!pending.length) return { ok: false as const, error: "Não há saques em aberto nesse associado." };
  const memberId = pending[0]?.memberId;
  if (!memberId || pending.some((item) => item.memberId !== memberId)) {
    return { ok: false as const, error: "Os saques precisam ser do mesmo associado." };
  }

  try {
    if (nextStatus === "pago") {
      await runTransaction(db, async (transaction) => {
        const memberRef = doc(db, "users", memberId);
        const memberSnapshot = await transaction.get(memberRef);
        const withdrawalSnapshots = await Promise.all(
          pending.map((item) => transaction.get(doc(db, "withdrawals", item.id))),
        );
        if (!memberSnapshot.exists()) throw new Error("Associado não encontrado.");
        const payable = withdrawalSnapshots.filter((snapshot) => {
          const status = String(snapshot.data()?.status ?? "");
          return snapshot.exists() && status !== "pago" && status !== "rejeitado";
        });
        const total = payable.reduce((sum, snapshot) => sum + Number(snapshot.data()?.value ?? 0), 0);
        const available = Number(memberSnapshot.data().saldoDisponivel ?? 0);
        const bonus = Number(memberSnapshot.data().saldoBonus ?? 0);
        if (available + bonus < total) throw new Error("Saldo insuficiente.");
        const debitAvailable = Math.min(available, total);
        const debitBonus = total - debitAvailable;
        transaction.update(memberRef, {
          saldoDisponivel: available - debitAvailable,
          saldoBonus: bonus - debitBonus,
          updatedAt: serverTimestamp(),
        });
        payable.forEach((snapshot) => {
          transaction.update(snapshot.ref, {
            status: nextStatus,
            adminNote: adminNote.trim(),
            updatedAt: serverTimestamp(),
          });
        });
      });
    } else {
      await Promise.all(
        pending.map((item) =>
          updateDoc(doc(db, "withdrawals", item.id), {
            status: nextStatus,
            adminNote: adminNote.trim(),
            updatedAt: serverTimestamp(),
          }),
        ),
      );
    }
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Não foi possível atualizar o saque.",
    };
  }
}
