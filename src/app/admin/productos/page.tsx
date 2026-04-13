import Link from 'next/link'
import { getAllProducts, toggleProductStatus } from '@/lib/products'
import { CATEGORY_LABELS, PRESENTATION_LABELS } from '@/lib/validations'
import ProductStatusBadge from '@/components/ProductStatusBadge'

export const revalidate = 0

async function toggleStatus(formData: FormData) {
  'use server'
  const id = parseInt(formData.get('id') as string)
  await toggleProductStatus(id)
}

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg"
        >
          Nuevo producto
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.image_url || '/products/default.svg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {CATEGORY_LABELS[product.category]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {PRESENTATION_LABELS[product.presentation]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${Number(product.price).toLocaleString('es-CO')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ProductStatusBadge is_active={product.is_active} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/productos/${product.id}/editar`}
                        className="text-amber-700 hover:text-amber-900"
                      >
                        Editar
                      </Link>
                      <form action={toggleStatus as any}>
                        <input type="hidden" name="id" value={product.id} />
                        <button
                          type="submit"
                          className={`ml-2 ${product.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {product.is_active ? 'Ocultar' : 'Activar'}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay productos registrados.</p>
            <Link href="/admin/productos/nuevo" className="text-amber-700 hover:text-amber-900">
              Crear el primero
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}