import { describe, it, expect } from 'vitest'
import { generateSlug, cleanSlug, validateProduct } from './validations'
import { Category, Presentation } from '@prisma/client'

describe('generateSlug', () => {
  it('should generate slug from name', () => {
    expect(generateSlug('Café Tradicional')).toBe('cafe-tradicional')
  })

  it('should return empty string for empty name', () => {
    expect(generateSlug('')).toBe('')
    expect(generateSlug('   ')).toBe('')
  })

  it('should remove special characters', () => {
    expect(generateSlug('Café @#$%')).toBe('cafe')
  })

  it('should replace spaces with hyphens', () => {
    expect(generateSlug('Cafe Test')).toBe('cafe-test')
  })

  it('should remove leading/trailing hyphens', () => {
    expect(generateSlug('  Cafe  ')).toBe('cafe')
  })
})

describe('cleanSlug', () => {
  it('should clean slug properly', () => {
    expect(cleanSlug('Cafe Test 123')).toBe('cafe-test-123')
  })

  it('should remove special characters', () => {
    expect(cleanSlug('test@#$slug')).toBe('testslug')
  })

  it('should handle multiple spaces', () => {
    expect(cleanSlug('test   slug')).toBe('test-slug')
  })
})

describe('validateProduct', () => {
  const validProduct = {
    name: 'Café Test',
    slug: 'cafe-test',
    category: 'TRADICIONAL' as Category,
    presentation: 'G500' as Presentation,
    weight_grams: 500,
    price: 15000,
    stock: 10,
    min_stock: 5,
    description: 'Test product',
    image_url: '/test.jpg',
    is_active: true
  }

  it('should return no errors for valid product', () => {
    const errors = validateProduct(validProduct)
    expect(errors).toHaveLength(0)
  })

  it('should return error for empty name', () => {
    const errors = validateProduct({ ...validProduct, name: '' })
    expect(errors.find(e => e.field === 'name')).toBeDefined()
  })

  it('should return error for empty slug', () => {
    const errors = validateProduct({ ...validProduct, slug: '' })
    expect(errors.find(e => e.field === 'slug')).toBeDefined()
  })

  it('should return error for invalid slug characters', () => {
    const errors = validateProduct({ ...validProduct, slug: 'Cafe Test' })
    expect(errors.find(e => e.field === 'slug')).toBeDefined()
  })

  it('should return error for invalid category', () => {
    const errors = validateProduct({ 
      ...validProduct, 
      category: 'INVALID' as Category 
    })
    expect(errors.find(e => e.field === 'category')).toBeDefined()
  })

  it('should return error for weight <= 0', () => {
    const errors = validateProduct({ ...validProduct, weight_grams: 0 })
    expect(errors.find(e => e.field === 'weight_grams')).toBeDefined()
  })

  it('should return error for negative price', () => {
    const errors = validateProduct({ ...validProduct, price: -1 })
    expect(errors.find(e => e.field === 'price')).toBeDefined()
  })

  it('should return error for negative stock', () => {
    const errors = validateProduct({ ...validProduct, stock: -1 })
    expect(errors.find(e => e.field === 'stock')).toBeDefined()
  })

  it('should return error for empty description', () => {
    const errors = validateProduct({ ...validProduct, description: '' })
    expect(errors.find(e => e.field === 'description')).toBeDefined()
  })
})