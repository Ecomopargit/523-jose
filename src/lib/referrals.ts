import { FieldValue } from "firebase-admin/firestore";
import { createHash } from "crypto";

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
  const fingerprint = createHash("sha256").update(uid).digest("hex").slice(0, 10);
  return `EC${fingerprint.toUpperCase()}`;
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

async function loadUsersByIds(ids: string[]) {
  const unique = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
  const map = new Map<string, Record<string, unknown>>();
  for (let i = 0; i < unique.length; i += 100) {
    const chunk = unique.slice(i, i + 100);
    const snaps = await adminDb.getAll(
      ...chunk.map((id) => adminDb.collection("users").doc(id)),
    );
    for (const snap of snaps) {
      if (snap.exists) map.set(snap.id, snap.data() as Record<string, unknown>);
    }
  }
  return map;
}

export async function getReferralDashboard(
  uid: string,
  options?: { joinCampaign?: boolean },
) {
  await ensureReferralProfile({ uid, joinCampaign: options?.joinCampaign });
  let userSnap = await adminDb.collection("users").doc(uid).get();
  if (!userSnap.exists) throw new Error("Associado não encontrado.");
  let user = userSnap.data()!;
  const referralQuery = adminDb.collection("referrals").where("referrerId", "==", uid);

  async function loadReferrals() {
    const snapshot = await referralQuery.get();
    const profiles = await loadUsersByIds(
      snapshot.docs.map((item) => String(item.data().referredId || "")),
    );
    return snapshot.docs
      .map((item) => {
        const data = item.data();
        const referredId = String(data.referredId || item.id);
        const profile = profiles.get(referredId) || {};
        return {
          id: item.id,
          referredId,
          nome: String(profile.nome || "Associado"),
          email: String(profile.email || ""),
          memberStatus: String(profile.status || "pendente"),
          status: String(data.status || "pending"),
          createdAt: String(data.createdAt || ""),
          activatedAt: data.activatedAt ? String(data.activatedAt) : null,
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  let referrals = await loadReferrals();
  const pendingActive = referrals.filter(
    (item) => item.status !== "activated" && item.memberStatus === "ativo",
  );
  if (pendingActive.length) {
    await Promise.all(pendingActive.map((item) => activateReferralForMember(item.referredId)));
    referrals = await loadReferrals();
    userSnap = await adminDb.collection("users").doc(uid).get();
    user = userSnap.data() || user;
  }

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
    referrals: referrals.map(({ referredId: _referredId, memberStatus: _memberStatus, ...item }) => item),
  };
}
