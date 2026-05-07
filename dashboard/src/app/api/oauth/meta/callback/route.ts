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
      console.error("[meta/callback] Supabase upsert error:", error.message)
      return false
    }
    return true
  } catch (err) {
    console.error("[meta/callback] Supabase unexpected error:", err)
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

  let state: { clientId: string; provider: string }
  try {
    state = JSON.parse(atob(stateRaw))
  } catch {
    return NextResponse.redirect(`${appUrl}/admin/clients?oauth_error=invalid_state`)
  }

  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET

  if (!appId || !appSecret) {
    // Demo mode: redirect back with mock success (no token in URL)
    const redirectParams = new URLSearchParams({
      tab: "integrations",
      oauth_success: "1",
      provider: state.provider,
      account_name: "Demo Account (sem credenciais reais)",
      account_id: "demo_act_000000",
    })
    return NextResponse.redirect(`${appUrl}/admin/clients/${state.clientId}?${redirectParams}`)
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
        new URLSearchParams({
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: `${appUrl}/api/oauth/meta/callback`,
          code,
        })
    )
    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      throw new Error(tokenData.error.message)
    }

    const accessToken: string = tokenData.access_token
    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      : null

    // Fetch ad accounts for this token
    const accountsRes = await fetch(
      `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_status&access_token=${accessToken}`
    )
    const accountsData = await accountsRes.json()
    const firstAccount = accountsData.data?.[0]
    const accountId: string = firstAccount?.id || ""
    const accountName: string = firstAccount?.name || "Meta Ads"

    // Attempt to save to Supabase
    const saved = await saveTokenToSupabase({
      client_id: state.clientId,
      provider: state.provider,
      access_token: accessToken,
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
        account_id: accountId,
        account_name: accountName,
        ...(expiresAt ? { expires_at: expiresAt } : {}),
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
