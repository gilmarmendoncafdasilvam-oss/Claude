"use client"

import { useState } from "react"
import Link from "next/link"
import { FileBarChart, Plus, Search, Eye, Edit, Download } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockReports, mockClients } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"

const typeLabels: Record<string, string> = {
  semanal: "Semanal",
  mensal: "Mensal",
  trimestral: "Trimestral",
  personalizado: "Personalizado",
}

export default function ReportsPage() {
  const [search, setSearch] = useState("")

  const filtered = mockReports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      mockClients.find((c) => c.id === r.client_id)?.company_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-500 mt-1">{mockReports.length} relatório(s) criado(s)</p>
        </div>
        <Button asChild>
          <Link href="/admin/reports/new">
            <Plus className="h-4 w-4" />
            Novo Relatório
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Buscar relatórios..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
              <span className="col-span-4">Título</span>
              <span className="col-span-2">Cliente</span>
              <span className="col-span-2">Tipo</span>
              <span className="col-span-2">Período</span>
              <span className="col-span-2 text-right">Ações</span>
            </div>
            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                <FileBarChart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Nenhum relatório encontrado</p>
              </div>
            )}
            {filtered.map((report) => {
              const client = mockClients.find((c) => c.id === report.client_id)
              return (
                <div key={report.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50">
                  <div className="col-span-4">
                    <p className="font-medium text-gray-900 text-sm">{report.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Criado em {formatDate(report.created_at)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">{client?.trade_name || client?.company_name}</p>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="secondary">{typeLabels[report.report_type]}</Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">
                      {formatDate(report.period_start)} – {formatDate(report.period_end)}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/reports/${report.id}`}><Eye className="h-3.5 w-3.5" /></Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/reports/${report.id}/edit`}><Edit className="h-3.5 w-3.5" /></Link>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
