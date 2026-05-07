"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Members now use the admin layout/pages — redirect to /admin
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const user = JSON.parse(userData)
    if (user.role === "member") {
      router.replace("/admin")
    }
  }, [router])

  return <>{children}</>
}
