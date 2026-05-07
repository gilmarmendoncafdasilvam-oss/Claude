import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

function isPlaceholder(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  return url.includes("placeholder") || url === ""
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params

  if (isPlaceholder()) {
    return NextResponse.json({ tokens: [], clientId })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("oauth_tokens")
      .select("*")
      .eq("client_id", clientId)

    if (error) {
      console.error("[integrations GET] Supabase error:", error.message)
      return NextResponse.json({ tokens: [], clientId, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ tokens: data ?? [], clientId })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error"
    console.error("[integrations GET] Unexpected error:", msg)
    return NextResponse.json({ tokens: [], clientId, error: msg }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 })
  }

  if (isPlaceholder()) {
    return NextResponse.json({ ok: true, clientId, saved: body })
  }

  try {
    const supabase = createAdminClient()
    const row = { ...body, client_id: clientId }
    const { data, error } = await supabase
      .from("oauth_tokens")
      .upsert(row, { onConflict: "client_id,provider" })
      .select()
      .single()

    if (error) {
      console.error("[integrations POST] Supabase error:", error.message)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, clientId, saved: data })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error"
    console.error("[integrations POST] Unexpected error:", msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  const { searchParams } = new URL(request.url)
  const provider = searchParams.get("provider")

  if (!provider) {
    return NextResponse.json({ ok: false, error: "provider_required" }, { status: 400 })
  }

  if (isPlaceholder()) {
    return NextResponse.json({ ok: true, clientId, provider, disconnected: true })
  }

  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from("oauth_tokens")
      .update({ connected: false })
      .eq("client_id", clientId)
      .eq("provider", provider)

    if (error) {
      console.error("[integrations DELETE] Supabase error:", error.message)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, clientId, provider, disconnected: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error"
    console.error("[integrations DELETE] Unexpected error:", msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
