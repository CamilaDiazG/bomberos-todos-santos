import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Inicializamos Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia', // Actualizado a la versión que exige la librería
})

export async function POST(request: Request) {
  try {
    //Recibimos los datos que nos mandará el botón de "Donar"
    const body = await request.json()
    const { equipmentId, title, price, category } = body

    //Le pedimos a Stripe que cree una "Sesión de Pago"
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
            // Stripe maneja los centavos, así que multiplicamos por 100
            unit_amount: Math.round(price * 100), 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // ¿A dónde mandamos al usuario después de pagar (o cancelar)?
      // Usamos el header 'origin' para saber si estamos en localhost o ya en producción
      success_url: `${request.headers.get('origin')}/en?success=true&equipment=${equipmentId}`,
      cancel_url: `${request.headers.get('origin')}/en?canceled=true`,
      
      // Metadatos ocultos que usaremos luego para el Webhook
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