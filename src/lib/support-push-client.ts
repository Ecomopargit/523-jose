import { auth } from "@/lib/firebase";

export async function notifySupportPush(input: {
  direction: "member_to_admin" | "admin_to_member";
  chatId: string;
  preview: string;
  memberName?: string;
}) {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await fetch("/api/notifications/support", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch (error) {
    console.warn("Falha ao disparar push de suporte.", error);
  }
}
