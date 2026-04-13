'use client'

import { useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'
import { createProduct, checkSlugExists } from '@/lib/products'
import { ProductFormData } from '@/lib/validations'

export default function NewProductPage() {
  const router = useRouter()

  async function handleSubmit(data: ProductFormData) {
    const slugExists = await checkSlugExists(data.slug)
    if (slugExists) {
      alert('Ya existe un producto con este slug')
      return
    }

    await createProduct(data)
    router.push('/admin/productos')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
        <p className="text-gray-500">Completa los datos del producto</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}