import Link from 'next/link'
import { getAllSales } from '@/lib/products'
import { CATEGORY_LABELS, PRESENTATION_LABELS } from '@/lib/validations'

export const revalidate = 0

export default async function SalesHistoryPage() {
  const sales = await getAllSales()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historial de Ventas</h1>
        <Link href="/admin/ventas" className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg transition-colors">
          + Nueva venta
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Productos</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">#{sale.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(sale.created_at).toLocaleDateString('es-CO', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{sale.customer_name || '-'}</span>
                    {sale.customer_phone && (
                      <span className="block text-xs text-gray-500">{sale.customer_phone}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {sale.saleItems.map(item => (
                      <div key={item.id} className="flex items-center gap-1">
                        <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-xs font-medium">{item.quantity}x</span>
                        <span>{item.product.name}</span>
                        <span className="text-gray-400">({PRESENTATION_LABELS[item.product.presentation]})</span>
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-amber-700">
                    ${Number(sale.total).toLocaleString('es-CO')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sales.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No hay ventas registradas.</p>
            <Link href="/admin/ventas" className="text-amber-700 hover:text-amber-900 font-medium">
              Registrar primera venta
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}