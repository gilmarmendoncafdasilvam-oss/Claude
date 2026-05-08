"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { mockClients } from "@/lib/mock-data"
import { useSessionUser } from "@/hooks/use-session-user"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loaded } = useSessionUser()

  useEffect(() => {
    if (!loaded) return
    if (!user) {
      router.push("/login")
    } else if (user.role !== "client" && user.role !== "client_employee") {
      router.push("/admin")
    }
  }, [user, loaded, router])

  if (!loaded || !user || (user.role !== "client" && user.role !== "client_employee")) return null

  const client = user.clientId ? mockClients.find((c) => c.id === user.clientId) : undefined
  const clientName = client?.trade_name || client?.company_name || ""

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={user.role as "client" | "client_employee"} clientName={clientName} userName={user.name ?? ""} />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 pt-16 lg:p-8 max-w-screen-2xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
