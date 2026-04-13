'use client'

import { useState } from 'react'
import { Category, Presentation } from '@prisma/client'
import { CATEGORIES, PRESENTATIONS, CATEGORY_LABELS, PRESENTATION_LABELS, generateSlug, validateProduct, ProductFormData, ValidationError } from '@/lib/validations'

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  onSubmit: (data: ProductFormData) => Promise<void>
  isLoading?: boolean
}

export default function ProductForm({ initialData, onSubmit, isLoading = false }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'TRADICIONAL',
    presentation: initialData?.presentation || 'G500',
    weight_grams: initialData?.weight_grams || 500,
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    min_stock: initialData?.min_stock || 5,
    description: initialData?.description || '',
    image_url: initialData?.image_url || '/products/default.svg',
    is_active: initialData?.is_active ?? true,
  })
  
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [slugEditable, setSlugEditable] = useState(!!initialData?.slug)

  const handleNameChange = (name: string) => {
    setFormData(prev => ({ ...prev, name }))
    if (!slugEditable) {
      setFormData(prev => ({ ...prev, slug: generateSlug(name) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateProduct(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setErrors([])
    await onSubmit(formData)
  }

  const getError = (field: string) => errors.find(e => e.field === field)?.message

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <ul className="list-disc list-inside">
            {errors.map((error, i) => (
              <li key={i}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Café Tradicional 500g"
        />
        {getError('name') && <p className="text-red-500 text-sm mt-1">{getError('name')}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase() }))}
            disabled={slugEditable}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
            placeholder="cafe-tradicional-500g"
          />
          {!slugEditable && initialData?.name && (
            <button
              type="button"
              onClick={() => setSlugEditable(true)}
              className="px-3 py-2 text-sm text-amber-700 hover:text-amber-900"
            >
              Editar
            </button>
          )}
        </div>
        {getError('slug') && <p className="text-red-500 text-sm mt-1">{getError('slug')}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Category }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Presentación *
          </label>
          <select
            value={formData.presentation}
            onChange={(e) => setFormData(prev => ({ ...prev, presentation: e.target.value as Presentation }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            {PRESENTATIONS.map(pres => (
              <option key={pres} value={pres}>{PRESENTATION_LABELS[pres]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (g) *
          </label>
          <input
            type="number"
            value={formData.weight_grams}
            onChange={(e) => setFormData(prev => ({ ...prev, weight_grams: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock *
          </label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stock mínimo
        </label>
        <input
          type="number"
          value={formData.min_stock}
          onChange={(e) => setFormData(prev => ({ ...prev, min_stock: parseInt(e.target.value) || 0 }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Descripción del producto..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL de imagen
        </label>
        <input
          type="text"
          value={formData.image_url}
          onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="/products/default.svg"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
        />
        <label htmlFor="is_active" className="text-sm text-gray-700">
          Producto activo (visible en catálogo público)
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : initialData?.name ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}