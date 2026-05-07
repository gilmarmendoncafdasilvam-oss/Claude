"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart3, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockUsers } from "@/lib/mock-data"
import { ROLE_PERMISSIONS } from "@/lib/permissions"
import type { MemberRole } from "@/lib/types"

const DEMO_USERS = [
  { email: "admin@agencia.com", password: "admin123", role: "admin", name: "Admin Agência" },
  { email: "maria@agencia.com", password: "membro123", role: "member", name: "Maria Santos" },
  { email: "joao@agencia.com", password: "membro123", role: "member", name: "João Ferreira" },
  { email: "carlos@saudetotal.com.br", password: "cliente123", role: "client", name: "Dr. Carlos Mendes", clientId: "c1" },
  { email: "ana@corpoemforma.com.br", password: "cliente123", role: "client", name: "Ana Lima", clientId: "c2" },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    await new Promise((r) => setTimeout(r, 800))

    const user = DEMO_USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      setError("E-mail ou senha incorretos. Tente: admin@agencia.com / admin123")
      setLoading(false)
      return
    }

    if (typeof window !== "undefined") {
      const mockUser = mockUsers.find((u) => u.email === user.email)
      const memberRole = mockUser?.member_role as MemberRole | undefined
      const sessionUser = {
        ...user,
        permissions: mockUser?.permissions ?? (memberRole ? ROLE_PERMISSIONS[memberRole] : []),
        assigned_clients: mockUser?.assigned_clients ?? [],
        member_role: memberRole ?? "",
        id: mockUser?.id ?? "",
      }
      sessionStorage.setItem("user", JSON.stringify(sessionUser))
    }

    if (user.role === "admin") {
      router.push("/admin")
    } else if (user.role === "member") {
      router.push("/member")
    } else {
      router.push("/client/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-950 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">TrafficDash</span>
        </div>
        <div>
          <blockquote className="text-2xl font-semibold text-white leading-relaxed mb-6">
            "Seus resultados de marketing em um único lugar. Dados + diagnóstico + plano de ação."
          </blockquote>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Clientes Ativos", value: "47+" },
              { label: "Relatórios Gerados", value: "320+" },
              { label: "Canais Integrados", value: "5+" },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-900 rounded-xl p-4">
                <p className="text-2xl font-bold text-blue-400">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="text-gray-600 text-sm">
          © 2024 TrafficDash. Todos os direitos reservados.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">TrafficDash</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Acesse sua conta</h1>
            <p className="text-gray-500 mt-2">Digite seu e-mail e senha para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Credenciais de demonstração</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Admin:</span>
                <code className="bg-gray-200 px-2 py-0.5 rounded text-gray-700">admin@agencia.com / admin123</code>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Membro:</span>
                <code className="bg-gray-200 px-2 py-0.5 rounded text-gray-700">maria@agencia.com / membro123</code>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Cliente:</span>
                <code className="bg-gray-200 px-2 py-0.5 rounded text-gray-700">carlos@saudetotal.com.br / cliente123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
