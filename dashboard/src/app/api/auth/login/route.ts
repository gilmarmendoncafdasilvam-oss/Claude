import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Mirror of DEMO_USERS from login/page.tsx — used as fallback in demo mode
const DEMO_USERS = [
  { email: "admin@agencia.com", password: "admin123", role: "admin", name: "Admin Agência" },
  { email: "maria@agencia.com", password: "membro123", role: "member", name: "Maria Santos" },
  { email: "joao@agencia.com", password: "membro123", role: "member", name: "João Ferreira" },
  {
    email: "carlos@saudetotal.com.br",
    password: "cliente123",
    role: "client",
    name: "Dr. Carlos Mendes",
    clientId: "c1",
  },
  {
    email: "ana@corpoemforma.com.br",
    password: "cliente123",
    role: "client",
    name: "Ana Lima",
    clientId: "c2",
  },
] as const

type DemoUser = (typeof DEMO_USERS)[number]

function isPlaceholder(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  return url.includes("placeholder") || url === ""
}

function demoLogin(email: string, password: string): DemoUser | null {
  return (
    (DEMO_USERS as readonly DemoUser[]).find(
      (u) => u.email === email && u.password === password
    ) ?? null
  )
}

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const email = (body.email ?? "").trim().toLowerCase()
  const password = body.password ?? ""

  if (!email || !password) {
    return NextResponse.json({ error: "email_and_password_required" }, { status: 400 })
  }

  // --- Demo / placeholder mode ---
  if (isPlaceholder()) {
    const demo = demoLogin(email, password)
    if (!demo) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 })
    }
    const user = {
      id: `demo-${demo.email}`,
      email: demo.email,
      name: demo.name,
      role: demo.role,
      ...("clientId" in demo ? { client_id: demo.clientId } : {}),
    }
    return NextResponse.json({ user, session: null, demo: true })
  }

  // --- Real Supabase auth ---
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (!error && data.user) {
      return NextResponse.json({ user: data.user, session: data.session })
    }

    // Supabase auth failed — try demo fallback (covers dev environments where
    // demo users are not in auth.users yet)
    const demo = demoLogin(email, password)
    if (demo) {
      const user = {
        id: `demo-${demo.email}`,
        email: demo.email,
        name: demo.name,
        role: demo.role,
        ...("clientId" in demo ? { client_id: demo.clientId } : {}),
      }
      return NextResponse.json({ user, session: null, demo: true })
    }

    return NextResponse.json(
      { error: error?.message ?? "invalid_credentials" },
      { status: 401 }
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error"
    console.error("[auth/login] Unexpected error:", msg)

    // Last-resort demo fallback if Supabase is offline
    const demo = demoLogin(email, password)
    if (demo) {
      const user = {
        id: `demo-${demo.email}`,
        email: demo.email,
        name: demo.name,
        role: demo.role,
        ...("clientId" in demo ? { client_id: demo.clientId } : {}),
      }
      return NextResponse.json({ user, session: null, demo: true })
    }

    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
