import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyUser } from '@/lib/auth'

const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 1 day

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Correo y contraseña requeridos' }, { status: 400 })
    }

    const user = await verifyUser(email, password)

    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const cookieStore = await cookies()
    
    cookieStore.set(COOKIE_NAME, JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/'
    })

    return NextResponse.json({ success: true, user })
  } catch (err) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}