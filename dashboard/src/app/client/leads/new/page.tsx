"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useSessionUser } from "@/hooks/use-session-user"
import { LEAD_ORIGINS } from "@/lib/leads"
import { mockLeads, mockUsers } from "@/lib/mock-data"

export default function NewLeadPage() {
  const router = useRouter()
  const { user } = useSessionUser()
  const [loading, setLoading] = useState(false)
  const clientId = user?.clientId ?? "c1"

  const employees = mockUsers.filter((u) => u.client_id === clientId && (u.role === "client_employee" || u.role === "client"))

  const [form, setForm] = useState({
    name: "", phone: "", email: "", origin: "", campaign: "", ad_set: "", ad: "",
    product_interest: "", responsible_name: user?.name ?? "", notes: "", next_action: "", next_action_date: "",
  })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { toast.error("Nome é obrigatório"); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const newLead = {
      id: `l${Date.now()}`,
      client_id: clientId,
      status: "novo" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...form,
    }
    mockLeads.push(newLead)
    toast.success("Lead cadastrado com sucesso")
    router.push("/client/leads")
    setLoading(false)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/client/leads"><ArrowLeft className="h-4 w-4" />Voltar</Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Novo Lead</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Dados do Lead</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Nome *</Label>
                    <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nome completo" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(11) 99999-9999" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@exemplo.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="product_interest">Serviço de Interesse</Label>
                    <Input id="product_interest" value={form.product_interest} onChange={(e) => set("product_interest", e.target.value)} placeholder="Ex: Botox, Matrícula..." />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Origem e Campanha</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Origem</Label>
                    <select value={form.origin} onChange={(e) => set("origin", e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Selecionar origem</option>
                      {LEAD_ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="campaign">Campanha</Label>
                    <Input id="campaign" value={form.campaign} onChange={(e) => set("campaign", e.target.value)} placeholder="Nome da campanha" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="ad_set">Conjunto</Label>
                    <Input id="ad_set" value={form.ad_set} onChange={(e) => set("ad_set", e.target.value)} placeholder="Nome do conjunto" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ad">Anúncio</Label>
                    <Input id="ad" value={form.ad} onChange={(e) => set("ad", e.target.value)} placeholder="Nome do anúncio" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Atendimento</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Responsável</Label>
                    <select value={form.responsible_name} onChange={(e) => set("responsible_name", e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Sem responsável</option>
                      {employees.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="next_action_date">Data da Próxima Ação</Label>
                    <Input id="next_action_date" type="date" value={form.next_action_date} onChange={(e) => set("next_action_date", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="next_action">Próxima Ação</Label>
                  <Input id="next_action" value={form.next_action} onChange={(e) => set("next_action", e.target.value)} placeholder="Ex: Ligar e agendar avaliação" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea id="notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Anotações sobre o lead..." rows={3} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Salvando...</> : <><Save className="h-4 w-4" />Cadastrar Lead</>}
            </Button>
            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href="/client/leads">Cancelar</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
