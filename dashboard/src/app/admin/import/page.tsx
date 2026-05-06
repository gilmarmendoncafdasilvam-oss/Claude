"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Upload, Download, CheckCircle2, AlertCircle, FileText, Loader2, Sparkles, X } from "lucide-react"
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
type MainTab = "padrao" | "apuracao"

export default function ImportPage() {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("padrao")

  const [importType, setImportType] = useState("")
  const [clientId, setClientId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<ImportStep>("config")
  const [loading, setLoading] = useState(false)
  const [previewRows, setPreviewRows] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const [aiFile, setAiFile] = useState<File | null>(null)
  const [aiClientId, setAiClientId] = useState("")
  const [aiMonth, setAiMonth] = useState("")
  const [aiYear, setAiYear] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

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

  async function handleAiAnalyze() {
    if (!aiFile) return
    setAnalyzing(true)
    setShowResults(false)
    setConfirmed(false)
    await new Promise((r) => setTimeout(r, 2000))
    setAnalyzing(false)
    setShowResults(true)
  }

  function handleAiConfirm() {
    setConfirmed(true)
  }

  function handleAiDiscard() {
    setAiFile(null)
    setShowResults(false)
    setConfirmed(false)
    setAnalyzing(false)
  }

  const months = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ]

  const years = ["2024", "2025", "2026"]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Importar Dados</h1>
        <p className="text-gray-500 mt-1">Importe métricas via planilha CSV para qualquer cliente</p>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 w-fit">
        <button
          onClick={() => setActiveMainTab("padrao")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeMainTab === "padrao"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Upload className="h-4 w-4" />
          Importação Padrão
        </button>
        <button
          onClick={() => setActiveMainTab("apuracao")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeMainTab === "apuracao"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Apuração Inteligente
        </button>
      </div>

      {activeMainTab === "padrao" && (
        <>
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
        </>
      )}

      {activeMainTab === "apuracao" && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">Apuração Inteligente</p>
                <p className="text-sm text-blue-700">
                  Envie qualquer arquivo e o sistema identificará automaticamente os dados e métricas.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Formatos suportados</p>
            <div className="flex flex-wrap gap-2">
              {["PDF", "CSV", "XLS", "XLSX", "PNG", "JPG", "DOC", "DOCX"].map((fmt) => (
                <span
                  key={fmt}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload do Arquivo</CardTitle>
              <CardDescription>Selecione o cliente, período e envie o arquivo para análise automática</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div
                className="border-2 border-dashed border-blue-200 rounded-xl p-12 text-center hover:border-blue-400 transition-colors bg-blue-50/30 cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const f = e.dataTransfer.files[0]
                  if (f) setAiFile(f)
                }}
              >
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept=".pdf,.csv,.xls,.xlsx,.png,.jpg,.jpeg,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) {
                        setAiFile(f)
                        setShowResults(false)
                        setConfirmed(false)
                      }
                    }}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-blue-500" />
                    </div>
                    {aiFile ? (
                      <div>
                        <p className="font-semibold text-gray-900">{aiFile.name}</p>
                        <p className="text-sm text-gray-400 mt-0.5">{(aiFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-base font-medium text-gray-700">
                          Arraste seus arquivos aqui ou clique para selecionar
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Formatos aceitos: PDF, CSV, XLS, XLSX, imagens, documentos
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Cliente</Label>
                  <Select value={aiClientId} onValueChange={setAiClientId}>
                    <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                    <SelectContent>
                      {mockClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Mês</Label>
                  <Select value={aiMonth} onValueChange={setAiMonth}>
                    <SelectTrigger><SelectValue placeholder="Mês" /></SelectTrigger>
                    <SelectContent>
                      {months.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Ano</Label>
                  <Select value={aiYear} onValueChange={setAiYear}>
                    <SelectTrigger><SelectValue placeholder="Ano" /></SelectTrigger>
                    <SelectContent>
                      {years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleAiAnalyze}
                  disabled={!aiFile || analyzing}
                  className="gap-2"
                >
                  {analyzing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Analisando arquivo...</>
                  ) : (
                    <><Sparkles className="h-4 w-4" />Analisar com IA</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {analyzing && (
            <div className="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin shrink-0" />
              <div>
                <p className="font-semibold text-blue-900">Analisando arquivo...</p>
                <p className="text-sm text-blue-600 mt-0.5">Identificando dados, métricas e tipo de fonte</p>
              </div>
            </div>
          )}

          {showResults && !confirmed && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Resultado da Análise
                </CardTitle>
                <CardDescription>Dados extraídos automaticamente do arquivo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{aiFile?.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {aiFile ? `${(aiFile.size / 1024).toFixed(1)} KB` : ""} · 47 linhas detectadas
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo de dado detectado</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Meta Ads
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Período detectado</p>
                    <p className="text-sm font-semibold text-gray-900">Abril 2024</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Métricas extraídas</p>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Métrica</th>
                          <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Valor Detectado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { label: "Investimento Total", value: "R$ 4.200,00" },
                          { label: "Impressões", value: "180.000" },
                          { label: "Cliques", value: "3.240" },
                          { label: "Leads", value: "198" },
                          { label: "CPL", value: "R$ 21,21" },
                          { label: "ROAS", value: "4.7x" },
                        ].map((row, i) => (
                          <tr key={row.label} className={`border-b border-gray-100 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                            <td className="px-4 py-3 text-gray-700">{row.label}</td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Confiança da extração</p>
                    <span className="text-sm font-bold text-emerald-600">94%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: "94%" }}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-700">
                    Verifique os dados antes de confirmar. O sistema pode não capturar todos os campos corretamente.
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={handleAiDiscard} className="gap-2">
                    <X className="h-4 w-4" />
                    Descartar
                  </Button>
                  <Button onClick={handleAiConfirm} className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Confirmar e Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {confirmed && (
            <div className="max-w-md mx-auto text-center py-12">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Dados extraídos e salvos com sucesso!</h2>
              <p className="text-gray-500 mb-6">As métricas foram salvas e já estão disponíveis no dashboard do cliente.</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={handleAiDiscard}>
                  Nova Apuração
                </Button>
                <Button asChild><Link href="/admin">Voltar ao Painel</Link></Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
