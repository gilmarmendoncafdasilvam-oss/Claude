import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

function isPlaceholder(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  return url.includes("placeholder") || url === ""
}

async function saveTokenToSupabase(row: {
  client_id: string
  provider: string
  access_token: string
  refresh_token: string | null
  account_id: string
  account_name: string
  expires_at: string | null
}): Promise<boolean> {
  if (isPlaceholder()) return false
  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from("oauth_tokens")
      .upsert({ ...row, connected: true }, { onConflict: "client_id,provider" })
    if (error) {
      console.error("[google/callback] Supabase upsert error:", error.message)
      return false
    }
    return true
  } catch (err) {
    console.error("[google/callback] Supabase unexpected error:", err)
    return false
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const stateRaw = searchParams.get("state")
  const error = searchParams.get("error")
  const appUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  if (error) {
    return NextResponse.redirect(`${appUrl}/admin/clients?oauth_error=${error}`)
  }

  if (!code || !stateRaw) {
    return NextResponse.redirect(`${appUrl}/admin/clients?oauth_error=missing_params`)
  }

  let state: { clientId: string; provider: string; scope: string }
  try {
    state = JSON.parse(atob(stateRaw))
  } catch {
    return NextResponse.redirect(`${appUrl}/admin/clients?oauth_error=invalid_state`)
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!googleClientId || !googleClientSecret) {
    // Demo mode: redirect with mock success (no token in URL)
    const redirectParams = new URLSearchParams({
      tab: "integrations",
      oauth_success: "1",
      provider: state.provider,
      account_name: "Demo Account (sem credenciais reais)",
      account_id: "demo_123-456-7890",
    })
    return NextResponse.redirect(`${appUrl}/admin/clients/${state.clientId}?${redirectParams}`)
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: `${appUrl}/api/oauth/google/callback`,
        grant_type: "authorization_code",
      }),
    })
    const tokenData = await tokenRes.json()

    if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error)

    const accessToken: string = tokenData.access_token
    const refreshToken: string | null = tokenData.refresh_token || null
    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      : null

    // Get user info to identify the account
    const userRes = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    )
    const userData = await userRes.json()
    const accountId: string = userData.email || ""
    const accountName: string = userData.name || userData.email || "Google Account"

    // Attempt to save to Supabase
    const saved = await saveTokenToSupabase({
      client_id: state.clientId,
      provider: state.provider,
      access_token: accessToken,
      refresh_token: refreshToken,
      account_id: accountId,
      account_name: accountName,
      expires_at: expiresAt,
    })

    if (saved) {
      // Token is in DB — do NOT include it in the URL
      const redirectParams = new URLSearchParams({
        tab: "integrations",
        oauth_success: "1",
        provider: state.provider,
        account_name: accountName,
        account_id: accountId,
      })
      return NextResponse.redirect(`${appUrl}/admin/clients/${state.clientId}?${redirectParams}`)
    } else {
      // Supabase unavailable — fall back to URL params approach
      const redirectParams = new URLSearchParams({
        tab: "integrations",
        oauth_success: "1",
        provider: state.provider,
        client_id: state.clientId,
        access_token: accessToken,
        refresh_token: refreshToken || "",
        ...(expiresAt ? { expires_at: expiresAt } : {}),
        account_id: accountId,
        account_name: accountName,
      })
      return NextResponse.redirect(`${appUrl}/admin/clients/${state.clientId}?${redirectParams}`)
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error"
    return NextResponse.redirect(
      `${appUrl}/admin/clients/${state.clientId}?tab=integrations&oauth_error=${encodeURIComponent(msg)}`
    )
  }
}
