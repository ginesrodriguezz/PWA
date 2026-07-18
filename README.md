# Gym Progress Tracker

App web mobile-first para registrar entrenamientos de gimnasio: rutinas, series, pesos y repeticiones, con recuerdo automático del último entrenamiento por ejercicio.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19 + TypeScript
- [TailwindCSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) + [Lucide Icons](https://lucide.dev)
- [next-intl](https://next-intl.dev) (ES/EN)
- [next-themes](https://github.com/pacocoursey/next-themes) (dark/light)
- [TanStack Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- [Supabase](https://supabase.com) (Auth + PostgreSQL, sin backend separado)
- [Framer Motion](https://www.framer.com/motion/)
- Despliegue en [Vercel](https://vercel.com)

## Requisitos

- Node.js 20+
- Una cuenta y proyecto en [Supabase](https://supabase.com)

## Crear el proyecto en Supabase

1. Crea un proyecto nuevo en [supabase.com/dashboard](https://supabase.com/dashboard).
2. Ve a **Project Settings → API** y copia `Project URL` y `anon public key`.
3. Ve a **SQL Editor** y ejecuta, en orden, los archivos de `supabase/migrations/` (`0001_init.sql`, `0002_rls.sql`, `0003_seed_exercises.sql`). También puedes aplicarlos con la [Supabase CLI](https://supabase.com/docs/guides/cli): `supabase db push`.
4. (Opcional) Regenera los tipos TypeScript desde el esquema real:

   ```bash
   npx supabase gen types typescript --project-id <tu-project-id> > src/types/database.types.ts
   ```

## Puesta en marcha

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar el archivo de variables de entorno y rellenarlo con las credenciales de tu proyecto Supabase (Project Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   `NEXT_PUBLIC_SITE_URL` debe apuntar a la URL pública de despliegue en producción (Vercel).

3. Aplicar las migraciones SQL en Supabase (SQL Editor o CLI) — ver `supabase/migrations/`.

4. Configurar la plantilla de email **Reset Password** en el Dashboard de Supabase (Authentication → Email Templates), sustituyendo el enlace por defecto para que pase por la ruta de confirmación de la app:

   ```
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next={{ .RedirectTo }}
   ```

5. Arrancar el entorno de desarrollo:

   ```bash
   npm run dev
   ```

   La app estará disponible en `http://localhost:3000` (redirige a `/es` por idioma por defecto).

## Estructura del proyecto

```
src/
  app/[locale]/     Rutas (App Router) con i18n
  components/        ui/ (shadcn), layout/, cards/, inputs/, feedback/
  hooks/             Hooks de datos (TanStack Query)
  services/          Acceso a Supabase por dominio
  lib/               Clientes Supabase, validaciones Zod, utils
  types/             Tipos generados y de dominio
  i18n/              Config de next-intl
messages/            Traducciones ES/EN
supabase/migrations/ Migraciones SQL (schema, RLS, seed)
```

## Scripts

- `npm run dev` — entorno de desarrollo (Turbopack)
- `npm run build` — build de producción
- `npm run start` — servidor de producción
- `npm run lint` — linting

## Despliegue

Listo para desplegar en [Vercel](https://vercel.com/new): importar el repositorio y configurar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` como variables de entorno del proyecto.
