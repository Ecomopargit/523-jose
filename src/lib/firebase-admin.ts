import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      projectId?: string;
      project_id?: string;
      clientEmail?: string;
      client_email?: string;
      privateKey?: string;
      private_key?: string;
    };
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON inválido.");
  }
}

function initAdminApp(): App {
  if (getApps().length) return getApps()[0]!;

  const serviceAccount = getServiceAccount();
  if (serviceAccount) {
    return initializeApp({
      credential: cert({
        projectId: serviceAccount.projectId || serviceAccount.project_id,
        clientEmail: serviceAccount.clientEmail || serviceAccount.client_email,
        privateKey: (serviceAccount.privateKey || serviceAccount.private_key || "").replace(
          /\\n/g,
          "\n",
        ),
      }),
    });
  }

  // Local/dev fallback when only public project id is available.
  return initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const adminApp = initAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
