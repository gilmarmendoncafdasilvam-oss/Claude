"use client"
import { useEffect, useState } from "react"

export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([])
  const [userRole, setUserRole] = useState<string>("")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem("user")
      if (userData) {
        const user = JSON.parse(userData)
        setPermissions(user.permissions || [])
        setUserRole(user.role || "")
      }
      setLoaded(true)
    }
  }, [])

  const can = (permission: string): boolean => {
    if (userRole === "admin") return true
    return permissions.includes(permission)
  }

  return { can, permissions, userRole, loaded }
}
