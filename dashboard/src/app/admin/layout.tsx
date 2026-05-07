"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [userName, setUserName] = useState("")

  const [userRole, setUserRole] = useState<"admin" | "member">("admin")

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const user = JSON.parse(userData)
    if (user.role === "client") {
      router.push("/client/dashboard")
      return
    }
    if (user.role !== "admin" && user.role !== "member") {
      router.push("/login")
      return
    }
    setUserName(user.name)
    setUserRole(user.role)
  }, [router])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={userRole} userName={userName} />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 pt-16 lg:p-8 max-w-screen-2xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
