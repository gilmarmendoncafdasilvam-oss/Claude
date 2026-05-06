"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MetricCard } from "@/components/dashboard/metric-card"
import { BarChart } from "@/components/charts/bar-chart"
import { mockGoogleAds, mockPaidMedia } from "@/lib/mock-data"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils"

const googleData = mockPaidMedia.find((m) => m.channel === "Google Ads")!

const statusColors: Record<string, "success" | "warning" | "destructive" | "default"> = {
  Escalar: "success",
  Manter: "default",
  Otimizar: "warning",
  Pausar: "destructive",
}

const campaignChart = mockGoogleAds.map((g) => ({
  campaign: g.campaign_name.substring(0, 20),
  spend: g.spend,
  conversions: g.conversions,
  cpa: g.cost_per_conversion,
}))

export default function GoogleAdsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Google Ads</h1>
        <p className="text-gray-500 mt-1">Análise de campanhas de pesquisa e performance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Investimento" value={googleData.spend} format="currency" />
        <MetricCard title="Cliques" value={googleData.clicks} format="number" />
        <MetricCard title="CTR" value={googleData.ctr} format="percent" description="Taxa de cliques" />
        <MetricCard title="CPC Médio" value={googleData.cpc} format="currency" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Conversões" value={googleData.conversions} format="number" />
        <MetricCard title="CPA" value={googleData.cpa} format="currency" />
        <MetricCard title="Taxa de Conversão" value={googleData.conversion_rate} format="percent" />
        <MetricCard title="ROAS" value={`${googleData.roas?.toFixed(2)}x`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Investimento vs. Conversões por Campanha</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={campaignChart}
              xKey="campaign"
              bars={[
                { key: "spend", label: "Investimento (R$)", color: "#3b82f6" },
                { key: "conversions", label: "Conversões", color: "#10b981" },
              ]}
              formatY={(v) => `R$ ${v}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CPA por Campanha</CardTitle>
            <CardDescription>Custo por conversão</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={campaignChart}
              xKey="campaign"
              bars={[{ key: "cpa", label: "CPA (R$)", color: "#8b5cf6" }]}
              formatY={(v) => `R$ ${v}`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Campaign table */}
      <Card>
        <CardHeader>
          <CardTitle>Análise por Campanha</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Campanha / Grupo</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Investimento</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Cliques</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">CTR</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">CPC</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Conv.</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">CPA</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">IS%</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">QS</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockGoogleAds.map((g, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{g.campaign_name}</p>
                      {g.keyword && <p className="text-xs text-gray-500 mt-0.5">Palavra: {g.keyword}</p>}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(g.spend)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatNumber(g.clicks)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatPercent(g.ctr)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(g.cpc)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{g.conversions}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(g.cost_per_conversion)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{g.impression_share ? `${g.impression_share}%` : "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${(g.quality_score || 0) >= 7 ? "text-emerald-600" : (g.quality_score || 0) >= 5 ? "text-amber-600" : "text-red-600"}`}>
                        {g.quality_score || "—"}/10
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusColors[g.status || ""] || "secondary"}>
                        {g.status || "—"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {mockGoogleAds.some((g) => g.recommendation) && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Recomendações</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {mockGoogleAds.filter((g) => g.recommendation).map((g, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                <div>
                  <p className="text-xs font-semibold text-blue-700">{g.campaign_name}</p>
                  <p className="text-sm text-blue-700">{g.recommendation}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
