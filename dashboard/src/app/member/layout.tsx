"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { useSessionUser } from "@/hooks/use-session-user"

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loaded } = useSessionUser()

  useEffect(() => {
    if (!loaded) return
    if (!user) {
      router.push("/login")
    } else if (user.role !== "member") {
      if (user.role === "admin") router.push("/admin")
      else router.push("/client/dashboard")
    }
  }, [user, loaded, router])

  if (!loaded || !user || user.role !== "member") return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="member" userName={user.name ?? ""} />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 pt-16 lg:p-8 max-w-screen-2xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
