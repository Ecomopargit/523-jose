export const ACTIVATION_AMOUNT = 7;
export const ACTIVATION_FEE_AMOUNT = 2;
export const ACTIVATION_RESERVE_AMOUNT = 5;
export const ACTIVATION_COLLECTION = "activationPayments";

export type ActivationPaymentStatus = "pending" | "approved" | "rejected" | "cancelled" | "expired";

export type ActivationPayment = {
  id: string;
  memberId: string;
  memberEmail: string;
  memberName: string;
  amount: number;
  feeAmount: number;
  reserveAmount: number;
  status: ActivationPaymentStatus;
  mpPaymentId: string;
  qrCode: string;
  qrCodeBase64: string;
  ticketUrl: string;
  expiresAt: string | null;
  emailSentAt: string | null;
  receiptGeneratedAt: string | null;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
};

export function publicActivationPayload(payment: ActivationPayment) {
  return {
    id: payment.id,
    amount: payment.amount,
    feeAmount: payment.feeAmount,
    reserveAmount: payment.reserveAmount,
    status: payment.status,
    qrCode: payment.qrCode,
    qrCodeBase64: payment.qrCodeBase64,
    ticketUrl: payment.ticketUrl,
    expiresAt: payment.expiresAt,
    emailSentAt: payment.emailSentAt,
    receiptAvailable: Boolean(payment.receiptGeneratedAt || payment.status === "approved"),
    approvedAt: payment.approvedAt,
    createdAt: payment.createdAt,
  };
}
