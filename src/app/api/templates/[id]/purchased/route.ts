import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import connectDB from '@/lib/db'
import Purchase from '@/models/Purchase'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ purchased: false })
    }

    await connectDB()

    const purchase = await Purchase.findOne({
      userId: session.user.id,
      templateId: params.id,
      status: 'completed'
    })

    return NextResponse.json({ 
      purchased: !!purchase,
      purchaseDate: purchase?.completedAt || null
    })

  } catch (error: any) {
    console.error('Check purchase error:', error)
    return NextResponse.json({ purchased: false })
  }
} 