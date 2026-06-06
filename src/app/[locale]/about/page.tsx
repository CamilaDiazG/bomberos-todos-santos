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

      <section className="mx-auto max-w-4xl px-6 py-16 flex flex-col gap-10">

        {/* Sobre Nosotros */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">Sobre Nosotros</h2>
          <div className="flex flex-col gap-4 text-zinc-600 leading-relaxed">
            <p>
              Somos el cuerpo de bomberos de Todos Santos, un equipo comprometido con la seguridad,
              el bienestar y la protección de nuestra comunidad. Nuestro trabajo va más allá de
              atender emergencias: somos una familia unida por la vocación de servicio, la valentía
              y el deseo de ayudar a los demás en los momentos más difíciles.
            </p>
            <p>
              Nuestra historia se ha construido con esfuerzo y dedicación a lo largo de los años.
              Desde nuestros inicios, hemos enfrentado grandes retos, muchas veces con recursos
              limitados, pero siempre con la firme convicción de estar presentes cuando nuestra
              comunidad nos necesita. Hoy, contamos con bomberos de distintas generaciones que han
              crecido dentro de esta institución, formándose desde jóvenes hasta convertirse en
              oficiales comprometidos y preparados.
            </p>
            <p>
              Creemos en la importancia de la capacitación constante. A lo largo del tiempo, hemos
              participado en entrenamientos y congresos nacionales e internacionales, donde
              fortalecemos nuestras habilidades en áreas como rescate, atención de emergencias,
              manejo de tecnología y técnicas especializadas. Esto nos permite ofrecer un servicio
              cada vez más profesional y eficiente.
            </p>
            <p>
              Somos también una institución que valora la experiencia de quienes han construido este
              camino. Fundadores como Manuel Salvador Cadena Moyrons, con casi tres décadas de
              servicio, representan el espíritu de entrega y compromiso que define a nuestro equipo.
              Su trayectoria, junto con la energía de las nuevas generaciones, mantiene viva nuestra
              misión.
            </p>
          </div>
        </div>

        {/* Cita destacada */}
        <blockquote className="border-l-4 border-red-600 pl-6 py-2">
          <p className="text-xl font-semibold text-zinc-800 leading-snug italic">
            "Ser bombero en Todos Santos no es solo una labor, es un estilo de vida. Es estar listos
            en todo momento, es trabajar en equipo, es servir sin esperar nada a cambio."
          </p>
        </blockquote>

        {/* Fundador */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Un fundador, casi 30 años de historia</h2>
          <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mb-6">
            Manuel Salvador Cadena Moyrons · Fundador
          </p>
          <div className="flex flex-col gap-4 text-zinc-600 leading-relaxed">
            <p>
              Manuel Salvador —"Chava"— es originario de Todos Santos. Carpintero desde los catorce
              años y bombero voluntario con casi veintinueve años de servicio, es uno de los dos
              fundadores del cuerpo que siguen activos hasta hoy.
            </p>
            <p>
              En los primeros años, la formación era un reto enorme. Chava tuvo que viajar dos veces
              a Estados Unidos al <em>Bombero Program</em> para capacitarse, cuando aún no existían
              los recursos ni las redes que hay hoy. Con el tiempo, vio crecer a los que ahora son
              oficiales: al teniente Jesús, quien llegó a los catorce años, y a otros que conoció
              desde los siete u once años y hoy lideran el equipo.
            </p>
            <p>
              Hoy, las nuevas generaciones participan en congresos internacionales de bomberos —
              Tijuana, San José del Cabo — donde se forman en rescate de bajo ángulo, áreas
              confinadas, drones, rescate automotriz y más, junto a brigadas de talla internacional
              de países como Chile.
            </p>
          </div>
        </div>

        {/* Cierre con foto */}
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="/474656173_632730815800378_6761194745116708550_n.jpg"
            alt="Bomberos Todos Santos"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-zinc-900/60 flex flex-col items-center justify-center text-white text-center px-6">
            <p className="text-2xl font-extrabold tracking-tight mb-2">
              Somos bomberos. Somos comunidad.
            </p>
            <p className="text-gray-200 text-lg">Estamos para todos.</p>
          </div>
        </div>

      </section>
    </main>
  )
}
