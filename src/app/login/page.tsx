"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2 } from "lucide-react";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/");
      } else {
        setError("Credenciais invalidas. Apenas administradores podem acessar.");
      }
    } catch {
      setError("Erro de conexao. Verifique o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center -mt-16 lg:-mt-6 -ml-0 lg:-ml-60">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-soc-info mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-100">SOC Dashboard</h1>
          <p className="text-sm text-soc-neutral mt-1">BBT Connect - Acesso Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-soc-border bg-soc-card p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-soc-danger/10 border border-soc-danger/30 px-4 py-2 text-sm text-soc-danger">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-soc-bg border border-soc-border px-3 py-2 text-sm text-gray-100 placeholder-soc-neutral focus:outline-none focus:border-soc-info transition-colors"
              placeholder="admin@bbttransportes.com.br"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-soc-bg border border-soc-border px-3 py-2 text-sm text-gray-100 placeholder-soc-neutral focus:outline-none focus:border-soc-info transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-soc-info px-4 py-2.5 text-sm font-medium text-white hover:bg-soc-info/90 focus:outline-none disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Autenticando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
