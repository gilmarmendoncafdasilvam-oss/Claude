"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { FileBarChart, ArrowLeft, Download, Edit, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockReports, mockClients, mockPaidMedia, mockFinancial, mockFunnel } from "@/lib/mock-data"
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/utils"

const typeLabels: Record<string, string> = {
  semanal: "Semanal",
  mensal: "Mensal",
  trimestral: "Trimestral",
  personalizado: "Personalizado",
}

export default function AdminReportDetailPage() {
  const params = useParams()
  const id = params.id as string

  const report = mockReports.find((r) => r.id === id)
  const [isPublished, setIsPublished] = useState(true)

  if (!report) {
    return (
      <div className="text-center py-16">
        <FileBarChart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium text-gray-900">Relatório não encontrado</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/reports">Voltar para Relatórios</Link>
        </Button>
      </div>
    )
  }

  const client = mockClients.find((c) => c.id === report.client_id)
  const metrics = mockPaidMedia.filter((m) => m.report_id === id || m.client_id === report.client_id)
  const financial = mockFinancial.report_id === id ? mockFinancial : (mockFinancial.client_id === report.client_id ? mockFinancial : null)
  const funnel = mockFunnel.report_id === id ? mockFunnel : (mockFunnel.client_id === report.client_id ? mockFunnel : null)

  const totalSpend = metrics.reduce((s, m) => s + m.spend, 0)
  const totalLeads = metrics.reduce((s, m) => s + m.leads, 0)
  const totalConversions = metrics.reduce((s, m) => s + m.conversions, 0)
  const avgROAS = metrics.length > 0 ? metrics.reduce((s, m) => s + (m.roas || 0), 0) / metrics.length : 0

  function exportPDF() {
    window.print()
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/reports">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
            <Badge variant="secondary">{typeLabels[report.report_type]}</Badge>
            <Badge variant={isPublished ? "success" : "secondary"}>
              {isPublished ? "Publicado" : "Rascunho"}
            </Badge>
          </div>
          {client && (
            <div className="flex items-center gap-2">
              <p className="text-gray-500">{client.company_name}</p>
              <span className="text-gray-300">•</span>
              <p className="text-gray-500 text-sm">
                {formatDate(report.period_start)} – {formatDate(report.period_end)}
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPublished(!isPublished)}
          >
            {isPublished ? "Marcar como Rascunho" : "Publicar"}
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/reports/${id}/edit`}>
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button onClick={exportPDF}>
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {report.executive_summary && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Resumo Executivo</h3>
          <p className="text-sm text-blue-700 leading-relaxed">{report.executive_summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {report.main_highlight && (
          <div className="flex items-start gap-3 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800 mb-1">Principal Destaque</p>
              <p className="text-sm text-emerald-700">{report.main_highlight}</p>
            </div>
          </div>
        )}
        {report.main_warning && (
          <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">Ponto de Atenção</p>
              <p className="text-sm text-amber-700">{report.main_warning}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Investimento Total", value: formatCurrency(totalSpend) },
          { label: "Total de Leads", value: formatNumber(totalLeads) },
          { label: "Conversões", value: formatNumber(totalConversions) },
          { label: "ROAS Médio", value: avgROAS > 0 ? `${avgROAS.toFixed(2)}x` : "—" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
            <p className="text-xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      {financial && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Métricas Financeiras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Investimento Mídia", value: formatCurrency(financial.media_spend) },
                { label: "Taxa de Gestão", value: formatCurrency(financial.management_fee) },
                { label: "Custo Total Marketing", value: formatCurrency(financial.total_marketing_cost) },
                { label: "Receita Gerada", value: formatCurrency(financial.revenue || 0) },
                { label: "Ticket Médio", value: formatCurrency(financial.average_ticket || 0) },
                { label: "CAC", value: formatCurrency(financial.cac || 0) },
                { label: "ROI", value: `${financial.roi}%` },
                { label: "Margem", value: formatPercent(financial.margin || 0) },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="font-bold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {metrics.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Métricas por Canal</CardTitle>
            <CardDescription>{metrics.length} canal(is) ativo(s)</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {metrics.map((metric) => (
                <div key={metric.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{metric.channel} — {metric.campaign_name}</p>
                      {metric.objective && <p className="text-xs text-gray-500">{metric.objective}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
                    {[
                      { label: "Investimento", value: formatCurrency(metric.spend) },
                      { label: "Impressões", value: formatNumber(metric.impressions) },
                      { label: "Cliques", value: formatNumber(metric.clicks) },
                      { label: "CTR", value: formatPercent(metric.ctr) },
                      { label: "CPC", value: formatCurrency(metric.cpc) },
                      { label: "Leads", value: formatNumber(metric.leads) },
                      { label: "CPL", value: formatCurrency(metric.cpl) },
                      { label: "ROAS", value: metric.roas ? `${metric.roas.toFixed(2)}x` : "—" },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="font-semibold text-gray-900 text-sm mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {report.next_steps && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              Próximas Ações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm text-gray-700 whitespace-pre-line">{report.next_steps}</div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex items-center justify-between text-sm text-gray-400 border-t border-gray-100 pt-4">
        <p>Criado em {formatDate(report.created_at)} · Atualizado em {formatDate(report.updated_at)}</p>
        <p>Criado por: {report.created_by}</p>
      </div>
    </div>
  )
}
