interface ProductStatusBadgeProps {
  is_active: boolean
}

export default function ProductStatusBadge({ is_active }: ProductStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        is_active
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {is_active ? 'Activo' : 'Oculto'}
    </span>
  )
}