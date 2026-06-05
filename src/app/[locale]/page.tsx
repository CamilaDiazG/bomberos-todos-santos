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
  estimated_cost_usd: number; // Precio de 1 solo equipo
  current_amount_usd: number; // Dinero donado hasta ahora
  cover_image_url: string; 
  quantity_needed: number;    // Meta física
  quantity_received: number;  // Equipos donados en especie
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado del catálogo */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-zinc-900 sm:text-5xl tracking-tight">
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
              // Calculamos el costo total multiplicando costo unitario por la cantidad de equipos
              const totalCost = item.estimated_cost_usd * item.quantity_needed
              // Calculamos el porcentaje basado en la meta total
              const progress = Math.min((item.current_amount_usd / totalCost) * 100, 100) || 0
              
              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                  
                  {/* BLOQUE DE IMAGEN MEJORADO */}
                  {item.cover_image_url ? (
                    <div className="h-56 w-full bg-white flex items-center justify-center p-4 border-b border-gray-100 overflow-hidden">
                      <img 
                        src={item.cover_image_url} 
                        alt={item.title_es}
                        className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-56 w-full bg-gray-50 flex items-center justify-center border-b border-gray-100">
                      <span className="text-gray-400 text-sm font-medium">Sin imagen</span>
                    </div>
                  )}

                  {/* CUERPO DE LA TARJETA */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-zinc-900 leading-tight">{item.title_es}</h3>
                      <span className="bg-red-50 text-red-700 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ml-3 shrink-0">
                        {item.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-6 flex-grow leading-relaxed text-sm">
                      {item.description_es}
                    </p>
                    
                    {/* PANEL DESGLOSADO DE MÉTRICAS */}
                    <div className="bg-zinc-50 rounded-xl p-4 mb-6 border border-zinc-100">
                      <div className="flex justify-between items-center mb-2 pb-2 border-b border-zinc-200 border-dashed text-sm">
                        <span className="text-zinc-500 font-medium">Costo unitario</span>
                        <span className="font-semibold text-zinc-800">${item.estimated_cost_usd} USD</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500 font-medium">Equipos conseguidos</span>
                        <span className="font-bold text-zinc-900 bg-white px-2 py-0.5 rounded shadow-sm border border-zinc-100">
                          {item.quantity_received} / {item.quantity_needed}
                        </span>
                      </div>
                    </div>
                    
                    {/* SECCIÓN DE META FINANCIERA */}
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-bold text-zinc-400 uppercase tracking-wider">Recaudación</span>
                        <span className="font-bold text-zinc-900">
                          ${item.current_amount_usd} / ${totalCost} USD
                        </span>
                      </div>
                      <div className="w-full bg-zinc-100 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botón de Acción Extraído */}
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