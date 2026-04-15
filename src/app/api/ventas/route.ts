import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerName, customerPhone, items } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'La venta no tiene productos' }, { status: 400 })
    }

    let total = 0
    const saleItemsData = []

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) {
        return NextResponse.json({ error: `Producto no encontrado: ${item.productId}` }, { status: 400 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Stock insuficiente para ${product.name}. Stock actual: ${product.stock}` 
        }, { status: 400 })
      }
      const subtotal = item.quantity * item.unitPrice
      total += subtotal
      saleItemsData.push({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal,
      })
    }

    const sale = await prisma.sale.create({
      data: {
        customer_name: customerName,
        customer_phone: customerPhone,
        total,
        saleItems: {
          create: saleItemsData,
        },
      },
      include: {
        saleItems: {
          include: {
            product: true
          }
        },
      },
    })

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    return NextResponse.json({ success: true, sale })
  } catch (err) {
    console.error('Error registering sale:', err)
    return NextResponse.json({ error: 'Error al registrar la venta' }, { status: 500 })
  }
}