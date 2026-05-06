"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Building2, Globe, MapPin, Target, ExternalLink, Edit, ArrowLeft, TrendingUp, DollarSign, Users, Activity, AtSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "@/components/dashboard/metric-card"
import { mockClients, mockReports, mockPaidMedia, mockFinancial, mockFunnel, mockActionPlans } from "@/lib/mock-data"
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/utils"

export default function AdminClientDetailPage() {
  const params = useParams()
  const id = params.id as string

  const client = mockClients.find((c) => c.id === id)
  const clientReports = mockReports.filter((r) => r.client_id === id)
  const clientActions = mockActionPlans.filter((a) => a.client_id === id)

  if (!client) {
    return (
      <div className="text-center py-16">
        <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium text-gray-900">Cliente não encontrado</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/clients">Voltar para Clientes</Link>
        </Button>
      </div>
    )
  }

  const totalSpend = mockPaidMedia
    .filter((m) => m.client_id === id)
    .reduce((s, m) => s + m.spend, 0)
  const totalLeads = mockPaidMedia
    .filter((m) => m.client_id === id)
    .reduce((s, m) => s + m.leads, 0)

  const financial = mockFinancial.client_id === id ? mockFinancial : null
  const funnel = mockFunnel.client_id === id ? mockFunnel : null

  const pendingActions = clientActions.filter((a) => a.status === "pendente").length
  const completedActions = clientActions.filter((a) => a.status === "concluído").length

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/clients">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
            <Building2 className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.company_name}</h1>
            {client.trade_name && <p className="text-gray-500 mt-0.5">{client.trade_name}</p>}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={client.status === "ativo" ? "success" : client.status === "inativo" ? "secondary" : "warning"}>
                {client.status}
              </Badge>
              {client.segment && <Badge variant="secondary">{client.segment}</Badge>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/client/dashboard`}>
              <ExternalLink className="h-4 w-4" />
              Ver como Cliente
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/clients/${id}/edit`}>
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Investido" value={totalSpend} format="currency" rawValue={totalSpend} />
        <MetricCard title="Total de Leads" value={totalLeads} format="number" rawValue={totalLeads} />
        <MetricCard title="ROAS" value={financial ? `${financial.roas?.toFixed(2)}x` : "—"} rawValue={financial?.roas || 0} />
        <MetricCard title="Vendas" value={financial?.sales_count || 0} format="number" rawValue={financial?.sales_count || 0} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="data">Dados do Cliente</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plano de Ação</CardTitle>
                <CardDescription>{clientActions.length} ações no total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-gray-600">{pendingActions}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Pendentes</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xl font-bold text-blue-600">{clientActions.filter((a) => a.status === "em andamento").length}</p>
                    <p className="text-xs text-blue-400 mt-0.5">Andamento</p>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <p className="text-xl font-bold text-emerald-600">{completedActions}</p>
                    <p className="text-xs text-emerald-400 mt-0.5">Concluídas</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {clientActions.slice(0, 4).map((action) => (
                    <div key={action.id} className="flex items-center gap-2 text-sm">
                      <div className={`h-2 w-2 rounded-full shrink-0 ${
                        action.status === "concluído" ? "bg-emerald-500" :
                        action.status === "em andamento" ? "bg-blue-500" : "bg-gray-300"
                      }`} />
                      <span className="text-gray-700 truncate">{action.action}</span>
                      <Badge variant={action.priority === "alta" ? "destructive" : "secondary"} className="text-xs shrink-0">{action.priority}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {funnel && (
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Funil</CardTitle>
                  <CardDescription>Conversão principal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: "Impressões", value: formatNumber(funnel.impressions) },
                      { label: "Cliques", value: formatNumber(funnel.clicks) },
                      { label: "Leads", value: formatNumber(funnel.leads) },
                      { label: "Agendamentos", value: formatNumber(funnel.appointments) },
                      { label: "Vendas", value: formatNumber(funnel.sales) },
                      { label: "Receita", value: formatCurrency(funnel.revenue) },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-semibold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {financial && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Investimento em Mídia", value: formatCurrency(financial.media_spend), icon: DollarSign },
                      { label: "Receita Gerada", value: formatCurrency(financial.revenue || 0), icon: TrendingUp },
                      { label: "ROAS", value: `${financial.roas?.toFixed(2)}x`, icon: Activity },
                      { label: "ROI", value: `${financial.roi}%`, icon: Activity },
                      { label: "Ticket Médio", value: formatCurrency(financial.average_ticket || 0), icon: DollarSign },
                      { label: "CAC", value: formatCurrency(financial.cac || 0), icon: Users },
                      { label: "LTV", value: formatCurrency(financial.ltv || 0), icon: TrendingUp },
                      { label: "Margem", value: formatPercent(financial.margin || 0), icon: Activity },
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
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {clientReports.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <p>Nenhum relatório criado para este cliente ainda</p>
                  <Button className="mt-4" asChild>
                    <Link href="/admin/reports/new">Criar Relatório</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {clientReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{report.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(report.period_start)} – {formatDate(report.period_end)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{report.report_type}</Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/reports/${report.id}`}>Ver</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockPaidMedia.filter((m) => m.client_id === id).map((metric) => (
              <Card key={metric.id}>
                <CardHeader>
                  <CardTitle>{metric.channel} — {metric.campaign_name}</CardTitle>
                  <CardDescription>{metric.objective}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
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
                      <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        <p className="font-bold text-gray-900 text-sm">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Informações do Cliente</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/clients/${id}/edit`}>
                  <Edit className="h-4 w-4" />
                  Editar
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Empresa</p>
                    <p className="text-sm font-medium text-gray-900">{client.company_name}</p>
                    {client.trade_name && <p className="text-sm text-gray-500">{client.trade_name}</p>}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Segmento</p>
                    <p className="text-sm text-gray-900">{client.segment || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Objetivo Principal</p>
                    <p className="text-sm text-gray-900">{client.main_objective || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Status</p>
                    <Badge variant={client.status === "ativo" ? "success" : client.status === "inativo" ? "secondary" : "warning"}>
                      {client.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  {client.website && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Website</p>
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" />
                        {client.website}
                      </a>
                    </div>
                  )}
                  {client.instagram && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Instagram</p>
                      <p className="text-sm text-gray-900 flex items-center gap-1">
                        <AtSign className="h-3.5 w-3.5" />
                        {client.instagram}
                      </p>
                    </div>
                  )}
                  {(client.city || client.state) && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Localização</p>
                      <p className="text-sm text-gray-900 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {[client.city, client.state].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Cadastrado em</p>
                    <p className="text-sm text-gray-900">{formatDate(client.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Última atualização</p>
                    <p className="text-sm text-gray-900">{formatDate(client.updated_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
