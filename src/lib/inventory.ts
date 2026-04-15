import { prisma } from './prisma'
import { MovementType } from '@prisma/client'

export async function getInventoryWithProducts() {
  return prisma.product.findMany({
    orderBy: { name: 'asc' },
    include: {
      inventoryMovements: {
        orderBy: { created_at: 'desc' },
        take: 1,
      }
    }
  })
}

export async function getAllMovements() {
  return prisma.inventoryMovement.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      product: true
    }
  })
}

export async function getMovementsByProduct(productId: number) {
  return prisma.inventoryMovement.findMany({
    where: { product_id: productId },
    orderBy: { created_at: 'desc' },
    include: {
      product: true
    }
  })
}

export interface CreateMovementData {
  product_id: number
  type: MovementType
  quantity: number
  reason?: string
}

export async function registerInventoryMovement(data: CreateMovementData) {
  const { product_id, type, quantity, reason } = data

  if (quantity <= 0) {
    throw new Error('La cantidad debe ser mayor a 0')
  }

  if (!reason || reason.trim() === '') {
    throw new Error('El motivo es obligatorio')
  }

  const product = await prisma.product.findUnique({
    where: { id: product_id }
  })

  if (!product) {
    throw new Error('Producto no encontrado')
  }

  if (type === 'SALIDA' && product.stock < quantity) {
    throw new Error(`Stock insuficiente. Stock actual: ${product.stock}`)
  }

  const result = await prisma.$transaction(async (tx) => {
    const movement = await tx.inventoryMovement.create({
      data: {
        product_id,
        type,
        quantity,
        reason,
      }
    })

    if (type === 'ENTRADA') {
      await tx.product.update({
        where: { id: product_id },
        data: { stock: { increment: quantity } }
      })
    } else {
      await tx.product.update({
        where: { id: product_id },
        data: { stock: { decrement: quantity } }
      })
    }

    return movement
  })

  return result
}