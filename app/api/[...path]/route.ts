import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://nyirangarama-backend.vercel.app/api'

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/')
  const searchParams = request.nextUrl.searchParams
  const url = `${BACKEND_URL}/${path}?${searchParams.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json().catch(() => null)
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[Proxy] GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch from backend' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/')
  const url = `${BACKEND_URL}/${path}`

  try {
    const body = await request.json().catch(() => ({}))
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => null)
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[Proxy] POST Error:', error)
    return NextResponse.json({ error: 'Failed to fetch from backend' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/')
  const url = `${BACKEND_URL}/${path}`

  try {
    const body = await request.json().catch(() => ({}))
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => null)
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[Proxy] PUT Error:', error)
    return NextResponse.json({ error: 'Failed to fetch from backend' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/')
  const url = `${BACKEND_URL}/${path}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json().catch(() => null)
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[Proxy] DELETE Error:', error)
    return NextResponse.json({ error: 'Failed to fetch from backend' }, { status: 500 })
  }
}
