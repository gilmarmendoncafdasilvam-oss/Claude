"use client"

import Link from "next/link"
import {
  Building2,
  Users,
  FileBarChart,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowRight,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/dashboard/metric-card"
import { mockClients, mockReports } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"

const portfolioStats = [
  { title: "Total Investido", value: 31500, format: "currency" as const, prev: 28200, icon: <DollarSign className="h-4 w-4" /> },
  { title: "Total de Leads", value: 1240, format: "number" as const, prev: 1080, icon: <TrendingUp className="h-4 w-4" /> },
  { title: "Total de Vendas", value: 178, format: "number" as const, prev: 152, icon: <Activity className="h-4 w-4" /> },
  { title: "CPL Médio", value: 25.4, format: "currency" as const, prev: 26.1, icon: <ArrowUpRight className="h-4 w-4" />, invertDelta: true },
]

const statusColors: Record<string, string> = {
  ativo: "success",
  inativo: "secondary",
  pausado: "warning",
}

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral da Carteira</h1>
        <p className="text-gray-500 mt-1">Resumo consolidado de todos os clientes – Maio 2024</p>
      </div>

      {/* Portfolio metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {portfolioStats.map((stat) => (
          <MetricCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            format={stat.format}
            rawValue={stat.value}
            previousValue={stat.prev}
            icon={stat.icon}
            invertDelta={stat.invertDelta}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients list */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Clientes Ativos</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/clients" className="flex items-center gap-1">
                  Ver todos <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {mockClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{client.company_name}</p>
                        <p className="text-xs text-gray-500">{client.segment}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusColors[client.status] as "success" | "secondary" | "warning"}>
                        {client.status}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/clients/${client.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent reports + Quick actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {mockReports.slice(0, 4).map((report) => (
                  <div key={report.id} className="px-6 py-3">
                    <p className="font-medium text-sm text-gray-800">{report.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {mockClients.find((c) => c.id === report.client_id)?.trade_name}
                      </p>
                      <span className="text-xs text-gray-400">{formatDate(report.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { href: "/admin/clients/new", icon: Building2, label: "Novo Cliente" },
                { href: "/admin/users/new", icon: Users, label: "Novo Usuário" },
                { href: "/admin/reports/new", icon: FileBarChart, label: "Novo Relatório" },
                { href: "/admin/import", icon: TrendingUp, label: "Importar Dados" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <action.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400 ml-auto" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
