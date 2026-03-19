'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  return session.user.id
}

export async function createFeedingLog(data: {
  batchId: number
  feedTypeId: number
  amountConsumed: number
  logDate: string
}) {
  const userId = await getUserId()
  return await (prisma as any).$withUser(userId, async (tx: any) => {
    const log = await tx.feedingLog.create({
      data: {
        batchId: data.batchId,
        feedTypeId: data.feedTypeId,
        amountConsumed: data.amountConsumed,
        logDate: new Date(data.logDate),
        userId: userId
      }
    })

    // Update inventory
    await tx.inventory.update({
      where: { id: data.feedTypeId },
      data: {
        stockLevel: {
          decrement: data.amountConsumed
        }
      }
    })

    revalidatePath('/dashboard/feed')
    return { success: true, log }
  }).catch((error: any) => {
    console.error('Error creating feeding log:', error)
    return { success: false, error: 'Failed to create log' }
  })
}

export async function updateFeedingLog(id: number, data: {
  amountConsumed: number
  oldAmount: number
  feedTypeId: number
}) {
  const userId = await getUserId()
  return await (prisma as any).$withUser(userId, async (tx: any) => {
    const log = await tx.feedingLog.update({
      where: { id },
      data: {
        amountConsumed: data.amountConsumed
      }
    })

    // Adjust inventory
    const difference = data.amountConsumed - data.oldAmount
    await tx.inventory.update({
      where: { id: data.feedTypeId },
      data: {
        stockLevel: {
          decrement: difference
        }
      }
    })

    revalidatePath('/dashboard/feed')
    return { success: true, log }
  }).catch((error: any) => {
    console.error('Error updating feeding log:', error)
    return { success: false, error: 'Failed to update log' }
  })
}

export async function deleteFeedingLog(id: number, data: {
  amountConsumed: number
  feedTypeId: number
}) {
  const userId = await getUserId()
  return await (prisma as any).$withUser(userId, async (tx: any) => {
    await tx.feedingLog.delete({
      where: { id }
    })

    // Restore inventory
    await tx.inventory.update({
      where: { id: data.feedTypeId },
      data: {
        stockLevel: {
          increment: data.amountConsumed
        }
      }
    })

    revalidatePath('/dashboard/feed')
    return { success: true }
  }).catch((error: any) => {
    console.error('Error deleting feeding log:', error)
    return { success: false, error: 'Failed to delete log' }
  })
}
