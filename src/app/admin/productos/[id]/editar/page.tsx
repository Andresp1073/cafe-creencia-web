import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/products'
import { CATEGORY_LABELS, PRESENTATION_LABELS } from '@/lib/validations'
import EditProductForm from './EditProductForm'

interface Props {
  params: Promise<{ id: string }>
}

export const revalidate = 0

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const productId = parseInt(id)
  
  if (isNaN(productId)) {
    notFound()
  }
  
  const product = await getProductById(productId)
  
  if (!product) {
    notFound()
  }

  return <EditProductForm product={product} />
}