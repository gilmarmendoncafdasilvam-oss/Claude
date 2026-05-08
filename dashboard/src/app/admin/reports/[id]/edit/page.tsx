"use client"

import { useState } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, FileBarChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { mockReports, mockClients } from "@/lib/mock-data"

export default function EditReportPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const router = useRouter()
  const pathname = usePathname()
  const basePath = pathname.startsWith("/member") ? "/member" : "/admin"

  const report = mockReports.find((r) => r.id === id)
  const client = report ? mockClients.find((c) => c.id === report.client_id) : undefined

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: report?.title ?? "",
    report_type: report?.report_type ?? "mensal",
    period_start: report?.period_start ?? "",
    period_end: report?.period_end ?? "",
    executive_summary: report?.executive_summary ?? "",
    main_highlight: report?.main_highlight ?? "",
    main_warning: report?.main_warning ?? "",
    next_steps: report?.next_steps ?? "",
  })

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    toast.success("Relatório atualizado com sucesso")
    router.push(`${basePath}/reports/${id}`)
  }

  if (!report) {
    return (
      <div className="text-center py-16">
        <FileBarChart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium text-gray-900">Relatório não encontrado</p>
        <p className="text-sm text-gray-500 mt-1">O relatório com ID &quot;{id}&quot; não existe.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={`${basePath}/reports`}>Voltar para Relatórios</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`${basePath}/reports/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Relatório</h1>
          <p className="text-gray-500 mt-1">{report.title}</p>
        </div>
      </div>

      {client && (
        <div className="mb-6 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <FileBarChart className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Cliente</p>
            <p className="text-sm font-semibold text-gray-900">{client.company_name}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Relatório Mensal – Maio 2024"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Tipo de Relatório *</Label>
                  <Select value={form.report_type} onValueChange={(v) => update("report_type", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="personalizado">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="period_start">Início do Período *</Label>
                    <Input
                      id="period_start"
                      type="date"
                      value={form.period_start}
                      onChange={(e) => update("period_start", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="period_end">Fim do Período *</Label>
                    <Input
                      id="period_end"
                      type="date"
                      value={form.period_end}
                      onChange={(e) => update("period_end", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conteúdo Executivo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="executive_summary">Resumo Executivo</Label>
                  <Textarea
                    id="executive_summary"
                    placeholder="Visão geral do período para o cliente..."
                    value={form.executive_summary}
                    onChange={(e) => update("executive_summary", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="main_highlight">Principal Destaque</Label>
                  <Textarea
                    id="main_highlight"
                    placeholder="Ex: CPL caiu 14% com 22% mais volume de leads"
                    value={form.main_highlight}
                    onChange={(e) => update("main_highlight", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="main_warning">Principal Ponto de Atenção</Label>
                  <Textarea
                    id="main_warning"
                    placeholder="Ex: Taxa de resposta comercial abaixo da meta"
                    value={form.main_warning}
                    onChange={(e) => update("main_warning", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="next_steps">Próximos Passos</Label>
                  <Textarea
                    id="next_steps"
                    placeholder="Ações planejadas para o próximo período..."
                    value={form.next_steps}
                    onChange={(e) => update("next_steps", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
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
              <Link href={`${basePath}/reports/${id}`}>Cancelar</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
