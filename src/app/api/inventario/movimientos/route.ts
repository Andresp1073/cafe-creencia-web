import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const movements = await prisma.inventoryMovement.findMany({
      orderBy: { created_at: 'desc' },
      take: 100,
      include: {
        product: true
      }
    })
    return NextResponse.json(movements)
  } catch (err) {
    return NextResponse.json({ error: 'Error loading movements' }, { status: 500 })
  }
}