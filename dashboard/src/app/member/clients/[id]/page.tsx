"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  Building2,
  Globe,
  MapPin,
  ArrowLeft,
  AtSign,
  Target,
  FileText,
  CheckSquare,
  TrendingUp,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "@/components/dashboard/metric-card"
import { AccessDenied } from "@/components/ui/access-denied"
import { usePermissions } from "@/hooks/use-permissions"
import {
  mockClients,
  mockReports,
  mockActionPlans,
  mockPaidMedia,
} from "@/lib/mock-data"
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/utils"

const STATUS_COLORS: Record<string, string> = {
  pendente: "bg-gray-300",
  "em andamento": "bg-blue-500",
  concluído: "bg-emerald-500",
}

export default function MemberClientDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { can, loaded } = usePermissions()

  const [actionStatuses, setActionStatuses] = useState<Record<string, string>>({})

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!can("clients.view")) {
    return <AccessDenied message="Você não tem permissão para visualizar detalhes de clientes." />
  }

  const client = mockClients.find((c) => c.id === id)
  const clientReports = mockReports.filter((r) => r.client_id === id)
  const clientActions = mockActionPlans.filter((a) => a.client_id === id)
  const clientMedia = mockPaidMedia.filter((m) => m.client_id === id)

  if (!client) {
    return (
      <div className="text-center py-16">
        <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium text-gray-900">Cliente não encontrado</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/member/clients">Voltar para Clientes</Link>
        </Button>
      </div>
    )
  }

  const totalSpend = clientMedia.reduce((sum, m) => sum + m.spend, 0)
  const totalLeads = clientMedia.reduce((sum, m) => sum + m.leads, 0)
  const avgCpl = totalLeads > 0 ? totalSpend / totalLeads : 0
  const avgRoas =
    clientMedia.length > 0
      ? clientMedia.reduce((sum, m) => sum + (m.roas ?? 0), 0) / clientMedia.length
      : 0

  const pendingActions = clientActions.filter(
    (a) => (actionStatuses[a.id] ?? a.status) === "pendente"
  ).length
  const inProgressActions = clientActions.filter(
    (a) => (actionStatuses[a.id] ?? a.status) === "em andamento"
  ).length
  const completedActions = clientActions.filter(
    (a) => (actionStatuses[a.id] ?? a.status) === "concluído"
  ).length

  function handleStatusChange(actionId: string, newStatus: string) {
    setActionStatuses((prev) => ({ ...prev, [actionId]: newStatus }))
  }

  return (
    <div>
      {/* Back button */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/member/clients">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      {/* Client header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
            <Building2 className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.company_name}</h1>
            {client.trade_name && (
              <p className="text-gray-500 mt-0.5">{client.trade_name}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={
                  client.status === "ativo"
                    ? "success"
                    : client.status === "inativo"
                    ? "secondary"
                    : "warning"
                }
              >
                {client.status}
              </Badge>
              {client.segment && <Badge variant="secondary">{client.segment}</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Investido" value={totalSpend} format="currency" />
        <MetricCard title="Total de Leads" value={totalLeads} format="number" />
        <MetricCard title="CPL Médio" value={avgCpl} format="currency" />
        <MetricCard title="ROAS Médio" value={avgRoas > 0 ? `${avgRoas.toFixed(2)}x` : "—"} format="raw" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="action-plan">Plano de Ação</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>

        {/* ─── Visão Geral ─── */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                    Empresa
                  </p>
                  <p className="text-sm font-medium text-gray-900">{client.company_name}</p>
                  {client.trade_name && (
                    <p className="text-sm text-gray-500">{client.trade_name}</p>
                  )}
                </div>

                {client.segment && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                      Segmento
                    </p>
                    <p className="text-sm text-gray-900">{client.segment}</p>
                  </div>
                )}

                {(client.city || client.state) && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                      Localização
                    </p>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {[client.city, client.state].filter(Boolean).join(", ")}
                    </p>
                  </div>
                )}

                {client.website && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                      Website
                    </p>
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {client.website}
                    </a>
                  </div>
                )}

                {client.instagram && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                      Instagram
                    </p>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <AtSign className="h-3.5 w-3.5 text-gray-400" />
                      {client.instagram}
                    </p>
                  </div>
                )}

                {client.main_objective && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                      Objetivo Principal
                    </p>
                    <p className="text-sm text-gray-900 flex items-start gap-1">
                      <Target className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                      {client.main_objective}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                    Status
                  </p>
                  <Badge
                    variant={
                      client.status === "ativo"
                        ? "success"
                        : client.status === "inativo"
                        ? "secondary"
                        : "warning"
                    }
                  >
                    {client.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo de Atividade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold text-blue-700">{clientReports.length}</p>
                      <p className="text-xs text-blue-500 mt-0.5">Relatórios</p>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <CheckSquare className="h-5 w-5 text-amber-500" />
                      </div>
                      <p className="text-2xl font-bold text-amber-700">{pendingActions}</p>
                      <p className="text-xs text-amber-500 mt-0.5">Ações Pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      <p className="text-xl font-bold text-blue-600">{inProgressActions}</p>
                      <p className="text-xs text-blue-400 mt-0.5">Andamento</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <p className="text-xl font-bold text-emerald-600">{completedActions}</p>
                      <p className="text-xs text-emerald-400 mt-0.5">Concluídas</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {clientActions.slice(0, 4).map((action) => {
                      const currentStatus = actionStatuses[action.id] ?? action.status
                      return (
                        <div key={action.id} className="flex items-center gap-2 text-sm">
                          <div
                            className={`h-2 w-2 rounded-full shrink-0 ${
                              STATUS_COLORS[currentStatus] ?? "bg-gray-300"
                            }`}
                          />
                          <span className="text-gray-700 truncate">{action.action}</span>
                          <Badge
                            variant={action.priority === "alta" ? "destructive" : "secondary"}
                            className="text-xs shrink-0"
                          >
                            {action.priority}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ─── Relatórios ─── */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios do Cliente</CardTitle>
              <CardDescription>
                {clientReports.length} relatório{clientReports.length !== 1 ? "s" : ""} encontrado
                {clientReports.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {clientReports.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Nenhum relatório criado para este cliente ainda.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {clientReports.map((report) => (
                    <Link
                      key={report.id}
                      href={`/member/reports/${report.id}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{report.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(report.period_start)} – {formatDate(report.period_end)}
                        </p>
                        {report.main_highlight && (
                          <p className="text-xs text-emerald-600 mt-1">{report.main_highlight}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary">{report.report_type}</Badge>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Plano de Ação ─── */}
        <TabsContent value="action-plan">
          <Card>
            <CardHeader>
              <CardTitle>Plano de Ação</CardTitle>
              <CardDescription>
                {clientActions.length} ação{clientActions.length !== 1 ? "ões" : ""} para este
                cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {clientActions.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <CheckSquare className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Nenhuma ação cadastrada para este cliente.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {clientActions.map((action) => {
                    const currentStatus = actionStatuses[action.id] ?? action.status
                    return (
                      <div key={action.id} className="px-6 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div
                              className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1.5 ${
                                STATUS_COLORS[currentStatus] ?? "bg-gray-300"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{action.action}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                {action.area && (
                                  <Badge variant="secondary" className="text-xs">
                                    {action.area}
                                  </Badge>
                                )}
                                <Badge
                                  variant={
                                    action.priority === "alta" ? "destructive" : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {action.priority}
                                </Badge>
                                {action.deadline && (
                                  <span className="text-xs text-gray-400">
                                    Prazo: {formatDate(action.deadline)}
                                  </span>
                                )}
                                {action.responsible && (
                                  <span className="text-xs text-gray-400">
                                    Responsável: {action.responsible}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {can("action_plans.edit") ? (
                            <select
                              value={currentStatus}
                              onChange={(e) => handleStatusChange(action.id, e.target.value)}
                              className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
                            >
                              <option value="pendente">Pendente</option>
                              <option value="em andamento">Em andamento</option>
                              <option value="concluído">Concluído</option>
                            </select>
                          ) : (
                            <Badge
                              variant={
                                currentStatus === "concluído"
                                  ? "success"
                                  : currentStatus === "em andamento"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs shrink-0"
                            >
                              {currentStatus}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Métricas ─── */}
        <TabsContent value="metrics">
          {clientMedia.length === 0 ? (
            <div className="text-center py-16">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">Nenhuma métrica de mídia paga encontrada.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary metric cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Investido" value={totalSpend} format="currency" />
                <MetricCard title="Total de Leads" value={totalLeads} format="number" />
                <MetricCard title="CPL Médio" value={avgCpl} format="currency" />
                <MetricCard
                  title="ROAS Médio"
                  value={avgRoas > 0 ? `${avgRoas.toFixed(2)}x` : "—"}
                  format="raw"
                />
              </div>

              {/* Per-campaign breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {clientMedia.map((metric) => (
                  <Card key={metric.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {metric.channel} — {metric.campaign_name}
                      </CardTitle>
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
                          {
                            label: "ROAS",
                            value: metric.roas ? `${metric.roas.toFixed(2)}x` : "—",
                          },
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

              {/* Link to full action plan */}
              <div className="flex justify-end">
                <Button variant="outline" asChild>
                  <Link href="/member/action-plan">
                    <ExternalLink className="h-4 w-4" />
                    Ver Plano de Ação Completo
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
