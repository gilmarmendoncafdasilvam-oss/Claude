"use client"

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface PieChartProps {
  data: { name: string; value: number; color: string }[]
  height?: number
  formatValue?: (value: number) => string
}

export function PieChart({ data, height = 280, formatValue }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
          formatter={(value, name) => [formatValue && typeof value === "number" ? formatValue(value) : value, name]}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
