import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const revalidate = 0

async function getMovements() {
  return prisma.inventoryMovement.findMany({
    orderBy: { created_at: 'desc' },
    take: 100,
    include: {
      product: true
    }
  })
}

const presentationMap: Record<string, string> = {
  G500: '500g',
  G250: '250g',
  G125: '125g'
}

export default async function HistorialInventarioPage() {
  const movements = await getMovements()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historial de Inventario</h1>
        <Link href="/admin/inventario" className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg">
          Volver a Inventario
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Motivo</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movements.map((movement) => (
                <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(movement.created_at).toLocaleDateString('es-CO', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{movement.product.name}</div>
                    <div className="text-xs text-gray-500">{presentationMap[movement.product.presentation]}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      movement.type === 'ENTRADA' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {movement.type === 'ENTRADA' ? 'Entrada' : 'Salida'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                    {movement.type === 'ENTRADA' ? '+' : '-'}{movement.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {movement.reason ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {movements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay movimientos registrados.</p>
            <Link href="/admin/inventario/movimiento" className="text-amber-700 hover:text-amber-900">
              Registrar movimiento
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}