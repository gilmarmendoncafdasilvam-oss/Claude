"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Plus, Search, Phone, Mail, X, AlertCircle, UserX } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useLeads } from "@/lib/leads-context"
import { useSessionUser } from "@/hooks/use-session-user"
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, QUALIFICATION_LABELS, QUALIFICATION_COLORS } from "@/lib/leads"
import type { LeadStatus } from "@/lib/types"
import { formatDate } from "@/lib/utils"

const ALL_STATUSES: LeadStatus[] = ["novo", "em_atendimento", "qualificado", "proposta_enviada", "venda_realizada", "perdido", "desqualificado", "sem_resposta"]

function isOverdue(next_action_date?: string) {
  if (!next_action_date) return false
  return new Date(next_action_date) < new Date(new Date().toDateString())
}

function formatPhone(phone: string) {
  return phone.replace(/\D/g, "")
}

export default function ClientLeadsPage() {
  const { user } = useSessionUser()
  const { leads: allLeads } = useLeads()
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "">("")
  const [filterOrigin, setFilterOrigin] = useState("")

  const clientId = user?.clientId
  const isEmployee = user?.role === "client_employee"

  const origins = useMemo(
    () => Array.from(new Set(allLeads.filter((l) => l.client_id === clientId).map((l) => l.origin).filter(Boolean))) as string[],
    [allLeads, clientId]
  )

  const leads = useMemo(() => {
    return allLeads.filter((l) => {
      if (clientId && l.client_id !== clientId) return false
      if (isEmployee && l.responsible_name !== user?.name) return false
      if (filterStatus && l.status !== filterStatus) return false
      if (filterOrigin && l.origin !== filterOrigin) return false
      if (search) {
        const s = search.toLowerCase()
        if (
          !l.name.toLowerCase().includes(s) &&
          !(l.phone ?? "").includes(s) &&
          !(l.campaign ?? "").toLowerCase().includes(s)
        ) return false
      }
      return true
    })
  }, [allLeads, clientId, isEmployee, user?.name, filterStatus, filterOrigin, search])

  const hasActiveFilters = !!(filterStatus || filterOrigin || search)

  function clearFilters() {
    setSearch("")
    setFilterStatus("")
    setFilterOrigin("")
  }

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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          <Input
            placeholder="Buscar nome, telefone ou campanha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Buscar leads"
          />
        </div>
        <label className="sr-only" htmlFor="filter-status">Filtrar por status</label>
        <select
          id="filter-status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as LeadStatus | "")}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[42px]"
        >
          <option value="">Todos os status</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>)}
        </select>
        <label className="sr-only" htmlFor="filter-origin">Filtrar por origem</label>
        <select
          id="filter-origin"
          value={filterOrigin}
          onChange={(e) => setFilterOrigin(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[42px]"
        >
          <option value="">Todas as origens</option>
          {origins.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="gap-1 text-gray-500 min-h-[42px]">
            <X className="h-3.5 w-3.5" />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Lead list */}
      <div className="space-y-3">
        {leads.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-10 w-10 mx-auto mb-3 text-gray-200" aria-hidden="true" />
            <p className="text-lg font-medium text-gray-600">Nenhum lead encontrado</p>
            {hasActiveFilters ? (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-400">Os filtros ativos não retornaram resultados.</p>
                <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline font-medium">
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400 mt-1">Cadastre o primeiro lead clicando em "Novo Lead".</p>
            )}
          </div>
        )}
        {leads.map((lead) => {
          const overdue = isOverdue(lead.next_action_date)
          const noResponsible = !lead.responsible_name
          return (
            <Link key={lead.id} href={`/client/leads/${lead.id}`}>
              <Card className={`hover:shadow-md transition-shadow cursor-pointer ${overdue ? "border-orange-200" : ""}`}>
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
                        {noResponsible && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center gap-1">
                            <UserX className="h-3 w-3" aria-hidden="true" />Sem responsável
                          </span>
                        )}
                        {overdue && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" aria-hidden="true" />Ação vencida
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-gray-500">
                        {lead.phone && (
                          <span
                            role="button"
                            tabIndex={0}
                            aria-label={`Abrir WhatsApp para ${lead.name}`}
                            className="flex items-center gap-1 hover:text-green-600 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault()
                              window.open(`https://wa.me/55${formatPhone(lead.phone!)}`, "_blank")
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                window.open(`https://wa.me/55${formatPhone(lead.phone!)}`, "_blank")
                              }
                            }}
                          >
                            <Phone className="h-3 w-3" />{lead.phone}
                          </span>
                        )}
                        {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>}
                        {lead.origin && <Badge variant="secondary" className="text-xs">{lead.origin}</Badge>}
                        {lead.campaign && <span className="text-xs text-gray-400">📢 {lead.campaign}</span>}
                        {lead.product_interest && <span className="text-xs text-gray-400">🎯 {lead.product_interest}</span>}
                      </div>
                      {overdue && lead.next_action && (
                        <p className="text-xs text-orange-600 mt-1.5">
                          ⏰ {lead.next_action} · venceu em {formatDate(lead.next_action_date!)}
                        </p>
                      )}
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
          )
        })}
      </div>
    </div>
  )
}
