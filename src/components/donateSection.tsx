'use client'

import { useState } from 'react'

// Definimos lo que recibe el componente (puedes ajustar el tipo si lo tienes exportado)
export default function DonateSection({ item }: { item: any }) {
  const [showInput, setShowInput] = useState(false)
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    // Validación básica: mínimo 10 dólares/pesos
    if (!amount || Number(amount) < 10) {
      alert("Por favor ingresa un monto válido (mínimo $10).")
      return
    }
    
    setIsLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentId: item.id,
          title: item.title_es,
          price: Number(amount), // 👈 Aquí mandamos lo que el usuario escribió
          category: item.category
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No se generó el link de pago")
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un problema al iniciar el donativo.')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 mt-auto">
      {!showInput ? (
        <button 
          onClick={() => setShowInput(true)}
          className="w-full bg-zinc-900 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 shadow-sm"
        >
          Donar para este equipo
        </button>
      ) : (
        <div className="flex flex-col space-y-3 animate-in fade-in zoom-in duration-200">
          <label className="text-sm font-semibold text-zinc-700">
            ¿Cuánto deseas aportar? (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-zinc-500 font-medium">$</span>
            <input
              type="number"
              min="10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              placeholder="Ej. 50"
              autoFocus
            />
          </div>
          <div className="flex space-x-2 pt-1">
            <button
              onClick={() => setShowInput(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center"
            >
              {isLoading ? 'Procesando...' : 'Pagar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}