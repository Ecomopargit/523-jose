import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

const pickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

const MAX_DATA_URL_CHARS = 700_000;

export async function pickProfilePhoto(source: "library" | "camera") {
  const permission =
    source === "camera"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      source === "camera"
        ? "Permita o acesso à câmera para tirar sua foto de perfil."
        : "Permita o acesso às fotos para escolher sua imagem de perfil.",
    );
  }

  const result =
    source === "camera"
      ? await ImagePicker.launchCameraAsync(pickerOptions)
      : await ImagePicker.launchImageLibraryAsync(pickerOptions);

  if (result.canceled || !result.assets[0]?.uri) return null;
  return result.assets[0].uri;
}

async function toDataUrl(uri: string, width: number, compress: number) {
  const optimized = await manipulateAsync(uri, [{ resize: { width } }], {
    compress,
    format: SaveFormat.JPEG,
    base64: true,
  });
  if (!optimized.base64) {
    throw new Error("Não foi possível processar a imagem.");
  }
  return `data:image/jpeg;base64,${optimized.base64}`;
}

export async function uploadProfilePhoto(uri: string) {
  const user = auth.currentUser;
  if (!user) return { ok: false as const, error: "Sessão expirada. Entre novamente." };

  try {
    let photoURL = await toDataUrl(uri, 320, 0.55);
    if (photoURL.length > MAX_DATA_URL_CHARS) {
      photoURL = await toDataUrl(uri, 240, 0.42);
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
    console.warn("Falha ao salvar foto de perfil:", error);
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Não foi possível salvar a foto. Tente novamente.",
    };
  }
}

export async function removeProfilePhoto() {
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

export async function chooseAndUploadProfilePhoto(source: "library" | "camera") {
  const uri = await pickProfilePhoto(source);
  if (!uri) return { ok: false as const, cancelled: true as const };
  const uploaded = await uploadProfilePhoto(uri);
  if (!uploaded.ok) return uploaded;
  return { ok: true as const, photoURL: uploaded.photoURL };
}
