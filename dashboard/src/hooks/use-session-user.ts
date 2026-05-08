"use client"
import { useSyncExternalStore } from "react"

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {}
  window.addEventListener("storage", cb)
  return () => window.removeEventListener("storage", cb)
}

function getSnapshot() {
  if (typeof window === "undefined") return ""
  return sessionStorage.getItem("user") ?? ""
}

function getServerSnapshot() {
  return ""
}

export type SessionUser = {
  id?: string
  email?: string
  name?: string
  role?: string
  clientId?: string
  permissions?: string[]
  member_role?: string
  assigned_clients?: string[]
}

export function useSessionUser(): { user: SessionUser | null; loaded: boolean } {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const loaded = typeof window !== "undefined"
  if (!raw) return { user: null, loaded }
  try {
    return { user: JSON.parse(raw) as SessionUser, loaded }
  } catch {
    return { user: null, loaded }
  }
}
