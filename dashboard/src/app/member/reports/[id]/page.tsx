"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileBarChart, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockReports, mockClients, mockFinancial } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"

const typeLabels: Record<string, string> = {
  semanal: "Semanal",
  mensal: "Mensal",
  trimestral: "Trimestral",
  personalizado: "Personalizado",
}

export default function MemberReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const report = mockReports.find((r) => r.id === id)
  const client = report ? mockClients.find((c) => c.id === report.client_id) : null

  if (!report) {
    return (
      <div className="text-center py-16">
        <FileBarChart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium text-gray-900">Relatório não encontrado</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/member/reports">Voltar para Relatórios</Link>
        </Button>
      </div>
    )
  }

  const financial = mockFinancial.report_id === report.id ? mockFinancial : null

  const kpis = [
    {
      label: "Investimento Total",
      value: financial ? `R$ ${financial.media_spend.toLocaleString("pt-BR")}` : "—",
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Leads Gerados",
      value: financial ? "312" : "—",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "ROAS",
      value: financial?.roas ? `${financial.roas}x` : "—",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "ROI",
      value: financial?.roi ? `${financial.roi}%` : "—",
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/member/reports">
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
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {client && <span>{client.trade_name || client.company_name}</span>}
            <span>
              {formatDate(report.period_start)} – {formatDate(report.period_end)}
            </span>
            <span>Criado em {formatDate(report.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`h-9 w-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-sm text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {report.executive_summary && (
          <Card>
            <CardHeader>
              <CardTitle>Resumo Executivo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{report.executive_summary}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {report.main_highlight && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h3 className="font-semibold text-emerald-800">Principal Destaque</h3>
              </div>
              <p className="text-emerald-700">{report.main_highlight}</p>
            </div>
          )}

          {report.main_warning && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-amber-800">Ponto de Atenção</h3>
              </div>
              <p className="text-amber-700">{report.main_warning}</p>
            </div>
          )}
        </div>

        {report.next_steps && (
          <Card>
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{report.next_steps}</pre>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-sm text-gray-500 text-center">
          Para exportar este relatório em PDF, solicite ao administrador.
        </p>
      </div>
    </div>
  )
}
