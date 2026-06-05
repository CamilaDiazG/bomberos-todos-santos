import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export async function POST(request: Request) {
  try {
    const { amount, itemId, title, frequency } = await request.json()

    if (!amount || Number(amount) < 10) {
      return NextResponse.json({ error: 'Monto mínimo: $10 MXN' }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'mxn',
      payment_method_types: ['card'],
      metadata: {
        itemId: itemId ?? '',
        title: title ?? 'Donativo general',
        frequency: frequency ?? 'once',
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: any) {
    console.error('Error creating PaymentIntent:', err)
    return NextResponse.json({ error: 'Error al procesar el pago' }, { status: 500 })
  }
}
