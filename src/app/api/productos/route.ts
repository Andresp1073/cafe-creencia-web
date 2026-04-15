import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(products)
  } catch (err) {
    return NextResponse.json({ error: 'Error loading products' }, { status: 500 })
  }
}