"use client"

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface BarChartProps {
  data: Record<string, unknown>[]
  bars: { key: string; label: string; color: string }[]
  xKey: string
  height?: number
  formatY?: (value: number) => string
  stacked?: boolean
}

export function BarChart({ data, bars, xKey, height = 280, formatY, stacked = false }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={formatY} width={60} />
        <Tooltip
          contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
          formatter={(value, name) => [formatY && typeof value === "number" ? formatY(value) : value, name]}
        />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.label}
            fill={bar.color}
            radius={[4, 4, 0, 0]}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
