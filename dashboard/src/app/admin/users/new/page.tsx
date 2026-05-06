"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockClients } from "@/lib/mock-data"

export default function NewUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "client", client_id: "" })

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    router.push("/admin/users")
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/users"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Usuário</h1>
          <p className="text-gray-500 mt-1">Crie um novo acesso ao sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-xl space-y-6">
          <Card>
            <CardHeader><CardTitle>Dados do Usuário</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nome Completo *</Label>
                <Input placeholder="Nome do usuário" value={form.name} onChange={(e) => update("name", e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>E-mail *</Label>
                <Input type="email" placeholder="email@empresa.com" value={form.email} onChange={(e) => update("email", e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Senha *</Label>
                <div className="relative">
                  <Input
                    type={showPwd ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    required
                    minLength={8}
                    className="pr-10"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Perfil de Acesso *</Label>
                <Select value={form.role} onValueChange={(v) => update("role", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador – Acesso total</SelectItem>
                    <SelectItem value="client">Cliente – Acesso ao próprio dashboard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.role === "client" && (
                <div className="space-y-1.5">
                  <Label>Vincular ao Cliente *</Label>
                  <Select value={form.client_id} onValueChange={(v) => update("client_id", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                    <SelectContent>
                      {mockClients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-700">
            <strong>Segurança:</strong> A senha será armazenada com hash bcrypt. O usuário poderá alterá-la no primeiro acesso.
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Criando...</> : <><Save className="h-4 w-4" />Criar Usuário</>}
          </Button>
        </div>
      </form>
    </div>
  )
}
