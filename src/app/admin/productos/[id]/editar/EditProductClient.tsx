'use client'

import { useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'
import { updateProduct, checkSlugExists } from '@/lib/products'
import { ProductFormData } from '@/lib/validations'
import { Product, Category, Presentation } from '@prisma/client'

interface EditProductClientProps {
  product: Product & { category: Category; presentation: Presentation }
}

export default function EditProductClient({ product }: EditProductClientProps) {
  const router = useRouter()

  const initialData: ProductFormData = {
    name: product.name,
    slug: product.slug,
    category: product.category,
    presentation: product.presentation,
    weight_grams: product.weight_grams,
    price: Number(product.price),
    stock: product.stock,
    min_stock: product.min_stock,
    description: product.description || '',
    image_url: product.image_url || '/products/default.svg',
    is_active: product.is_active,
  }

  async function handleSubmit(data: ProductFormData) {
    if (data.slug !== product.slug) {
      const slugExists = await checkSlugExists(data.slug, product.id)
      if (slugExists) {
        alert('Ya existe un producto con este slug')
        return
      }
    }

    await updateProduct(product.id, {
      name: data.name,
      slug: data.slug,
      category: data.category,
      presentation: data.presentation,
      weight_grams: data.weight_grams,
      price: data.price,
      stock: data.stock,
      min_stock: data.min_stock,
      description: data.description,
      image_url: data.image_url,
      is_active: data.is_active,
    })
    router.push('/admin/productos')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
        <p className="text-gray-500">Actualiza los datos del producto</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <ProductForm initialData={initialData} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}