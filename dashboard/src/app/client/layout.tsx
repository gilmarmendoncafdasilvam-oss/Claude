"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { mockClients } from "@/lib/mock-data"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [clientName, setClientName] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const user = JSON.parse(userData)
    if (user.role !== "client") {
      router.push("/admin")
      return
    }
    setUserName(user.name)
    if (user.clientId) {
      const client = mockClients.find((c) => c.id === user.clientId)
      setClientName(client?.trade_name || client?.company_name || "")
    }
  }, [router])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="client" clientName={clientName} userName={userName} />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
