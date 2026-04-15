import Link from 'next/link'
import { getDashboardData } from '@/lib/dashboard'

export const revalidate = 0

const presentationMap: Record<string, string> = {
  G500: '500g',
  G250: '250g',
  G125: '125g'
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/catalogo" target="_blank" className="text-amber-700 hover:text-amber-900 text-sm">
          Ver catálogo público
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Ventas hoy</p>
          <p className="text-2xl font-bold text-gray-900">{data.todaySales.count}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Ingresos hoy</p>
          <p className="text-2xl font-bold text-green-600">${data.todaySales.total.toLocaleString('es-CO')}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Ventas mes</p>
          <p className="text-2xl font-bold text-gray-900">{data.monthSales.count}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Ingresos mes</p>
          <p className="text-2xl font-bold text-green-600">${data.monthSales.total.toLocaleString('es-CO')}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Ingresos totales</p>
          <p className="text-2xl font-bold text-green-600">${data.totalRevenue.toLocaleString('es-CO')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Alerts */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Alertas de inventario</h2>
          </div>
          <div className="p-4">
            {data.outOfStock.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-bold text-red-700 mb-2">Sin stock ({data.outOfStock.length})</p>
                <div className="space-y-2">
                  {data.outOfStock.map(p => (
                    <div key={p.id} className="flex justify-between text-sm bg-red-50 p-2 rounded">
                      <span className="text-gray-900">{p.name}</span>
                      <span className="text-red-600 font-medium">0</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.lowStock.length > 0 && (
              <div>
                <p className="text-sm font-bold text-orange-700 mb-2">Stock bajo ({data.lowStock.length})</p>
                <div className="space-y-2">
                  {data.lowStock.map(p => (
                    <div key={p.id} className="flex justify-between text-sm bg-orange-50 p-2 rounded">
                      <span className="text-gray-900">{p.name}</span>
                      <span className="text-orange-600 font-medium">{p.stock} / {p.min_stock}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.outOfStock.length === 0 && data.lowStock.length === 0 && (
              <p className="text-gray-500 text-sm">Sin alertas</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Productos más vendidos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-600">Producto</th>
                  <th className="px-4 py-2 text-center text-xs font-bold text-gray-600">Cant.</th>
                  <th className="px-4 py-2 text-right text-xs font-bold text-gray-600">Ingreso</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.topProducts.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {item.product.name}
                      <span className="text-gray-400 text-xs ml-1">({presentationMap[item.product.presentation]})</span>
                    </td>
                    <td className="px-4 py-2 text-center text-sm text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-2 text-right text-sm text-green-600">${item.revenue.toLocaleString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.topProducts.length === 0 && (
            <p className="p-4 text-gray-500 text-sm">No hay ventas registradas</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Actividad reciente</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* Recent Sales */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">Últimas ventas</p>
            {data.recentSales.length > 0 ? (
              <div className="space-y-2">
                {data.recentSales.slice(0, 5).map(sale => (
                  <div key={sale.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {new Date(sale.created_at).toLocaleDateString('es-CO')}
                    </span>
                    <span className="text-gray-900">{sale.customer_name || sale.customer_phone || 'Sin nombre'}</span>
                    <span className="text-green-600 font-medium">${Number(sale.total).toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Sin ventas</p>
            )}
          </div>
          {/* Recent Movements */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">Últimos movimientos</p>
            {data.recentMovements.length > 0 ? (
              <div className="space-y-2">
                {data.recentMovements.slice(0, 5).map(mov => (
                  <div key={mov.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {new Date(mov.created_at).toLocaleDateString('es-CO')}
                    </span>
                    <span className="text-gray-900 truncate max-w-[100px]">{mov.product.name}</span>
                    <span className={`font-medium ${mov.type === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                      {mov.type === 'ENTRADA' ? '+' : '-'}{mov.quantity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Sin movimientos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}