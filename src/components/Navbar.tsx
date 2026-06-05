import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-zinc-900 border-b border-red-600 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo y Nombre */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🚒</span>
              <span className="font-extrabold text-white tracking-tight">
                Bomberos <span className="text-red-500">Todos Santos</span>
              </span>
            </Link>
          </div>

          {/* Enlaces de Navegación */}
          <div className="flex space-x-8 items-center">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Catálogo
            </Link>
            
            {/* Este es el que va a construir Karlo */}
            <Link 
              href="/about" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              Nosotros
            </Link>

            {/* Link secreto/discreto para ti como Admin */}
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