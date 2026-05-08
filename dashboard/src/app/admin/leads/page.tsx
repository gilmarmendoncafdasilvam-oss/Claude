"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { mockLeads, mockClients } from "@/lib/mock-data"
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, QUALIFICATION_LABELS, QUALIFICATION_COLORS } from "@/lib/leads"
import type { LeadStatus } from "@/lib/types"
import { formatDate } from "@/lib/utils"

const ALL_STATUSES: LeadStatus[] = ["novo","em_atendimento","qualificado","proposta_enviada","venda_realizada","perdido","desqualificado","sem_resposta"]

export default function AdminLeadsPage() {
  const [search, setSearch] = useState("")
  const [filterClient, setFilterClient] = useState("")
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "">("")

  const filtered = mockLeads.filter((l) => {
    if (filterClient && l.client_id !== filterClient) return false
    if (filterStatus && l.status !== filterStatus) return false
    if (search) {
      const s = search.toLowerCase()
      if (!l.name.toLowerCase().includes(s) && !(l.phone ?? "").includes(s)) return false
    }
    return true
  })

  const totalRevenue = filtered.filter((l) => l.status === "venda_realizada").reduce((s, l) => s + (l.sale_value ?? 0), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Central de Leads</h1>
          <p className="text-gray-500 mt-1">{filtered.length} leads · R$ {totalRevenue.toLocaleString("pt-BR")} em vendas</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar lead..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Todos os clientes</option>
          {mockClients.map((c) => <option key={c.id} value={c.id}>{c.trade_name ?? c.company_name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as LeadStatus | "")} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Todos os status</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((lead) => {
          const client = mockClients.find((c) => c.id === lead.client_id)
          return (
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
                        {client && <Badge variant="secondary" className="text-xs">{client.trade_name ?? client.company_name}</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-gray-500">
                        {lead.phone && <span className="flex items-center gap-1 text-xs"><Phone className="h-3 w-3" />{lead.phone}</span>}
                        {lead.origin && <Badge variant="secondary" className="text-xs">{lead.origin}</Badge>}
                        {lead.responsible_name && <span className="text-xs text-gray-400">👤 {lead.responsible_name}</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {lead.sale_value && <p className="text-emerald-700 font-bold text-sm">R$ {lead.sale_value.toLocaleString("pt-BR")}</p>}
                      <p className="text-xs text-gray-400 mt-1">{formatDate(lead.created_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">Nenhum lead encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}
