"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MetricCard } from "@/components/dashboard/metric-card"
import { BarChart } from "@/components/charts/bar-chart"
import { mockGA4 } from "@/lib/mock-data"
import { formatNumber, formatPercent } from "@/lib/utils"

const g4 = mockGA4

const deviceData = [
  { device: "Mobile", sessions: Math.round(g4.sessions * 0.72), users: Math.round(g4.users * 0.72) },
  { device: "Desktop", sessions: Math.round(g4.sessions * 0.24), users: Math.round(g4.users * 0.24) },
  { device: "Tablet", sessions: Math.round(g4.sessions * 0.04), users: Math.round(g4.users * 0.04) },
]

const sourceData = [
  { source: "google / cpc", sessions: 3120 },
  { source: "facebook / cpc", sessions: 1850 },
  { source: "direct", sessions: 490 },
  { source: "organic", sessions: 360 },
]

export default function GA4Page() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site / GA4</h1>
        <p className="text-gray-500 mt-1">Análise de comportamento e conversões no site</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricCard title="Sessões" value={g4.sessions} format="number" />
        <MetricCard title="Usuários" value={g4.users} format="number" />
        <MetricCard title="Novos Usuários" value={g4.new_users} format="number" />
        <MetricCard title="Visualizações" value={g4.pageviews} format="number" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Taxa de Engajamento" value={g4.engagement_rate} format="percent" />
        <MetricCard title="Taxa de Rejeição" value={g4.bounce_rate} format="percent" invertDelta />
        <MetricCard title="Tempo Médio" value={`${Math.floor(g4.average_engagement_time / 60)}m ${g4.average_engagement_time % 60}s`} description="Engajamento" />
        <MetricCard title="Taxa de Conversão" value={g4.conversion_rate} format="percent" highlight />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Conversões" value={g4.conversions} format="number" highlight />
        <MetricCard title="Cliques WhatsApp" value={g4.whatsapp_clicks || 0} format="number" />
        <MetricCard title="Envios de Formulário" value={g4.form_submits || 0} format="number" />
        <MetricCard title="Cliques em Botões" value={g4.button_clicks || 0} format="number" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Sessões por Origem</CardTitle>
            <CardDescription>Principais fontes de tráfego</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={sourceData}
              xKey="source"
              bars={[{ key: "sessions", label: "Sessões", color: "#3b82f6" }]}
              formatY={(v) => String(v)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sessões por Dispositivo</CardTitle>
            <CardDescription>Mobile vs. Desktop vs. Tablet</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={deviceData}
              xKey="device"
              bars={[
                { key: "sessions", label: "Sessões", color: "#8b5cf6" },
                { key: "users", label: "Usuários", color: "#10b981" },
              ]}
              formatY={(v) => String(v)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Analysis insights */}
      <Card>
        <CardHeader>
          <CardTitle>Análise da Landing Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Positivo</p>
              <p className="text-sm text-emerald-800">Taxa de conversão de {formatPercent(g4.conversion_rate)} — acima da média do setor (3–5%).</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-700 mb-1">Mobile</p>
              <p className="text-sm text-blue-800">72% do tráfego vem de mobile. Verificar velocidade de carregamento no celular.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-700 mb-1">Atenção</p>
              <p className="text-sm text-amber-800">Taxa de rejeição de {formatPercent(g4.bounce_rate)} — monitorar conteúdo acima da dobra.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
