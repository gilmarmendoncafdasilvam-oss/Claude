"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Users, TrendingUp, DollarSign, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart } from "@/components/charts/pie-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { useLeads } from "@/lib/leads-context"
import { useSessionUser } from "@/hooks/use-session-user"
import { LEAD_STATUS_LABELS, LOSS_REASON_LABELS, QUALIFICATION_LABELS } from "@/lib/leads"

function MetricBox({ label, value, sub, color = "text-gray-900", icon: Icon }: { label: string; value: string | number; sub?: string; color?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
          </div>
          {Icon && <Icon className="h-5 w-5 text-gray-300" aria-hidden="true" />}
        </div>
      </CardContent>
    </Card>
  )
}

export default function SalesDashboardPage() {
  const { user } = useSessionUser()
  const { leads: allLeads } = useLeads()
  const clientId = user?.clientId

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const leads = useMemo(() => {
    return allLeads.filter((l) => {
      if (clientId && l.client_id !== clientId) return false
      if (startDate && l.created_at < startDate) return false
      if (endDate && l.created_at > endDate + "T23:59:59") return false
      return true
    })
  }, [allLeads, clientId, startDate, endDate])

  const total = leads.length
  const sales = leads.filter((l) => l.status === "venda_realizada")
  const lost = leads.filter((l) => l.status === "perdido" || l.status === "desqualificado")
  const noResponse = leads.filter((l) => l.status === "sem_resposta")
  const qualified = leads.filter((l) => l.qualification === "qualificado" || l.qualification === "muito_qualificado")
  const revenue = sales.reduce((s, l) => s + (l.sale_value ?? 0), 0)
  const convRate = total > 0 ? ((sales.length / total) * 100).toFixed(1) : "0"
  const avgTicket = sales.length > 0 ? revenue / sales.length : 0

  const noResponsible = useMemo(() => leads.filter((l) => !l.responsible_name).length, [leads])

  const originData = useMemo(() => {
    const map: Record<string, number> = {}
    leads.forEach((l) => { if (l.origin) map[l.origin] = (map[l.origin] ?? 0) + 1 })
    return Object.entries(map).map(([name, value], i) => ({ name, value, color: ["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#6b7280"][i % 6] }))
  }, [leads])

  const respData = useMemo(() => {
    const map: Record<string, { leads: number; sales: number }> = {}
    leads.forEach((l) => {
      const r = l.responsible_name ?? "Sem responsável"
      if (!map[r]) map[r] = { leads: 0, sales: 0 }
      map[r].leads++
      if (l.status === "venda_realizada") map[r].sales++
    })
    return Object.entries(map).map(([name, v]) => ({ name, leads: v.leads, sales: v.sales }))
  }, [leads])

  const lossData = useMemo(() => {
    const map: Record<string, number> = {}
    lost.forEach((l) => { if (l.loss_reason) map[LOSS_REASON_LABELS[l.loss_reason]] = (map[LOSS_REASON_LABELS[l.loss_reason]] ?? 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [lost])

  const hasPeriodFilter = !!(startDate || endDate)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Central Comercial</h1>
          <p className="text-gray-500 mt-1">
            {hasPeriodFilter ? `${total} leads no período selecionado` : "Visão geral de leads e vendas"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(s, e) => { setStartDate(s); setEndDate(e) }}
          />
          {hasPeriodFilter && (
            <button
              onClick={() => { setStartDate(""); setEndDate("") }}
              className="text-xs text-gray-500 hover:text-gray-700 underline whitespace-nowrap"
            >
              Limpar período
            </button>
          )}
          <Link href="/client/leads/new"><Button size="sm">+ Novo Lead</Button></Link>
        </div>
      </div>

      {/* Alertas */}
      <div className="space-y-2 mb-6">
        {noResponse.length > 3 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-amber-700">
              <strong>{noResponse.length} leads sem resposta</strong> — Atenção imediata necessária. Atribua responsáveis e inicie o atendimento.
            </p>
          </div>
        )}
        {noResponsible > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-red-700">
              <strong>{noResponsible} {noResponsible === 1 ? "lead sem responsável" : "leads sem responsável"}</strong> — Atribua um responsável para não perder esses contatos.
            </p>
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricBox label="Total de Leads" value={total} icon={Users} />
        <MetricBox label="Vendas Realizadas" value={sales.length} color="text-emerald-600" icon={CheckCircle2} />
        <MetricBox label="Taxa de Conversão" value={`${convRate}%`} color="text-blue-600" icon={TrendingUp} />
        <MetricBox label="Faturamento" value={`R$ ${revenue.toLocaleString("pt-BR")}`} color="text-emerald-700" icon={DollarSign} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricBox label="Leads Qualificados" value={qualified.length} sub={`${total > 0 ? ((qualified.length / total) * 100).toFixed(0) : 0}% do total`} color="text-blue-600" />
        <MetricBox label="Perdidos/Desqualificados" value={lost.length} color="text-red-600" icon={XCircle} />
        <MetricBox label="Sem Resposta" value={noResponse.length} color="text-orange-500" icon={Clock} />
        <MetricBox label="Ticket Médio" value={avgTicket > 0 ? `R$ ${avgTicket.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}` : "—"} icon={DollarSign} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle>Leads por Origem</CardTitle></CardHeader>
          <CardContent>
            {originData.length > 0
              ? <PieChart data={originData} formatValue={(v) => `${v} leads`} />
              : <p className="text-center text-gray-400 py-8 text-sm">Sem dados de origem</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Desempenho por Responsável</CardTitle></CardHeader>
          <CardContent>
            {respData.length > 0
              ? <BarChart data={respData} xKey="name" bars={[{ key: "leads", label: "Leads", color: "#3b82f6" }, { key: "sales", label: "Vendas", color: "#10b981" }]} />
              : <p className="text-center text-gray-400 py-8 text-sm">Sem dados</p>}
          </CardContent>
        </Card>
      </div>

      {/* Motivos de perda + Funil status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle>Motivos de Perda</CardTitle></CardHeader>
          <CardContent>
            {lossData.length > 0 ? (
              <div className="space-y-2">
                {lossData.sort((a, b) => b.value - a.value).map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="flex-1 text-sm text-gray-700 truncate">{item.name}</div>
                    <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-red-400 h-full rounded-full" style={{ width: `${(item.value / lost.length) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-center text-gray-400 py-8 text-sm">Nenhum lead perdido</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Distribuição por Status</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(["novo","em_atendimento","qualificado","proposta_enviada","venda_realizada","perdido","sem_resposta"] as const).map((s) => {
                const count = leads.filter((l) => l.status === s).length
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className="flex-1 text-sm text-gray-700">{LEAD_STATUS_LABELS[s]}</div>
                    <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }} />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas vendas */}
      {sales.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Últimas Vendas</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sales.slice(0, 5).map((lead) => (
                <Link key={lead.id} href={`/client/leads/${lead.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.sale_product ?? lead.product_interest ?? "—"} · {lead.responsible_name ?? "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700 text-sm">R$ {(lead.sale_value ?? 0).toLocaleString("pt-BR")}</p>
                    {lead.sale_date && <p className="text-xs text-gray-400">{lead.sale_date}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {total === 0 && hasPeriodFilter && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium text-gray-600">Nenhum lead no período selecionado</p>
          <button onClick={() => { setStartDate(""); setEndDate("") }} className="text-sm text-blue-600 hover:underline mt-2">
            Limpar filtro de período
          </button>
        </div>
      )}
    </div>
  )
}
