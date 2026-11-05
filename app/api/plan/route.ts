import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const planDays = await prisma.planDay.findMany({
    orderBy: {
      day: 'asc',
    },
  })

  return NextResponse.json(planDays)
}
