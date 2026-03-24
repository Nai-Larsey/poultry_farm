import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
  try {
    const user = await prisma.user.create({
      data: {
        firstname: 'Test',
        surname: 'User',
        email: 'test' + Date.now() + '@example.com',
        phoneNumber: '1234567890' + Date.now(),
        role: 'OWNER',
      }
    })
    console.log('User created:', user)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

test()
