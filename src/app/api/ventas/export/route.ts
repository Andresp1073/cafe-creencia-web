import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { startDate, endDate } = body

    const where: any = {}
    
    if (startDate && endDate) {
      where.created_at = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const sales = await prisma.sale.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        saleItems: {
          include: {
            product: true
          }
        }
      }
    })

    const rows = [
      ['Fecha', 'Cliente', 'Teléfono', 'Total', 'Productos']
    ]

    for (const sale of sales) {
      const products = sale.saleItems
        .map(item => `${item.product.name} (x${item.quantity})`)
        .join(', ')
      
      rows.push([
        new Date(sale.created_at).toLocaleString('es-CO'),
        sale.customer_name || '',
        sale.customer_phone || '',
        Number(sale.total).toString(),
        products
      ])
    }

    const csv = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const buffer = await blob.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="ventas-${startDate || 'all'}-${endDate || 'all'}.csv"`
      }
    })
  } catch (err) {
    return NextResponse.json({ error: 'Error exporting sales' }, { status: 500 })
  }
}