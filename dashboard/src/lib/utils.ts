import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date))
}

export function formatDateRange(start: string, end: string): string {
  return `${formatDate(start)} – ${formatDate(end)}`
}

export function calcCTR(clicks: number, impressions: number): number {
  if (!impressions) return 0
  return (clicks / impressions) * 100
}

export function calcCPC(spend: number, clicks: number): number {
  if (!clicks) return 0
  return spend / clicks
}

export function calcCPM(spend: number, impressions: number): number {
  if (!impressions) return 0
  return (spend / impressions) * 1000
}

export function calcCPL(spend: number, leads: number): number {
  if (!leads) return 0
  return spend / leads
}

export function calcCPA(spend: number, conversions: number): number {
  if (!conversions) return 0
  return spend / conversions
}

export function calcROAS(revenue: number, spend: number): number {
  if (!spend) return 0
  return revenue / spend
}

export function calcROI(profit: number, cost: number): number {
  if (!cost) return 0
  return ((profit - cost) / cost) * 100
}

export function calcConversionRate(conversions: number, clicks: number): number {
  if (!clicks) return 0
  return (conversions / clicks) * 100
}

export function percentChange(current: number, previous: number): number {
  if (!previous) return 0
  return ((current - previous) / previous) * 100
}

export function getPerformanceColor(change: number): string {
  if (change > 0) return "text-emerald-500"
  if (change < 0) return "text-red-500"
  return "text-gray-400"
}

export function getPerformanceBg(change: number): string {
  if (change > 0) return "bg-emerald-500/10 text-emerald-600"
  if (change < 0) return "bg-red-500/10 text-red-600"
  return "bg-gray-100 text-gray-500"
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    excelente: "text-emerald-600 bg-emerald-50",
    bom: "text-blue-600 bg-blue-50",
    estável: "text-gray-600 bg-gray-100",
    atenção: "text-amber-600 bg-amber-50",
    crítico: "text-red-600 bg-red-50",
  }
  return map[status] ?? "text-gray-600 bg-gray-100"
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    alta: "text-red-600 bg-red-50",
    média: "text-amber-600 bg-amber-50",
    baixa: "text-blue-600 bg-blue-50",
  }
  return map[priority] ?? "text-gray-600 bg-gray-100"
}
