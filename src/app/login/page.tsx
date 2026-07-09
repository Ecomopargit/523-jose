import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  async function loginAction(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      redirect("/login");
    }

    if (email === "admin@ecomopar.org") {
      redirect("/admin");
    }

    redirect("/dashboard");
  }

  return <LoginForm action={loginAction} />;
}
