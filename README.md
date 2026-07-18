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
3. Ve a **SQL Editor** y ejecuta, en orden, todos los archivos de `supabase/migrations/` (`0001_init.sql` → `0006_restore_workout_exercises_fk.sql`). También puedes aplicarlos con la [Supabase CLI](https://supabase.com/docs/guides/cli): `supabase db push`. Tras `0005_exercise_library.sql`, importa el catálogo de ejercicios con `npm run import:exercises` (ver variables de entorno adicionales que requiere en `scripts/import-exercises.ts`).
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
- `npm run import:exercises` — importa el catálogo de ejercicios (imágenes/gifs + metadatos) a Supabase Storage/DB. Solo se ejecuta manualmente y en local, requiere `SUPABASE_SERVICE_ROLE_KEY` — **no** se usa en el build de Vercel.

## Despliegue

Listo para desplegar en [Vercel](https://vercel.com/new): importar el repositorio y configurar como variables de entorno del proyecto (Production y Preview):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (la clave `publishable`, nunca la `service_role`/`secret`)
- `NEXT_PUBLIC_SITE_URL` — la URL pública del despliegue (p. ej. `https://tu-app.vercel.app` o el dominio propio)

No añadas `SUPABASE_SERVICE_ROLE_KEY` ni `PASSWORD` a Vercel: no los usa la aplicación, solo el script de importación local.

Después del primer despliegue, en el Dashboard de Supabase → **Authentication → URL Configuration**:

- **Site URL**: la misma URL de producción.
- **Redirect URLs**: añade `https://tu-app.vercel.app/**` (y el dominio propio si lo usas, y las URLs de preview de Vercel si las necesitas) — si no, los enlaces de confirmación de email y de restablecimiento de contraseña seguirán apuntando a `localhost`.
