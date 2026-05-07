import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  // In production: query Supabase oauth_tokens table for this clientId
  return NextResponse.json({ tokens: [], clientId })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  const body = await request.json()
  // In production: upsert into Supabase oauth_tokens table
  return NextResponse.json({ ok: true, clientId, saved: body })
}
