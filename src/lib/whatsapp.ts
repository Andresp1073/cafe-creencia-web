const WHATSAPP_NUMBER = '573123456789'

export function generateWhatsAppMessage(productName: string, presentation: string): string {
  return `Hola, quiero pedir ${productName} (${presentation}). ¿Está disponible?`
}

export function getWhatsAppLink(message?: string): string {
  const encodedMessage = encodeURIComponent(message || 'Hola, quiero información sobre sus productos de café')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
}

export function getProductWhatsAppLink(productName: string, presentation: string): string {
  const message = generateWhatsAppMessage(productName, presentation)
  return getWhatsAppLink(message)
}