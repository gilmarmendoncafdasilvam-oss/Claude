"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MetricCard } from "@/components/dashboard/metric-card"
import { BarChart } from "@/components/charts/bar-chart"
import { mockMetaAds, mockPaidMedia } from "@/lib/mock-data"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils"

const metaData = mockPaidMedia.find((m) => m.channel === "Meta Ads")!

const creativesChart = mockMetaAds.map((m) => ({
  ad: m.ad_name?.substring(0, 18) || "",
  leads: m.leads,
  cpl: m.cost_per_lead,
  spend: m.spend,
  hookRate: m.hook_rate || 0,
}))

const statusColors: Record<string, "success" | "warning" | "destructive" | "default"> = {
  Escalar: "success",
  Manter: "default",
  Otimizar: "warning",
  Pausar: "destructive",
}

export default function MetaAdsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meta Ads</h1>
        <p className="text-gray-500 mt-1">Facebook e Instagram Ads — análise de campanhas e criativos</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricCard title="Investimento" value={metaData.spend} format="currency" />
        <MetricCard title="Alcance" value={metaData.reach || 0} format="number" />
        <MetricCard title="Impressões" value={metaData.impressions} format="number" />
        <MetricCard title="Frequência" value={metaData.frequency || 0} description="Vezes que cada pessoa viu" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricCard title="Cliques no Link" value={metaData.link_clicks || 0} format="number" />
        <MetricCard title="CTR" value={metaData.ctr} format="percent" />
        <MetricCard title="CPM" value={metaData.cpm} format="currency" />
        <MetricCard title="CPC" value={metaData.cpc} format="currency" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Leads Gerados" value={metaData.leads} format="number" highlight />
        <MetricCard title="Custo por Lead" value={metaData.cpl} format="currency" invertDelta />
        <MetricCard title="ROAS" value={`${metaData.roas?.toFixed(2)}x`} />
        <MetricCard title="Receita" value={metaData.revenue || 0} format="currency" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Leads por Criativo</CardTitle>
            <CardDescription>Volume e custo por lead por anúncio</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={creativesChart}
              xKey="ad"
              bars={[
                { key: "leads", label: "Leads", color: "#3b82f6" },
              ]}
              formatY={(v) => String(v)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hook Rate por Criativo</CardTitle>
            <CardDescription>% de pessoas que pararam para ver o anúncio</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={creativesChart}
              xKey="ad"
              bars={[
                { key: "hookRate", label: "Hook Rate (%)", color: "#8b5cf6" },
              ]}
              formatY={(v) => `${v}%`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Creative detail table */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Criativos e Conjuntos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Anúncio</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Público</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Investimento</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Alcance</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Freq.</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">CTR</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">CPM</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Leads</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">CPL</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Hook%</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockMetaAds.map((m, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-xs">{m.ad_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{m.ad_set_name}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{m.audience}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(m.spend)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatNumber(m.reach)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{m.frequency.toFixed(1)}x</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatPercent(m.ctr)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(m.cpm)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{m.leads}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(m.cost_per_lead)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${(m.hook_rate || 0) >= 35 ? "text-emerald-600" : (m.hook_rate || 0) >= 25 ? "text-amber-600" : "text-red-600"}`}>
                        {m.hook_rate || "—"}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusColors[m.status || ""] || "secondary"}>{m.status || "—"}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="mt-6">
        <CardHeader><CardTitle>Recomendações</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {mockMetaAds.filter((m) => m.recommendation).map((m, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="h-6 w-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</div>
              <div>
                <p className="text-xs font-semibold text-blue-700">{m.ad_name}</p>
                <p className="text-sm text-blue-700">{m.recommendation}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
