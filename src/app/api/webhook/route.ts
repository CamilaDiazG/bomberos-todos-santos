import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

// Usamos el service_role para que el servidor pueda escribir en la tabla ignorando el RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  // Stripe necesita el "cuerpo crudo" de la petición para validar la firma de seguridad
  const body = await req.text()
  const signature = req.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('⚠️ Error verificando el webhook:', error.message)
    return new NextResponse(`Error de Webhook: ${error.message}`, { status: 400 })
  }

  // Si el evento es de un pago completado con éxito...
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    const equipmentId = session.metadata?.equipmentId
    const amountTotal = session.amount_total // Viene en centavos (ej. 45000)

    if (equipmentId && amountTotal) {
      const amountInUsd = amountTotal / 100 // Lo regresamos a dólares

      // 1. Buscamos cuánto dinero tiene el equipo actualmente
      const { data: equipo } = await supabase
        .from('equipment_needs')
        .select('current_amount_usd')
        .eq('id', equipmentId)
        .single()

      if (equipo) {
        // 2. Le sumamos el nuevo donativo y lo guardamos
        const nuevoTotal = equipo.current_amount_usd + amountInUsd
        
        await supabase
          .from('equipment_needs')
          .update({ current_amount_usd: nuevoTotal })
          .eq('id', equipmentId)
          
        console.log(`✅ ¡Donativo de $${amountInUsd} USD registrado para el equipo ${equipmentId}!`)
      }
    }
  }

  return new NextResponse('OK', { status: 200 })
}