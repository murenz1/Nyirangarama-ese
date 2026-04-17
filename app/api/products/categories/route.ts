import { NextResponse } from 'next/server'

const BACKEND_URL = 'https://nyirangarama-backend.vercel.app/api'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/products/categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json().catch(() => null)
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[Proxy] Categories Error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
