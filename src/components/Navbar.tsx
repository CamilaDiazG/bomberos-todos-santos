import { Link } from '@/lib/i18n/routing'

export default function Navbar() {
  return (
    <nav className="bg-zinc-900 border-b border-red-600 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo-bomberos-todos-santos-removebg-preview.png"
                alt="Bomberos Todos Santos"
                className="h-9 w-9 object-contain"
              />
              <span className="font-extrabold text-white tracking-tight">
                Bomberos <span className="text-red-500">Todos Santos</span>
              </span>
            </Link>
          </div>

          <div className="flex space-x-8 items-center">
            <Link
              href="/"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Catálogo
            </Link>

            <Link
              href="/about"
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Nosotros
            </Link>

            <Link
              href="/donate"
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-1.5 rounded-lg transition-colors text-sm"
            >
              Donar
            </Link>

            <Link
              href="/admin/login"
              className="text-zinc-600 hover:text-red-500 text-sm font-medium transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}