import { Category, Presentation } from '@prisma/client'

export const CATEGORIES = ['TRADICIONAL', 'MENTA_LIMONCILLO', 'EN_GRANO'] as const
export const PRESENTATIONS = ['G500', 'G250', 'G125'] as const

export const CATEGORY_LABELS: Record<Category, string> = {
  TRADICIONAL: 'Café Tradicional',
  MENTA_LIMONCILLO: 'Café Menta Limoncillo',
  EN_GRANO: 'Café en Grano'
}

export const PRESENTATION_LABELS: Record<Presentation, string> = {
  G500: '500g',
  G250: '250g',
  G125: '125g'
}

export interface ProductFormData {
  name: string
  slug: string
  category: Category
  presentation: Presentation
  weight_grams: number
  price: number
  stock: number
  min_stock: number
  description: string
  image_url: string
  is_active: boolean
}

export interface ValidationError {
  field: string
  message: string
}

export function validateProduct(data: ProductFormData, excludeId?: number): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (!data.name || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'El nombre es obligatorio' })
  }
  
  if (!data.slug || data.slug.trim() === '') {
    errors.push({ field: 'slug', message: 'El slug es obligatorio' })
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push({ field: 'slug', message: 'El slug solo puede contener letras minúsculas, números y guiones' })
  }
  
  if (!CATEGORIES.includes(data.category)) {
    errors.push({ field: 'category', message: 'Categoría inválida' })
  }
  
  if (!PRESENTATIONS.includes(data.presentation)) {
    errors.push({ field: 'presentation', message: 'Presentación inválida' })
  }
  
  if (!data.weight_grams || data.weight_grams <= 0) {
    errors.push({ field: 'weight_grams', message: 'El peso debe ser mayor a 0' })
  }
  
  if (data.price === undefined || data.price < 0) {
    errors.push({ field: 'price', message: 'El precio debe ser válido' })
  }
  
  if (data.stock === undefined || data.stock < 0) {
    errors.push({ field: 'stock', message: 'El stock no puede ser negativo' })
  }
  
  if (data.min_stock === undefined || data.min_stock < 0) {
    errors.push({ field: 'min_stock', message: 'El stock mínimo no puede ser negativo' })
  }
  
  if (!data.description || data.description.trim() === '') {
    errors.push({ field: 'description', message: 'La descripción es obligatoria' })
  }
  
  return errors
}

export function generateSlug(name: string): string {
  if (!name || name.trim() === '') return ''
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function cleanSlug(slug: string): string {
  return slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
}