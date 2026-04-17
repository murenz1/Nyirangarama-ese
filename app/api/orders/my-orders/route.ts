import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://nyirangarama-backend.vercel.app/api'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization') || ''
    const response = await fetch(`${BACKEND_URL}/orders/my-orders`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })

    const data = await response.json().catch(() => null)
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[Proxy] My Orders Error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
