'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Actualizamos el tipo para incluir ABSOLUTAMENTE TODO lo que necesita tu BD y el catálogo público
type EquipmentNeed = {
  id?: string;
  title_es: string;
  description_es: string;
  category: string;
  priority: string;
  status: string;
  estimated_cost_usd: number;
  current_amount_usd: number;
  quantity_needed: number;
  cover_image_url: string;
}

export default function AdminNeedsPage() {
  const [needs, setNeeds] = useState<EquipmentNeed[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // Estados del Formulario
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('epp')
  const [priority, setPriority] = useState('high')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Función para cargar los datos de la tabla
  const fetchNeeds = async () => {
    const { data, error } = await supabase
      .from('equipment_needs')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setNeeds((data as any) || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchNeeds()
  }, [])

  // Función maestra que guarda el equipo y sube la foto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let cover_image_url = ''

      // 1. Subir foto si existe
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('equipment-images')
          .upload(fileName, imageFile)

        if (uploadError) throw new Error('Error subiendo la imagen')

        const { data: publicUrlData } = supabase.storage
          .from('equipment-images')
          .getPublicUrl(fileName)
          
        cover_image_url = publicUrlData.publicUrl
      }

        // Generamos el slug automáticamente
        const generatedSlug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

        // 2. Guardar en la base de datos
        const { error: dbError } = await supabase
          .from('equipment_needs')
          .insert([
            {
              title_es: title,
              title_en: title, // 👈 ¡El clon en inglés para burlar la seguridad!
              description_es: description,
              description_en: description, // 👈 Por si las moscas, también cubrimos este
              slug: generatedSlug,
              category: category,
              priority: priority,
              status: 'active',
              estimated_cost_usd: parseFloat(price),
              current_amount_usd: 0,
              quantity_needed: parseInt(quantity),
              cover_image_url: cover_image_url
            } as any
          ])

      if (dbError) throw new Error(`Error BD: ${dbError.message}`)

      // 3. Limpiar formulario y recargar tabla
      setTitle('')
      setDescription('')
      setPrice('')
      setQuantity('1')
      setImageFile(null)
      alert('¡Equipo agregado con éxito! 🚒')
      fetchNeeds() // Recargamos tu tabla para que aparezca luego luego

    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }


    // Función para cerrar sesión
    const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Inventario de Necesidades</h1>
        <button 
          onClick={handleLogout} 
          className="text-sm font-medium text-zinc-500 hover:text-red-600 transition"
        >
         Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PANEL IZQUIERDO: EL FORMULARIO NUEVO */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">+ Agregar Nuevo Equipo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-red-500 focus:border-red-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio USD</label>
                <input type="number" required min="1" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                <input type="number" required min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-red-500 focus:border-red-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-red-500 focus:border-red-500">
                  <option value="epp">EPP</option>
                  <option value="tools">Herramientas</option>
                  <option value="medical">Médico</option>
                  <option value="vehicles">Vehículos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-red-500 focus:border-red-500">
                  <option value="high">Alta (High)</option>
                  <option value="critical">Crítica</option>
                  <option value="medium">Media</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Foto del Equipo</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción (Para el catálogo)</label>
              <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-red-500 focus:border-red-500" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50">
              {isSubmitting ? 'Guardando...' : 'Guardar Equipo'}
            </button>
          </form>
        </div>

        {/* PANEL DERECHO: TU TABLA ORIGINAL */}
        <div className="lg:col-span-2">
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
                      <td className="px-6 py-4 text-gray-900 font-medium text-right">
                        ${item.estimated_cost_usd.toLocaleString()} USD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {needs.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No hay necesidades registradas. Usa el formulario para empezar.
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}