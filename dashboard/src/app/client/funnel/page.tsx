"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MetricCard } from "@/components/dashboard/metric-card"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { mockFunnel } from "@/lib/mock-data"
import { formatNumber, formatPercent, formatCurrency } from "@/lib/utils"

const fn = mockFunnel

const stages = [
  { label: "Impressões", value: fn.impressions, next: fn.clicks, rate: fn.click_through_rate, cost: null, color: "#dbeafe" },
  { label: "Cliques", value: fn.clicks, next: fn.site_visits, rate: null, cost: null, color: "#bfdbfe" },
  { label: "Visitas ao Site", value: fn.site_visits, next: fn.landing_page_views, rate: null, cost: null, color: "#93c5fd" },
  { label: "Visualizações LP", value: fn.landing_page_views, next: fn.leads, rate: fn.page_conversion_rate, cost: null, color: "#60a5fa" },
  { label: "Leads", value: fn.leads, next: fn.whatsapp_conversations, rate: null, cost: null, color: "#3b82f6" },
  { label: "Conversas WhatsApp", value: fn.whatsapp_conversations, next: fn.qualified_leads, rate: null, cost: null, color: "#2563eb" },
  { label: "Leads Qualificados", value: fn.qualified_leads, next: fn.appointments, rate: null, cost: null, color: "#1d4ed8" },
  { label: "Agendamentos", value: fn.appointments, next: fn.show_ups, rate: fn.lead_to_appointment_rate, cost: null, color: "#1e40af", bottleneck: true },
  { label: "Comparecimentos", value: fn.show_ups, next: fn.proposals, rate: null, cost: null, color: "#1e3a8a" },
  { label: "Vendas", value: fn.sales, next: null, rate: fn.appointment_to_sale_rate, cost: fn.revenue / fn.sales, color: "#172554" },
]

const maxValue = stages[0].value

const presetLabels: Record<string, string> = {
  "2024-04-01|2024-04-30": "Abril 2024",
  "2024-03-01|2024-03-31": "Março 2024",
  "2024-01-01|2024-03-31": "Último trimestre",
}

export default function FunnelPage() {
  const [startDate, setStartDate] = useState("2024-04-01")
  const [endDate, setEndDate] = useState("2024-04-30")

  const periodKey = `${startDate}|${endDate}`
  const periodLabel = presetLabels[periodKey]
  const isDefaultPeriod = periodKey === "2024-04-01|2024-04-30"

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Funil de Conversão</h1>
          <p className="text-gray-500 mt-1">Visão completa de impressões até receita gerada</p>
        </div>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(s, e) => { setStartDate(s); setEndDate(e) }}
        />
      </div>
      {!isDefaultPeriod && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4 text-sm text-blue-700">
          Exibindo dados de {periodLabel || `${startDate} – ${endDate}`}. Para ver dados de outro período, importe os dados correspondentes.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Impressões" value={fn.impressions} format="number" />
        <MetricCard title="Leads" value={fn.leads} format="number" highlight />
        <MetricCard title="Vendas" value={fn.sales} format="number" highlight />
        <MetricCard title="Receita" value={fn.revenue} format="currency" highlight />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="CTR" value={fn.click_through_rate} format="percent" description="Impressões → Cliques" />
        <MetricCard title="Conv. LP" value={fn.page_conversion_rate} format="percent" description="Visitas → Leads" />
        <MetricCard title="Lead → Agendamento" value={fn.lead_to_appointment_rate} format="percent" />
        <MetricCard title="Agendamento → Venda" value={fn.appointment_to_sale_rate} format="percent" />
      </div>

      {/* Visual Funnel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Funil Visual</CardTitle>
          <CardDescription>Cada barra representa o volume relativo em cada etapa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stages.map((stage, i) => {
              const widthPct = Math.max((stage.value / maxValue) * 100, 5)
              const convRate = stage.next ? ((stage.next / stage.value) * 100) : null
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-40 text-right shrink-0">
                    <p className={`text-sm font-medium ${stage.bottleneck ? "text-amber-600" : "text-gray-700"}`}>{stage.label}</p>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div
                      className={`h-10 rounded-lg flex items-center px-4 transition-all ${stage.bottleneck ? "ring-2 ring-amber-400" : ""}`}
                      style={{ width: `${widthPct}%`, backgroundColor: stage.color }}
                    >
                      <span className="text-xs font-bold text-white drop-shadow">{formatNumber(stage.value)}</span>
                    </div>
                    {convRate !== null && (
                      <span className={`text-xs shrink-0 font-semibold ${stage.bottleneck ? "text-amber-600" : "text-gray-500"}`}>
                        ↓ {formatPercent(convRate, 1)} conv.
                      </span>
                    )}
                    {stage.bottleneck && (
                      <div className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded text-xs text-amber-700 font-medium">
                        <AlertTriangle className="h-3 w-3" />
                        Gargalo
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bottleneck analysis */}
      {fn.main_bottleneck && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800">Gargalo Principal Identificado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 mb-4">{fn.main_bottleneck}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <p className="text-xs font-semibold text-amber-700 mb-1">Taxa Atual</p>
                <p className="text-2xl font-bold text-amber-600">{formatPercent(fn.lead_to_appointment_rate)}</p>
                <p className="text-xs text-gray-500">Lead → Agendamento</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <p className="text-xs font-semibold text-emerald-700 mb-1">Meta Ideal</p>
                <p className="text-2xl font-bold text-emerald-600">45%</p>
                <p className="text-xs text-gray-500">Lead → Agendamento</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <p className="text-xs font-semibold text-blue-700 mb-1">Potencial de Melhora</p>
                <p className="text-2xl font-bold text-blue-600">+{Math.round(fn.appointments * (45 / fn.lead_to_appointment_rate - 1))} agend.</p>
                <p className="text-xs text-gray-500">Se atingir meta</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
