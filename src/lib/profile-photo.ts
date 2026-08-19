import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

const MAX_DATA_URL_CHARS = 700_000;

async function toJpegDataUrl(file: File, maxWidth: number, quality: number) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Imagem inválida."));
    img.src = dataUrl;
  });

  const ratio = Math.min(1, maxWidth / image.width);
  const width = Math.max(1, Math.round(image.width * ratio));
  const height = Math.max(1, Math.round(image.height * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Não foi possível processar a imagem.");
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", quality);
}

export async function uploadMemberPhotoWeb(file: File) {
  const user = auth.currentUser;
  if (!user) return { ok: false as const, error: "Sessão expirada. Entre novamente." };
  if (!file.type.startsWith("image/")) {
    return { ok: false as const, error: "Selecione um arquivo de imagem." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false as const, error: "A imagem precisa ter no máximo 8 MB." };
  }

  try {
    let photoURL = await toJpegDataUrl(file, 320, 0.55);
    if (photoURL.length > MAX_DATA_URL_CHARS) {
      photoURL = await toJpegDataUrl(file, 240, 0.42);
    }
    if (photoURL.length > MAX_DATA_URL_CHARS) {
      return { ok: false as const, error: "Essa imagem ficou grande demais. Escolha outra foto." };
    }

    await updateDoc(doc(db, "users", user.uid), {
      photoURL,
      updatedAt: serverTimestamp(),
    });

    return { ok: true as const, photoURL };
  } catch (error) {
    console.error("uploadMemberPhotoWeb", error);
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Não foi possível salvar a foto. Tente novamente.",
    };
  }
}

export async function removeMemberPhotoWeb() {
  const user = auth.currentUser;
  if (!user) return { ok: false as const, error: "Sessão expirada. Entre novamente." };

  try {
    await updateDoc(doc(db, "users", user.uid), {
      photoURL: "",
      updatedAt: serverTimestamp(),
    });
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Não foi possível remover a foto." };
  }
}
