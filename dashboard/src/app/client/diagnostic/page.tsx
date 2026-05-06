"use client"

import { TrendingUp, TrendingDown, AlertTriangle, Target, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockDiagnostic } from "@/lib/mock-data"
import { getStatusColor } from "@/lib/utils"

const diag = mockDiagnostic

interface DiagnosticSectionProps {
  icon: React.ReactNode
  title: string
  content?: string
  type?: "positive" | "negative" | "neutral"
}

function DiagnosticSection({ icon, title, content, type = "neutral" }: DiagnosticSectionProps) {
  if (!content) return null
  const bgClass = type === "positive" ? "bg-emerald-50 border-emerald-200" : type === "negative" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
  const textClass = type === "positive" ? "text-emerald-800" : type === "negative" ? "text-red-800" : "text-gray-700"
  const titleClass = type === "positive" ? "text-emerald-700" : type === "negative" ? "text-red-700" : "text-gray-600"
  return (
    <div className={`rounded-xl border p-4 ${bgClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={titleClass}>{icon}</div>
        <h3 className={`text-sm font-semibold ${titleClass}`}>{title}</h3>
      </div>
      <p className={`text-sm leading-relaxed ${textClass}`}>{content}</p>
    </div>
  )
}

const areaLabels: Record<string, string> = {
  traffic_diagnosis: "Tráfego Pago",
  offer_diagnosis: "Oferta",
  landing_page_diagnosis: "Página / LP",
  commercial_diagnosis: "Comercial / Atendimento",
  financial_diagnosis: "Financeiro",
}

export default function DiagnosticPage() {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Diagnóstico Estratégico</h1>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${getStatusColor(diag.performance_status)}`}>
            {diag.performance_status.charAt(0).toUpperCase() + diag.performance_status.slice(1)}
          </span>
        </div>
        <p className="text-gray-500">Análise qualitativa do período para entender o que aconteceu e o que fazer</p>
      </div>

      {/* Main highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <DiagnosticSection
          icon={<TrendingUp className="h-4 w-4" />}
          title="O que melhorou"
          content={diag.what_improved}
          type="positive"
        />
        <DiagnosticSection
          icon={<TrendingDown className="h-4 w-4" />}
          title="O que piorou"
          content={diag.what_worsened}
          type="negative"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <DiagnosticSection
          icon={<AlertTriangle className="h-4 w-4" />}
          title="Problema principal"
          content={diag.main_problem}
          type="negative"
        />
        <DiagnosticSection
          icon={<Target className="h-4 w-4" />}
          title="Principal oportunidade"
          content={diag.main_opportunity}
          type="positive"
        />
      </div>

      {/* Area diagnosis */}
      <h2 className="text-base font-semibold text-gray-800 mb-3">Diagnóstico por Área</h2>
      <div className="grid grid-cols-1 gap-4 mb-6">
        {Object.entries(areaLabels).map(([key, label]) => {
          const content = diag[key as keyof typeof diag] as string | undefined
          if (!content) return null
          return (
            <Card key={key}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5 shrink-0">{label}</Badge>
                  <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Conclusion */}
      {diag.conclusion && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Conclusão do Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 leading-relaxed text-sm">{diag.conclusion}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
