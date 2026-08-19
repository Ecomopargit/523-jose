import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { db } from "./firebase";
import type { MemberProfile, MemberStatus } from "../types";

export const REFERRAL_BONUS = 150;
export const REFERRALS_PER_BONUS = 3;

export type AdminReferredPerson = {
  id: string;
  nome: string;
  email: string;
  memberStatus: MemberStatus;
  referralStatus: "pending" | "activated";
  depositosCount: number;
  activatedAt: string | null;
  createdAt: string;
  isValid: boolean;
  isActive: boolean;
  isDepositing: boolean;
};

export type AdminReferralDossier = {
  referralCode: string;
  wasReferred: boolean;
  referredBy: { id: string; nome: string; email: string; code: string } | null;
  madeReferrals: AdminReferredPerson[];
  validCount: number;
  pendingCount: number;
  totalReferrals: number;
  bonusPaid: number;
  bonusGroupsPaid: number;
  progressToNextBonus: number;
  remainingForBonus: number;
};

function mapReferredPerson(
  referralId: string,
  data: Record<string, unknown>,
  profile: Record<string, unknown>,
): AdminReferredPerson {
  const memberStatus = (profile.status as MemberStatus) || "pendente";
  const referralStatus = data.status === "activated" ? "activated" : "pending";
  const depositosCount = Number(profile.depositosCount ?? 0);
  const isActive = memberStatus === "ativo";
  return {
    id: String(data.referredId || referralId),
    nome: String(profile.nome || "Associado"),
    email: String(profile.email || ""),
    memberStatus,
    referralStatus,
    depositosCount,
    activatedAt: data.activatedAt ? String(data.activatedAt) : null,
    createdAt: String(data.createdAt || ""),
    isValid: referralStatus === "activated",
    isActive,
    isDepositing: isActive && depositosCount > 0,
  };
}

export async function getMemberReferralDossier(
  memberId: string,
  member?: Pick<
    MemberProfile,
    | "referralCode"
    | "referredByUid"
    | "referredByCode"
    | "referralValidCount"
    | "referralBonusPaidGroups"
  >,
): Promise<AdminReferralDossier> {
  let profile = member;
  if (!profile) {
    const snap = await getDoc(doc(db, "users", memberId));
    if (!snap.exists()) {
      return {
        referralCode: "",
        wasReferred: false,
        referredBy: null,
        madeReferrals: [],
        validCount: 0,
        pendingCount: 0,
        totalReferrals: 0,
        bonusPaid: 0,
        bonusGroupsPaid: 0,
        progressToNextBonus: 0,
        remainingForBonus: REFERRALS_PER_BONUS,
      };
    }
    const data = snap.data();
    profile = {
      referralCode: String(data.referralCode ?? ""),
      referredByUid: String(data.referredByUid ?? ""),
      referredByCode: String(data.referredByCode ?? ""),
      referralValidCount: Number(data.referralValidCount ?? 0),
      referralBonusPaidGroups: Number(data.referralBonusPaidGroups ?? 0),
    };
  }

  let referredBy: AdminReferralDossier["referredBy"] = null;
  if (profile.referredByUid) {
    const referrerSnap = await getDoc(doc(db, "users", profile.referredByUid));
    if (referrerSnap.exists()) {
      const referrer = referrerSnap.data();
      referredBy = {
        id: referrerSnap.id,
        nome: String(referrer.nome || "Associado"),
        email: String(referrer.email || ""),
        code: profile.referredByCode || String(referrer.referralCode || ""),
      };
    }
  }

  const referralsSnap = await getDocs(
    query(collection(db, "referrals"), where("referrerId", "==", memberId)),
  );

  const madeReferrals = await Promise.all(
    referralsSnap.docs.map(async (item) => {
      const data = item.data();
      const referredId = String(data.referredId || item.id);
      const referredSnap = await getDoc(doc(db, "users", referredId));
      const referredData = referredSnap.exists() ? referredSnap.data()! : {};
      return mapReferredPerson(item.id, data, referredData);
    }),
  );

  madeReferrals.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const validCount = madeReferrals.filter((item) => item.isValid).length;
  const pendingCount = madeReferrals.length - validCount;
  const bonusGroupsPaid = profile.referralBonusPaidGroups ?? 0;
  const progressToNextBonus = validCount % REFERRALS_PER_BONUS;
  const remainingForBonus =
    progressToNextBonus === 0 && validCount > 0 && validCount % REFERRALS_PER_BONUS === 0
      ? 0
      : REFERRALS_PER_BONUS - progressToNextBonus;

  return {
    referralCode: profile.referralCode || "",
    wasReferred: Boolean(profile.referredByUid),
    referredBy,
    madeReferrals,
    validCount,
    pendingCount,
    totalReferrals: madeReferrals.length,
    bonusPaid: bonusGroupsPaid * REFERRAL_BONUS,
    bonusGroupsPaid,
    progressToNextBonus,
    remainingForBonus: remainingForBonus === REFERRALS_PER_BONUS ? REFERRALS_PER_BONUS : remainingForBonus,
  };
}
