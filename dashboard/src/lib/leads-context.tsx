"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { mockLeads } from "@/lib/mock-data"
import type { Lead, LeadStatus, LeadQualification, LossReason } from "@/lib/types"

interface LeadUpdate {
  status?: LeadStatus
  qualification?: LeadQualification | ""
  responsible_name?: string
  notes?: string
  next_action?: string
  next_action_date?: string
  loss_reason?: LossReason | ""
  loss_reason_detail?: string
  sale_value?: number | undefined
  sale_date?: string
  sale_product?: string
  sale_observation?: string
}

interface LeadsContextValue {
  leads: Lead[]
  addLead: (lead: Lead) => void
  updateLead: (id: string, update: LeadUpdate) => void
  getLead: (id: string) => Lead | undefined
}

const LeadsContext = createContext<LeadsContextValue | null>(null)

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([...mockLeads])

  const addLead = useCallback((lead: Lead) => {
    setLeads((prev) => {
      const next = [...prev, lead]
      // keep mockLeads in sync for pages not yet on context
      mockLeads.push(lead)
      return next
    })
  }, [])

  const updateLead = useCallback((id: string, update: LeadUpdate) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l
        const updated: Lead = {
          ...l,
          ...update,
          qualification: (update.qualification as LeadQualification) || undefined,
          loss_reason: (update.loss_reason as LossReason) || undefined,
          updated_at: new Date().toISOString(),
        }
        // keep mockLeads in sync for pages not yet on context
        const idx = mockLeads.findIndex((m) => m.id === id)
        if (idx !== -1) Object.assign(mockLeads[idx], updated)
        return updated
      })
    )
  }, [])

  const getLead = useCallback((id: string) => leads.find((l) => l.id === id), [leads])

  return (
    <LeadsContext.Provider value={{ leads, addLead, updateLead, getLead }}>
      {children}
    </LeadsContext.Provider>
  )
}

export function useLeads() {
  const ctx = useContext(LeadsContext)
  if (!ctx) throw new Error("useLeads must be used inside LeadsProvider")
  return ctx
}
