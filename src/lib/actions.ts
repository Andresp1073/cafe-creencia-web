'use server'

import { prisma } from '@/lib/prisma'
import { Category, Presentation } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { cleanSlug } from './validations'
import { decrementStock, getActiveProductsSimple } from './products'

export async function createProductAction(formData: FormData) {
  const name = formData.get('name') as string
  const rawSlug = formData.get('slug') as string
  const slug = cleanSlug(rawSlug)
  const category = formData.get('category') as Category
  const presentation = formData.get('presentation') as Presentation
  const weight_grams = parseInt(formData.get('weight_grams') as string)
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)
  const min_stock = parseInt(formData.get('min_stock') as string)
  const description = formData.get('description') as string
  const image_url = formData.get('image_url') as string
  const is_active = formData.get('is_active') === 'on'

  if (!slug) {
    return { error: 'El slug no puede estar vacío' }
  }

  console.log('Creating product:', { name, slug, category, presentation, weight_grams, price, stock, min_stock, is_active })

  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) {
    return { error: 'Ya existe un producto con este slug' }
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        category,
        presentation,
        weight_grams,
        price,
        stock,
        min_stock,
        description,
        image_url: image_url || '/products/default.svg',
        is_active,
      }
    })
    console.log('Product created successfully:', product)
  } catch (err) {
    console.error('Error creating product:', err)
    return { error: 'Error al crear el producto: ' + String(err) }
  }

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')
  return { success: true }
}

export async function updateProductAction(id: number, formData: FormData) {
  const name = formData.get('name') as string
  const rawSlug = formData.get('slug') as string
  const slug = cleanSlug(rawSlug)
  const category = formData.get('category') as Category
  const presentation = formData.get('presentation') as Presentation
  const weight_grams = parseInt(formData.get('weight_grams') as string)
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)
  const min_stock = parseInt(formData.get('min_stock') as string)
  const description = formData.get('description') as string
  const image_url = formData.get('image_url') as string
  const is_active = formData.get('is_active') === 'on'

  const existing = await prisma.product.findFirst({
    where: { slug, id: { not: id } }
  })
  if (existing) {
    return { error: 'Ya existe un producto con este slug' }
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      category,
      presentation,
      weight_grams,
      price,
      stock,
      min_stock,
      description,
      image_url,
      is_active,
    }
  })

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')
  return { success: true }
}

export async function toggleProductStatusAction(id: number) {
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) {
    return { error: 'Producto no encontrado' }
  }

  await prisma.product.update({
    where: { id },
    data: { is_active: !product.is_active }
  })

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')
  return { success: true }
}

export async function getProductsForSale() {
  try {
    const products = await getActiveProductsSimple()
    return { success: true, products }
  } catch (err) {
    console.error('Error getting products:', err)
    return { error: 'Error al cargar productos', products: [] }
  }
}

export async function registerSale(
  customerName: string | null,
  customerPhone: string | null,
  items: { productId: number; quantity: number; unitPrice: number }[]
) {
  if (items.length === 0) {
    return { error: 'La venta no tiene productos' }
  }

  let total = 0
  const saleItemsData = []

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } })
    if (!product) {
      return { error: `Producto no encontrado: ${item.productId}` }
    }
    if (product.stock < item.quantity) {
      return { error: `Stock insuficiente para ${product.name}. Stock actual: ${product.stock}` }
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
      saleItems: true,
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

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')
  return { success: true, sale }
}