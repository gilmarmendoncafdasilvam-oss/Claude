"use client"

import { AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MetricCard } from "@/components/dashboard/metric-card"
import { Progress } from "@/components/ui/progress"
import { BarChart } from "@/components/charts/bar-chart"
import { mockWhatsapp } from "@/lib/mock-data"
import { formatCurrency, formatPercent } from "@/lib/utils"

const wa = mockWhatsapp

const funnelData: { label: string; value: number }[] = [
  { label: "Conversas", value: wa.conversations_started },
  { label: "Respondidos", value: wa.leads_answered },
  { label: "Qualificados", value: wa.qualified_leads },
  { label: "Agendamentos", value: wa.scheduled_appointments },
  { label: "Comparecimentos", value: wa.show_ups },
  { label: "Vendas", value: wa.sales },
]

const lostReasonsData = [
  { reason: "Preço", pct: 38 },
  { reason: "Sem urgência", pct: 28 },
  { reason: "Não respondeu", pct: 22 },
  { reason: "Outros", pct: 12 },
]

export default function WhatsappPage() {
  const alerts = [
    wa.leads_not_answered > 20 && {
      type: "warning" as const,
      icon: AlertTriangle,
      msg: `${wa.leads_not_answered} leads sem resposta. Verifique o atendimento.`,
    },
    (wa.average_response_time || 0) > 10 && {
      type: "warning" as const,
      icon: Clock,
      msg: `Tempo médio de resposta de ${wa.average_response_time} min — meta ideal: até 10 min.`,
    },
    wa.close_rate >= 40 && {
      type: "success" as const,
      icon: CheckCircle2,
      msg: `Taxa de fechamento de ${formatPercent(wa.close_rate)} — ótimo resultado!`,
    },
  ].filter(Boolean)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp / Comercial</h1>
        <p className="text-gray-500 mt-1">Análise de atendimento, qualificação e vendas</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricCard title="Conversas Iniciadas" value={wa.conversations_started} format="number" />
        <MetricCard title="Leads Respondidos" value={wa.leads_answered} format="number" />
        <MetricCard title="Sem Resposta" value={wa.leads_not_answered} format="number" invertDelta />
        <MetricCard title="Taxa de Resposta" value={wa.response_rate} format="percent" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Leads Qualificados" value={wa.qualified_leads} format="number" />
        <MetricCard title="Agendamentos" value={wa.scheduled_appointments} format="number" />
        <MetricCard title="Comparecimentos" value={wa.show_ups} format="number" />
        <MetricCard title="Vendas" value={wa.sales} format="number" highlight />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Taxa de Fechamento" value={wa.close_rate} format="percent" />
        <MetricCard title="Custo / Conversa" value={wa.cost_per_conversation || 0} format="currency" />
        <MetricCard title="Custo / Agendamento" value={wa.cost_per_appointment || 0} format="currency" />
        <MetricCard title="Custo / Venda" value={wa.cost_per_sale || 0} format="currency" />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          {alerts.map((alert, i) => alert && (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${alert.type === "warning" ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
              <alert.icon className={`h-4 w-4 shrink-0 mt-0.5 ${alert.type === "warning" ? "text-amber-600" : "text-emerald-600"}`} />
              <p className={`text-sm ${alert.type === "warning" ? "text-amber-700" : "text-emerald-700"}`}>{alert.msg}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Funil Comercial</CardTitle>
            <CardDescription>Do contato à venda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {funnelData.map((stage, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{stage.label}</span>
                  <span className="text-gray-900 font-semibold">{stage.value}</span>
                </div>
                <Progress value={(stage.value / funnelData[0].value) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Lost reasons */}
        <Card>
          <CardHeader>
            <CardTitle>Motivos de Perda</CardTitle>
            <CardDescription>Por que os leads não converteram</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={lostReasonsData}
              xKey="reason"
              bars={[{ key: "pct", label: "Percentual (%)", color: "#ef4444" }]}
              formatY={(v) => `${v}%`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Response time alert */}
      <Card>
        <CardHeader>
          <CardTitle>Tempo de Resposta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-amber-500">{wa.average_response_time} min</p>
              <p className="text-sm text-gray-500 mt-1">Tempo médio atual</p>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Meta ideal</span>
                  <span className="font-semibold text-emerald-600">até 5 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tempo atual</span>
                  <span className="font-semibold text-amber-600">{wa.average_response_time} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impacto estimado</span>
                  <span className="text-gray-700">Redução de ~25% na conversão</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-700">
                Implementar bot de triagem para resposta imediata fora do horário comercial pode reduzir esse tempo para menos de 1 minuto.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
