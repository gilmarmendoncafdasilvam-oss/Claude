export interface OAuthTokenRow {
  id: string
  client_id: string
  provider: string
  access_token: string | null
  refresh_token: string | null
  expires_at: string | null
  account_id: string | null
  account_name: string | null
  scope: string | null
  connected: boolean
  connected_at: string
  updated_at: string
}

export interface UserProfileRow {
  id: string
  name: string | null
  role: string
  member_role: string | null
  permissions: string[]
  client_id: string | null
  created_at: string
}
