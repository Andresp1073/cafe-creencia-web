import Link from 'next/link'
import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/admin/productos" className="text-xl font-bold text-amber-900">
              Cafe Creencia - Admin
            </Link>
            <Link href="/admin/productos" className="text-gray-700 hover:text-amber-700">
              Productos
            </Link>
            <Link href="/admin/ventas" className="text-gray-700 hover:text-amber-700">
              Ventas
            </Link>
            <Link href="/admin/ventas/historial" className="text-gray-700 hover:text-amber-700 text-sm">
              Historial
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/catalogo" target="_blank" className="text-gray-600 hover:text-amber-700 text-sm">
              Ver catálogo
            </Link>
            <Link href="/" className="text-gray-600 hover:text-amber-700 text-sm">
              Inicio
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}