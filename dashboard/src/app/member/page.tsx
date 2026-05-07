"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2, CheckSquare, FileBarChart, TrendingUp, ArrowRight, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockClients, mockActionPlans, mockReports, mockUsers } from "@/lib/mock-data"

const recentActivity = [
  { id: 1, description: "Plano de Ação aprovado para Clínica Saúde Total", time: "Hoje, 09:15", type: "success" },
  { id: 2, description: "Dados importados — Meta Ads (Academia Corpo em Forma)", time: "Ontem, 16:42", type: "info" },
  { id: 3, description: "Relatório mensal publicado — Clínica Saúde Total", time: "01/05/2024", type: "success" },
  { id: 4, description: "Ação validada: Bot WhatsApp implementado", time: "30/04/2024", type: "success" },
  { id: 5, description: "Importação de dados GA4 concluída", time: "29/04/2024", type: "info" },
]

const statusColors: Record<string, string> = {
  ativo: "success",
  inativo: "secondary",
  pausado: "warning",
}

export default function MemberDashboardPage() {
  const [userName, setUserName] = useState("")
  const [assignedClientIds, setAssignedClientIds] = useState<string[]>([])

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) return
    const user = JSON.parse(userData)
    setUserName(user.name)
    const found = mockUsers.find((u) => u.email === user.email)
    setAssignedClientIds(found?.assigned_clients || [])
  }, [])

  const assignedClients = mockClients.filter((c) => assignedClientIds.includes(c.id))
  const activeClients = assignedClients.filter((c) => c.status === "ativo").length
  const activeReports = mockReports.filter((r) => assignedClientIds.includes(r.client_id)).length
  const pendingActions = mockActionPlans.filter(
    (a) => assignedClientIds.includes(a.client_id) && a.status === "pendente"
  ).length
  const completedActions = mockActionPlans.filter(
    (a) => assignedClientIds.includes(a.client_id) && a.status === "concluído"
  ).length

  const stats = [
    { label: "Clientes Gerenciados", value: assignedClients.length, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Relatórios Ativos", value: activeReports, icon: FileBarChart, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Ações Pendentes", value: pendingActions, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Ações Concluídas", value: completedActions, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {userName || "Membro"}! Área de Membros
        </h1>
        <p className="text-gray-500 mt-1">Gerencie seus clientes e planos de ação</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Meus Clientes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/member/clients" className="flex items-center gap-1">
                  Ver todos <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {assignedClients.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Nenhum cliente atribuído ainda</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {assignedClients.map((client) => {
                    const clientActions = mockActionPlans.filter((a) => a.client_id === client.id)
                    const pending = clientActions.filter((a) => a.status === "pendente").length
                    return (
                      <Link
                        key={client.id}
                        href={`/member/clients/${client.id}`}
                        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm group-hover:text-blue-600">{client.company_name}</p>
                            <p className="text-xs text-gray-500">{client.segment}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={statusColors[client.status] as "success" | "secondary" | "warning"}>
                            {client.status}
                          </Badge>
                          {pending > 0 && (
                            <Badge variant="warning">{pending} pendente{pending > 1 ? "s" : ""}</Badge>
                          )}
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="px-6 py-3">
                    <div className="flex items-start gap-2">
                      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${activity.type === "success" ? "bg-emerald-500" : "bg-blue-500"}`} />
                      <div>
                        <p className="text-sm text-gray-700">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { href: "/member/action-plan", icon: CheckSquare, label: "Gerenciar Planos de Ação" },
                { href: "/member/reports", icon: FileBarChart, label: "Ver Relatórios" },
                { href: "/member/import", icon: TrendingUp, label: "Importar Dados" },
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
