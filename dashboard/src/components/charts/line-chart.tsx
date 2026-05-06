"use client"

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface LineChartProps {
  data: Record<string, unknown>[]
  lines: { key: string; label: string; color: string }[]
  xKey: string
  height?: number
  formatY?: (value: number) => string
}

export function LineChart({ data, lines, xKey, height = 280, formatY }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={formatY} width={60} />
        <Tooltip
          contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
          formatter={(value, name) => [formatY && typeof value === "number" ? formatY(value) : value, name]}
        />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.label}
            stroke={line.color}
            strokeWidth={2}
            dot={{ r: 4, fill: line.color }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
