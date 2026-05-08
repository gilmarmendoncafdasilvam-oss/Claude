"use client"
import { useSyncExternalStore } from "react"

const SUBSCRIBERS = new Set<() => void>()

function subscribe(callback: () => void) {
  SUBSCRIBERS.add(callback)
  const onStorage = () => callback()
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage)
  }
  return () => {
    SUBSCRIBERS.delete(callback)
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage)
    }
  }
}

function getSnapshot() {
  if (typeof window === "undefined") return ""
  return sessionStorage.getItem("user") ?? ""
}

function getServerSnapshot() {
  return ""
}

type SessionUser = {
  permissions?: string[]
  role?: string
  member_role?: string
  assigned_clients?: string[]
}

export function usePermissions() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const user: SessionUser | null = raw ? safeParse(raw) : null
  const userRole = user?.role ?? ""
  const permissions = user?.permissions ?? []
  const loaded = typeof window !== "undefined"

  const can = (permission: string): boolean => {
    if (userRole === "admin") return true
    return permissions.includes(permission)
  }

  return { can, permissions, userRole, loaded }
}

function safeParse(s: string): SessionUser | null {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}
