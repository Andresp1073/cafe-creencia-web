import Link from 'next/link'
import { getProductWhatsAppLink } from '@/lib/whatsapp'

interface ProductCardProps {
  product: {
    id: number
    name: string
    slug: string
    presentation: string
    price: unknown
    image_url: string | null
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const presentationMap: Record<string, string> = {
    G500: '500g',
    G250: '250g',
    G125: '125g'
  }

  const presentation = presentationMap[product.presentation] || product.presentation
  const priceNum = Number(product.price)
  const imageSrc = product.image_url || '/products/default.jpg'
  
  const waLink = getProductWhatsAppLink(product.name, presentation)

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="aspect-square relative bg-amber-50 flex items-center justify-center">
        <img
          src={imageSrc}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-amber-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-amber-700 mb-3">
          Presentación: {presentation}
        </p>
        
        <p className="text-xl font-bold text-amber-900 mb-4">
          ${priceNum.toLocaleString('es-CO')}
        </p>
        
        <div className="flex gap-2">
          <Link
            href={`/productos/${product.slug}`}
            className="flex-1 text-center px-4 py-2 border border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors duration-200"
          >
            Ver producto
          </Link>
          
          <Link
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
            aria-label="Pedir por WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.298-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3 .149.124 2.171 3.336 4.658 4.853.646.385 1.45.77 2.246.988.264.073.522.126.792.173.272.048.552.04.748.024.296-.024 1.157-.596 1.318-1.173.1-.372.1-.69.07-.99-.073-.298-.667-1.642-.916-2.207z"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}