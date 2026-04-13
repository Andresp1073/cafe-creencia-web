'use client'

import Link from 'next/link'
import { getWhatsAppLink, getProductWhatsAppLink } from '@/lib/whatsapp'

interface WhatsAppButtonProps {
  productName?: string
  presentation?: string
  message?: string
  variant?: 'primary' | 'secondary' | 'floating'
  className?: string
  children?: React.ReactNode
}

export default function WhatsAppButton({
  productName,
  presentation,
  message,
  variant = 'primary',
  children
}: WhatsAppButtonProps) {
  const href = productName && presentation
    ? getProductWhatsAppLink(productName, presentation)
    : getWhatsAppLink(message)

  const baseClasses = 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200'
  
  const variantClasses = {
    primary: 'bg-green-500 hover:bg-green-600 text-white',
    secondary: 'bg-amber-700 hover:bg-amber-800 text-white',
    floating: 'fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl'
  }

  const sizeClasses = variant === 'floating' ? 'w-14 h-14' : ''

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses}`}
    >
      {variant === 'floating' ? (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.298-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3 .149.124 2.171 3.336 4.658 4.853.646.385 1.45.77 2.246.988.264.073.522.126.792.173.272.048.552.04.748.024.296-.024 1.157-.596 1.318-1.173.1-.372.1-.69.07-.99-.073-.298-.667-1.642-.916-2.207z"/>
          <path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.298-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3 .149.124 2.171 3.336 4.658 4.853.646.385 1.45.77 2.246.988.264.073.522.126.792.173.272.048.552.04.748.024.296-.024 1.157-.596 1.318-1.173.1-.372.1-.69.07-.99-.073-.298-.667-1.642-.916-2.207z"/>
        </svg>
      ) : children || (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.298-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3 .149.124 2.171 3.336 4.658 4.853.646.385 1.45.77 2.246.988.264.073.522.126.792.173.272.048.552.04.748.024.296-.024 1.157-.596 1.318-1.173.1-.372.1-.69.07-.99-.073-.298-.667-1.642-.916-2.207z"/>
          </svg>
          Pedir por WhatsApp
        </>
      )}
    </Link>
  )
}