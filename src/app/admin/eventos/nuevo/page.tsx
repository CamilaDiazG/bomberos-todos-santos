// src/app/admin/eventos/nuevo/page.tsx
'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventSchema, type EventInput } from '@/lib/validations/events'
import { createEvent } from '@/actions/events'
import { useRouter } from 'next/navigation'

export default function NuevoEventoPage() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  
  const form = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title_es: '',
      title_en: '',
      description_es: '',
      description_en: '',
      type: 'community',
      starts_at: '',
      ends_at: '',
      location: '',
      capacity: 0,
      registration_url: '',
      published: true,
    }
  })

  function onSubmit(data: EventInput) {
    const formData = new FormData()
    // Convertimos el objeto data a FormData para pasarlo a la Server Action
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    startTransition(async () => {
      const result = await createEvent(formData)
      if (result.ok) {
        alert('¡Evento creado con éxito!')
        router.push('/admin/eventos') // Te regresa a la lista
      } else {
        alert('Error al crear el evento: ' + result.error)
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Crear Nuevo Evento</h1>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        
        {/* Títulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título (ES)</label>
            <input {...form.register('title_es')} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500" />
            {form.formState.errors.title_es && <p className="text-red-500 text-xs mt-1">{form.formState.errors.title_es.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título (EN)</label>
            <input {...form.register('title_en')} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500" />
          </div>
        </div>

        {/* Descripciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (ES)</label>
            <textarea {...form.register('description_es')} rows={3} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (EN)</label>
            <textarea {...form.register('description_en')} rows={3} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"></textarea>
          </div>
        </div>

        {/* Detalles Técnicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento</label>
            <select {...form.register('type')} className="w-full border border-gray-300 rounded-lg p-2.5 bg-white">
              <option value="community">Comunidad</option>
              <option value="fundraiser">Recaudación</option>
              <option value="course">Curso</option>
              <option value="training">Entrenamiento</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
            {/* Input nativo de fecha, a prueba de balas */}
            <input type="datetime-local" {...form.register('starts_at')} className="w-full border border-gray-300 rounded-lg p-2.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input type="text" {...form.register('location')} placeholder="Ej. Estación Central" className="w-full border border-gray-300 rounded-lg p-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad maxima</label>
            <input
              type="number"
              min="0"
              {...form.register('capacity')}
              placeholder="Ej. 40"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Liga de registro</label>
            <input
              type="url"
              {...form.register('registration_url')}
              placeholder="Google Forms o WhatsApp"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* Publicar */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <input type="checkbox" id="published" {...form.register('published')} className="w-4 h-4 text-red-600 rounded focus:ring-red-500" />
          <label htmlFor="published" className="text-sm font-medium text-gray-900">Publicar evento inmediatamente</label>
        </div>

        {/* Botón Guardar */}
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={pending}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {pending ? 'Guardando evento...' : 'Guardar Nuevo Evento'}
          </button>
        </div>

      </form>
    </div>
  )
}
