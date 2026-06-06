# Bomberos Todos Santos

Plataforma web para el Patronato de Bomberos Voluntarios de Todos Santos, BCS, México. Permite a la comunidad conocer las necesidades de equipo del cuerpo de bomberos, realizar donaciones en línea y mantenerse informada sobre eventos.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS v4 |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Pagos | Stripe Elements (PaymentIntent API) |
| Internacionalización | next-intl v4 (ES / EN) |
| Monitoreo | Sentry |
| Analíticas | Vercel Analytics |
| Despliegue | Vercel |

---

## Funcionalidades

### Pública
- **Catálogo de necesidades** — lista de equipo con costo, progreso de recaudación e imágenes
- **Donaciones** — flujo de pago en tarjeta (Stripe Elements, MXN) con dos modos:
  - *Donación dirigida*: vinculada a un artículo específico, con barra de progreso y tope máximo
  - *Donación general*: una vez o mensual, con tarjeta de impacto
- **Eventos** — calendario de actividades de la estación
- **Nosotros** — historia y misión del cuerpo de bomberos
- **Idioma** — español e inglés (prefijo `/es` / `/en` en la URL)

### Admin (protegido por autenticación)
- Gestión de necesidades de equipo
- Creación y administración de eventos
- Acceso en `/admin` con sesión de Supabase Auth

---

## Estructura del proyecto

```
src/
├── app/
│   ├── [locale]/           # Rutas públicas con i18n
│   │   ├── page.tsx        # Catálogo de necesidades
│   │   ├── donate/         # Página de donación (Stripe Elements)
│   │   ├── about/          # Nosotros
│   │   ├── eventos/        # Eventos públicos
│   │   └── layout.tsx      # Layout con Navbar + Footer
│   ├── admin/              # Panel de administración
│   │   ├── login/
│   │   ├── needs/
│   │   └── eventos/
│   └── api/
│       ├── payment-intent/ # Crea PaymentIntent en Stripe
│       ├── checkout/       # Checkout legacy (compatibilidad)
│       └── webhook/        # Recibe eventos de Stripe
├── components/
│   ├── DonationFlow.tsx    # Formulario de donación con Stripe Elements
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── donateSection.tsx
├── lib/
│   ├── i18n/               # Traducciones ES/EN y configuración de rutas
│   └── supabase/           # Clientes server / client / admin
├── actions/
│   └── events.ts           # Server Actions para eventos
├── middleware.ts            # Autenticación admin + routing i18n
└── types/
    └── database.ts         # Tipos generados desde Supabase
```

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz con las siguientes variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## Instalación y desarrollo

```bash
# Instalar dependencias
npm install

# Si hay errores de versión, actualiza Next.js y React antes de continuar
npm install next@latest react@latest react-dom@latest

# Iniciar servidor de desarrollo
npm run dev

# Verificar tipos
npm run typecheck

# Generar tipos desde Supabase
npm run db:types
```

La aplicación estará disponible en `http://localhost:3000`. El middleware redirige automáticamente a `/es` por defecto.

---

## Pruebas de donación (Stripe test mode)

Solo funcionan mientras `STRIPE_SECRET_KEY` empiece con `sk_test_`.

### Tarjetas de prueba

| Número | Resultado |
|---|---|
| `4242 4242 4242 4242` | Pago aprobado |
| `4000 0000 0000 0002` | Pago rechazado |
| `4000 0025 0000 3155` | Requiere autenticación 3D Secure |

**Datos comunes:** fecha futura cualquiera (ej. `12/26`) · CVC cualquiera (ej. `123`) · CP cualquiera (ej. `12345`)

---

## Webhooks de Stripe

Para probar pagos en local necesitas el CLI de Stripe:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Copia el `whsec_...` que genera y ponlo en `STRIPE_WEBHOOK_SECRET`.

---

## Despliegue

El proyecto está configurado para Vercel. Agrega las variables de entorno en el dashboard de Vercel y conecta el repositorio. El webhook de Stripe en producción debe apuntar a `https://tu-dominio.com/api/webhook`.

---

## Usuarios admin

Los usuarios con acceso al panel `/admin` se gestionan directamente en **Supabase Auth** (Authentication → Users).

| Usuario | Rol |
|---|---|
| a00842489@tec.mx · `cisco` | Administrador |

> Para crear un nuevo admin: en el dashboard de Supabase ve a **Authentication → Users → Invite user** e ingresa el correo. El usuario recibirá un enlace para establecer su contraseña.

---

## Contribución

Rama principal de desarrollo: `develop`. Crea ramas con el prefijo `feat/`, `fix/` o `chore/` según el tipo de cambio y abre un Pull Request hacia `develop`.

---

*Patronato de Bomberos Voluntarios de Todos Santos A.C. — Todos Santos, BCS, México*
