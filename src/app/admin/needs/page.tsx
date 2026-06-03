'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Definimos la estructura exacta que acabamos de armar en la base de datos
type EquipmentNeed = {
  id: string;
  title_es: string;
  category: string;
  priority: string;
  status: string;
  estimated_cost_usd: number;
  quantity_needed: number;
}

export default function AdminNeedsPage() {
  const [needs, setNeeds] = useState<EquipmentNeed[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchNeeds() {
      // Mandamos llamar a Supabase
      const { data, error } = await supabase
        .from('equipment_needs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error cargando equipo:', error.message)
      } else {
        // Ponemos el "as" hasta el final para forzar la validación de todo el resultado
        setNeeds((data as any) || [])
      }
      setIsLoading(false)
    }

    fetchNeeds()
  }, [])

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Inventario de Necesidades</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition">
          + Nuevo Equipo
        </button>
      </div>

      {isLoading ? (
        <p className="text-zinc-500 animate-pulse">Cargando datos desde Supabase...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Equipo (ES)</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-center">Cantidad</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Categoría</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Prioridad</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Estado</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-right">Costo Unitario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {needs.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.title_es}</td>
                  <td className="px-6 py-4 text-gray-900 text-center font-medium">{item.quantity_needed}</td>
                  <td className="px-6 py-4 text-gray-600 uppercase text-xs">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      item.priority === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 capitalize text-sm">{item.status}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium text-right">
                    ${item.estimated_cost_usd.toLocaleString()} USD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {needs.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No hay necesidades registradas. Haz clic en "Nuevo Equipo" para empezar.
            </div>
          )}
        </div>
      )}
    </div>
  )
}