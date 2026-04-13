import { prisma } from './prisma'
import { Product, Category, Presentation } from '@prisma/client'

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

export async function getProductsByCategory(category: Category): Promise<ProductWithDetails[]> {
  return prisma.product.findMany({
    where: { is_active: true, category },
    orderBy: { name: 'asc' }
  }) as Promise<ProductWithDetails[]>
}