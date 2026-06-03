import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/i18n/routing'
import '@/app/globals.css'

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className="antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          
          {/* HEADER PÚBLICO */}
          <header className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm">
            <h1 className="font-bold text-xl text-red-600">
               Bomberos Todos Santos
            </h1>
            {/* Aquí luego Karlo puede meter el selector de idiomas de Shadcn */}
            <div className="text-sm font-medium text-gray-500 uppercase">
              {locale}
            </div>
          </header>

          {/* CONTENIDO DE LAS PÁGINAS */}
          <main className="flex-grow bg-gray-50">
            {children}
          </main>

          {/* FOOTER */}
          <footer className="py-6 text-center border-t border-gray-200 bg-white text-sm text-gray-500">
            © {new Date().getFullYear()} Patronato de Bomberos Todos Santos.
          </footer>

        </NextIntlClientProvider>
      </body>
    </html>
  )
}