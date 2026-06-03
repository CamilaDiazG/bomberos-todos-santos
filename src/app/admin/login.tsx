'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Esta ruta la crearemos después para validar el token
        emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
      },
    })

    if (error) {
      setMessage(' Error: ' + error.message)
    } else {
      setMessage('¡Revisa tu correo! Te enviamos un link para entrar.')
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl border-t-8 border-red-600">
        <h1 className="text-2xl font-bold mb-2 text-center text-zinc-900">Comandancia</h1>
        <p className="text-center text-zinc-500 mb-8 text-sm">Ingresa tu correo oficial para acceder al sistema</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="comandante@bomberostodossantos.com"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-2.5 rounded-md hover:bg-red-700 font-bold transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Enviando...' : 'Solicitar Acceso'}
          </button>
          
          {message && (
            <div className="p-3 mt-4 rounded-md bg-zinc-100 text-sm font-medium text-center text-zinc-800">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}