"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockClients } from "@/lib/mock-data"

export default function NewReportPage() {
  const router = useRouter()
  const pathname = usePathname()
  const basePath = pathname.startsWith("/member") ? "/member" : "/admin"
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    client_id: "", report_type: "mensal", title: "",
    period_start: "", period_end: "",
    executive_summary: "", main_highlight: "", main_warning: "", next_steps: "",
  })

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    router.push(`${basePath}/reports`)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`${basePath}/reports`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Relatório</h1>
          <p className="text-gray-500 mt-1">Preencha as informações do relatório</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Cliente *</Label>
                  <Select value={form.client_id} onValueChange={(v) => update("client_id", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                    <SelectContent>
                      {mockClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Tipo de Relatório *</Label>
                    <Select value={form.report_type} onValueChange={(v) => update("report_type", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="trimestral">Trimestral</SelectItem>
                        <SelectItem value="personalizado">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Título *</Label>
                    <Input placeholder="Ex: Relatório Mensal – Maio 2024" value={form.title} onChange={(e) => update("title", e.target.value)} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Início do Período *</Label>
                    <Input type="date" value={form.period_start} onChange={(e) => update("period_start", e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Fim do Período *</Label>
                    <Input type="date" value={form.period_end} onChange={(e) => update("period_end", e.target.value)} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Conteúdo Executivo</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Resumo Executivo</Label>
                  <Textarea placeholder="Visão geral do período para o cliente..." value={form.executive_summary} onChange={(e) => update("executive_summary", e.target.value)} rows={4} />
                </div>
                <div className="space-y-1.5">
                  <Label>Principal Destaque</Label>
                  <Input placeholder="Ex: CPL caiu 14% com 22% mais volume de leads" value={form.main_highlight} onChange={(e) => update("main_highlight", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Principal Ponto de Atenção</Label>
                  <Input placeholder="Ex: Taxa de resposta comercial abaixo da meta" value={form.main_warning} onChange={(e) => update("main_warning", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Próximos Passos</Label>
                  <Textarea placeholder="Ações planejadas para o próximo período..." value={form.next_steps} onChange={(e) => update("next_steps", e.target.value)} rows={3} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Salvando...</> : <><Save className="h-4 w-4" />Salvar Relatório</>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
