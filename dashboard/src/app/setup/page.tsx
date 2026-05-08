"use client"

import { useState } from "react"

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [results, setResults] = useState<{ email: string; status: string }[]>([])
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSetup() {
    setStatus("loading")
    setErrorMsg("")
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: "trafficdash-setup-2024" }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? "Erro desconhecido")
        setStatus("error")
        return
      }
      setResults(data.results ?? [])
      setStatus("done")
    } catch {
      setErrorMsg("Não foi possível conectar ao servidor.")
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Configuração inicial</h1>
        <p className="text-gray-500 text-sm mb-6">Cria os usuários demo no Supabase para teste de login.</p>

        {status === "idle" && (
          <button
            onClick={handleSetup}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Criar usuários demo
          </button>
        )}

        {status === "loading" && (
          <div className="w-full bg-blue-100 text-blue-700 font-semibold py-3 rounded-xl text-center animate-pulse">
            Criando usuários...
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              <strong>Erro:</strong> {errorMsg}
              {errorMsg.includes("env vars") && (
                <p className="mt-2">
                  Adicione as variáveis <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
                  <code>SUPABASE_SERVICE_ROLE_KEY</code> no painel do Vercel e faça um Redeploy.
                </p>
              )}
            </div>
            <button
              onClick={() => setStatus("idle")}
              className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {status === "done" && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-emerald-700 font-semibold mb-3">Usuários criados com sucesso!</p>
              <div className="space-y-2">
                {results.map((r) => (
                  <div key={r.email} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{r.email}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.status === "created" ? "bg-emerald-100 text-emerald-700" :
                      r.status === "already_exists" ? "bg-gray-100 text-gray-600" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {r.status === "created" ? "criado" : r.status === "already_exists" ? "já existe" : r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800 mb-2">Credenciais de acesso:</p>
              <p>👤 <strong>admin@agencia.com</strong> / Admin@2024</p>
              <p>👤 <strong>maria@agencia.com</strong> / Maria@2024</p>
              <p>👤 <strong>joao@agencia.com</strong> / Joao@2024</p>
              <p>👤 <strong>cliente@clinica.com</strong> / Cliente@2024</p>
            </div>

            <a
              href="/login"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-center transition"
            >
              Ir para o Login →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
