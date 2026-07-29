import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Resend } from "resend";

import {
  ACTIVATION_AMOUNT,
  ACTIVATION_FEE_AMOUNT,
  ACTIVATION_RESERVE_AMOUNT,
  type ActivationPayment,
} from "@/lib/activation-constants";

function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export async function buildActivationReceiptPdf(payment: ActivationPayment) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const draw = (text: string, x: number, y: number, size = 12, isBold = false) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: isBold ? bold : font,
      color: rgb(0.05, 0.18, 0.14),
    });
  };

  draw("ECOMOPAR", 50, 780, 22, true);
  draw("Comprovante de ativação via PIX", 50, 752, 14, true);
  draw("Instituto de Apoio ao Motorista Autônomo", 50, 732, 10);

  page.drawRectangle({
    x: 50,
    y: 560,
    width: 495,
    height: 145,
    borderColor: rgb(0.08, 0.3, 0.22),
    borderWidth: 1,
    color: rgb(0.95, 0.98, 0.96),
  });

  draw(`Associado: ${payment.memberName || "—"}`, 65, 670, 12, true);
  draw(`E-mail: ${payment.memberEmail}`, 65, 648);
  draw(`Valor total: ${brl(ACTIVATION_AMOUNT)}`, 65, 626, 12, true);
  draw(
    `Reserva: ${brl(ACTIVATION_RESERVE_AMOUNT)}  |  Taxa da transação: ${brl(ACTIVATION_FEE_AMOUNT)}`,
    65,
    604,
  );
  draw(`Status: ${payment.status === "approved" ? "Aprovado" : payment.status}`, 65, 582);

  draw(`ID Mercado Pago: ${payment.mpPaymentId}`, 50, 520);
  draw(`ID interno: ${payment.id}`, 50, 500);
  draw(
    `Pago em: ${
      payment.approvedAt
        ? new Date(payment.approvedAt).toLocaleString("pt-BR")
        : new Date().toLocaleString("pt-BR")
    }`,
    50,
    480,
  );
  draw("Este documento confirma a ativação do cadastro ECOMOPAR.", 50, 450);
  draw("Os R$ 2,00 de taxa já estão incluídos no valor total de R$ 7,00.", 50, 430);

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}

export async function sendActivationReceiptEmail(payment: ActivationPayment, pdf: Buffer) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim() || "ECOMOPAR <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("RESEND_API_KEY ausente — e-mail de comprovante não enviado.");
    return { sent: false as const, reason: "missing_resend_key" };
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to: payment.memberEmail,
    subject: "Comprovante de ativação ECOMOPAR — PIX R$ 7,00",
    html: `
      <div style="font-family:Arial,sans-serif;color:#12241c;line-height:1.5">
        <h2>Cadastro ativado</h2>
        <p>Olá, ${payment.memberName || "associado"}.</p>
        <p>Recebemos o PIX de <strong>${brl(ACTIVATION_AMOUNT)}</strong> e seu cadastro ECOMOPAR foi ativado.</p>
        <p style="font-size:13px;color:#4b6357">
          R$ 2,00 deste valor correspondem à taxa por transação (já incluídos no total).
        </p>
        <p>O comprovante em PDF segue em anexo.</p>
        <p>ID Mercado Pago: <code>${payment.mpPaymentId}</code></p>
      </div>
    `,
    attachments: [
      {
        filename: `comprovante-ativacao-${payment.mpPaymentId}.pdf`,
        content: pdf,
      },
    ],
  });

  if (result.error) {
    throw new Error(result.error.message || "Falha ao enviar e-mail Resend.");
  }

  return { sent: true as const, id: result.data?.id || null };
}
