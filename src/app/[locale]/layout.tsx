import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/i18n/routing'
import Navbar from '@/components/Navbar' // Tu nuevo Navbar
import { Footer } from '@/components/Footer'
import '@/app/globals.css' // Importación única de tus estilos

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
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
          
          {/* EL PASILLO MAESTRO */}
          <Navbar />

          {/* CONTENIDO DE LAS PÁGINAS */}
          <main className="flex-grow bg-gray-50">
            {children}
          </main>

          <Footer />

        </NextIntlClientProvider>
      </body>
    </html>
  )
}