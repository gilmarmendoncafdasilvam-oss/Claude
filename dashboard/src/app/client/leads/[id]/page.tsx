"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Phone, Mail, MapPin, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { mockLeads, mockUsers } from "@/lib/mock-data"
import { useSessionUser } from "@/hooks/use-session-user"
import {
  LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, QUALIFICATION_LABELS, QUALIFICATION_COLORS,
  LOSS_REASON_LABELS, LEAD_STATUS_KANBAN,
} from "@/lib/leads"
import type { LeadStatus, LeadQualification, LossReason } from "@/lib/types"
import { formatDate } from "@/lib/utils"

const LOSS_REASONS: LossReason[] = [
  "preco_alto","nao_respondeu","fora_da_regiao","sem_orcamento","comprou_concorrente",
  "nao_era_perfil","lead_duplicado","atendimento_demorou","sem_interesse_real","outro",
]
const QUALIFICATIONS: LeadQualification[] = ["muito_qualificado","qualificado","pouco_qualificado","desqualificado"]
const ALL_STATUSES: LeadStatus[] = ["novo","em_atendimento","qualificado","proposta_enviada","venda_realizada","perdido","desqualificado","sem_resposta"]

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useSessionUser()

  const lead = mockLeads.find((l) => l.id === id)
  const [loading, setLoading] = useState(false)
  const [showSaleForm, setShowSaleForm] = useState(false)
  const [showLossForm, setShowLossForm] = useState(false)

  const clientId = user?.clientId
  const employees = mockUsers.filter((u) => u.client_id === clientId && (u.role === "client_employee" || u.role === "client"))

  const [form, setForm] = useState({
    status: lead?.status ?? "novo",
    qualification: lead?.qualification ?? "",
    responsible_name: lead?.responsible_name ?? "",
    notes: lead?.notes ?? "",
    next_action: lead?.next_action ?? "",
    next_action_date: lead?.next_action_date ?? "",
    loss_reason: lead?.loss_reason ?? "",
    loss_reason_detail: lead?.loss_reason_detail ?? "",
    sale_value: lead?.sale_value?.toString() ?? "",
    sale_product: lead?.sale_product ?? "",
    sale_date: lead?.sale_date ?? "",
    sale_observation: lead?.sale_observation ?? "",
  })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const idx = mockLeads.findIndex((l) => l.id === id)
    if (idx !== -1) {
      Object.assign(mockLeads[idx], {
        ...form,
        qualification: form.qualification as LeadQualification || undefined,
        loss_reason: form.loss_reason as LossReason || undefined,
        sale_value: form.sale_value ? parseFloat(form.sale_value) : undefined,
        updated_at: new Date().toISOString(),
      })
    }
    toast.success("Lead atualizado")
    setLoading(false)
    setShowSaleForm(false)
    setShowLossForm(false)
  }

  if (!lead) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-medium text-gray-900">Lead não encontrado</p>
        <Button variant="outline" className="mt-4" asChild><Link href="/client/leads">Voltar</Link></Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/client/leads"><ArrowLeft className="h-4 w-4" />Voltar</Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEAD_STATUS_COLORS[form.status as LeadStatus]}`}>
              {LEAD_STATUS_LABELS[form.status as LeadStatus]}
            </span>
            {form.qualification && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${QUALIFICATION_COLORS[form.qualification as LeadQualification]}`}>
                {QUALIFICATION_LABELS[form.qualification as LeadQualification]}
              </span>
            )}
            <span className="text-xs text-gray-400">Entrada: {formatDate(lead.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contato */}
          <Card>
            <CardHeader><CardTitle>Dados de Contato</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {lead.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /><span>{lead.phone}</span></div>}
              {lead.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /><span>{lead.email}</span></div>}
              {lead.product_interest && <div className="flex items-center gap-2 text-gray-500"><span>🎯</span><span>{lead.product_interest}</span></div>}
              {lead.origin && <div className="flex items-center gap-2"><Badge variant="secondary">{lead.origin}</Badge>{lead.campaign && <span className="text-gray-500">📢 {lead.campaign}</span>}</div>}
            </CardContent>
          </Card>

          {/* Status e qualificação */}
          <Card>
            <CardHeader><CardTitle>Status e Qualificação</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <select value={form.status} onChange={(e) => { set("status", e.target.value); if (e.target.value === "venda_realizada") setShowSaleForm(true); if (e.target.value === "perdido" || e.target.value === "desqualificado") setShowLossForm(true); }} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {ALL_STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Qualificação</Label>
                  <select value={form.qualification} onChange={(e) => set("qualification", e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Sem qualificação</option>
                    {QUALIFICATIONS.map((q) => <option key={q} value={q}>{QUALIFICATION_LABELS[q]}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Responsável</Label>
                  <select value={form.responsible_name} onChange={(e) => set("responsible_name", e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Sem responsável</option>
                    {employees.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="next_action_date">Data da Próxima Ação</Label>
                  <Input id="next_action_date" type="date" value={form.next_action_date} onChange={(e) => set("next_action_date", e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="next_action">Próxima Ação</Label>
                <Input id="next_action" value={form.next_action} onChange={(e) => set("next_action", e.target.value)} placeholder="Ex: Ligar amanhã de manhã" />
              </div>
            </CardContent>
          </Card>

          {/* Perda */}
          {(showLossForm || form.status === "perdido" || form.status === "desqualificado") && (
            <Card className="border-red-200">
              <CardHeader><CardTitle className="text-red-700">Motivo de Perda</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Motivo *</Label>
                  <select value={form.loss_reason} onChange={(e) => set("loss_reason", e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecionar motivo</option>
                    {LOSS_REASONS.map((r) => <option key={r} value={r}>{LOSS_REASON_LABELS[r]}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="loss_detail">Detalhe (opcional)</Label>
                  <Textarea id="loss_detail" value={form.loss_reason_detail} onChange={(e) => set("loss_reason_detail", e.target.value)} placeholder="Descreva o motivo com mais detalhes..." rows={2} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Venda */}
          {(showSaleForm || form.status === "venda_realizada") && (
            <Card className="border-emerald-200">
              <CardHeader><CardTitle className="text-emerald-700">Registro de Venda</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="sale_value">Valor da Venda (R$)</Label>
                    <Input id="sale_value" type="number" min="0" step="0.01" value={form.sale_value} onChange={(e) => set("sale_value", e.target.value)} placeholder="0,00" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sale_date">Data da Venda</Label>
                    <Input id="sale_date" type="date" value={form.sale_date} onChange={(e) => set("sale_date", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sale_product">Produto/Serviço Vendido</Label>
                  <Input id="sale_product" value={form.sale_product} onChange={(e) => set("sale_product", e.target.value)} placeholder="Ex: Botox Testa, Plano Mensal..." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sale_obs">Observação da Venda</Label>
                  <Textarea id="sale_obs" value={form.sale_observation} onChange={(e) => set("sale_observation", e.target.value)} rows={2} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          <Card>
            <CardHeader><CardTitle>Observações</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Anotações gerais sobre o lead..." rows={4} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar ações */}
        <div className="space-y-4">
          <Button className="w-full" onClick={handleSave} disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Salvando...</> : <><Save className="h-4 w-4" />Salvar Alterações</>}
          </Button>
          {form.status !== "venda_realizada" && (
            <Button variant="outline" className="w-full text-emerald-700 border-emerald-300 hover:bg-emerald-50" onClick={() => { set("status", "venda_realizada"); setShowSaleForm(true) }}>
              ✅ Marcar como Venda
            </Button>
          )}
          {form.status !== "perdido" && (
            <Button variant="outline" className="w-full text-red-700 border-red-300 hover:bg-red-50" onClick={() => { set("status", "perdido"); setShowLossForm(true) }}>
              ❌ Marcar como Perdido
            </Button>
          )}

          {lead.sale_value && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-xs text-emerald-600 font-medium">VENDA REGISTRADA</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">R$ {lead.sale_value.toLocaleString("pt-BR")}</p>
              {lead.sale_product && <p className="text-sm text-emerald-600 mt-1">{lead.sale_product}</p>}
              {lead.sale_date && <p className="text-xs text-emerald-500 mt-1">📅 {formatDate(lead.sale_date)}</p>}
            </div>
          )}

          {lead.loss_reason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-xs text-red-600 font-medium">MOTIVO DE PERDA</p>
              <p className="text-sm font-semibold text-red-700 mt-1">{LOSS_REASON_LABELS[lead.loss_reason]}</p>
              {lead.loss_reason_detail && <p className="text-xs text-red-500 mt-1">{lead.loss_reason_detail}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
