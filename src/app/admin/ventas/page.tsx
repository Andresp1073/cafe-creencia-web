'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { getProductsForSale, registerSale } from '@/lib/actions'

interface CartItem {
  productId: number
  name: string
  presentation: string
  price: number
  quantity: number
  available: number
}

interface SimpleProduct {
  id: number
  name: string
  slug: string
  presentation: string
  price: number
  stock: number
}

export default function NewSalePage() {
  const [products, setProducts] = useState<SimpleProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    const result = await getProductsForSale()
    if (result.products) {
      setProducts(result.products)
    }
    setLoading(false)
  }

  function addToCart(productId: number) {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const existing = cart.find(item => item.productId === productId)
    if (existing) {
      if (existing.quantity < existing.available) {
        setCart(cart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      }
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        presentation: product.presentation,
        price: product.price,
        quantity: 1,
        available: product.stock
      }])
    }
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = cart.find(i => i.productId === productId)
    if (!item) return

    if (quantity <= 0) {
      setCart(cart.filter(i => i.productId !== productId))
    } else if (quantity <= item.available) {
      setCart(cart.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      ))
    }
  }

  function removeFromCart(productId: number) {
    setCart(cart.filter(i => i.productId !== productId))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleSubmit() {
    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Agrega productos al carrito' })
      return
    }

    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName || null,
          customerPhone: customerPhone || null,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price
          }))
        })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: `Venta registrada por $${total.toLocaleString('es-CO')}` })
        setCart([])
        setCustomerName('')
        setCustomerPhone('')
        loadProducts()
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al registrar venta' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      setSubmitting(false)
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
        <h1 className="text-2xl font-bold text-gray-900">Nueva Venta</h1>
        <Link href="/admin/productos" className="text-amber-700 hover:text-amber-900">
          ← Volver a Productos
        </Link>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg mb-6 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Seleccionar productos</h2>
          </div>
          
          <div className="p-4">
            {loading ? (
              <p className="text-gray-500">Cargando...</p>
            ) : products.filter(p => p.stock > 0).length === 0 ? (
              <p className="text-gray-500">No hay productos en stock</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {products.filter(p => p.stock > 0).map(product => {
                  const inCart = cart.find(i => i.productId === product.id)
                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.name}</p>
<p className="text-sm text-gray-500">
                        {presentationMap[product.presentation] || product.presentation} · 
                        <span className="text-green-600 font-semibold">{product.stock} unidades disponibles</span> · 
                        <span className="text-amber-700 font-semibold">${product.price.toLocaleString('es-CO')}</span>
                      </p>
                      </div>
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={inCart && inCart.quantity >= inCart.available}
                        className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + Agregar
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Carrito de venta</h2>
          </div>
          
          <div className="p-4">
            <div className="space-y-3 mb-4 min-h-[200px]">
              {cart.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-gray-400">
                  <p>No hay productos agregados</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.productId} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
<p className="text-sm text-amber-700">
                      ${item.price.toLocaleString('es-CO')} c/u · {item.available} unidades
                    </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.available}
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded flex items-center justify-center disabled:opacity-50"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="ml-2 w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t-2 border-amber-200 pt-4 mb-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-gray-800">Total:</span>
                <span className="text-amber-700">${total.toLocaleString('es-CO')}</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Nombre del cliente</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ backgroundColor: '#ffffff', color: '#000000' }}
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Opcional"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ backgroundColor: '#ffffff', color: '#000000' }}
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || cart.length === 0}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Registrando...' : 'Registrar venta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}