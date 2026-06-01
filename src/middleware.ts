import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/lib/i18n/routing'
import { createServerClient } from '@supabase/ssr'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Saltar i18n para rutas de admin y API
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      // Auth guard
      const response = NextResponse.next()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (cookiesToSet) => {
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              )
            },
          },
        }
      )

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Verificar rol de admin
      const { data: admin } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .single()

      if (!admin) {
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      return response
    }
    return NextResponse.next()
  }

  // Aplicar i18n para rutas públicas
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ]
}