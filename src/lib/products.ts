import { prisma } from './prisma'
import { Category, Presentation, Product } from '@prisma/client'

export interface ProductWithDetails extends Product {
  category: Category
  presentation: Presentation
}

export async function getActiveProducts(): Promise<ProductWithDetails[]> {
  return prisma.product.findMany({
    where: { is_active: true },
    orderBy: { name: 'asc' }
  }) as Promise<ProductWithDetails[]>
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  return prisma.product.findUnique({
    where: { slug }
  }) as Promise<ProductWithDetails | null>
}

export async function getProductById(id: number): Promise<ProductWithDetails | null> {
  return prisma.product.findUnique({
    where: { id }
  }) as Promise<ProductWithDetails | null>
}

export async function getProductsByCategory(category: Category): Promise<ProductWithDetails[]> {
  return prisma.product.findMany({
    where: { is_active: true, category },
    orderBy: { name: 'asc' }
  }) as Promise<ProductWithDetails[]>
}

export async function getAllProducts(): Promise<ProductWithDetails[]> {
  return prisma.product.findMany({
    orderBy: { name: 'asc' }
  }) as Promise<ProductWithDetails[]>
}

export interface CreateProductData {
  name: string
  slug: string
  category: Category
  presentation: Presentation
  weight_grams: number
  price: number
  stock: number
  min_stock: number
  description?: string
  image_url?: string
  is_active?: boolean
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      category: data.category,
      presentation: data.presentation,
      weight_grams: data.weight_grams,
      price: data.price,
      stock: data.stock,
      min_stock: data.min_stock,
      description: data.description || '',
      image_url: data.image_url || '/products/default.svg',
      is_active: data.is_active ?? true,
    }
  })
}

export interface UpdateProductData {
  name?: string
  slug?: string
  category?: Category
  presentation?: Presentation
  weight_grams?: number
  price?: number
  stock?: number
  min_stock?: number
  description?: string
  image_url?: string
  is_active?: boolean
}

export async function updateProduct(id: number, data: UpdateProductData): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data
  })
}

export async function toggleProductStatus(id: number): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { id }
  })
  
  if (!product) {
    throw new Error('Producto no encontrado')
  }
  
  return prisma.product.update({
    where: { id },
    data: { is_active: !product.is_active }
  })
}

export async function deleteProduct(id: number): Promise<void> {
  await prisma.product.delete({
    where: { id }
  })
}

export async function checkSlugExists(slug: string, excludeId?: number): Promise<boolean> {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      ...(excludeId ? { id: { not: excludeId } } : {})
    }
  })
  return !!product
}