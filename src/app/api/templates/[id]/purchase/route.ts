import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import connectDB from '@/lib/db'
import Template from '@/models/Template'
import Purchase from '@/models/Purchase'
import { stripe, calculateFees } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Get template details
    const template = await Template.findById(params.id)
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    if (template.price === 0) {
      return NextResponse.json({ error: 'This template is free' }, { status: 400 })
    }

    // Check if user already purchased this template
    const existingPurchase = await Purchase.findOne({
      userId: session.user.id,
      templateId: params.id,
      status: 'completed'
    })

    if (existingPurchase) {
      return NextResponse.json({ error: 'Template already purchased' }, { status: 400 })
    }

    // Calculate fees
    const priceInCents = Math.round(template.price * 100) // Convert to cents
    const fees = calculateFees(priceInCents)

    // Create Stripe checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: template.name,
              description: template.description,
              images: template.previewImage ? [template.previewImage] : [],
              metadata: {
                templateId: template._id.toString(),
                creatorId: template.createdBy.toString(),
              }
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/templates?purchase_success=true&template_id=${template._id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/templates?purchase_cancelled=true`,
      client_reference_id: session.user.id,
      metadata: {
        templateId: template._id.toString(),
        creatorId: template.createdBy.toString(),
        userId: session.user.id,
        platformFee: fees.platformFee.toString(),
        creatorAmount: fees.creatorAmount.toString(),
      },
    }

    const checkoutSession = await stripe.checkout.sessions.create(sessionParams)

    // Create pending purchase record
    const purchase = new Purchase({
      userId: session.user.id,
      templateId: template._id,
      templateName: template.name,
      creatorId: template.createdBy,
      amount: template.price,
      platformFee: fees.platformFee / 100, // Convert back to dollars
      creatorAmount: fees.creatorAmount / 100,
      stripeSessionId: checkoutSession.id,
      status: 'pending',
    })

    await purchase.save()

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id 
    })

  } catch (error: any) {
    console.error('Purchase error:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
} 