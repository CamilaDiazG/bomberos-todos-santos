import '@/app/globals.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        {/* Aquí adentro es donde Next.js va a inyectar tu page.tsx de login y de needs */}
        {children}
      </body>
    </html>
  )
}