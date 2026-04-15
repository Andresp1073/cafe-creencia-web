import { prisma } from './prisma'

export async function getTodaySalesStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const sales = await prisma.sale.findMany({
    where: {
      created_at: {
        gte: today
      }
    }
  })
  
  return {
    count: sales.length,
    total: sales.reduce((sum, s) => sum + Number(s.total), 0)
  }
}

export async function getMonthSalesStats() {
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const sales = await prisma.sale.findMany({
    where: {
      created_at: {
        gte: firstDayOfMonth
      }
    }
  })
  
  return {
    count: sales.length,
    total: sales.reduce((sum, s) => sum + Number(s.total), 0)
  }
}

export async function getTotalRevenue() {
  const sales = await prisma.sale.findMany()
  
  return sales.reduce((sum, s) => sum + Number(s.total), 0)
}

export async function getTopSellingProducts(limit: number = 5) {
  const saleItems = await prisma.saleItem.findMany({
    include: {
      product: true
    }
  })
  
  const productTotals: Record<number, { product: any; quantity: number; revenue: number }> = {}
  
  for (const item of saleItems) {
    if (!productTotals[item.product_id]) {
      productTotals[item.product_id] = {
        product: item.product,
        quantity: 0,
        revenue: 0
      }
    }
    productTotals[item.product_id].quantity += item.quantity
    productTotals[item.product_id].revenue += Number(item.subtotal)
  }
  
  return Object.values(productTotals)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
}

export async function getLowStockProducts() {
  const products = await prisma.product.findMany({
    where: {
      is_active: true,
      stock: {
        gt: 0
      }
    }
  })
  
  return products.filter(p => p.stock <= p.min_stock)
}

export async function getOutOfStockProducts() {
  return prisma.product.findMany({
    where: {
      is_active: true,
      stock: 0
    }
  })
}

export async function getRecentSales(limit: number = 10) {
  return prisma.sale.findMany({
    orderBy: { created_at: 'desc' },
    take: limit,
    include: {
      saleItems: {
        include: {
          product: true
        }
      }
    }
  })
}

export async function getRecentInventoryMovements(limit: number = 10) {
  return prisma.inventoryMovement.findMany({
    orderBy: { created_at: 'desc' },
    take: limit,
    include: {
      product: true
    }
  })
}

export async function getDashboardData() {
  const [todaySales, monthSales, totalRevenue, topProducts, lowStock, outOfStock, recentSales, recentMovements] = await Promise.all([
    getTodaySalesStats(),
    getMonthSalesStats(),
    getTotalRevenue(),
    getTopSellingProducts(5),
    getLowStockProducts(),
    getOutOfStockProducts(),
    getRecentSales(10),
    getRecentInventoryMovements(10)
  ])
  
  return {
    todaySales,
    monthSales,
    totalRevenue,
    topProducts,
    lowStock,
    outOfStock,
    recentSales,
    recentMovements
  }
}