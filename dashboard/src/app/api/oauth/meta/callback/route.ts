import { NextRequest, NextResponse } from "next/server"

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
    // Demo mode: redirect back with mock success
    const params = new URLSearchParams({
      oauth_success: "1",
      provider: state.provider,
      client_id: state.clientId,
      account_id: "demo_act_000000",
      account_name: "Demo Account (sem credenciais reais)",
    })
    return NextResponse.redirect(`${appUrl}/admin/clients/${state.clientId}?tab=integrations&${params}`)
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

    const accessToken = tokenData.access_token

    // Fetch ad accounts for this token
    const accountsRes = await fetch(
      `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_status&access_token=${accessToken}`
    )
    const accountsData = await accountsRes.json()
    const firstAccount = accountsData.data?.[0]

    // Pass token data back to client via URL params (client will store in localStorage)
    const params = new URLSearchParams({
      oauth_success: "1",
      provider: state.provider,
      client_id: state.clientId,
      access_token: accessToken,
      account_id: firstAccount?.id || "",
      account_name: firstAccount?.name || "Meta Ads",
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
    })

    return NextResponse.redirect(`${appUrl}/admin/clients/${state.clientId}?tab=integrations&${params}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error"
    return NextResponse.redirect(`${appUrl}/admin/clients/${state.clientId}?tab=integrations&oauth_error=${encodeURIComponent(msg)}`)
  }
}
