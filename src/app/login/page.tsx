"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff,
  LogIn,
  Shield,
  AlertCircle
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de login - redirecionaria para área do associado
    if (formData.email === "admin@ecomopar.org") {
      window.location.href = "/admin";
    } else if (formData.email) {
      window.location.href = "/dashboard";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0E3A5D] via-[#0E3A5D] to-[#1a5a3d] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0E3A5D] to-[#1FA35B] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-3xl">E</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Área do Associado</h1>
          <p className="text-gray-300 mt-2">Faça login para acessar sua conta</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button className="flex-1 py-4 text-center font-semibold text-[#0E3A5D] border-b-2 border-[#0E3A5D] bg-gray-50">
              <div className="flex items-center justify-center space-x-2">
                <User className="w-5 h-5" />
                <span>Associado</span>
              </div>
            </button>
            <Link 
              href="/admin/login"
              className="flex-1 py-4 text-center font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Administrador</span>
              </div>
            </Link>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail ou CPF
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Digite seu e-mail ou CPF"
                    className="field !pl-12"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Digite sua senha"
                    className="field !pl-12 !pr-12"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#0E3A5D] rounded"
                    checked={formData.remember}
                    onChange={(e) => setFormData({...formData, remember: e.target.checked})}
                  />
                  <span className="text-sm text-gray-600">Lembrar de mim</span>
                </label>
                <Link 
                  href="/recuperar-senha"
                  className="text-sm text-[#0E3A5D] hover:underline font-medium"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <button type="submit" className="btn-primary btn-md w-full">
                <LogIn className="w-5 h-5" />
                <span>Entrar</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Ainda não é associado?{" "}
                <Link href="/associar-se" className="text-[#0E3A5D] font-semibold hover:underline">
                  Associe-se agora
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Links de ajuda */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Precisa de ajuda?{" "}
            <Link href="/contato" className="text-white hover:underline">
              Entre em contato
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
