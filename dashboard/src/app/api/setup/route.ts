import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const SETUP_SECRET = process.env.SETUP_SECRET ?? "trafficdash-setup-2024"

const demoUsers = [
  { email: "admin@agencia.com", password: "Admin@2024", full_name: "Administrador", role: "admin" },
  { email: "maria@agencia.com", password: "Maria@2024", full_name: "Maria Oliveira", role: "member" },
  { email: "joao@agencia.com", password: "Joao@2024", full_name: "João Silva", role: "member" },
  { email: "cliente@clinica.com", password: "Cliente@2024", full_name: "Dr. Carlos Lima", role: "client", client_id: "client-1" },
]

export async function POST(req: Request) {
  const { secret } = await req.json().catch(() => ({ secret: "" }))

  if (secret !== SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Supabase env vars not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Vercel." },
      { status: 500 }
    )
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const results: { email: string; status: string; error?: string }[] = []

  for (const u of demoUsers) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.full_name },
    })

    if (error && error.message.includes("already been registered")) {
      results.push({ email: u.email, status: "already_exists" })
      continue
    }

    if (error) {
      results.push({ email: u.email, status: "error", error: error.message })
      continue
    }

    const { error: profileError } = await supabase.from("user_profiles").upsert({
      id: data.user.id,
      email: u.email,
      full_name: u.full_name,
      role: u.role,
      ...(u.client_id ? { client_id: u.client_id } : {}),
    })

    results.push({
      email: u.email,
      status: profileError ? `created (profile error: ${profileError.message})` : "created",
    })
  }

  return NextResponse.json({ ok: true, results })
}
