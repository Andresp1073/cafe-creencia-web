import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: 'Café Tradicional 500g',
    slug: 'cafe-tradicional-500g',
    category: 'TRADICIONAL',
    presentation: 'G500',
    weight_grams: 500,
    price: 15000,
    stock: 20,
    min_stock: 5,
    description: 'Café tradicional de alta calidad en presentación de 500 gramos',
    image_url: '/products/default.jpg',
    is_active: true,
  },
  {
    name: 'Café Tradicional 250g',
    slug: 'cafe-tradicional-250g',
    category: 'TRADICIONAL',
    presentation: 'G250',
    weight_grams: 250,
    price: 8000,
    stock: 20,
    min_stock: 5,
    description: 'Café tradicional de alta calidad en presentación de 250 gramos',
    image_url: '/products/default.jpg',
    is_active: true,
  },
  {
    name: 'Café Tradicional 125g',
    slug: 'cafe-tradicional-125g',
    category: 'TRADICIONAL',
    presentation: 'G125',
    weight_grams: 125,
    price: 5000,
    stock: 20,
    min_stock: 5,
    description: 'Café tradicional de alta calidad en presentación de 125 gramos',
    image_url: '/products/default.jpg',
    is_active: true,
  },
  {
    name: 'Café Menta Limoncillo 500g',
    slug: 'cafe-menta-limoncillo-500g',
    category: 'MENTA_LIMONCILLO',
    presentation: 'G500',
    weight_grams: 500,
    price: 15000,
    stock: 20,
    min_stock: 5,
    description: 'Café con sabor a menta y limoncillo en presentación de 500 gramos',
    image_url: '/products/default.jpg',
    is_active: true,
  },
  {
    name: 'Café Menta Limoncillo 250g',
    slug: 'cafe-menta-limoncillo-250g',
    category: 'MENTA_LIMONCILLO',
    presentation: 'G250',
    weight_grams: 250,
    price: 8000,
    stock: 20,
    min_stock: 5,
    description: 'Café con sabor a menta y limoncillo en presentación de 250 gramos',
    image_url: '/products/default.jpg',
    is_active: true,
  },
  {
    name: 'Café Menta Limoncillo 125g',
    slug: 'cafe-menta-limoncillo-125g',
    category: 'MENTA_LIMONCILLO',
    presentation: 'G125',
    weight_grams: 125,
    price: 5000,
    stock: 20,
    min_stock: 5,
    description: 'Café con sabor a menta y limoncillo en presentación de 125 gramos',
    image_url: '/products/default.jpg',
    is_active: true,
  },
  {
    name: 'Café en Grano 500g',
    slug: 'cafe-en-grano-500g',
    category: 'EN_GRANO',
    presentation: 'G500',
    weight_grams: 500,
    price: 15000,
    stock: 20,
    min_stock: 5,
    description: 'Café en grano de alta calidad en presentación de 500 gramos',
    image_url: '/products/default.jpg',
    is_active: true,
  },
  {
    name: 'Café en Grano 250g',
    slug: 'cafe-en-grano-250g',
    category: 'EN_GRANO',
    presentation: 'G250',
    weight_grams: 250,
    price: 8000,
    stock: 20,
    min_stock: 5,
    description: 'Café en grano de alta calidad en presentación de 250 gramos',
    image_url: '/products/default.jpg',
    is_active: true,
  },
  {
    name: 'Café en Grano 125g',
    slug: 'cafe-en-grano-125g',
    category: 'EN_GRANO',
    presentation: 'G125',
    weight_grams: 125,
    price: 5000,
    stock: 20,
    min_stock: 5,
    description: 'Café en grano de alta calidad en presentación de 125 gramos',
    image_url: '/products/default.jpg',
    is_active: true,
  },
]

async function main() {
  console.log('Starting seed...')

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
    console.log(`Created product: ${created.name}`)
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })