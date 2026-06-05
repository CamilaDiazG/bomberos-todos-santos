import '@/app/globals.css'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        {/* Aquí adentro es donde Next.js va a inyectar tu page.tsx de login y de needs */}
        <div className="min-h-screen md:flex">
          <aside className="bg-white border-r border-zinc-200 p-4 md:w-64">
            <div className="mb-6 px-4 py-2">
              <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Admin
              </p>
            </div>
            <nav className="space-y-1">
              <Link
                href="/admin/needs"
                className="block px-4 py-2 text-zinc-600 hover:bg-red-50 hover:text-red-600 rounded-lg"
              >
                 Necesidades
              </Link>

              <Link
                href="/admin/eventos/nuevo"
                className="block px-4 py-2 text-zinc-600 hover:bg-red-50 hover:text-red-600 rounded-lg"
              >
                 Eventos
              </Link>
            </nav>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
