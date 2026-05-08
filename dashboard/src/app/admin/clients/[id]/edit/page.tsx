"use client"

import { useState } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { mockClients } from "@/lib/mock-data"

const segments = [
  "Saúde / Clínica Médica", "Fitness / Academia", "Jurídico", "Imobiliário",
  "Educação / Cursos", "Estética / Beleza", "Odontologia", "Psicologia",
  "Consultoria", "E-commerce", "Restaurante / Food", "Outros",
]

const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]

export default function EditClientPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const router = useRouter()
  const pathname = usePathname()
  const basePath = pathname.startsWith("/member") ? "/member" : "/admin"

  const client = mockClients.find((c) => c.id === id)

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    company_name: client?.company_name ?? "",
    trade_name: client?.trade_name ?? "",
    segment: client?.segment ?? "",
    website: client?.website ?? "",
    instagram: client?.instagram ?? "",
    main_objective: client?.main_objective ?? "",
    city: client?.city ?? "",
    state: client?.state ?? "",
    status: client?.status ?? "ativo",
  })

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    toast.success("Cliente atualizado com sucesso")
    router.push(`${basePath}/clients/${id}`)
  }

  if (!client) {
    return (
      <div className="text-center py-16">
        <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium text-gray-900">Cliente não encontrado</p>
        <p className="text-sm text-gray-500 mt-1">O cliente com ID "{id}" não existe.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={`${basePath}/clients`}>Voltar para Clientes</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`${basePath}/clients/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
          <p className="text-gray-500 mt-1">{client.company_name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="company_name">Razão Social *</Label>
                    <Input
                      id="company_name"
                      placeholder="Nome completo da empresa"
                      value={form.company_name}
                      onChange={(e) => update("company_name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="trade_name">Nome Fantasia</Label>
                    <Input
                      id="trade_name"
                      placeholder="Como a empresa é conhecida"
                      value={form.trade_name}
                      onChange={(e) => update("trade_name", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Segmento</Label>
                  <Select value={form.segment} onValueChange={(v) => update("segment", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      {segments.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://site.com.br"
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      placeholder="@perfil"
                      value={form.instagram}
                      onChange={(e) => update("instagram", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      placeholder="São Paulo"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Estado</Label>
                    <Select value={form.state} onValueChange={(v) => update("state", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="main_objective">Objetivo Principal</Label>
                  <Textarea
                    id="main_objective"
                    placeholder="Ex: Gerar leads qualificados para consultas de estética..."
                    value={form.main_objective}
                    onChange={(e) => update("main_objective", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={form.status} onValueChange={(v) => update("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>

            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href={`${basePath}/clients/${id}`}>Cancelar</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
