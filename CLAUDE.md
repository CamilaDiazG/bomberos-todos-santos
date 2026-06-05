@AGENTS.md

# CLAUDE.md — Sistema Prompt para Agentes de IA

Plataforma de donaciones para la estación de bomberos de Todos Santos, BCS.
Stack: **Next.js 16.2.7 · React 19.2.4 · Tailwind CSS v4 · shadcn/ui (radix-nova) · Supabase (SSR) · Stripe 22.x · next-intl 4.x**

---

## 1. Comandos Útiles

```bash
npm run dev          # Servidor de desarrollo (Turbopack activado por defecto en Next 16)
npm run build        # Build de producción
npm run start        # Servidor de producción (requiere build previo)
npm run lint         # ESLint — flat config (eslint.config.mjs), next/core-web-vitals + next/typescript
npm run typecheck    # tsc --noEmit (TypeScript strict mode)
npm run db:types     # Regenera src/types/database.ts desde Supabase Cloud
```

**Variables de entorno requeridas** (nunca commitear `.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # Solo server — nunca exponer al cliente
STRIPE_SECRET_KEY=                # Solo server
STRIPE_WEBHOOK_SECRET=            # Solo server
```

---

## 2. Convenciones de Código — React / Next.js 16

### Server Components vs Client Components

| Situación | Decisión |
|---|---|
| Leer datos de Supabase para renderizar HTML | **Server Component** (default, sin directiva) |
| Usar `useState`, `useEffect`, `useRouter`, handlers de eventos | **`'use client'`** obligatorio |
| Formularios con react-hook-form | **`'use client'`** |
| Datos que cambian en tiempo real o con interacción del usuario | **`'use client'`** |
| Wrappers de layout estáticos | **Server Component** |

**Regla de oro:** el árbol de componentes debe ser Server por defecto. Solo "bajar" a `'use client'` en las hojas del árbol que realmente lo necesiten.

### Asincronía en Next.js 16 — `params` y `searchParams` son Promise

**CRÍTICO:** En Next.js 16, `params` y `searchParams` en páginas y layouts son `Promise<{...}>`. No son objetos síncronos.

```tsx
// ✅ CORRECTO — Next.js 16
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  // ...
}

// ❌ INCORRECTO — patrón de Next.js 14/15
export default function Page({ params }: { params: { locale: string } }) {
  const { locale } = params // TypeError en runtime
}
```

Lo mismo aplica para `searchParams`:
```tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const { success } = await searchParams
}
```

### Convenciones de Nombrado

- **Archivos de página/layout:** `page.tsx`, `layout.tsx`, `route.ts` (minúsculas, Next.js lo exige)
- **Componentes React:** PascalCase → `DonateSection.tsx`, `EquipmentCard.tsx`
- **Funciones utilitarias / hooks:** camelCase → `formatCurrency.ts`, `useEquipment.ts`
- **Rutas de API:** `src/app/api/[recurso]/route.ts`
- **Imports con alias:** siempre `@/` (mapea a `src/`) — nunca rutas relativas `../../`

### Internacionalización (next-intl v4)

Locales disponibles: `['es', 'en']`, defaultLocale: `'es'`, prefijo: `always`.

```tsx
// En Client Components — usar hooks de @/lib/i18n/routing
import { Link, useRouter, usePathname } from '@/lib/i18n/routing'

// En Server Components — usar next-intl/server
import { getTranslations } from 'next-intl/server'
const t = await getTranslations('namespace')

// ❌ NUNCA importar Link de 'next/link' en rutas localizadas
// ❌ NUNCA importar useRouter de 'next/navigation' en rutas localizadas
```

Todos los textos visibles al usuario en el área pública (`/[locale]/`) deben tener su clave en `src/lib/i18n/es.json` y `en.json`. El área `/admin` no usa i18n.

---

## 3. Arquitectura de Datos y Auth — Supabase

Existen **tres clientes distintos**. Usar el incorrecto rompe SSR o expone la `service_role_key`.

### Cliente 1 — Server Components y Server Actions
```ts
// src/lib/supabase/server.ts
import { createClient } from '@/lib/supabase/server'

// ⚠️ La función es async porque cookies() de next/headers es async en Next 16
const supabase = await createClient()
const { data } = await supabase.from('equipment_needs').select('*')
```
**Cuándo usarlo:** En cualquier Server Component, Server Action o Route Handler donde el usuario necesita respetar Row Level Security (RLS). Usa `ANON_KEY`.

### Cliente 2 — Client Components
```ts
// src/lib/supabase/client.ts
import { createClient } from '@/lib/supabase/client'

// La función es síncrona — llamar fuera del render (en el cuerpo del componente)
const supabase = createClient()
```
**Cuándo usarlo:** Dentro de componentes con `'use client'` para lecturas reactivas, auth client-side (signIn/signOut), o upload de archivos. Usa `ANON_KEY`.

### Cliente 3 — Admin / Bypass RLS
```ts
// src/lib/supabase/admin.ts
import { createAdminClient } from '@/lib/supabase/admin'

const supabase = createAdminClient()
```
**Cuándo usarlo:** Exclusivamente en Route Handlers (`src/app/api/`) o Server Actions que necesitan ignorar RLS (ej: el webhook de Stripe escribiendo en `equipment_needs`). Usa `SERVICE_ROLE_KEY`.

**⛔ NUNCA importar `createAdminClient` en un archivo con `'use client'`.**
**⛔ NUNCA usar `createClient` de `@supabase/supabase-js` directamente fuera de `admin.ts`.**

### Cliente en Middleware
El middleware (`src/middleware.ts`) construye su propio `createServerClient` de `@supabase/ssr` inline, gestionando manualmente las cookies de `NextRequest`/`NextResponse`. **No importar ninguno de los tres clientes de `@/lib/supabase/` desde el middleware** — la Edge Runtime no puede ejecutarlos.

### Tipos de Base de Datos
Siempre usar los tipos generados:
```ts
import type { Database } from '@/types/database'
import type { Tables, Enums } from '@/types/database'

type EquipmentNeed = Tables<'equipment_needs'>
type Priority = Enums<'priority_level'>  // 'critical' | 'high' | 'medium' | 'low'
type Category = Enums<'equipment_category'>  // 'epp' | 'tools' | 'vehicles' | 'medical' | 'communications' | 'station' | 'other'
```

Regenerar tipos tras migrar el schema: `npm run db:types`

---

## 4. Flujo Financiero — Stripe

### Configuración
```ts
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia', // versión fijada — no cambiar sin verificar changelog
})
```

### Reglas de Seguridad

1. **Nunca crear la intención de pago en el cliente.** El componente React llama a `POST /api/checkout`, que es quien crea la `checkout.session` en Stripe.

2. **El monto siempre lo calcula el servidor.** El cliente puede enviar `equipmentId`, nunca el precio. El servidor lo lee de Supabase.

3. **Verificar firma del webhook antes de procesar cualquier evento:**
   ```ts
   // src/app/api/webhook/route.ts
   const body = await req.text()          // ⚠️ texto crudo, no JSON
   const signature = req.headers.get('stripe-signature')!
   const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
   ```
   Si `constructEvent` lanza, devolver `400` inmediatamente.

4. **Idempotencia:** El webhook puede recibir el mismo evento más de una vez. Al procesar `checkout.session.completed`, verificar el estado actual antes de escribir. En el futuro, usar `session.payment_intent` como llave única en la tabla `donations`.

5. **Monedas:** Stripe trabaja en centavos (`unit_amount`). Siempre `Math.round(precio * 100)` al enviar y `/ 100` al recibir.

6. **PayPal:** La librería `@paypal/react-paypal-js` está instalada pero **no activa**. Antes de implementar, confirmar con el equipo. No asumir su integración.

---

## 5. Flujo de Git — Tickets y Commits

### Branching
```
feature/<descripcion-kebab>    # nueva funcionalidad
fix/<descripcion-kebab>        # corrección de bug
chore/<descripcion-kebab>      # configuración, deps, sin cambio funcional
refactor/<descripcion-kebab>   # refactor sin cambio de comportamiento
```
Ejemplos: `feature/volunteer-form`, `fix/webhook-idempotencia`, `chore/update-stripe-types`

### Conventional Commits
```
<tipo>(<scope>): <descripción en imperativo, minúsculas>

feat(donations): agrega formulario de donación con Stripe Checkout
fix(webhook): verifica firma antes de procesar evento
chore(deps): actualiza stripe a v22.2
refactor(admin): extrae lógica de formulario a hook useEquipmentForm
```

Tipos válidos: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `ci`

El scope es el área del sistema: `donations`, `admin`, `webhook`, `i18n`, `auth`, `equipment`, `volunteers`, `events`.

---

## 6. Componentes UI — shadcn/ui

### Configuración activa (components.json)
- **Style:** `radix-nova`
- **RSC:** `true` (los componentes son Server-compatible por defecto)
- **CSS variables:** `true`
- **Iconos:** `lucide-react`
- **Alias UI:** `@/components/ui`

### Uso correcto
```tsx
// Agregar un componente nuevo
npx shadcn@latest add button

// Importar siempre desde el alias ui
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
```

**⛔ No instalar componentes Radix UI directamente** si ya existen en shadcn — duplica código y rompe el tema.

### Tailwind CSS v4
No existe `tailwind.config.js` ni `tailwind.config.ts`. La configuración se hace en el CSS global (`src/app/globals.css`) con directivas `@theme`. Los colores del tema usan CSS custom properties.

```tsx
// ✅ Clases de utilidad normales
<div className="bg-background text-foreground" />

// ❌ No intentar importar un archivo tailwind.config — no existe
```

---

## 7. Formularios

Stack disponible: `react-hook-form` + `@hookform/resolvers` + `zod` v4. **Estas librerías SÍ están en package.json** y son la opción preferida para formularios nuevos.

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  amount: z.number().min(1),
})

export function DonationForm() {
  const form = useForm({ resolver: zodResolver(schema) })
}
```

**⚠️ Zod v4 rompe compatibilidad con Zod v3.** Si ves errores de tipos con `z.infer`, verificar que el resolver sea de `@hookform/resolvers/zod` (compatible con v4).

---

## 8. Restricciones y Prevención de Alucinaciones

### Estado Global
**No hay Redux, Zustand, Jotai, ni React Query en este proyecto.** Verificar `package.json` antes de sugerir cualquier librería de estado. El estado actual es local con `useState`/`useEffect`.

### Patrones Confirmados vs Especulados
- `react-hook-form` + `zod` → **confirmado en package.json, no en uso activo aún**
- `resend` → **instalado, no integrado aún**
- `@sentry/nextjs` → **instalado, configuración no verificada**
- `@vercel/analytics` → **instalado, no verificado**
- Tests (Jest, Vitest, Playwright) → **NO están en package.json**

### Antes de Escribir Código
1. Si la tarea involucra Next.js (routing, params, middleware, Server Actions), leer `node_modules/next/dist/docs/` antes de asumir el API.
2. Si la tarea involucra Supabase, confirmar qué cliente (`server`, `client`, `admin`) corresponde al contexto de ejecución.
3. Si la tarea involucra un componente UI, verificar si ya existe en `src/components/ui/` antes de crearlo desde cero.
4. Si hay duda entre Server Component y Client Component, preferir Server Component e ir bajando solo cuando TypeScript o el comportamiento lo exijan.

### Esquema de Base de Datos
Las tablas existentes son: `admin_users`, `donations`, `equipment_needs`, `events`, `posts`, `site_settings`, `station_stats`, `volunteers`. **No asumir la existencia de tablas adicionales** — correr `npm run db:types` para sincronizar.
