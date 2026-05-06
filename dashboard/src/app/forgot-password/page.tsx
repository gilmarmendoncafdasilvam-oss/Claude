"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">TrafficDash</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {!sent ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar senha</h1>
              <p className="text-gray-500 mb-6">Digite seu e-mail para receber o link de redefinição.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</> : "Enviar link de recuperação"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">E-mail enviado!</h2>
              <p className="text-gray-500 mb-6">
                Verifique sua caixa de entrada e spam. O link expira em 1 hora.
              </p>
            </div>
          )}

          <div className="mt-4 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar para login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
