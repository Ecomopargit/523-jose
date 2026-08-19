import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";
import { activateReferralForMember, withdrawalLockUntil } from "@/lib/referrals";

export async function activateMemberAdmin(memberId: string) {
  const userRef = adminDb.collection("users").doc(memberId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    throw new Error("Associado não encontrado.");
  }

  const member = userSnap.data()!;
  const stamp = new Date().toISOString();
  const patch: Record<string, unknown> = {
    status: "ativo",
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (!member.activatedAt) {
    patch.activatedAt = stamp;
    if (member.aderiuIndicacao) {
      patch.withdrawalLockedUntil = withdrawalLockUntil(stamp);
    }
  }

  await userRef.set(patch, { merge: true });
  await activateReferralForMember(memberId);

  return { id: memberId, status: "ativo" as const };
}
