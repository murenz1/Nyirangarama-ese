import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://nyirangarama-backend.vercel.app/api'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = `${BACKEND_URL}/orders?${searchParams.toString()}`

  try {
    const token = request.headers.get('authorization') || ''
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    })

    const data = await response.json().catch(() => null)
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[Proxy] Orders Error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization') || ''
    const response = await fetch(`${BACKEND_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => null)
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[Proxy] Create Order Error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
