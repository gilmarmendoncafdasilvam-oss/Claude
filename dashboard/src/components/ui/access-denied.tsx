"use client"
import { ShieldX } from "lucide-react"

interface AccessDeniedProps {
  message?: string
}

export function AccessDenied({ message = "Você não tem permissão para acessar esta funcionalidade." }: AccessDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <ShieldX className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">Acesso negado</h3>
      <p className="text-sm text-gray-500 max-w-xs">{message}</p>
    </div>
  )
}
