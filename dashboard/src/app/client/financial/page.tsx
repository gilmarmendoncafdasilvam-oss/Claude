"use client"

import { Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MetricCard } from "@/components/dashboard/metric-card"
import { LineChart } from "@/components/charts/line-chart"
import { mockFinancial, mockChartData } from "@/lib/mock-data"
import { formatCurrency, formatPercent } from "@/lib/utils"

const fin = mockFinancial

const hasRevenue = fin.revenue && fin.revenue > 0

export default function FinancialPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Análise Financeira</h1>
        <p className="text-gray-500 mt-1">Retorno sobre investimento, CAC, ROAS e rentabilidade</p>
      </div>

      {!hasRevenue && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-700">
            Receita não informada para este período. A análise financeira foi limitada aos indicadores de custo e geração de oportunidades.
          </p>
        </div>
      )}

      {/* Costs */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">Investimento</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Invest. em Mídia" value={fin.media_spend} format="currency" />
        <MetricCard title="Fee de Gestão" value={fin.management_fee} format="currency" />
        <MetricCard title="Custo Total Marketing" value={fin.total_marketing_cost} format="currency" />
        <MetricCard title="Número de Vendas" value={fin.sales_count || 0} format="number" />
      </div>

      {/* Revenue */}
      {hasRevenue && (
        <>
          <h2 className="text-base font-semibold text-gray-700 mb-3">Resultado</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Receita Gerada" value={fin.revenue!} format="currency" highlight />
            <MetricCard title="Lucro Bruto" value={fin.gross_profit!} format="currency" highlight />
            <MetricCard title="Ticket Médio" value={fin.average_ticket!} format="currency" />
            <MetricCard title="Margem" value={fin.margin!} format="percent" />
          </div>
        </>
      )}

      {/* Key ratios */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">Indicadores de Eficiência</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="ROAS" value={`${fin.roas?.toFixed(2)}x`} description="Retorno sobre mídia" />
        <MetricCard title="ROI" value={`${fin.roi}%`} description="Retorno total" />
        <MetricCard title="CAC" value={fin.cac || 0} format="currency" description="Custo por cliente" invertDelta />
        <MetricCard title="LTV" value={fin.ltv || 0} format="currency" description="Valor do cliente" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <MetricCard title="Ponto de Equilíbrio" value={fin.break_even_revenue || 0} format="currency" description="Receita mínima" />
        <MetricCard title="Payback" value={`${fin.payback} meses`} description="Retorno do CAC" />
        <MetricCard title="LTV / CAC" value={`${((fin.ltv || 0) / (fin.cac || 1)).toFixed(1)}x`} description="Saudável = acima de 3x" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROAS trend */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução do ROAS</CardTitle>
            <CardDescription>Rentabilidade dos últimos 4 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={mockChartData.roasEvolution}
              xKey="month"
              lines={[
                { key: "roas", label: "ROAS", color: "#10b981" },
              ]}
              formatY={(v) => `${v}x`}
            />
          </CardContent>
        </Card>

        {/* Profitability summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Rentabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Receita Total", value: formatCurrency(fin.revenue || 0), highlight: true },
                { label: "(-) Investimento em Mídia", value: `- ${formatCurrency(fin.media_spend)}`, negative: true },
                { label: "(-) Fee de Gestão", value: `- ${formatCurrency(fin.management_fee)}`, negative: true },
                { label: "(=) Lucro Bruto", value: formatCurrency(fin.gross_profit || 0), positive: true },
                { label: "Margem de Lucro", value: formatPercent(fin.margin || 0), positive: true },
              ].map((item, i) => (
                <div key={i} className={`flex justify-between py-2 border-b border-gray-100 ${item.highlight ? "font-bold" : ""}`}>
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.positive ? "text-emerald-600" : item.negative ? "text-red-600" : "text-gray-900"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Para cada R$ 1 investido em marketing:</p>
              <p className="text-xl font-bold text-emerald-800">R$ {fin.roas?.toFixed(2)} retornou</p>
              <p className="text-xs text-emerald-600 mt-1">ROAS de {fin.roas?.toFixed(2)}x — excelente performance</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
