"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { mockReports, mockClients, mockPaidMedia, mockFinancial, mockFunnel } from "@/lib/mock-data"
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils"

export default function ReportPrintPage() {
  const params = useParams()
  const id = params.id as string

  const report = mockReports.find((r) => r.id === id)
  const client = report ? mockClients.find((c) => c.id === report.client_id) : null

  const totalInvestido = mockFinancial.media_spend + mockFinancial.management_fee
  const totalLeads = mockPaidMedia.reduce((s, m) => s + m.leads, 0)
  const totalVendas = mockFinancial.sales_count ?? 0
  const receita = mockFinancial.revenue ?? 0
  const roas = mockFinancial.roas ?? 0
  const roi = mockFinancial.roi ?? 0
  const cpl = totalLeads > 0 ? totalInvestido / totalLeads : 0
  const cac = mockFinancial.cac ?? 0

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print()
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Relatório não encontrado.</p>
      </div>
    )
  }

  const nextStepsList = report.next_steps
    ? report.next_steps.split("\n").filter(Boolean)
    : []

  const funnelSteps = [
    { label: "Impressões", value: formatNumber(mockFunnel.impressions) },
    { label: "Cliques", value: formatNumber(mockFunnel.clicks) },
    { label: "Leads", value: formatNumber(mockFunnel.leads) },
    { label: "Consultas", value: formatNumber(mockFunnel.appointments) },
    { label: "Vendas", value: formatNumber(mockFunnel.sales) },
  ]

  const funnelMax = mockFunnel.impressions

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="no-print fixed top-4 left-4 right-4 flex items-center justify-between z-50 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-lg">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Voltar
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Modo de impressão / PDF</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            🖨 Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      <div className="bg-white min-h-screen pt-20 pb-16 px-0 print:pt-0">
        <div className="max-w-[860px] mx-auto px-8">

          <div className="min-h-[280px] border-b-4 border-blue-600 mb-12 pb-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">TD</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg leading-none">TrafficDash</p>
                <p className="text-xs text-gray-400 mt-0.5">Plataforma de Relatórios</p>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {report.title}
            </h1>

            {client && (
              <div className="mb-4">
                <p className="text-xl text-gray-700 font-semibold">{client.company_name}</p>
                {client.trade_name && (
                  <p className="text-base text-gray-400">{client.trade_name}</p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-5">
              <div>
                <span className="font-semibold text-gray-700">Período: </span>
                {formatDate(report.period_start)} a {formatDate(report.period_end)}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Tipo: </span>
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
                  {report.report_type}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Gerado em: </span>
                {new Intl.DateTimeFormat("pt-BR").format(new Date())}
              </div>
            </div>
          </div>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-blue-600 rounded-full" />
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                1. Resumo Executivo
              </h2>
            </div>
            {report.executive_summary && (
              <p className="text-base text-gray-700 leading-relaxed mb-6 pl-4 border-l-2 border-gray-200">
                {report.executive_summary}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              {report.main_highlight && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                  <p className="text-sm font-bold text-emerald-800 mb-2">✅ Principal Destaque</p>
                  <p className="text-sm text-emerald-700 leading-relaxed">{report.main_highlight}</p>
                </div>
              )}
              {report.main_warning && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <p className="text-sm font-bold text-amber-800 mb-2">⚠️ Ponto de Atenção</p>
                  <p className="text-sm text-amber-700 leading-relaxed">{report.main_warning}</p>
                </div>
              )}
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-blue-600 rounded-full" />
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                2. Métricas Principais
              </h2>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Total Investido", value: formatCurrency(totalInvestido), color: "border-t-blue-500" },
                { label: "Leads Gerados", value: formatNumber(totalLeads), color: "border-t-emerald-500" },
                { label: "Vendas", value: formatNumber(totalVendas), color: "border-t-purple-500" },
                { label: "Receita", value: formatCurrency(receita), color: "border-t-green-500" },
                { label: "ROAS", value: `${roas.toFixed(2)}x`, color: "border-t-blue-400" },
                { label: "ROI", value: `${roi}%`, color: "border-t-indigo-500" },
                { label: "CPL", value: formatCurrency(cpl), color: "border-t-orange-500" },
                { label: "CAC", value: formatCurrency(cac), color: "border-t-red-400" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`bg-white border border-gray-200 border-t-4 ${item.color} rounded-xl p-4`}
                >
                  <p className="text-xs text-gray-400 font-medium mb-1">{item.label}</p>
                  <p className="text-lg font-extrabold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-blue-600 rounded-full" />
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                3. Análise por Canal
              </h2>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Canal</th>
                    <th className="text-right px-5 py-3 font-semibold text-gray-600">Investimento</th>
                    <th className="text-right px-5 py-3 font-semibold text-gray-600">Leads</th>
                    <th className="text-right px-5 py-3 font-semibold text-gray-600">CPL</th>
                    <th className="text-right px-5 py-3 font-semibold text-gray-600">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                        <span className="font-medium text-gray-800">Google Ads</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-gray-700">R$ 3.400</td>
                    <td className="px-5 py-4 text-right text-gray-700">114</td>
                    <td className="px-5 py-4 text-right text-gray-700">R$ 29,82</td>
                    <td className="px-5 py-4 text-right font-semibold text-emerald-600">3.8x</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                        <span className="font-medium text-gray-800">Meta Ads</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-gray-700">R$ 4.200</td>
                    <td className="px-5 py-4 text-right text-gray-700">198</td>
                    <td className="px-5 py-4 text-right text-gray-700">R$ 21,21</td>
                    <td className="px-5 py-4 text-right font-semibold text-emerald-600">4.7x</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-blue-600 rounded-full" />
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                4. Funil de Conversão
              </h2>
            </div>
            <div className="space-y-3">
              {funnelSteps.map((step, i) => {
                const rawValue = [
                  mockFunnel.impressions,
                  mockFunnel.clicks,
                  mockFunnel.leads,
                  mockFunnel.appointments,
                  mockFunnel.sales,
                ][i]
                const pct = Math.max(8, Math.round((rawValue / funnelMax) * 100))
                const colors = [
                  "bg-blue-500",
                  "bg-blue-400",
                  "bg-emerald-500",
                  "bg-purple-500",
                  "bg-green-600",
                ]
                return (
                  <div key={step.label} className="flex items-center gap-4">
                    <div className="w-28 text-right">
                      <span className="text-sm font-medium text-gray-600">{step.label}</span>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                      <div
                        className={`h-full ${colors[i]} rounded-full flex items-center px-3`}
                        style={{ width: `${pct}%` }}
                      >
                        <span className="text-white text-xs font-bold whitespace-nowrap">{step.value}</span>
                      </div>
                    </div>
                    {i < funnelSteps.length - 1 && (
                      <div className="w-16 text-xs text-gray-400 text-right">
                        {i === 0 && `${((mockFunnel.clicks / mockFunnel.impressions) * 100).toFixed(1)}%`}
                        {i === 1 && `${((mockFunnel.leads / mockFunnel.clicks) * 100).toFixed(1)}%`}
                        {i === 2 && `${((mockFunnel.appointments / mockFunnel.leads) * 100).toFixed(1)}%`}
                        {i === 3 && `${((mockFunnel.sales / mockFunnel.appointments) * 100).toFixed(1)}%`}
                      </div>
                    )}
                    {i === funnelSteps.length - 1 && <div className="w-16" />}
                  </div>
                )
              })}
            </div>
          </section>

          {nextStepsList.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 bg-blue-600 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                  5. Próximas Ações
                </h2>
              </div>
              <div className="space-y-3">
                {nextStepsList.map((step, i) => (
                  <div key={i} className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{step.replace(/^\d+\.\s*/, "")}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="border-t-2 border-gray-200 pt-6 mt-8 flex items-center justify-between text-xs text-gray-400">
            <p>Documento gerado pelo TrafficDash — Confidencial</p>
            <p>
              {client?.company_name} · {report.title}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
