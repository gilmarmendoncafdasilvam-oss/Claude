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

  let state: { clientId: string; provider: string; scope: string }
  try {
    state = JSON.parse(atob(stateRaw))
  } catch {
    return NextResponse.redirect(`${appUrl}/admin/clients?oauth_error=invalid_state`)
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    const params = new URLSearchParams({
      oauth_success: "1",
      provider: state.provider,
      client_id: state.clientId,
      account_id: "demo_123-456-7890",
      account_name: "Demo Account (sem credenciais reais)",
    })
    return NextResponse.redirect(`${appUrl}/admin/clients/${state.clientId}?tab=integrations&${params}`)
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${appUrl}/api/oauth/google/callback`,
        grant_type: "authorization_code",
      }),
    })
    const tokenData = await tokenRes.json()

    if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error)

    const accessToken = tokenData.access_token
    const refreshToken = tokenData.refresh_token
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString()

    // Get user info to identify the account
    const userRes = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
    const userData = await userRes.json()

    const params = new URLSearchParams({
      oauth_success: "1",
      provider: state.provider,
      client_id: state.clientId,
      access_token: accessToken,
      refresh_token: refreshToken || "",
      expires_at: expiresAt,
      account_id: userData.email || "",
      account_name: userData.name || userData.email || "Google Account",
    })

    return NextResponse.redirect(`${appUrl}/admin/clients/${state.clientId}?tab=integrations&${params}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error"
    return NextResponse.redirect(`${appUrl}/admin/clients/${state.clientId}?tab=integrations&oauth_error=${encodeURIComponent(msg)}`)
  }
}
