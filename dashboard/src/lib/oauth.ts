/**
 * OAuth token storage and retrieval.
 * Uses Supabase when configured, falls back to localStorage in demo mode.
 */

export interface OAuthToken {
  provider: string
  client_id: string
  access_token: string
  refresh_token?: string
  expires_at?: string
  account_id?: string
  account_name?: string
  scope?: string
  connected_at: string
}

const STORAGE_KEY = "trafficdash_oauth_tokens"

function getLocalTokens(): OAuthToken[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

function saveLocalTokens(tokens: OAuthToken[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
}

export function getToken(clientId: string, provider: string): OAuthToken | null {
  const tokens = getLocalTokens()
  return tokens.find((t) => t.client_id === clientId && t.provider === provider) ?? null
}

export function saveToken(token: OAuthToken) {
  const tokens = getLocalTokens().filter(
    (t) => !(t.client_id === token.client_id && t.provider === token.provider)
  )
  saveLocalTokens([...tokens, token])
}

export function removeToken(clientId: string, provider: string) {
  const tokens = getLocalTokens().filter(
    (t) => !(t.client_id === clientId && t.provider === provider)
  )
  saveLocalTokens(tokens)
}

export function getAllTokensForClient(clientId: string): Record<string, OAuthToken> {
  const tokens = getLocalTokens().filter((t) => t.client_id === clientId)
  return Object.fromEntries(tokens.map((t) => [t.provider, t]))
}

// Build OAuth authorization URL for each provider
export function buildMetaOAuthUrl(clientId: string, appUrl: string): string {
  const state = btoa(JSON.stringify({ clientId, provider: "meta", ts: Date.now() }))
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_META_APP_ID || "",
    redirect_uri: `${appUrl}/api/oauth/meta/callback`,
    scope: "ads_read,ads_management,business_management,pages_read_engagement",
    response_type: "code",
    state,
  })
  return `https://www.facebook.com/v18.0/dialog/oauth?${params}`
}

export function buildGoogleOAuthUrl(clientId: string, appUrl: string, scope: "ads" | "ga4" | "both" = "both"): string {
  const state = btoa(JSON.stringify({ clientId, provider: "google", scope, ts: Date.now() }))
  const scopes = [
    scope !== "ga4" && "https://www.googleapis.com/auth/adwords",
    scope !== "ads" && "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
  ].filter(Boolean).join(" ")

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    redirect_uri: `${appUrl}/api/oauth/google/callback`,
    scope: scopes,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    state,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export function buildWhatsAppOAuthUrl(clientId: string, appUrl: string): string {
  // WhatsApp Business uses the same Meta App OAuth
  const state = btoa(JSON.stringify({ clientId, provider: "whatsapp", ts: Date.now() }))
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_META_APP_ID || "",
    redirect_uri: `${appUrl}/api/oauth/meta/callback`,
    scope: "whatsapp_business_management,whatsapp_business_messaging",
    response_type: "code",
    state,
  })
  return `https://www.facebook.com/v18.0/dialog/oauth?${params}`
}
