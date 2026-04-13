import { notFound } from 'next/navigation'
import { getProductById, updateProduct } from '@/lib/products'
import EditProductClient from './EditProductClient'

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

  return <EditProductClient product={product} />
}