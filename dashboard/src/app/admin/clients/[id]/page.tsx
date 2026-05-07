"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  Building2,
  Globe,
  MapPin,
  ExternalLink,
  Edit,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  AtSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Link2,
  Unlink,
  Zap,
  MessageSquare,
  Target,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "@/components/dashboard/metric-card"
import {
  mockClients,
  mockReports,
  mockPaidMedia,
  mockFinancial,
  mockFunnel,
  mockActionPlans,
  mockUsers,
} from "@/lib/mock-data"
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/utils"

const CLIENT_ACTIVITY: Record<string, Array<{ time: string; user: string; action: string }>> = {
  c1: [
    { time: "Hoje 09:15", user: "Maria Santos", action: "Publicou plano de ação" },
    { time: "Hoje 08:30", user: "Admin", action: "Criou novo relatório" },
    { time: "Ontem 17:45", user: "João Ferreira", action: "Importou dados Meta Ads" },
    { time: "Ontem 14:20", user: "Maria Santos", action: "Comentou no plano de ação" },
    { time: "Seg 11:00", user: "Admin", action: "Atualizou informações do cliente" },
  ],
}

const DEFAULT_ACTIVITY = [
  { time: "Hoje 10:00", user: "Admin", action: "Visualizou perfil do cliente" },
  { time: "Ontem 15:30", user: "Admin", action: "Atualizou dados cadastrais" },
  { time: "Seg 09:00", user: "Admin", action: "Criou registro do cliente" },
]

export default function AdminClientDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [internalNote, setInternalNote] = useState(
    "Cliente preferencial — negociar renovação até junho. Ticket médio acima da média da carteira."
  )
  const [noteSaved, setNoteSaved] = useState(false)

  const [integrations, setIntegrations] = useState({
    meta_ads: { connected: true, account_id: "act_123456789", account_name: "Clínica Saúde Total - Ads", last_sync: "Há 2 horas" },
    google_ads: { connected: true, account_id: "AW-987654321", account_name: "Saúde Total Google Ads", last_sync: "Há 3 horas" },
    ga4: { connected: true, account_id: "G-ABC123XYZ", account_name: "Saúde Total - GA4", last_sync: "Há 1 hora" },
    meta_business: { connected: false, account_id: "", account_name: "", last_sync: "" },
    whatsapp: { connected: true, account_id: "+55 11 99999-0000", account_name: "WhatsApp Business", last_sync: "Há 30 min" },
    rd_station: { connected: false, account_id: "", account_name: "", last_sync: "" },
    google_sheets: { connected: false, account_id: "", account_name: "", last_sync: "" },
  })

  function toggleIntegration(key: string) {
    setIntegrations((prev) => {
      const curr = prev[key as keyof typeof prev]
      const wasConnected = curr.connected
      toast[wasConnected ? "info" : "success"](wasConnected ? `${key} desconectado` : `${key} conectado com sucesso`)
      return {
        ...prev,
        [key]: { ...curr, connected: !wasConnected, last_sync: !wasConnected ? "Agora mesmo" : "" },
      }
    })
  }

  function handleSaveNote() {
    setNoteSaved(true)
    toast.success("Nota interna salva com sucesso")
    setTimeout(() => setNoteSaved(false), 2000)
  }

  const client = mockClients.find((c) => c.id === id)
  const clientReports = mockReports.filter((r) => r.client_id === id)
  const clientActions = mockActionPlans.filter((a) => a.client_id === id)
  const responsaveis = mockUsers.filter(
    (u) => u.role === "member" && u.assigned_clients?.includes(id)
  )
  const activityFeed = CLIENT_ACTIVITY[id] || DEFAULT_ACTIVITY

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
            <Link href="/client/dashboard">
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
        <MetricCard title="Total Investido" value={totalSpend} format="currency" />
        <MetricCard title="Total de Leads" value={totalLeads} format="number" />
        <MetricCard title="ROAS" value={financial ? `${financial.roas?.toFixed(2)}x` : "—"} format="raw" />
        <MetricCard title="Vendas" value={financial?.sales_count || 0} format="number" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="data">Dados do Cliente</TabsTrigger>
          <TabsTrigger value="internal">Dados Internos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Investimento em Mídia" value={financial?.media_spend || totalSpend} format="currency" />
            <MetricCard title="Leads Gerados" value={totalLeads} format="number" />
            <MetricCard title="Vendas" value={financial?.sales_count || 0} format="number" />
            <MetricCard title="ROAS" value={financial ? `${financial.roas?.toFixed(2)}x` : "—"} format="raw" />
            <MetricCard title="ROI" value={financial?.roi || 0} format="percent" />
            <MetricCard title="CPL" value={financial ? (financial.media_spend / totalLeads) : 0} format="currency" />
            <MetricCard title="CAC" value={financial?.cac || 0} format="currency" />
            <MetricCard title="LTV" value={financial?.ltv || 0} format="currency" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Responsáveis</CardTitle>
              </CardHeader>
              <CardContent>
                {responsaveis.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum responsável atribuído.</p>
                ) : (
                  <div className="space-y-3">
                    {responsaveis.map((u) => {
                      const memberRole = (u as { member_role?: string }).member_role || "membro"
                      return (
                        <div key={u.id} className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-semibold">{u.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                          <Badge variant="secondary" className="capitalize">{memberRole}</Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Última Atividade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activityFeed.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{item.user}</span>{" "}
                        <span className="text-gray-600">{item.action}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
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

        <TabsContent value="internal">
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-amber-800">
                Essas informações são visíveis apenas para administradores.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Contratuais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Fee Mensal", value: "R$ 2.500,00/mês" },
                    { label: "Contrato Desde", value: "01/01/2024" },
                    { label: "Próximo Vencimento", value: "01/01/2025" },
                    { label: "Modalidade", value: "Gestão de Tráfego + Estratégia" },
                    { label: "Renovação Automática", value: "Sim" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Margem da Agência</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Receita do Cliente", value: formatCurrency(financial?.revenue || 30600), highlight: false },
                    { label: "Custo de Mídia", value: formatCurrency(financial?.media_spend || 7000), highlight: false },
                    { label: "Fee da Agência", value: "R$ 2.500,00", highlight: false },
                    { label: "Custo Total", value: formatCurrency((financial?.media_spend || 7000) + 2500), highlight: false },
                    {
                      label: "Margem Líquida",
                      value: `${financial?.margin?.toFixed(1) || "70.6"}%`,
                      highlight: true,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0 ${item.highlight ? "font-semibold" : ""}`}
                    >
                      <span className={item.highlight ? "text-gray-900" : "text-gray-500"}>{item.label}</span>
                      <span className={item.highlight ? "text-emerald-600 text-base" : "text-gray-900"}>{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Notas Internas</CardTitle>
                <CardDescription>Visível apenas para a equipe da agência</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <textarea
                  className="w-full min-h-[120px] rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Adicione notas internas sobre este cliente..."
                />
                <div className="flex items-center gap-3">
                  <Button onClick={handleSaveNote}>Salvar</Button>
                  {noteSaved && (
                    <span className="text-sm text-emerald-600 font-medium">Nota salva!</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
              <strong>Integrações por cliente</strong> — conecte as contas de anúncios, analytics e CRM específicas deste cliente. Cada integração sincroniza os dados automaticamente para os relatórios.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Meta Ads */}
              <IntegrationCard
                icon={<div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center"><Target className="h-4 w-4 text-white" /></div>}
                name="Meta Ads"
                description="Facebook & Instagram Ads — campanhas, conjuntos e anúncios"
                integration={integrations.meta_ads}
                onToggle={() => toggleIntegration("meta_ads")}
              />
              {/* Google Ads */}
              <IntegrationCard
                icon={<div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center"><Zap className="h-4 w-4 text-white" /></div>}
                name="Google Ads"
                description="Campanhas de pesquisa, display, YouTube e shopping"
                integration={integrations.google_ads}
                onToggle={() => toggleIntegration("google_ads")}
              />
              {/* GA4 */}
              <IntegrationCard
                icon={<div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center"><Globe className="h-4 w-4 text-white" /></div>}
                name="Google Analytics 4"
                description="Tráfego orgânico, sessões, conversões e comportamento do site"
                integration={integrations.ga4}
                onToggle={() => toggleIntegration("ga4")}
              />
              {/* Meta Business */}
              <IntegrationCard
                icon={<div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center"><Building2 className="h-4 w-4 text-white" /></div>}
                name="Meta Business Suite"
                description="Página do Facebook, Instagram e engajamento orgânico"
                integration={integrations.meta_business}
                onToggle={() => toggleIntegration("meta_business")}
              />
              {/* WhatsApp */}
              <IntegrationCard
                icon={<div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center"><MessageSquare className="h-4 w-4 text-white" /></div>}
                name="WhatsApp Business"
                description="Conversas, leads via WhatsApp e taxa de resposta"
                integration={integrations.whatsapp}
                onToggle={() => toggleIntegration("whatsapp")}
              />
              {/* RD Station */}
              <IntegrationCard
                icon={<div className="h-8 w-8 rounded-lg bg-rose-500 flex items-center justify-center"><TrendingUp className="h-4 w-4 text-white" /></div>}
                name="RD Station CRM"
                description="Pipeline de vendas, oportunidades e receita gerada"
                integration={integrations.rd_station}
                onToggle={() => toggleIntegration("rd_station")}
              />
              {/* Google Sheets */}
              <IntegrationCard
                icon={<div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center"><Activity className="h-4 w-4 text-white" /></div>}
                name="Google Sheets"
                description="Planilha de dados customizada para importação manual"
                integration={integrations.google_sheets}
                onToggle={() => toggleIntegration("google_sheets")}
              />
              {/* MCP */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900 text-sm">MCP / Automação</p>
                      <Badge variant="secondary">Em breve</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Conecte via Model Context Protocol para automações avançadas com IA</p>
                    <div className="mt-3 bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-600 break-all">
                      wss://mcp.trafficdash.io/client/{id}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sync status overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status de Sincronização</CardTitle>
                <CardDescription>Última atualização dos dados de cada canal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(integrations)
                    .filter(([, v]) => v.connected)
                    .map(([key, v]) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-medium text-gray-700 capitalize">{key.replace(/_/g, " ")}</span>
                          <span className="text-xs text-gray-400">{v.account_id}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">{v.last_sync}</span>
                          <Button variant="ghost" size="sm" onClick={() => toast.success(`${key} sincronizado`)}>
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  {Object.values(integrations).filter((v) => v.connected).length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">Nenhuma integração conectada</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface IntegrationCardProps {
  icon: React.ReactNode
  name: string
  description: string
  integration: { connected: boolean; account_id: string; account_name: string; last_sync: string }
  onToggle: () => void
}

function IntegrationCard({ icon, name, description, integration, onToggle }: IntegrationCardProps) {
  return (
    <div className={`bg-white rounded-xl border p-5 transition-colors ${integration.connected ? "border-emerald-200" : "border-gray-200"}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-gray-900 text-sm">{name}</p>
            {integration.connected ? (
              <Badge variant="success" className="text-xs">Conectado</Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">Desconectado</Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
          {integration.connected && integration.account_name && (
            <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs font-medium text-gray-700">{integration.account_name}</p>
              <p className="text-xs text-gray-400">{integration.account_id} · {integration.last_sync}</p>
            </div>
          )}
          <Button
            size="sm"
            variant={integration.connected ? "outline" : "default"}
            className="mt-3 w-full"
            onClick={onToggle}
          >
            {integration.connected ? (
              <><Unlink className="h-3.5 w-3.5" /> Desconectar</>
            ) : (
              <><Link2 className="h-3.5 w-3.5" /> Conectar</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
