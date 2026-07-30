import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase-admin";

export const REFERRAL_BONUS = 150;
export const REFERRALS_PER_BONUS = 3;
export const WITHDRAWAL_LOCK_DAYS = 90;

function nowIso() {
  return new Date().toISOString();
}

function normalizeCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function ownCode(uid: string) {
  return `EC${uid.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase()}`;
}

export function withdrawalLockUntil(activatedAt: string) {
  const date = new Date(activatedAt);
  date.setUTCDate(date.getUTCDate() + WITHDRAWAL_LOCK_DAYS);
  return date.toISOString();
}

export async function ensureReferralProfile(input: {
  uid: string;
  referralCode?: string;
  joinCampaign?: boolean;
}) {
  const userRef = adminDb.collection("users").doc(input.uid);
  const candidateCode = ownCode(input.uid);
  const ownCodeRef = adminDb.collection("referralCodes").doc(candidateCode);
  const usedCode = normalizeCode(input.referralCode || "");
  const usedCodeRef = usedCode ? adminDb.collection("referralCodes").doc(usedCode) : null;
  const referralRef = adminDb.collection("referrals").doc(input.uid);

  return adminDb.runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) throw new Error("Associado não encontrado.");

    const user = userSnap.data()!;
    const currentCode = normalizeCode(String(user.referralCode || ""));
    const currentCodeRef = currentCode
      ? adminDb.collection("referralCodes").doc(currentCode)
      : ownCodeRef;
    const codeSnap = await tx.get(currentCodeRef);
    const usedCodeSnap = usedCodeRef ? await tx.get(usedCodeRef) : null;
    const referralSnap = await tx.get(referralRef);

    const code = currentCode || candidateCode;
    if (codeSnap.exists && codeSnap.data()?.memberId !== input.uid) {
      throw new Error("Não foi possível reservar o código de indicação.");
    }

    if (!codeSnap.exists) {
      tx.create(currentCodeRef, {
        memberId: input.uid,
        code,
        createdAt: nowIso(),
      });
    }

    const patch: Record<string, unknown> = {
      referralCode: code,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (input.joinCampaign || usedCode) {
      patch.aderiuIndicacao = true;
      patch.referralCampaignJoinedAt =
        user.referralCampaignJoinedAt || nowIso();
      if (user.activatedAt && !user.withdrawalLockedUntil) {
        patch.withdrawalLockedUntil = withdrawalLockUntil(String(user.activatedAt));
      }
    }

    if (usedCode && !referralSnap.exists) {
      if (!usedCodeSnap?.exists) {
        throw new Error("Código de indicação não encontrado.");
      }
      const referrerId = String(usedCodeSnap.data()?.memberId || "");
      if (!referrerId || referrerId === input.uid) {
        throw new Error("Código de indicação inválido.");
      }

      tx.create(referralRef, {
        referrerId,
        referredId: input.uid,
        codeUsed: usedCode,
        status: "pending",
        createdAt: nowIso(),
        activatedAt: null,
        bonusGroup: null,
      });
      patch.referredByUid = referrerId;
      patch.referredByCode = usedCode;
      patch.codigoIndicacao = usedCode;
    }

    tx.set(userRef, patch, { merge: true });
    return { code };
  });
}

export async function activateReferralForMember(referredId: string) {
  const referralRef = adminDb.collection("referrals").doc(referredId);

  await adminDb.runTransaction(async (tx) => {
    const referralSnap = await tx.get(referralRef);
    if (!referralSnap.exists || referralSnap.data()?.status === "activated") return;

    const referral = referralSnap.data()!;
    const referrerId = String(referral.referrerId || "");
    if (!referrerId) return;

    const referrerRef = adminDb.collection("users").doc(referrerId);
    const referrerSnap = await tx.get(referrerRef);
    if (!referrerSnap.exists) return;

    const referrer = referrerSnap.data()!;
    const oldCount = Number(referrer.referralValidCount || 0);
    const newCount = oldCount + 1;
    const oldGroups = Number(referrer.referralBonusPaidGroups || 0);
    const newGroups = Math.floor(newCount / REFERRALS_PER_BONUS);
    const earnsBonus = newGroups > oldGroups;
    const bonusRef = adminDb
      .collection("bonusCredits")
      .doc(`${referrerId}_group_${newGroups}`);
    const bonusSnap = earnsBonus ? await tx.get(bonusRef) : null;
    const stamp = nowIso();

    tx.update(referralRef, {
      status: "activated",
      activatedAt: stamp,
      bonusGroup: earnsBonus ? newGroups : null,
    });

    const update: Record<string, unknown> = {
      referralValidCount: newCount,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (earnsBonus && !bonusSnap?.exists) {
      update.referralBonusPaidGroups = newGroups;
      update.saldoBonus = FieldValue.increment(REFERRAL_BONUS);
      tx.create(bonusRef, {
        referrerId,
        amount: REFERRAL_BONUS,
        groupNumber: newGroups,
        triggerReferredId: referredId,
        createdAt: stamp,
        ruleVersion: 1,
      });
    }

    tx.set(referrerRef, update, { merge: true });
  });
}

export async function getReferralDashboard(uid: string) {
  await ensureReferralProfile({ uid });
  const userSnap = await adminDb.collection("users").doc(uid).get();
  if (!userSnap.exists) throw new Error("Associado não encontrado.");
  const user = userSnap.data()!;
  const referralsSnap = await adminDb
    .collection("referrals")
    .where("referrerId", "==", uid)
    .orderBy("createdAt", "desc")
    .get();

  const referrals = await Promise.all(
    referralsSnap.docs.map(async (item) => {
      const data = item.data();
      const referred = await adminDb.collection("users").doc(String(data.referredId)).get();
      const profile = referred.data() || {};
      return {
        id: item.id,
        nome: String(profile.nome || "Associado"),
        email: String(profile.email || ""),
        status: String(data.status || "pending"),
        createdAt: String(data.createdAt || ""),
        activatedAt: data.activatedAt ? String(data.activatedAt) : null,
      };
    }),
  );

  const valid = referrals.filter((item) => item.status === "activated").length;
  return {
    code: String(user.referralCode || ownCode(uid)),
    joined: Boolean(user.aderiuIndicacao),
    total: referrals.length,
    valid,
    pending: referrals.length - valid,
    bonus: Number(user.referralBonusPaidGroups || 0) * REFERRAL_BONUS,
    withdrawalLockedUntil: user.withdrawalLockedUntil
      ? String(user.withdrawalLockedUntil)
      : null,
    referrals,
  };
}
