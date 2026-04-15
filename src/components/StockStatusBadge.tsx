interface StockStatusBadgeProps {
  stock: number
  minStock?: number
}

export default function StockStatusBadge({ stock, minStock = 5 }: StockStatusBadgeProps) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
        Sin stock
      </span>
    )
  }

  if (stock <= minStock) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Stock bajo
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
      Disponible
    </span>
  )
}