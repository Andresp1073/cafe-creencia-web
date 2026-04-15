import { prisma } from '../src/lib/prisma'

async function main() {
  const adminEmail = 'admin@cafecreencia.com'
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('Admin already exists')
    return
  }

  await prisma.user.create({
    data: {
      name: 'Administrador',
      email: adminEmail,
      password: 'admin123',
      role: 'ADMIN'
    }
  })

  console.log('Admin user created successfully')
  console.log('Email: admin@cafecreencia.com')
  console.log('Password: admin123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())