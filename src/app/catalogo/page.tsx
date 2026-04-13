import Link from 'next/link'
import { getActiveProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'

export const revalidate = 0

export default async function CatalogoPage() {
  const products = await getActiveProducts()

  return (
    <>
      <FloatingWhatsApp />
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-amber-900">
              Cafe Creencia
            </Link>
            <Link
              href="/"
              className="text-amber-700 hover:text-amber-900 transition-colors"
            >
              Inicio
            </Link>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4 text-center">
            Nuestro Catálogo
          </h1>
          <p className="text-amber-700 text-center mb-8">
            Descubre todos nuestros productos de café
          </p>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-amber-700 text-lg">
                No hay productos disponibles en este momento.
              </p>
              <Link href="/" className="text-amber-700 underline hover:text-amber-900">
                Volver al inicio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        <footer className="text-center py-8 text-amber-600 text-sm">
          <p>© 2026 Cafe Creencia. Todos los derechos reservados.</p>
        </footer>
      </main>
    </>
  )
}