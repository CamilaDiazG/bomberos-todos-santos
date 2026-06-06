'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { ShieldCheck, Flame, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export type EquipmentItem = {
  id: string
  title_es: string
  estimated_cost_usd: number | null
  estimated_cost_mxn: number | null
  current_amount_usd: number | null
  quantity_needed: number
  quantity_received: number | null
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

const PRESET_AMOUNTS = [200, 500, 1000, 2500, 5000]
const FEE_RATE = 0.036

const ELEMENT_OPTS = {
  style: {
    base: {
      fontSize: '15px',
      color: '#18181b',
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '::placeholder': { color: '#a1a1aa' },
    },
    invalid: { color: '#dc2626' },
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeRemaining(item: EquipmentItem): {
  totalGoalUsd: number
  currentUsd: number
  progressPct: number
  remainingMxn: number
} {
  const currentUsd = item.current_amount_usd ?? 0
  const totalGoalUsd = (item.estimated_cost_usd ?? 0) * item.quantity_needed

  const progressPct =
    totalGoalUsd > 0 ? Math.min((currentUsd / totalGoalUsd) * 100, 100) : 0

  let remainingMxn: number
  if (item.estimated_cost_mxn && item.estimated_cost_usd && item.estimated_cost_usd > 0) {
    const rate = item.estimated_cost_mxn / item.estimated_cost_usd
    const totalMxn = item.estimated_cost_mxn * item.quantity_needed
    const currentMxn = currentUsd * rate
    remainingMxn = Math.max(totalMxn - currentMxn, 0)
  } else {
    remainingMxn = Math.max(totalGoalUsd - currentUsd, 0) * 17
  }

  return { totalGoalUsd, currentUsd, progressPct, remainingMxn }
}

// ── Inner form (needs Elements context) ──────────────────────────────────────

interface InnerProps {
  item: EquipmentItem | null
}

function DonationInner({ item }: InnerProps) {
  const stripe = useStripe()
  const elements = useElements()

  const isDirected = item !== null

  // For directed donations, frequency is always 'once' and hidden
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('monthly')
  const effectiveFrequency = isDirected ? 'once' : frequency

  const [selectedAmount, setSelectedAmount] = useState(500)
  const [isCustom, setIsCustom] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [coverFee, setCoverFee] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const base = isCustom ? Number(customAmount) || 0 : selectedAmount
  const fee = Math.round(base * FEE_RATE)
  const total = coverFee ? base + fee : base

  // Directed: compute cap
  const { totalGoalUsd, currentUsd, progressPct, remainingMxn } = item
    ? computeRemaining(item)
    : { totalGoalUsd: 0, currentUsd: 0, progressPct: 0, remainingMxn: Infinity }

  const isFulfilled = isDirected && remainingMxn <= 0
  const isOverCap = isDirected && !isFulfilled && total > remainingMxn && remainingMxn !== Infinity
  const isValid = total >= 10 && !isOverCap && !isFulfilled

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !isValid) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          itemId: item?.id ?? null,
          title: item?.title_es ?? 'Donativo general',
          frequency: effectiveFrequency,
        }),
      })

      const { clientSecret, error: apiError } = await res.json()
      if (apiError) throw new Error(apiError)

      const cardNumber = elements.getElement(CardNumberElement)
      if (!cardNumber) throw new Error('No se encontró el elemento de tarjeta')

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardNumber },
      })

      if (stripeError) throw new Error(stripeError.message)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message ?? 'Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-12 text-center max-w-md shadow-sm border border-zinc-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-zinc-900 mb-3">¡Gracias por tu donativo!</h2>
          <p className="text-zinc-500 mb-8">
            Tu aportación llega directamente a la estación de Todos Santos.
          </p>
          <Link
            href="/"
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-block"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  // ── Main form ───────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="bg-[#f2ede6] px-4 py-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 items-start">

        {/* ── PANEL IZQUIERDO ──────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Cabecera */}
          <div>
            <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Donación segura
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-none">
              HAZ TU DONATIVO
            </h1>
            {isDirected && (
              <p className="mt-3 text-sm font-semibold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg inline-block">
                Para: {item!.title_es}
              </p>
            )}
            {!isDirected && (
              <p className="mt-3 text-zinc-500 text-sm leading-relaxed max-w-lg">
                Apoya a la brigada de voluntarios de Todos Santos. El 100% se queda en la estación.
              </p>
            )}
          </div>

          {/* Paso 1: Elige el monto */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
            <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest mb-4">
              1 · Elige tu donativo
            </p>

            {/* Frequency tabs — solo en donación general */}
            {!isDirected && (
              <div className="flex rounded-xl border border-zinc-200 p-1 bg-zinc-50 mb-5">
                <button
                  type="button"
                  onClick={() => setFrequency('once')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    frequency === 'once'
                      ? 'bg-white shadow-sm text-zinc-900'
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  Una vez
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('monthly')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    frequency === 'monthly'
                      ? 'bg-white shadow-sm text-red-600'
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Mensual
                </button>
              </div>
            )}

            {/* Grid de montos */}
            <div className="grid grid-cols-3 gap-3">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => { setSelectedAmount(amt); setIsCustom(false) }}
                  className={`py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                    !isCustom && selectedAmount === amt
                      ? 'border-red-600 text-red-600 bg-red-50'
                      : 'border-zinc-200 text-zinc-800 bg-white hover:border-zinc-300'
                  }`}
                >
                  ${amt.toLocaleString('es-MX')}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`py-3 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-1 ${
                  isCustom
                    ? 'border-red-600 text-red-600 bg-red-50'
                    : 'border-zinc-200 text-zinc-500 bg-white hover:border-zinc-300'
                }`}
              >
                <span className="text-zinc-400 mr-0.5">$</span> Otro
              </button>
            </div>

            {isCustom && (
              <div className="mt-3 relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-semibold">$</span>
                <input
                  type="number"
                  min={10}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Escribe el monto"
                  className="w-full pl-8 pr-4 py-3 border-2 border-red-200 focus:border-red-500 rounded-xl outline-none text-zinc-900 font-semibold bg-white"
                  autoFocus
                />
              </div>
            )}

            {/* Advertencia de monto máximo */}
            {isOverCap && (
              <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-xl">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  El monto supera el faltante para esta meta.{' '}
                  <strong>Máximo: ${Math.floor(remainingMxn).toLocaleString('es-MX')} MXN</strong>
                </span>
              </div>
            )}
          </div>

          {/* Paso 3: Forma de pago */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
            <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest mb-4">
              3 · Forma de pago
            </p>

            <div className="mb-5">
              <div className="inline-flex px-5 py-2 text-sm font-bold rounded-lg bg-white border-2 border-zinc-900 text-zinc-900 items-center gap-2">
                <span className="flex">
                  <span className="w-4 h-2.5 bg-yellow-400 rounded-sm inline-block" />
                  <span className="-ml-1.5 w-4 h-2.5 bg-red-500 rounded-sm inline-block opacity-80" />
                </span>
                Tarjeta
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                  Número de tarjeta
                </label>
                <div className="border border-zinc-200 rounded-xl px-4 py-3.5 bg-white focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-50 transition-all">
                  <CardNumberElement options={{ ...ELEMENT_OPTS, showIcon: true }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                    MM / AA
                  </label>
                  <div className="border border-zinc-200 rounded-xl px-4 py-3.5 bg-white focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-50 transition-all">
                    <CardExpiryElement options={ELEMENT_OPTS} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                    CVC
                  </label>
                  <div className="border border-zinc-200 rounded-xl px-4 py-3.5 bg-white focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-50 transition-all">
                    <CardCvcElement options={ELEMENT_OPTS} />
                  </div>
                </div>
              </div>

              <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Procesado de forma segura con Stripe.
              </p>

              <label className="flex items-start gap-3 cursor-pointer bg-zinc-50 rounded-xl p-4 border border-zinc-100 hover:bg-zinc-100 transition-colors">
                <input
                  type="checkbox"
                  checked={coverFee}
                  onChange={(e) => setCoverFee(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-red-600 cursor-pointer shrink-0"
                />
                <div>
                  <span className="text-sm font-semibold text-zinc-800">
                    Cubrir la comisión de procesamiento (+${fee} MXN)
                  </span>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Añade ~3.6% para que la estación reciba el monto completo
                  </p>
                </div>
              </label>

              {error && (
                <p className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── PANEL DERECHO ────────────────────────────────── */}
        <div className="sticky top-24 flex flex-col gap-4">

          {/* Resumen (siempre visible) */}
          <div className="bg-zinc-900 rounded-2xl p-6 text-white">
            <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400 mb-4">
              Resumen
            </p>
            <div className="flex flex-col gap-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Tu donativo</span>
                <span className="font-semibold">
                  ${base.toLocaleString('es-MX')} MXN
                  {effectiveFrequency === 'monthly' ? ' /mes' : ''}
                </span>
              </div>
              {coverFee && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Comisión cubierta</span>
                  <span className="font-semibold">+${fee}</span>
                </div>
              )}
            </div>
            <div className="border-t border-zinc-700 pt-4 mb-5">
              <div className="flex justify-between items-end">
                <span className="text-zinc-400 text-sm">Total a pagar</span>
                <div className="text-right">
                  <span className="text-3xl font-extrabold leading-none">
                    ${total.toLocaleString('es-MX')}
                  </span>
                  <span className="text-xs text-zinc-400 ml-1">
                    MXN{effectiveFrequency === 'monthly' ? '/mes' : ''}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !stripe || !isValid}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-4 rounded-xl transition-colors text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Procesando...</span>
              ) : isFulfilled ? (
                'Meta alcanzada ✓'
              ) : (
                <>♥ DONAR $ {total.toLocaleString('es-MX')}</>
              )}
            </button>
          </div>

          {/* Tarjeta de progreso — solo en donación dirigida */}
          {isDirected && item && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-0.5">
                    Recaudación
                  </p>
                  <p className="text-sm font-semibold text-zinc-800 truncate">{item.title_es}</p>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mb-3">
                <div className="w-full bg-zinc-100 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-red-600 h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>${currentUsd.toLocaleString('en-US')} USD recaudados</span>
                  <span className="font-semibold text-zinc-700">{Math.round(progressPct)}%</span>
                </div>
              </div>

              <div className="text-center py-2 bg-zinc-50 rounded-xl border border-zinc-100">
                <p className="text-xs text-zinc-500 mb-0.5">Meta total</p>
                <p className="text-lg font-extrabold text-zinc-900">
                  ${totalGoalUsd.toLocaleString('en-US')} USD
                </p>
              </div>

              {isFulfilled ? (
                <div className="mt-3 bg-green-50 border border-green-100 text-green-700 text-sm font-semibold px-3 py-2 rounded-xl text-center">
                  ✓ Meta completamente alcanzada
                </div>
              ) : (
                <p className="mt-3 text-xs text-zinc-500 text-center">
                  Faltante aprox.{' '}
                  <strong className="text-zinc-700">
                    ${Math.floor(remainingMxn).toLocaleString('es-MX')} MXN
                  </strong>
                </p>
              )}
            </div>
          )}

          {/* Tarjeta de impacto — solo en donación general */}
          {!isDirected && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                  <img
                    src="/logo-bomberos-todos-santos-removebg-preview.png"
                    alt="Bomberos Todos Santos"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-wide mb-1">
                    Tu impacto
                  </p>
                  <p className="text-sm text-zinc-700 leading-snug">
                    {base >= 2500
                      ? 'Cubre el mantenimiento mensual de un equipo de protección.'
                      : 'Cubre el combustible de una semana de respuestas.'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  'Pago cifrado y seguro',
                  'Recibo deducible de impuestos',
                  '100% para la estación',
                ].map((label) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-zinc-500">
                    <div className="w-3.5 h-3.5 rounded-full border border-red-300 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}

// ── Public wrapper ────────────────────────────────────────────────────────────

export interface DonationFlowProps {
  item?: EquipmentItem | null
}

export function DonationFlow({ item = null }: DonationFlowProps) {
  return (
    <Elements stripe={stripePromise}>
      <DonationInner item={item} />
    </Elements>
  )
}
