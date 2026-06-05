export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f2ede6]">
      {/* Hero */}
      <section className="bg-zinc-900 text-white py-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <img
            src="/logo-bomberos-todos-santos-removebg-preview.png"
            alt="Bomberos Todos Santos"
            className="mx-auto h-24 w-24 object-contain mb-6"
          />
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Bomberos <span className="text-red-500">Todos Santos</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Voluntarios al servicio de nuestra comunidad en Todos Santos, BCS, México.
          </p>
        </div>
      </section>

      {/* Contenido principal — placeholder */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-12">

          {/* Misión */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">Nuestra Misión</h2>
            <p className="text-zinc-600 leading-relaxed">
              {/* TODO: agregar texto */}
              Contenido próximamente.
            </p>
          </div>

          {/* Historia */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">Historia</h2>
            <p className="text-zinc-600 leading-relaxed">
              {/* TODO: agregar texto */}
              Contenido próximamente.
            </p>
          </div>

          {/* Equipo */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">Nuestro Equipo</h2>
            <p className="text-zinc-600 leading-relaxed">
              {/* TODO: agregar texto */}
              Contenido próximamente.
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
