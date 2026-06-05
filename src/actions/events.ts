'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { eventSchema } from '@/lib/validations/events'
import { slugify } from '@/lib/utils'

type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; issues?: unknown }

type AdminCheckResult =
  | { ok: true; user: NonNullable<Awaited<ReturnType<Awaited<ReturnType<typeof createClient>>['auth']['getUser']>>['data']['user']> }
  | { ok: false; error: string }

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { ok: false, error: 'No autenticado' } satisfies AdminCheckResult
  
  // TRUCO: Usamos el AdminClient para saltarnos el RLS al leer la tabla
  const adminClient = createAdminClient()
  const { data: admin, error } = await adminClient
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .single()
    
  if (!admin) {
    console.error("Error interno verificando admin:", error)
    return { ok: false, error: 'No autorizado' } satisfies AdminCheckResult
  }
  
  return { ok: true, user } satisfies AdminCheckResult
}

export async function createEvent(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const auth = await requireAdmin()
  if (!auth.ok) return { ok: false, error: auth.error }

  const raw = Object.fromEntries(formData)
  const parsed = eventSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Datos invalidos',
      issues: parsed.error.flatten().fieldErrors,
    }
  }

  const admin = createAdminClient()
  const slug = slugify(parsed.data.title_es)

  const { data, error } = await admin
    .from('events')
    .insert({ ...parsed.data, slug })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }

  revalidatePath('/[locale]/eventos', 'page')
  revalidatePath('/admin/eventos')

  return { ok: true, data: { id: data.id } }
}

export async function deleteEvent(id: string): Promise<ActionResult<void>> {
  const auth = await requireAdmin()
  if (!auth.ok) return { ok: false, error: auth.error }

  const admin = createAdminClient()
  const { error } = await admin.from('events').delete().eq('id', id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/[locale]/eventos', 'page')
  revalidatePath('/admin/eventos')

  return { ok: true, data: undefined }
}
