"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockLeads } from "@/lib/mock-data"
import { useSessionUser } from "@/hooks/use-session-user"
import { LEAD_STATUS_LABELS, LEAD_STATUS_KANBAN } from "@/lib/leads"
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

const COLUMN_DRAG_OVER: Record<string, string> = {
  novo: "border-blue-500 bg-blue-100 ring-2 ring-blue-400",
  em_atendimento: "border-yellow-500 bg-yellow-100 ring-2 ring-yellow-400",
  qualificado: "border-emerald-500 bg-emerald-100 ring-2 ring-emerald-400",
  proposta_enviada: "border-purple-500 bg-purple-100 ring-2 ring-purple-400",
  venda_realizada: "border-green-600 bg-green-100 ring-2 ring-green-500",
  perdido: "border-red-500 bg-red-100 ring-2 ring-red-400",
}

export default function LeadsKanbanPage() {
  const { user } = useSessionUser()
  const clientId = user?.clientId
  const [leads, setLeads] = useState<Lead[]>(
    mockLeads.filter((l) => clientId ? l.client_id === clientId : true)
  )
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<LeadStatus | null>(null)
  const dragLeadId = useRef<string | null>(null)

  function moveToStatus(leadId: string, newStatus: LeadStatus) {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l))
    const idx = mockLeads.findIndex((l) => l.id === leadId)
    if (idx !== -1) mockLeads[idx].status = newStatus
    toast.success(`Lead movido para "${LEAD_STATUS_LABELS[newStatus]}"`)
  }

  function handleDragStart(e: React.DragEvent, leadId: string) {
    dragLeadId.current = leadId
    setDraggingId(leadId)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", leadId)
  }

  function handleDragEnd() {
    setDraggingId(null)
    setOverColumn(null)
    dragLeadId.current = null
  }

  function handleDragOver(e: React.DragEvent, status: LeadStatus) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setOverColumn(status)
  }

  function handleDragLeave(e: React.DragEvent) {
    // Only clear if leaving the column entirely (not entering a child)
    const related = e.relatedTarget as Node | null
    if (!(e.currentTarget as HTMLElement).contains(related)) {
      setOverColumn(null)
    }
  }

  function handleDrop(e: React.DragEvent, status: LeadStatus) {
    e.preventDefault()
    const id = dragLeadId.current ?? e.dataTransfer.getData("text/plain")
    if (!id) return
    const lead = leads.find((l) => l.id === id)
    if (lead && lead.status !== status) {
      moveToStatus(id, status)
    }
    setOverColumn(null)
    setDraggingId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kanban Comercial</h1>
          <p className="text-gray-500 mt-1">{leads.length} leads no funil · Arraste os cards para mover</p>
        </div>
        <Link href="/client/leads/new">
          <Button size="sm">+ Novo Lead</Button>
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6">
        {LEAD_STATUS_KANBAN.map((status) => {
          const colLeads = leads.filter((l) => l.status === status)
          const isDragTarget = overColumn === status
          return (
            <div
              key={status}
              className={`flex-shrink-0 w-72 rounded-xl border-2 p-3 transition-all duration-150 ${isDragTarget ? COLUMN_DRAG_OVER[status] : COLUMN_COLORS[status]}`}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-gray-800">{LEAD_STATUS_LABELS[status]}</span>
                <span className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 font-medium">{colLeads.length}</span>
              </div>

              <div className="space-y-2 min-h-[40px]">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white rounded-lg border border-gray-200 p-3 shadow-sm cursor-grab active:cursor-grabbing select-none transition-opacity duration-150 ${draggingId === lead.id ? "opacity-40 scale-95" : "opacity-100"}`}
                  >
                    <Link href={`/client/leads/${lead.id}`} className="block" onClick={(e) => draggingId && e.preventDefault()}>
                      <p className="font-medium text-sm text-gray-900 hover:text-blue-600 truncate">{lead.name}</p>
                      {lead.phone && <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" />{lead.phone}</p>}
                      {lead.product_interest && <p className="text-xs text-gray-400 mt-0.5">🎯 {lead.product_interest}</p>}
                      {lead.origin && <p className="text-xs text-gray-400 mt-0.5">📍 {lead.origin}</p>}
                      {lead.responsible_name && <p className="text-xs text-gray-400 mt-0.5">👤 {lead.responsible_name}</p>}
                      {lead.sale_value && <p className="text-xs font-semibold text-emerald-600 mt-1">R$ {lead.sale_value.toLocaleString("pt-BR")}</p>}
                    </Link>
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className={`text-center py-6 text-xs rounded-lg border-2 border-dashed transition-colors ${isDragTarget ? "border-gray-400 text-gray-500 bg-white/50" : "border-gray-200 text-gray-400"}`}>
                    {isDragTarget ? "Soltar aqui" : "Nenhum lead aqui"}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
