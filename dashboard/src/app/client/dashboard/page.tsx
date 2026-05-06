"use client"

import { Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MetricCard } from "@/components/dashboard/metric-card"
import { LineChart } from "@/components/charts/line-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import {
  mockReports, mockPaidMedia, mockFinancial, mockFunnel, mockDiagnostic, mockActionPlans, mockChartData,
} from "@/lib/mock-data"
import { formatCurrency, formatNumber, formatPercent, formatDateRange, getStatusColor } from "@/lib/utils"
import Link from "next/link"

const report = mockReports[0]
const financial = mockFinancial
const funnel = mockFunnel
const diagnostic = mockDiagnostic

const totalSpend = mockPaidMedia.reduce((s, m) => s + m.spend, 0)
const totalLeads = mockPaidMedia.reduce((s, m) => s + m.leads, 0)
const totalConversions = mockPaidMedia.reduce((s, m) => s + m.conversions, 0)
const avgCPL = totalSpend / totalLeads
const avgROAS = mockPaidMedia.reduce((s, m) => s + (m.roas || 0), 0) / mockPaidMedia.length

const alertItems = [
  { type: "warning", icon: AlertTriangle, message: "Taxa de resposta comercial caiu para 68% — meta é 80%.", area: "Comercial" },
  { type: "info", icon: Info, message: "Campanha 'Video_Botox_Resultado' com CPL 18% abaixo da média — escalar.", area: "Meta Ads" },
  { type: "success", icon: CheckCircle2, message: "Google Ads com CTR de 4% — acima da média do setor (2,5%).", area: "Google Ads" },
]

export default function ClientDashboardPage() {
  function exportPDF() {
    window.print()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clínica Saúde Total</h1>
          <p className="text-gray-500 mt-1">{report.title}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-gray-500">{formatDateRange(report.period_start, report.period_end)}</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(diagnostic.performance_status)}`}>
              {diagnostic.performance_status.charAt(0).toUpperCase() + diagnostic.performance_status.slice(1)}
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={exportPDF} className="gap-2 shrink-0">
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Executive Summary */}
      {report.executive_summary && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Resumo Executivo</h3>
          <p className="text-sm text-blue-700 leading-relaxed">{report.executive_summary}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {report.main_highlight && (
              <div className="flex items-start gap-2 bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <TrendingUp className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-emerald-700 mb-0.5">Principal Destaque</p>
                  <p className="text-xs text-emerald-700">{report.main_highlight}</p>
                </div>
              </div>
            )}
            {report.main_warning && (
              <div className="flex items-start gap-2 bg-amber-50 rounded-lg p-3 border border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-700 mb-0.5">Ponto de Atenção</p>
                  <p className="text-xs text-amber-700">{report.main_warning}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Investimento Total" value={totalSpend} format="currency" previousValue={6350} rawValue={totalSpend} />
        <MetricCard title="Leads Gerados" value={totalLeads} format="number" previousValue={256} rawValue={totalLeads} />
        <MetricCard title="Custo por Lead" value={avgCPL} format="currency" previousValue={24.8} rawValue={avgCPL} invertDelta />
        <MetricCard title="ROAS Médio" value={`${avgROAS.toFixed(2)}x`} previousValue={4.0} rawValue={avgROAS} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Vendas Realizadas" value={financial.sales_count || 0} format="number" previousValue={36} rawValue={financial.sales_count || 0} />
        <MetricCard title="Receita Gerada" value={financial.revenue || 0} format="currency" previousValue={26000} rawValue={financial.revenue || 0} />
        <MetricCard title="ROI" value={`${financial.roi}%`} previousValue={218} rawValue={financial.roi || 0} />
        <MetricCard title="CAC" value={financial.cac || 0} format="currency" previousValue={248} rawValue={financial.cac || 0} invertDelta />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Leads e CPL</CardTitle>
            <CardDescription>Últimos 4 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={mockChartData.leadsEvolution}
              xKey="month"
              lines={[
                { key: "leads", label: "Leads", color: "#3b82f6" },
              ]}
              formatY={(v) => String(v)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROAS e ROI Histórico</CardTitle>
            <CardDescription>Tendência de rentabilidade</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={mockChartData.roasEvolution}
              xKey="month"
              lines={[
                { key: "roas", label: "ROAS", color: "#10b981" },
                { key: "roi", label: "ROI (%)", color: "#8b5cf6" },
              ]}
              formatY={(v) => String(v)}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leads por Semana</CardTitle>
            <CardDescription>Volume e conversões semanais</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={mockChartData.weeklyLeads}
              xKey="week"
              bars={[
                { key: "leads", label: "Leads", color: "#3b82f6" },
                { key: "conversions", label: "Conversões", color: "#10b981" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Canal</CardTitle>
            <CardDescription>Meta Ads vs. Google Ads</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart
              data={mockChartData.channelDistribution.map((d) => ({ name: d.channel, value: d.value, color: d.color }))}
              formatValue={(v) => `${v} leads`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Funnel Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Funil</CardTitle>
            <CardDescription>Conversão de impressões até vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Impressões", value: funnel.impressions, rate: null },
                { label: "Cliques", value: funnel.clicks, rate: funnel.click_through_rate },
                { label: "Leads", value: funnel.leads, rate: funnel.page_conversion_rate },
                { label: "Agendamentos", value: funnel.appointments, rate: funnel.lead_to_appointment_rate, bottleneck: true },
                { label: "Vendas", value: funnel.sales, rate: funnel.appointment_to_sale_rate },
              ].map((stage, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 text-right text-sm font-medium text-gray-700">{stage.label}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className={`h-full rounded-full flex items-center px-3 text-xs font-semibold text-white ${stage.bottleneck ? "bg-amber-500" : "bg-blue-600"}`}
                      style={{ width: `${Math.max((stage.value / funnel.impressions) * 100 * 30, 15)}%` }}
                    >
                      {formatNumber(stage.value)}
                    </div>
                  </div>
                  {stage.rate !== null && stage.rate !== undefined && (
                    <span className={`text-xs w-16 text-right font-medium ${stage.bottleneck ? "text-amber-600" : "text-gray-500"}`}>
                      {formatPercent(stage.rate)} conv.
                    </span>
                  )}
                </div>
              ))}
            </div>
            {funnel.main_bottleneck && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                <strong>Gargalo principal:</strong> {funnel.main_bottleneck}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas e Destaques</CardTitle>
            <CardDescription>Pontos que merecem sua atenção</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertItems.map((alert, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  alert.type === "warning" ? "bg-amber-50 border-amber-200" :
                  alert.type === "success" ? "bg-emerald-50 border-emerald-200" :
                  "bg-blue-50 border-blue-200"
                }`}
              >
                <alert.icon className={`h-4 w-4 mt-0.5 shrink-0 ${
                  alert.type === "warning" ? "text-amber-600" :
                  alert.type === "success" ? "text-emerald-600" :
                  "text-blue-600"
                }`} />
                <div>
                  <Badge variant={alert.type === "warning" ? "warning" : alert.type === "success" ? "success" : "default"} className="text-xs mb-1">
                    {alert.area}
                  </Badge>
                  <p className="text-xs text-gray-700">{alert.message}</p>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link href="/client/diagnostic">
                <Button variant="outline" size="sm" className="w-full">
                  Ver Diagnóstico Completo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      {report.next_steps && (
        <Card>
          <CardHeader>
            <CardTitle>Próximas Ações</CardTitle>
            <CardDescription>O que está planejado para o próximo período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm text-gray-700 whitespace-pre-line">{report.next_steps}</div>
            <div className="mt-4">
              <Link href="/client/action-plan">
                <Button variant="outline" size="sm">Ver Plano de Ação Detalhado</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
