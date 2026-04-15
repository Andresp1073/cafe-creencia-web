import { prisma } from './prisma'

export async function verifyUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return null
  }

  const isValid = password === user.password

  if (!isValid) {
    return null
  }

  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id }
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  })
}

export async function createUser(name: string, email: string, password: string, role?: 'ADMIN' | 'EMPLEADO') {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
      role: role || 'EMPLEADO'
    }
  })
}

export async function getCurrentUser() {
  const cookieStore = await import('next/headers').then(m => m.cookies())
  const sessionCookie = cookieStore.get('admin_session')
  
  if (!sessionCookie) {
    return null
  }
  
  try {
    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}