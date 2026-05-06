"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Upload, Download, CheckCircle2, AlertCircle, FileText, X, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { mockClients } from "@/lib/mock-data"

const importTypes = [
  { value: "google_ads", label: "Google Ads", color: "text-blue-600", bg: "bg-blue-50" },
  { value: "meta_ads", label: "Meta Ads", color: "text-indigo-600", bg: "bg-indigo-50" },
  { value: "ga4", label: "Site / GA4", color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: "whatsapp", label: "WhatsApp / Comercial", color: "text-green-600", bg: "bg-green-50" },
  { value: "funnel", label: "Funil", color: "text-orange-600", bg: "bg-orange-50" },
  { value: "financial", label: "Financeiro", color: "text-purple-600", bg: "bg-purple-50" },
]

const csvTemplates: Record<string, string[]> = {
  google_ads: ["campaign_name", "ad_group_name", "keyword", "spend", "impressions", "clicks", "ctr", "cpc", "conversions", "cost_per_conversion", "quality_score"],
  meta_ads: ["campaign_name", "ad_set_name", "ad_name", "spend", "reach", "impressions", "frequency", "cpm", "clicks", "ctr", "cpc", "leads", "cost_per_lead"],
  ga4: ["sessions", "users", "new_users", "pageviews", "engagement_rate", "bounce_rate", "conversions", "conversion_rate", "source", "medium", "device"],
  whatsapp: ["conversations_started", "leads_answered", "leads_not_answered", "response_rate", "qualified_leads", "appointments", "show_ups", "sales", "close_rate"],
  funnel: ["impressions", "clicks", "site_visits", "leads", "whatsapp_conversations", "qualified_leads", "appointments", "sales", "revenue"],
  financial: ["media_spend", "management_fee", "total_marketing_cost", "revenue", "gross_profit", "average_ticket", "sales_count", "cac", "roas", "roi"],
}

type ImportStep = "config" | "preview" | "done"

export default function ImportPage() {
  const [importType, setImportType] = useState("")
  const [clientId, setClientId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<ImportStep>("config")
  const [loading, setLoading] = useState(false)
  const [previewRows, setPreviewRows] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const lines = text.split("\n").filter(Boolean)
      const hdrs = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
      const rows = lines.slice(1, 6).map((l) => l.split(",").map((v) => v.trim().replace(/"/g, "")))
      setHeaders(hdrs)
      setPreviewRows(rows)

      const expectedCols = csvTemplates[importType] || []
      const missing = expectedCols.slice(0, 5).filter((col) => !hdrs.includes(col))
      if (missing.length > 0) {
        setErrors([`Colunas não encontradas: ${missing.join(", ")}. Verifique o modelo CSV.`])
      } else {
        setErrors([])
      }
    }
    reader.readAsText(f)
  }, [importType])

  async function handleImport() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setStep("done")
  }

  function downloadTemplate() {
    const cols = csvTemplates[importType]
    if (!cols) return
    const csv = cols.join(",") + "\n" + cols.map(() => "exemplo").join(",")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `modelo_${importType}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Importar Dados</h1>
        <p className="text-gray-500 mt-1">Importe métricas via planilha CSV para qualquer cliente</p>
      </div>

      {step === "config" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração da Importação</CardTitle>
                <CardDescription>Selecione o cliente, o tipo de dado e faça o upload do arquivo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Cliente *</Label>
                    <Select value={clientId} onValueChange={setClientId}>
                      <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                      <SelectContent>
                        {mockClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tipo de Dado *</Label>
                    <Select value={importType} onValueChange={setImportType}>
                      <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                      <SelectContent>
                        {importTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {importType && (
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={downloadTemplate}>
                      <Download className="h-3.5 w-3.5" />
                      Baixar Modelo CSV
                    </Button>
                  </div>
                )}

                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const f = e.dataTransfer.files[0]
                    if (f) handleFileChange({ target: { files: [f] } } as unknown as React.ChangeEvent<HTMLInputElement>)
                  }}
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {file ? file.name : "Arraste o arquivo CSV ou clique para selecionar"}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">Suporta arquivos .csv com codificação UTF-8</p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={!importType || !clientId}
                    />
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      !importType || !clientId
                        ? "border-gray-200 text-gray-300 cursor-not-allowed"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                    }`}>
                      <FileText className="h-4 w-4" />
                      Selecionar Arquivo
                    </span>
                  </label>
                </div>

                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-1">
                    {errors.map((e, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-red-700">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        {e}
                      </div>
                    ))}
                  </div>
                )}

                {previewRows.length > 0 && errors.length === 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
                      Prévia – {previewRows.length} linhas encontradas
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-100">
                            {headers.slice(0, 6).map((h) => (
                              <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>
                            ))}
                            {headers.length > 6 && <th className="px-3 py-2 text-gray-400">+{headers.length - 6} mais</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {previewRows.map((row, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                              {row.slice(0, 6).map((cell, j) => (
                                <td key={j} className="px-3 py-2 text-gray-700">{cell || "—"}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button
                onClick={handleImport}
                disabled={!file || !clientId || !importType || errors.length > 0 || loading}
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Importando...</> : <><Upload className="h-4 w-4" />Confirmar Importação</>}
              </Button>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader><CardTitle>Tipos de Importação</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {importTypes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setImportType(t.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                      importType === t.value ? "border-blue-300 bg-blue-50" : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg ${t.bg} flex items-center justify-center`}>
                      <FileText className={`h-4 w-4 ${t.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{t.label}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="max-w-md mx-auto text-center py-16">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Dados importados com sucesso!</h2>
          <p className="text-gray-500 mb-6">Os dados foram processados e já estão disponíveis no dashboard do cliente.</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => { setStep("config"); setFile(null); setPreviewRows([]); setHeaders([]) }}>
              Nova Importação
            </Button>
            <Button asChild><Link href="/admin">Voltar ao Painel</Link></Button>
          </div>
        </div>
      )}
    </div>
  )
}
