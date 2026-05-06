"use client"

import { Bell, Download, Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDateRange } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface HeaderProps {
  title: string
  subtitle?: string
  periodStart?: string
  periodEnd?: string
  performanceStatus?: string
  showExport?: boolean
  onExport?: () => void
}

const statusConfig: Record<string, { label: string; className: string }> = {
  excelente: { label: "Excelente", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  bom: { label: "Bom", className: "bg-blue-100 text-blue-700 border-blue-200" },
  estável: { label: "Estável", className: "bg-gray-100 text-gray-600 border-gray-200" },
  atenção: { label: "Atenção", className: "bg-amber-100 text-amber-700 border-amber-200" },
  crítico: { label: "Crítico", className: "bg-red-100 text-red-700 border-red-200" },
}

export function Header({ title, subtitle, periodStart, periodEnd, performanceStatus, showExport = false, onExport }: HeaderProps) {
  const status = performanceStatus ? statusConfig[performanceStatus] : null

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {status && (
            <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", status.className)}>
              {status.label}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        {periodStart && periodEnd && (
          <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDateRange(periodStart, periodEnd)}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showExport && (
          <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        )}
      </div>
    </div>
  )
}
