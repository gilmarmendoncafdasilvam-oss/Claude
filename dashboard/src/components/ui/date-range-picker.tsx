"use client"

import { useState } from "react"
import { Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (start: string, end: string) => void
  disabled?: boolean
}

const presets = [
  { label: "Abril 2024", start: "2024-04-01", end: "2024-04-30" },
  { label: "Março 2024", start: "2024-03-01", end: "2024-03-31" },
  { label: "Último trimestre", start: "2024-01-01", end: "2024-03-31" },
]

export function DateRangePicker({ startDate, endDate, onChange, disabled }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [localStart, setLocalStart] = useState(startDate)
  const [localEnd, setLocalEnd] = useState(endDate)

  const activePreset = presets.find((p) => p.start === startDate && p.end === endDate)

  function applyPreset(preset: typeof presets[0]) {
    setLocalStart(preset.start)
    setLocalEnd(preset.end)
    onChange(preset.start, preset.end)
    setOpen(false)
  }

  function applyCustom() {
    if (localStart && localEnd) {
      onChange(localStart, localEnd)
      setOpen(false)
    }
  }

  function formatDisplay() {
    if (activePreset) return activePreset.label
    if (startDate && endDate) {
      const fmt = (d: string) =>
        new Intl.DateTimeFormat("pt-BR").format(new Date(d + "T00:00:00"))
      return `${fmt(startDate)} – ${fmt(endDate)}`
    }
    return "Selecionar período"
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Calendar className="h-4 w-4 text-gray-400" />
        <span>{formatDisplay()}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl border border-gray-200 shadow-lg p-4 w-80">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Períodos rápidos</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  activePreset?.label === preset.label
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Personalizado</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="space-y-1">
              <Label className="text-xs">Início</Label>
              <Input
                type="date"
                value={localStart}
                onChange={(e) => setLocalStart(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Fim</Label>
              <Input
                type="date"
                value={localEnd}
                onChange={(e) => setLocalEnd(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={applyCustom} disabled={!localStart || !localEnd}>
              Aplicar
            </Button>
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  )
}
