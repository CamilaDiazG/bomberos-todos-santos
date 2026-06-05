import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Inicializamos Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia', // Actualizado a la versión que exige la librería
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { equipmentId, title, price, category, locale } = body

    const validLocales = ['es', 'en']
    const safeLocale = validLocales.includes(locale) ? locale : 'es'
    const origin = request.headers.get('origin') ?? ''

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Donación para: ${title}`,
              description: `Categoría: ${category}`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/${safeLocale}/success?equipmentId=${equipmentId}&title=${encodeURIComponent(title)}`,
      cancel_url: `${origin}/${safeLocale}?canceled=true`,
      metadata: {
        equipmentId: equipmentId,
      },
    })

    //  Le devolveamos la URL segura de Stripe a nuestro frontend
    return NextResponse.json({ url: session.url })

  } catch (err: any) {
    console.error('Error al crear sesión de Stripe:', err)
    return NextResponse.json(
      { error: 'Error al procesar el pago con Stripe' },
      { status: 500 }
    )
  }
}