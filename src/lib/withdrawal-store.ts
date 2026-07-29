import {
  addDoc,
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
    await addDoc(collection(db, "withdrawals"), {
      memberId: input.memberId,
      memberName: input.memberName,
      memberCpf: input.memberCpf,
      value: input.value,
      pixKey: input.pixKey.trim(),
      note: input.note?.trim() ?? "",
      status: "solicitado",
      requestedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      adminNote: "",
    });
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Não foi possível registrar o saque." };
  }
}

export async function updateWithdrawalStatus(
  withdrawal: Withdrawal,
  nextStatus: WithdrawalStatus,
  adminNote = "",
) {
  try {
    if (nextStatus === "pago" && withdrawal.status !== "pago") {
      await runTransaction(db, async (transaction) => {
        const memberRef = doc(db, "users", withdrawal.memberId);
        const memberSnapshot = await transaction.get(memberRef);
        if (!memberSnapshot.exists()) throw new Error("Associado não encontrado.");
        const available = Number(memberSnapshot.data().saldoDisponivel ?? 0);
        if (available < withdrawal.value) throw new Error("Saldo insuficiente.");
        transaction.update(memberRef, {
          saldoDisponivel: available - withdrawal.value,
          updatedAt: serverTimestamp(),
        });
        transaction.update(doc(db, "withdrawals", withdrawal.id), {
          status: nextStatus,
          adminNote: adminNote.trim(),
          updatedAt: serverTimestamp(),
        });
      });
    } else {
      await updateDoc(doc(db, "withdrawals", withdrawal.id), {
        status: nextStatus,
        adminNote: adminNote.trim(),
        updatedAt: serverTimestamp(),
      });
    }
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Não foi possível atualizar o saque.",
    };
  }
}
