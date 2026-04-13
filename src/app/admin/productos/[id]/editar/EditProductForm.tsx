'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getProductById } from '@/lib/products'
import { updateProductAction } from '@/lib/actions'
import { CATEGORIES, PRESENTATIONS, CATEGORY_LABELS, PRESENTATION_LABELS } from '@/lib/validations'
import { Product, Category, Presentation } from '@prisma/client'

interface EditProductFormProps {
  product: Product & { category: Category; presentation: Presentation }
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setMessage(null)
    
    const result = await updateProductAction(product.id, formData)
    
    setIsLoading(false)
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Producto actualizado exitosamente' })
      setTimeout(() => {
        router.push('/admin/productos')
      }, 1500)
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6 max-w-2xl">
      {message && (
        <div className={`px-4 py-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Nombre *</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={product.name}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Slug *</label>
        <input
          type="text"
          name="slug"
          required
          defaultValue={product.slug}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Categoría *</label>
          <select name="category" required defaultValue={product.category} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Presentación *</label>
          <select name="presentation" required defaultValue={product.presentation} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
            {PRESENTATIONS.map(pres => (
              <option key={pres} value={pres}>{PRESENTATION_LABELS[pres]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Peso (g) *</label>
          <input
            type="number"
            name="weight_grams"
            required
            min="1"
            defaultValue={product.weight_grams}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Precio *</label>
          <input
            type="number"
            name="price"
            required
            min="0"
            step="0.01"
            defaultValue={Number(product.price)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Stock *</label>
          <input
            type="number"
            name="stock"
            required
            min="0"
            defaultValue={product.stock}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Stock mínimo</label>
        <input
          type="number"
          name="min_stock"
          min="0"
          defaultValue={product.min_stock}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Descripción *</label>
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={product.description || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">URL de imagen</label>
        <input
          type="text"
          name="image_url"
          defaultValue={product.image_url || '/products/default.svg'}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked={product.is_active}
          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
        />
        <label htmlFor="is_active" className="text-sm text-gray-700">
          Producto activo (visible en catálogo público)
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : 'Actualizar producto'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/productos')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}