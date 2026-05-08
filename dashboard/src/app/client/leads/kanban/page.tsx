"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockLeads } from "@/lib/mock-data"
import { useSessionUser } from "@/hooks/use-session-user"
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, LEAD_STATUS_KANBAN } from "@/lib/leads"
import type { LeadStatus, Lead } from "@/lib/types"
import { toast } from "sonner"

const COLUMN_COLORS: Record<string, string> = {
  novo: "border-blue-300 bg-blue-50",
  em_atendimento: "border-yellow-300 bg-yellow-50",
  qualificado: "border-emerald-300 bg-emerald-50",
  proposta_enviada: "border-purple-300 bg-purple-50",
  venda_realizada: "border-green-400 bg-green-50",
  perdido: "border-red-300 bg-red-50",
}

export default function LeadsKanbanPage() {
  const { user } = useSessionUser()
  const clientId = user?.clientId
  const [leads, setLeads] = useState<Lead[]>(
    mockLeads.filter((l) => clientId ? l.client_id === clientId : true)
  )

  function moveToStatus(leadId: string, newStatus: LeadStatus) {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l))
    // sync mock
    const idx = mockLeads.findIndex((l) => l.id === leadId)
    if (idx !== -1) mockLeads[idx].status = newStatus
    toast.success(`Lead movido para "${LEAD_STATUS_LABELS[newStatus]}"`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kanban Comercial</h1>
          <p className="text-gray-500 mt-1">{leads.length} leads no funil</p>
        </div>
        <Link href="/client/leads/new">
          <Button size="sm">+ Novo Lead</Button>
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6">
        {LEAD_STATUS_KANBAN.map((status) => {
          const colLeads = leads.filter((l) => l.status === status)
          return (
            <div key={status} className={`flex-shrink-0 w-72 rounded-xl border-2 ${COLUMN_COLORS[status]} p-3`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-gray-800">{LEAD_STATUS_LABELS[status]}</span>
                <span className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 font-medium">{colLeads.length}</span>
              </div>

              <div className="space-y-2">
                {colLeads.map((lead) => (
                  <div key={lead.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                    <Link href={`/client/leads/${lead.id}`} className="block">
                      <p className="font-medium text-sm text-gray-900 hover:text-blue-600 truncate">{lead.name}</p>
                      {lead.phone && <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" />{lead.phone}</p>}
                      {lead.product_interest && <p className="text-xs text-gray-400 mt-0.5">🎯 {lead.product_interest}</p>}
                      {lead.origin && <p className="text-xs text-gray-400 mt-0.5">📍 {lead.origin}</p>}
                      {lead.responsible_name && <p className="text-xs text-gray-400 mt-0.5">👤 {lead.responsible_name}</p>}
                      {lead.sale_value && <p className="text-xs font-semibold text-emerald-600 mt-1">R$ {lead.sale_value.toLocaleString("pt-BR")}</p>}
                    </Link>

                    {/* Move buttons */}
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {LEAD_STATUS_KANBAN.filter((s) => s !== status).slice(0, 2).map((s) => (
                        <button
                          key={s}
                          onClick={() => moveToStatus(lead.id, s)}
                          className="text-xs px-2 py-0.5 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                        >
                          → {LEAD_STATUS_LABELS[s].split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="text-center py-6 text-gray-400 text-xs">Nenhum lead aqui</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
