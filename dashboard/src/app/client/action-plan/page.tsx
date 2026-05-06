"use client"

import { useState } from "react"
import { CheckCircle2, Clock, Circle, Share2, Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockActionPlans, mockReports, mockFinancial, mockFunnel } from "@/lib/mock-data"
import { getPriorityColor, formatCurrency, formatDate } from "@/lib/utils"

const statusIcons = {
  pendente: <Circle className="h-4 w-4 text-gray-400" />,
  "em andamento": <Clock className="h-4 w-4 text-blue-500" />,
  concluído: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
}

const statusColors = {
  pendente: "bg-gray-100 text-gray-600",
  "em andamento": "bg-blue-100 text-blue-700",
  concluído: "bg-emerald-100 text-emerald-700",
}

export default function ActionPlanPage() {
  const [copied, setCopied] = useState(false)
  const report = mockReports[0]

  const publishedPlans = mockActionPlans.filter((a) => a.published_to_client === true)
  const displayPlans = publishedPlans.length > 0 ? publishedPlans : mockActionPlans

  const alta = displayPlans.filter((a) => a.priority === "alta")
  const media = displayPlans.filter((a) => a.priority === "média")
  const baixa = displayPlans.filter((a) => a.priority === "baixa")

  const completed = displayPlans.filter((a) => a.status === "concluído").length
  const total = displayPlans.length

  const whatsappMessage = `📊 *Visão Geral — Clínica Saúde Total*

No período de ${formatDate(report.period_start)} a ${formatDate(report.period_end)}, investimos ${formatCurrency(mockFinancial.media_spend)} em mídia paga e geramos ${mockFunnel.leads} leads.

Em comparação com o período anterior:
• CPL reduziu 14% — de R$ 24,80 para R$ 21,30
• Volume de leads cresceu 22%
• ROAS: ${mockFinancial.roas?.toFixed(2)}x
• ROI: ${mockFinancial.roi}%

📈 *Principal destaque:* CPL em queda com maior volume.

⚠️ *Ponto de atenção:* Taxa de resposta comercial precisa melhorar.

🎯 *Próximas ações:*
1. Implementar bot WhatsApp 24h
2. Escalar campanha vencedora Meta Ads +30%
3. Otimizar orçamento Google Ads

O relatório completo está disponível no dashboard.`

  function copyWhatsapp() {
    navigator.clipboard.writeText(whatsappMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function ActionCard({ action }: { action: typeof mockActionPlans[0] }) {
    return (
      <div className={`border rounded-xl p-4 ${action.status === "concluído" ? "opacity-70" : ""}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">{statusIcons[action.status]}</div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${action.status === "concluído" ? "line-through text-gray-400" : "text-gray-900"}`}>
              {action.action}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">{action.area}</Badge>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(action.priority)}`}>
                {action.priority}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[action.status]}`}>
                {action.status}
              </span>
              {action.responsible && (
                <span className="text-xs text-gray-500">👤 {action.responsible}</span>
              )}
              {action.deadline && (
                <span className="text-xs text-gray-500">📅 {formatDate(action.deadline)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700">
        Estas são as ações validadas e publicadas pela equipe da agência para este período.
        {publishedPlans.length === 0 && (
          <span className="block mt-1 text-blue-600 font-medium">
            Nenhum plano publicado ainda — aguardando revisão da equipe.
          </span>
        )}
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plano de Ação</h1>
          <p className="text-gray-500 mt-1">{completed}/{total} ações concluídas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyWhatsapp}>
            {copied ? <><Check className="h-4 w-4" />Copiado!</> : <><Copy className="h-4 w-4" />Copiar para WhatsApp</>}
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Concluídas", count: displayPlans.filter((a) => a.status === "concluído").length, color: "text-emerald-600" },
          { label: "Em Andamento", count: displayPlans.filter((a) => a.status === "em andamento").length, color: "text-blue-600" },
          { label: "Pendentes", count: displayPlans.filter((a) => a.status === "pendente").length, color: "text-gray-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas ({displayPlans.length})</TabsTrigger>
          <TabsTrigger value="alta">🔴 Alta ({alta.length})</TabsTrigger>
          <TabsTrigger value="media">🟡 Média ({media.length})</TabsTrigger>
          <TabsTrigger value="baixa">🔵 Baixa ({baixa.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {alta.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-3">Alta Prioridade</h2>
              <div className="space-y-3">
                {alta.map((a) => <ActionCard key={a.id} action={a} />)}
              </div>
            </div>
          )}
          {media.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-3">Média Prioridade</h2>
              <div className="space-y-3">
                {media.map((a) => <ActionCard key={a.id} action={a} />)}
              </div>
            </div>
          )}
          {baixa.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">Baixa Prioridade</h2>
              <div className="space-y-3">
                {baixa.map((a) => <ActionCard key={a.id} action={a} />)}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="alta">
          <div className="space-y-3">{alta.map((a) => <ActionCard key={a.id} action={a} />)}</div>
        </TabsContent>
        <TabsContent value="media">
          <div className="space-y-3">{media.map((a) => <ActionCard key={a.id} action={a} />)}</div>
        </TabsContent>
        <TabsContent value="baixa">
          <div className="space-y-3">{baixa.map((a) => <ActionCard key={a.id} action={a} />)}</div>
        </TabsContent>
      </Tabs>

      {/* WhatsApp summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Resumo para WhatsApp
          </CardTitle>
          <CardDescription>Texto pronto para enviar ao cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-200 font-sans leading-relaxed">
            {whatsappMessage}
          </pre>
          <Button variant="outline" size="sm" className="mt-3" onClick={copyWhatsapp}>
            {copied ? <><Check className="h-4 w-4" />Copiado!</> : <><Copy className="h-4 w-4" />Copiar Texto</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
