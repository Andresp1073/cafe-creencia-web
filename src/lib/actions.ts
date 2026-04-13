'use server'

import { prisma } from '@/lib/prisma'
import { Category, Presentation } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createProductAction(formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const category = formData.get('category') as Category
  const presentation = formData.get('presentation') as Presentation
  const weight_grams = parseInt(formData.get('weight_grams') as string)
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)
  const min_stock = parseInt(formData.get('min_stock') as string)
  const description = formData.get('description') as string
  const image_url = formData.get('image_url') as string
  const is_active = formData.get('is_active') === 'on'

  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) {
    return { error: 'Ya existe un producto con este slug' }
  }

  await prisma.product.create({
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

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')
  return { success: true }
}

export async function updateProductAction(id: number, formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
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