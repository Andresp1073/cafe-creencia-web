'use client'

import Link from 'next/link'
import { getWhatsAppLink } from '@/lib/whatsapp'

export default function FloatingWhatsApp() {
  const href = getWhatsAppLink('Hola, quiero información sobre sus productos de café')

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300"
      aria-label="Contactar por WhatsApp"
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.298-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3 .149.124 2.171 3.336 4.658 4.853.646.385 1.45.77 2.246.988.264.073.522.126.792.173.272.048.552.04.748.024.296-.024 1.157-.596 1.318-1.173.1-.372.1-.69.07-.99-.073-.298-.667-1.642-.916-2.207z"/>
      </svg>
    </Link>
  )
}