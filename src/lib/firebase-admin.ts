import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKeyBase64 = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64;
    if (projectId && clientEmail && privateKeyBase64) {
      return {
        projectId,
        clientEmail,
        privateKey: Buffer.from(privateKeyBase64, "base64").toString("utf8"),
      };
    }

    // Conveniência exclusiva do desenvolvimento local (`next dev` / `next start`).
    // O arquivo está no .gitignore e nunca deve ir para o repositório ou deploy.
    const isHostedRuntime = Boolean(
      process.env.NETLIFY || process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME,
    );
    if (!isHostedRuntime) {
      const localPath = join(process.cwd(), "src", "firebase-service-account.json");
      if (existsSync(localPath)) {
        try {
          return JSON.parse(readFileSync(localPath, "utf8")) as {
            projectId?: string;
            project_id?: string;
            clientEmail?: string;
            client_email?: string;
            privateKey?: string;
            private_key?: string;
          };
        } catch {
          throw new Error("src/firebase-service-account.json inválido.");
        }
      }
    }

    return null;
  }
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
