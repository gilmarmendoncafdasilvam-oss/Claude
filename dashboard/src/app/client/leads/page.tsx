"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Phone, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { mockLeads, mockClients } from "@/lib/mock-data"
import { useSessionUser } from "@/hooks/use-session-user"
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, QUALIFICATION_LABELS, QUALIFICATION_COLORS } from "@/lib/leads"
import type { LeadStatus } from "@/lib/types"
import { formatDate } from "@/lib/utils"

const ALL_STATUSES: LeadStatus[] = ["novo", "em_atendimento", "qualificado", "proposta_enviada", "venda_realizada", "perdido", "desqualificado", "sem_resposta"]

export default function ClientLeadsPage() {
  const { user } = useSessionUser()
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "">("")
  const [filterOrigin, setFilterOrigin] = useState("")

  const clientId = user?.clientId
  const isEmployee = user?.role === "client_employee"

  const leads = mockLeads.filter((l) => {
    if (clientId && l.client_id !== clientId) return false
    if (isEmployee && l.responsible_name !== user?.name) return false // employee sees own leads by default
    if (filterStatus && l.status !== filterStatus) return false
    if (filterOrigin && l.origin !== filterOrigin) return false
    if (search) {
      const s = search.toLowerCase()
      if (!l.name.toLowerCase().includes(s) && !(l.phone ?? "").includes(s) && !(l.campaign ?? "").toLowerCase().includes(s)) return false
    }
    return true
  })

  const origins = Array.from(new Set(mockLeads.filter((l) => l.client_id === clientId).map((l) => l.origin).filter(Boolean)))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">{leads.length} leads encontrados</p>
        </div>
        <Link href="/client/leads/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Lead
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar nome, telefone ou campanha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as LeadStatus | "")}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>)}
        </select>
        <select
          value={filterOrigin}
          onChange={(e) => setFilterOrigin(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as origens</option>
          {origins.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {/* Lead list */}
      <div className="space-y-3">
        {leads.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">Nenhum lead encontrado</p>
            <p className="text-sm mt-1">Tente ajustar os filtros ou cadastre um novo lead.</p>
          </div>
        )}
        {leads.map((lead) => (
          <Link key={lead.id} href={`/client/leads/${lead.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{lead.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEAD_STATUS_COLORS[lead.status]}`}>
                        {LEAD_STATUS_LABELS[lead.status]}
                      </span>
                      {lead.qualification && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${QUALIFICATION_COLORS[lead.qualification]}`}>
                          {QUALIFICATION_LABELS[lead.qualification]}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-gray-500">
                      {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>}
                      {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>}
                      {lead.origin && <Badge variant="secondary" className="text-xs">{lead.origin}</Badge>}
                      {lead.campaign && <span className="text-xs text-gray-400">📢 {lead.campaign}</span>}
                      {lead.product_interest && <span className="text-xs text-gray-400">🎯 {lead.product_interest}</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {lead.sale_value && (
                      <p className="text-emerald-700 font-bold text-sm">R$ {lead.sale_value.toLocaleString("pt-BR")}</p>
                    )}
                    {lead.responsible_name && (
                      <p className="text-xs text-gray-400 mt-1">👤 {lead.responsible_name}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{formatDate(lead.created_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
