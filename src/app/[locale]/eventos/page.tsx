import { createAdminClient } from '@/lib/supabase/admin'
import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function EventsPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const supabase = createAdminClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .order('starts_at', { ascending: true })

  if (error) {
    return <div className="text-center py-20 text-red-500">Error al cargar los eventos.</div>
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight uppercase">
            {locale === 'en' ? 'Upcoming Events' : 'Proximos Eventos'}
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            {locale === 'en'
              ? 'Join us and support the Todos Santos Fire Department.'
              : 'Acompananos y apoya a los Bomberos de Todos Santos.'}
          </p>
        </div>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt) => {
              const title = locale === 'en' ? evt.title_en : evt.title_es
              const description = locale === 'en' ? evt.description_en : evt.description_es
              const whatsappNumber = '5216120000000'
              const whatsappMessage = encodeURIComponent(
                `Hola, quiero registrarme al evento: ${title}`
              )
              const registrationLink =
                evt.registration_url || `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
                      {evt.type}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">
                      {title}
                    </h3>
                    {evt.starts_at && (
                      <p className="text-gray-600 text-sm mb-4">
                        {new Date(evt.starts_at).toLocaleDateString(
                          locale === 'en' ? 'en-US' : 'es-MX',
                          {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    )}
                    {description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {description}
                      </p>
                    )}
                    <div className="mt-auto space-y-3">
                      {evt.location && (
                        <div className="text-sm font-medium text-zinc-500">
                          Ubicacion: {evt.location}
                        </div>
                      )}
                      {evt.capacity !== null && evt.capacity !== undefined && evt.capacity > 0 && (
                        <div className="text-sm font-semibold text-zinc-700">
                          {locale === 'en' ? 'Maximum capacity' : 'Capacidad maxima'}: {evt.capacity}
                        </div>
                      )}
                      <a
                        href={registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-bold text-white transition-colors hover:bg-red-600"
                      >
                        {locale === 'en' ? 'Register' : 'Registrarse'}
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 bg-white p-12 rounded-2xl border border-gray-100 shadow-sm">
            {locale === 'en'
              ? 'No upcoming events at the moment.'
              : 'No hay eventos programados por el momento.'}
          </div>
        )}
      </div>
    </main>
  )
}
