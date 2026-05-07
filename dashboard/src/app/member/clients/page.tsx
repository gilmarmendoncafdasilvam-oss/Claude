"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, Search, CheckSquare, Plus, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockClients, mockUsers, mockActionPlans } from "@/lib/mock-data"
import type { Client } from "@/lib/types"
import { usePermissions } from "@/hooks/use-permissions"
import { AccessDenied } from "@/components/ui/access-denied"

export default function MemberClientsPage() {
  const router = useRouter()
  const { can, loaded } = usePermissions()
  const [search, setSearch] = useState("")
  const [assignedClients, setAssignedClients] = useState<Client[]>([])

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) return
    const user = JSON.parse(userData)
    const found = mockUsers.find((u) => u.email === user.email)
    const ids = found?.assigned_clients || []
    setAssignedClients(mockClients.filter((c) => ids.includes(c.id)))
  }, [])

  if (!loaded) return <div className="p-8 text-gray-400 text-sm">Carregando...</div>
  if (!can("clients.view")) return <AccessDenied message="Você não tem permissão para visualizar clientes." />

  const filtered = assignedClients.filter(
    (c) =>
      c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      c.segment?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Clientes</h1>
          <p className="text-gray-500 mt-1">{assignedClients.length} clientes atribuídos</p>
        </div>
        {can("clients.create") && (
          <Button asChild>
            <Link href="/member/clients/new">
              <Plus className="h-4 w-4" /> Novo Cliente
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, segmento ou cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
              <span className="col-span-4">Empresa</span>
              <span className="col-span-3">Segmento</span>
              <span className="col-span-2">Cidade / Estado</span>
              <span className="col-span-1">Status</span>
              <span className="col-span-2 text-right">Ações</span>
            </div>
            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Nenhum cliente encontrado</p>
              </div>
            )}
            {filtered.map((client) => {
              const pendingActions = mockActionPlans.filter(
                (a) => a.client_id === client.id && a.status === "pendente"
              ).length
              return (
                <div
                  key={client.id}
                  className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/member/clients/${client.id}`)}
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm hover:text-blue-600 transition-colors">{client.company_name}</p>
                      {client.trade_name && <p className="text-xs text-gray-500">{client.trade_name}</p>}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-600">{client.segment || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">
                      {client.city && client.state ? `${client.city}, ${client.state}` : "—"}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <Badge
                      variant={
                        client.status === "ativo" ? "success" : client.status === "inativo" ? "secondary" : "warning"
                      }
                    >
                      {client.status}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    {pendingActions > 0 && (
                      <Badge variant="warning" className="text-xs mr-1">{pendingActions}</Badge>
                    )}
                    <Button variant="ghost" size="sm" asChild title="Ver detalhes">
                      <Link href={`/member/clients/${client.id}`}>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {filtered.length > 0 && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((client) => {
            const clientActions = mockActionPlans.filter((a) => a.client_id === client.id)
            const pending = clientActions.filter((a) => a.status === "pendente").length
            const inProgress = clientActions.filter((a) => a.status === "em andamento").length
            const completed = clientActions.filter((a) => a.status === "concluído").length
            return (
              <div key={`card-${client.id}`} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.company_name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{client.segment}</p>
                  </div>
                  <Badge
                    variant={
                      client.status === "ativo" ? "success" : client.status === "inativo" ? "secondary" : "warning"
                    }
                  >
                    {client.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-600">{pending}</p>
                    <p className="text-xs text-gray-400">Pendentes</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{inProgress}</p>
                    <p className="text-xs text-blue-400">Andamento</p>
                  </div>
                  <div className="text-center p-2 bg-emerald-50 rounded-lg">
                    <p className="text-lg font-bold text-emerald-600">{completed}</p>
                    <p className="text-xs text-emerald-400">Concluídas</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <Link href={`/member/clients/${client.id}`}>
                      Ver Detalhes
                    </Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/member/clients/${client.id}?tab=action-plan`}>
                      <CheckSquare className="h-3.5 w-3.5" />
                      Plano
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
