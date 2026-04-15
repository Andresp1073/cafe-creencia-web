'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">
          Algo salió mal
        </h2>
        <p className="text-amber-700 mb-6">
          {error.message || 'Ha ocurrido un error inesperado'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}