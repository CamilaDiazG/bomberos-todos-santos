import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './lib/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  // 1. Si la persona está intentando entrar a la zona de /admin...
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Armamos un mini-cliente de Supabase especial para el Middleware
    let supabaseResponse = NextResponse.next({ request: { headers: request.headers } })
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options })
            supabaseResponse = NextResponse.next({
              request: { headers: request.headers },
            })
            supabaseResponse.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options })
            supabaseResponse = NextResponse.next({
              request: { headers: request.headers },
            })
            supabaseResponse.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Le preguntamos a Supabase: "¿Esta persona tiene sesión activa?"
    const { data: { session } } = await supabase.auth.getSession()

    const isLoginPage = request.nextUrl.pathname === '/admin/login'

    // Si NO tiene sesión y no está en el login, ¡patealo al login!
    if (!session && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // Si SÍ tiene sesión y está en el login, mándalo directo al panel
    if (session && isLoginPage) {
      return NextResponse.redirect(new URL('/admin/needs', request.url))
    }

    return supabaseResponse
  }

  // 2. Si no es /admin, dejamos que next-intl maneje el idioma para la vista pública
  return intlMiddleware(request)
}

export const config = {
  // Le agregamos |.*\..* para que ignore todos los archivos estáticos (.png, .jpg, etc.)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
}