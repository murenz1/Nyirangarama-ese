import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://nyirangarama-backend.vercel.app/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => null)
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[Proxy] Signup Error:', error)
    return NextResponse.json({ error: 'Failed to signup' }, { status: 500 })
  }
}
