import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db'
import Review from '@/models/Review'
import Template from '@/models/Template'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const sort = url.searchParams.get('sort') || 'newest' // newest, oldest, highest, lowest, helpful
    
    const skip = (page - 1) * limit
    
    let sortQuery: any = { createdAt: -1 } // Default: newest first
    
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 }
        break
      case 'highest':
        sortQuery = { rating: -1, createdAt: -1 }
        break
      case 'lowest':
        sortQuery = { rating: 1, createdAt: -1 }
        break
      case 'helpful':
        sortQuery = { 'helpful.count': -1, createdAt: -1 }
        break
    }
    
    const reviews = await Review.find({ templateId: params.id })
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name')
      .lean()
    
    const totalReviews = await Review.countDocuments({ templateId: params.id })
    
    // Get rating breakdown
    const ratingBreakdown = await Review.aggregate([
      { $match: { templateId: params.id } },
      { 
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ])
    
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    ratingBreakdown.forEach(item => {
      breakdown[item._id as keyof typeof breakdown] = item.count
    })
    
    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total: totalReviews,
        pages: Math.ceil(totalReviews / limit)
      },
      ratingBreakdown: breakdown
    })
    
  } catch (error: unknown) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { rating, comment } = await req.json()
    
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }
    
    await connectDB()
    
    // Check if template exists
    const template = await Template.findById(params.id)
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }
    
    // Check if user already reviewed this template
    const existingReview = await Review.findOne({
      templateId: params.id,
      userId: session.user.id
    })
    
    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this template' }, { status: 400 })
    }
    
    // Create new review
    const review = new Review({
      templateId: params.id,
      userId: session.user.id,
      userName: session.user.name || 'Anonymous',
      rating,
      comment: comment || '',
      isVerified: false // User has used the template system
    })
    
    await review.save()
    
    return NextResponse.json({ message: 'Review added successfully', review })
    
  } catch (error: unknown) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
} 