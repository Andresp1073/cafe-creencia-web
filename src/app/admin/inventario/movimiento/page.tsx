'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { registerInventoryMovementAction } from '@/lib/actions'

interface Product {
  id: number
  name: string
  presentation: string
  stock: number
}

export default function NuevoMovimientoPage() {
  const [formType, setFormType] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const res = await fetch('/api/inventario/productos')
      const data = await res.json()
      if (data.error) {
        console.error('Error:', data.error)
      } else {
        setProducts(data)
      }
    } catch (err) {
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!selectedProduct || !quantity || !reason) {
      setMessage({ type: 'error', text: 'Todos los campos son obligatorios' })
      return
    }

    const qty = parseInt(quantity)
    if (qty <= 0) {
      setMessage({ type: 'error', text: 'La cantidad debe ser mayor a 0' })
      return
    }

    setSubmitting(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('product_id', selectedProduct)
    formData.append('type', formType)
    formData.append('quantity', quantity)
    formData.append('reason', reason)

    const result = await registerInventoryMovementAction(formData)

    setSubmitting(false)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: `${formType === 'ENTRADA' ? 'Entrada' : 'Salida'} registrada correctamente` })
      setSelectedProduct('')
      setQuantity('')
      setReason('')
    }
  }

  const presentationMap: Record<string, string> = {
    G500: '500g',
    G250: '250g',
    G125: '125g'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Registrar Movimiento</h1>
        <Link href="/admin/inventario" className="text-amber-700 hover:text-amber-900">
          ← Volver a Inventario
        </Link>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg mb-6 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden max-w-2xl">
        <div className="px-4 py-3 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Nuevo movimiento de inventario</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Tipo de movimiento</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="ENTRADA"
                  checked={formType === 'ENTRADA'}
                  onChange={() => setFormType('ENTRADA')}
                  className="w-4 h-4 text-green-600"
                />
                <span className={`font-medium ${formType === 'ENTRADA' ? 'text-green-700' : 'text-gray-600'}`}>
                  + Entrada (aumenta stock)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="SALIDA"
                  checked={formType === 'SALIDA'}
                  onChange={() => setFormType('SALIDA')}
                  className="w-4 h-4 text-red-600"
                />
                <span className={`font-medium ${formType === 'SALIDA' ? 'text-red-700' : 'text-gray-600'}`}>
                  - Salida (reduce stock)
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">Producto</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              onClick={loadProducts}
              style={{ backgroundColor: '#ffffff', color: '#000000' }}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">Seleccionar...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({presentationMap[p.presentation]}) - Stock: {p.stock}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">Cantidad</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ backgroundColor: '#ffffff', color: '#000000' }}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="0"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">Motivo</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ backgroundColor: '#ffffff', color: '#000000' }}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500"
              placeholder="Ej: Reposición, Venta directa, Ajuste de inventario, etc."
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? 'Guardando...' : `Registrar ${formType === 'ENTRADA' ? 'Entrada' : 'Salida'}`}
          </button>
        </form>
      </div>
    </div>
  )
}