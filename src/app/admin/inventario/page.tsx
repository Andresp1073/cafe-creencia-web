import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import StockStatusBadge from '@/components/StockStatusBadge'

export const revalidate = 0

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { name: 'asc' }
  })
}

const presentationMap: Record<string, string> = {
  G500: '500g',
  G250: '250g',
  G125: '125g'
}

const categoryLabels: Record<string, string> = {
  TRADICIONAL: 'Tradicional',
  MENTA_LIMONCILLO: 'Menta Limoncillo',
  EN_GRANO: 'En Grano'
}

export default async function InventarioPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
        <div className="flex gap-2">
          <Link href="/admin/productos" className="text-amber-700 hover:text-amber-900">
            Productos
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="/admin/ventas" className="text-amber-700 hover:text-amber-900">
            Ventas
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="/admin/inventario/historial" className="text-amber-700 hover:text-amber-900">
            Historial
          </Link>
        </div>
      </div>

      {/* Tabla de inventario */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Stock actual</h2>
          <Link href="/admin/inventario/movimiento" className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg transition-colors">
            + Registrar movimiento
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Presentación</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Mín. Stock</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                      {categoryLabels[product.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {presentationMap[product.presentation]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`text-sm font-bold ${
                      product.stock === 0 ? 'text-gray-400' :
                      product.stock <= product.min_stock ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {product.min_stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StockStatusBadge stock={product.stock} minStock={product.min_stock} />
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
              Crear producto
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}