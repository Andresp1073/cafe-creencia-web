'use client'

import { useRef, useState } from 'react'
import { createProductAction } from '@/lib/actions'
import { CATEGORIES, PRESENTATIONS, CATEGORY_LABELS, PRESENTATION_LABELS, generateSlug } from '@/lib/validations'

export default function CreateProductForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setMessage(null)
    
    const result = await createProductAction(formData)
    
    setIsLoading(false)
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Producto creado exitosamente' })
      formRef.current?.reset()
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
          onChange={(e) => {
            const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement
            if (slugInput && !slugInput.value) {
              slugInput.value = generateSlug(e.target.value)
            }
          }}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
          placeholder="Café Tradicional 500g"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Slug *</label>
        <input
          type="text"
          name="slug"
          required
          pattern="^[a-z0-9-]+$"
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
          placeholder="cafe-tradicional-500g"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Categoría *</label>
          <select name="category" required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-gray-900">
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Presentación *</label>
          <select name="presentation" required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-gray-900">
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
            placeholder="500"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
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
            placeholder="15000"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">Stock *</label>
          <input
            type="number"
            name="stock"
            required
            min="0"
            placeholder="20"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Stock mínimo</label>
        <input
          type="number"
          name="min_stock"
          min="0"
          placeholder="5"
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Descripción *</label>
        <textarea
          name="description"
          required
          rows={3}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
          placeholder="Descripción del producto..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">URL de imagen</label>
        <input
          type="text"
          name="image_url"
          placeholder="/products/default.svg"
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          id="is_active"
          defaultChecked
          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
        />
        <label htmlFor="is_active" className="text-sm text-gray-700">
          Producto activo (visible en catálogo público)
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg disabled:opacity-50"
      >
        {isLoading ? 'Guardando...' : 'Crear producto'}
      </button>
    </form>
  )
}