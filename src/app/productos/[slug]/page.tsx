import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/products'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 0

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const presentationMap: Record<string, string> = {
    G500: '500g',
    G250: '250g',
    G125: '125g'
  }

  const categoryLabels: Record<string, string> = {
    TRADICIONAL: 'Café Tradicional',
    MENTA_LIMONCILLO: 'Café Menta Limoncillo',
    EN_GRANO: 'Café en Grano'
  }

  const presentation = presentationMap[product.presentation] || product.presentation
  const price = Number(product.price)
  const imageSrc = product.image_url || '/products/default.jpg'
  const waMessage = `Hola, quiero pedir ${product.name} (${presentation}). ¿Está disponible?`
  const waLink = `https://wa.me/573123456789?text=${encodeURIComponent(waMessage)}`

  return (
    <>
      <FloatingWhatsApp />
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-amber-900">
              Cafe Creencia
            </Link>
            <Link
              href="/catalogo"
              className="text-amber-700 hover:text-amber-900 transition-colors"
            >
              Volver al catálogo
            </Link>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-amber-50">
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8 md:w-1/2">
                <p className="text-amber-700 font-medium mb-2">
                  {categoryLabels[product.category]}
                </p>
                
                <h1 className="text-3xl font-bold text-amber-900 mb-4">
                  {product.name}
                </h1>

                <div className="space-y-3 mb-6">
                  <p className="text-amber-800">
                    <span className="font-semibold">Presentación:</span> {presentation}
                  </p>
                  <p className="text-amber-800">
                    <span className="font-semibold">Peso:</span> {product.weight_grams}g
                  </p>
                  <p className="text-amber-800">
                    <span className="font-semibold">Categoría:</span> {product.category}
                  </p>
                </div>

                <p className="text-4xl font-bold text-amber-900 mb-6">
                  ${price.toLocaleString('es-CO')}
                </p>

                {product.description && (
                  <p className="text-amber-700 mb-6">
                    {product.description}
                  </p>
                )}

                <Link
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-lg rounded-lg transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.298-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3 .149.124 2.171 3.336 4.658 4.853.646.385 1.45.77 2.246.988.264.073.522.126.792.173.272.048.552.04.748.024.296-.024 1.157-.596 1.318-1.173.1-.372.1-.69.07-.99-.073-.298-.667-1.642-.916-2.207z"/>
                  </svg>
                  Pedir por WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center py-8 text-amber-600 text-sm">
          <p>© 2026 Cafe Creencia. Todos los derechos reservados.</p>
        </footer>
      </main>
    </>
  )
}