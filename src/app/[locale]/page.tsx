'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DonateSection from '@/components/donateSection'

// Reciclamos nuestro tipo, pero enfocado en lo que verá el público
type EquipmentNeed = {
  id: string;
  title_es: string;
  description_es: string;
  category: string;
  estimated_cost_usd: number;
  current_amount_usd: number;
  cover_image_url: string; 
}

export default function PublicCatalogPage() {
  const [needs, setNeeds] = useState<EquipmentNeed[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchNeeds() {
      const { data, error } = await supabase
        .from('equipment_needs')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setNeeds((data as any) || [])
      }
      setIsLoading(false)
    }

    fetchNeeds()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado del catálogo */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-zinc-900 sm:text-5xl">
            Catálogo de Necesidades
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Ayuda a los Bomberos Todos Santos a conseguir el equipo vital para seguir protegiendo a la comunidad.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500 animate-pulse text-lg font-medium">
            Cargando el inventario desde Supabase...
          </div>
        ) : (
          /* Cuadrícula de Tarjetas */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {needs.map((item) => {
              // Calculamos el porcentaje para la barra de progreso
              const progress = Math.min((item.current_amount_usd / item.estimated_cost_usd) * 100, 100)
              
              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                  
                  {/* BLOQUE DE IMAGEN */}
                  {item.cover_image_url ? (
                    <div className="h-48 w-full bg-gray-200 overflow-hidden">
                      <img 
                        src={item.cover_image_url} 
                        alt={item.title_es}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-sm font-medium">Sin imagen</span>
                    </div>
                  )}

                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-zinc-900">{item.title_es}</h3>
                      <span className="bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                      {item.description_es}
                    </p>
                    
                    {/* Sección de Meta y Progreso */}
                    <div className="mt-auto">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-gray-500">Progreso</span>
                        <span className="font-bold text-zinc-900">
                          ${item.current_amount_usd} / ${item.estimated_cost_usd} USD
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className="bg-red-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 👇 Botón de Acción Extraído 👇 */}
                  <DonateSection item={item} />
                  
                </div>
              )
            })}
          </div>
        )}
        
        {!isLoading && needs.length === 0 && (
          <div className="text-center text-gray-500 bg-white p-12 rounded-2xl border border-gray-100 shadow-sm">
            Aún no hay necesidades publicadas.
          </div>
        )}
        
      </div>
    </div>
  )
}