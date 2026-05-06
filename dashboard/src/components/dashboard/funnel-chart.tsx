import { formatNumber, formatPercent } from "@/lib/utils"

interface FunnelStage {
  label: string
  value: number
  rate?: number
  cost?: number
  color: string
  isBottleneck?: boolean
}

interface FunnelChartProps {
  stages: FunnelStage[]
}

export function FunnelChart({ stages }: FunnelChartProps) {
  const maxValue = stages[0]?.value || 1

  return (
    <div className="flex flex-col gap-1">
      {stages.map((stage, index) => {
        const widthPct = Math.max((stage.value / maxValue) * 100, 8)
        return (
          <div key={index} className="flex items-center gap-3">
            <div className="w-36 text-right shrink-0">
              <p className="text-sm font-medium text-gray-700 truncate">{stage.label}</p>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div
                className="h-9 rounded-md flex items-center px-3 transition-all"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: stage.isBottleneck ? "#fef3c7" : stage.color,
                  borderLeft: stage.isBottleneck ? "3px solid #f59e0b" : "none",
                }}
              >
                <span className="text-xs font-bold text-white drop-shadow-sm whitespace-nowrap">
                  {formatNumber(stage.value)}
                </span>
              </div>
              <div className="flex gap-3 text-xs text-gray-500 shrink-0">
                {stage.rate !== undefined && (
                  <span className={stage.isBottleneck ? "text-amber-600 font-semibold" : ""}>
                    {formatPercent(stage.rate)} conv.
                  </span>
                )}
                {stage.cost !== undefined && <span>R$ {stage.cost.toFixed(2)}/un.</span>}
              </div>
            </div>
            {index < stages.length - 1 && (
              <div className="w-full absolute" />
            )}
          </div>
        )
      })}
    </div>
  )
}
