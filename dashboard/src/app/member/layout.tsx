"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const user = JSON.parse(userData)
    if (user.role !== "member") {
      if (user.role === "admin") router.push("/admin")
      else router.push("/client/dashboard")
      return
    }
    setUserName(user.name)
  }, [router])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="member" userName={userName} />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 pt-16 lg:p-8 max-w-screen-2xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
