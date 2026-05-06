import { cn, formatCurrency, formatNumber, formatPercent, percentChange, getPerformanceBg } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  format?: "currency" | "number" | "percent" | "raw"
  previousValue?: number
  rawValue?: number
  icon?: React.ReactNode
  description?: string
  highlight?: boolean
  className?: string
  invertDelta?: boolean
}

function formatValue(value: string | number, format?: string): string {
  if (typeof value === "string") return value
  switch (format) {
    case "currency": return formatCurrency(value)
    case "percent": return formatPercent(value)
    case "number": return formatNumber(value)
    default: return String(value)
  }
}

export function MetricCard({
  title,
  value,
  format,
  previousValue,
  rawValue,
  icon,
  description,
  highlight,
  className,
  invertDelta = false,
}: MetricCardProps) {
  const numericValue = typeof value === "number" ? value : (rawValue ?? 0)
  const delta = previousValue !== undefined ? percentChange(numericValue, previousValue) : undefined
  const effectiveDelta = invertDelta && delta !== undefined ? -delta : delta

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3",
        highlight && "border-blue-200 bg-blue-50/30",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className={cn("text-2xl font-bold text-gray-900", highlight && "text-blue-700")}>
          {formatValue(value, format)}
        </p>
        {effectiveDelta !== undefined && (
          <div className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", getPerformanceBg(effectiveDelta))}>
            {effectiveDelta > 0 ? <TrendingUp className="h-3 w-3" /> : effectiveDelta < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {Math.abs(effectiveDelta).toFixed(1)}%
          </div>
        )}
      </div>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  )
}
