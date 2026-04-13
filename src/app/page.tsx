import Link from 'next/link'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'

export default function Home() {
  return (
    <>
      <FloatingWhatsApp />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center max-w-2xl px-4">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-4">
              Cafe Creencia
            </h1>
            <p className="text-xl md:text-2xl text-amber-700">
              Para una nueva experiencia
            </p>
          </div>
          
          <div className="mb-8 text-amber-800">
            <p className="text-lg">
              Descubre nuestros cafés artesanales de la más alta calidad. 
              Desde tradisional hasta sabores únicos como menta limoncillo.
            </p>
          </div>
          
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white text-lg rounded-lg transition-colors duration-200"
          >
            Ver catálogo
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        
        <footer className="absolute bottom-4 text-center text-amber-600 text-sm">
          <p>© 2026 Cafe Creencia. Todos los derechos reservados.</p>
        </footer>
      </main>
    </>
  )
}