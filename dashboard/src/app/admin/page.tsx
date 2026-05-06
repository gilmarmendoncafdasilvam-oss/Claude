"use client"

import Link from "next/link"
import {
  Building2,
  AlertTriangle,
  Clock,
  Circle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/dashboard/metric-card"
import { mockClients, mockUsers, mockReports, mockActionPlans, mockPaidMedia, mockFinancial } from "@/lib/mock-data"

const ROAS_BY_CLIENT: Record<string, number> = { c1: 4.38, c2: 3.2, c3: 2.8 }

const ACTIVITY_FEED = [
  { time: "Hoje 09:15", user: "Maria Santos", action: "Publicou plano de ação", client: "Clínica Saúde Total" },
  { time: "Hoje 08:30", user: "Admin", action: "Criou novo relatório", client: "Academia Corpo em Forma" },
  { time: "Ontem 17:45", user: "João Ferreira", action: "Importou dados Meta Ads", client: "Escritório Mendes" },
  { time: "Ontem 14:20", user: "Maria Santos", action: "Comentou no plano de ação", client: "Clínica Saúde Total" },
  { time: "Seg 11:00", user: "Admin", action: "Adicionou novo cliente", client: "—" },
]

const INTEGRATIONS = [
  { name: "Google Ads API", status: "Não configurado" },
  { name: "Meta Ads API", status: "Não configurado" },
  { name: "Google Analytics 4", status: "Não configurado" },
  { name: "WhatsApp Business API", status: "Não configurado" },
  { name: "Importação CSV", status: "Ativo" },
]

const MEMBER_ROLE_LABELS: Record<string, { label: string; color: string }> = {
  gestor: { label: "Gestor", color: "bg-blue-100 text-blue-700" },
  analista: { label: "Analista", color: "bg-purple-100 text-purple-700" },
}

export default function AdminDashboardPage() {
  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  const activeClients = mockClients.filter((c) => c.status === "ativo")
  const memberUsers = mockUsers.filter((u) => u.role === "member")
  const publishedActions = mockActionPlans.filter((a) => a.published_to_client)
  const validatedActions = mockActionPlans.filter((a) => a.validated)
  const pendingActions = mockActionPlans.filter((a) => !a.validated && !a.published_to_client)

  const totalSpend = mockPaidMedia.reduce((s, m) => s + m.spend, 0)
  const totalLeads = mockPaidMedia.reduce((s, m) => s + m.leads, 0)
  const roasMedio = mockFinancial.roas

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral da Agência</h1>
        <p className="text-gray-500 mt-1 capitalize">{today}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard title="Clientes Ativos" value={activeClients.length} format="number" />
        <MetricCard title="Total Investido (mês)" value={totalSpend} format="currency" />
        <MetricCard title="Leads Gerados" value={totalLeads} format="number" />
        <MetricCard title="ROAS Médio" value={`${roasMedio}x`} format="raw" />
        <MetricCard title="Funcionários Ativos" value={memberUsers.length} format="number" />
        <MetricCard title="Relatórios Este Mês" value={mockReports.length} format="number" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Clientes — Visão Rápida</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/clients">Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Cliente</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Segmento</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Responsável</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">ROAS</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockClients.map((client) => {
                    const assigned = mockUsers.find(
                      (u) => u.role === "member" && u.assigned_clients?.includes(client.id)
                    )
                    const roas = ROAS_BY_CLIENT[client.id]
                    return (
                      <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                              <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">{client.company_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{client.segment || "—"}</td>
                        <td className="px-6 py-4">
                          <Badge variant={client.status === "ativo" ? "success" : client.status === "inativo" ? "secondary" : "warning"}>
                            {client.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{assigned?.name || "—"}</td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900">{roas ? `${roas}x` : "—"}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/clients/${client.id}`}>Ver</Link>
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Equipe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {memberUsers.map((user) => {
                const memberRole = (user as { member_role?: string }).member_role || ""
                const roleInfo = MEMBER_ROLE_LABELS[memberRole] || { label: "Membro", color: "bg-gray-100 text-gray-700" }
                const clientCount = user.assigned_clients?.length || 0
                return (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-semibold">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{clientCount} cliente{clientCount !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Planos de Ação — Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{publishedActions.length}</p>
                <p className="text-xs text-emerald-600 mt-0.5">Publicados</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{validatedActions.length}</p>
                <p className="text-xs text-blue-600 mt-0.5">Validados</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">{pendingActions.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Pendentes</p>
              </div>
            </div>
            <div className="space-y-2">
              {pendingActions.slice(0, 5).map((action) => (
                <div key={action.id} className="flex items-start gap-2 text-sm">
                  <Circle className="h-3.5 w-3.5 text-gray-300 shrink-0 mt-0.5" />
                  <span className="text-gray-700 flex-1 truncate">{action.action}</span>
                  <Badge
                    variant={action.priority === "alta" ? "destructive" : action.priority === "média" ? "warning" : "secondary"}
                    className="text-xs shrink-0"
                  >
                    {action.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ACTIVITY_FEED.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{item.user}</span>{" "}
                    <span className="text-gray-600">{item.action}</span>
                  </p>
                  {item.client !== "—" && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.client}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alertas Importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "3 ações de alta prioridade sem responsável definido",
              "2 clientes sem relatório no último mês",
              "Meta Ads API não configurada",
            ].map((msg, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">{msg}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>Status das Integrações</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/settings">Configurar</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {INTEGRATIONS.map((integration) => {
                const isActive = integration.status === "Ativo"
                return (
                  <div key={integration.name} className="flex items-center justify-between px-6 py-3">
                    <span className="text-sm text-gray-700">{integration.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                      <span className={`text-sm ${isActive ? "text-emerald-700" : "text-red-600"}`}>
                        {integration.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
