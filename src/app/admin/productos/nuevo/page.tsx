'use client'

import { useRef, useState } from 'react'
import { createProductAction } from '@/lib/actions'
import { CATEGORIES, PRESENTATIONS, CATEGORY_LABELS, PRESENTATION_LABELS, generateSlug } from '@/lib/validations'

export default function CreateProductForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [slugValue, setSlugValue] = useState('')

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
      setSlugValue('')
    }
  }

  const handleNameChange = (name: string) => {
    if (!slugValue) {
      setSlugValue(generateSlug(name))
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
        <label className="block text-sm font-bold text-gray-800 mb-1">Nombre del producto *</label>
        <input
          type="text"
          name="name"
          required
          onChange={(e) => handleNameChange(e.target.value)}
          style={{ backgroundColor: '#ffffff', color: '#000000' }}
          className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Ej: Café Tradicional 500g"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">Slug (URL) *</label>
        <input
          type="text"
          name="slug"
          required
          value={slugValue}
          onChange={(e) => {
            const cleaned = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            setSlugValue(cleaned)
          }}
          style={{ backgroundColor: '#ffffff', color: '#000000' }}
          className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Ej: cafe-tradicional-500g"
        />
        <p className="text-xs text-gray-500 mt-1">Solo letras minúsculas, números y guiones (sin espacios)</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Categoría *</label>
          <select name="category" required style={{ backgroundColor: '#ffffff', color: '#000000' }} className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500">
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Presentación *</label>
          <select name="presentation" required style={{ backgroundColor: '#ffffff', color: '#000000' }} className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500">
            {PRESENTATIONS.map(pres => (
              <option key={pres} value={pres}>{PRESENTATION_LABELS[pres]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Peso (g) *</label>
          <input
            type="text"
            name="weight_grams"
            required
            inputMode="numeric"
            style={{ backgroundColor: '#ffffff', color: '#000000' }}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Precio *</label>
          <input
            type="text"
            name="price"
            required
            inputMode="decimal"
            style={{ backgroundColor: '#ffffff', color: '#000000' }}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="15000"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Stock *</label>
          <input
            type="text"
            name="stock"
            required
            inputMode="numeric"
            style={{ backgroundColor: '#ffffff', color: '#000000' }}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="20"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">Stock mínimo</label>
        <input
          type="text"
          name="min_stock"
          inputMode="numeric"
          style={{ backgroundColor: '#ffffff', color: '#000000' }}
          className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="5"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">Descripción *</label>
        <textarea
          name="description"
          required
          rows={3}
          style={{ backgroundColor: '#ffffff', color: '#000000' }}
          className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Descripción del producto..."
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">URL de imagen</label>
        <input
          type="text"
          name="image_url"
          style={{ backgroundColor: '#ffffff', color: '#000000' }}
          className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="/products/default.svg"
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
        <label htmlFor="is_active" className="text-sm text-gray-800 font-bold">
          Producto activo (visible en catálogo público)
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg disabled:opacity-50"
      >
        {isLoading ? 'Guardando...' : 'Crear producto'}
      </button>
    </form>
  )
}