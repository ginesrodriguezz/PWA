import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "@/types/database.types"
import { routing } from "@/i18n/routing"

const AUTH_PATHS = ["/login", "/register", "/forgot-password"]
const PUBLIC_PATHS = ["/reset-password"]

function stripLocale(pathname: string) {
  const match = pathname.match(
    new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`)
  )
  return match ? pathname.slice(match[0].length) || "/" : pathname
}

export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = stripLocale(request.nextUrl.pathname)
  const isAuthPath = AUTH_PATHS.some(
    (p) => path === p || path.startsWith(`${p}/`)
  )
  const isPublicPath =
    path === "/" ||
    isAuthPath ||
    PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`))

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = url.pathname.replace(path, "/login")
    return NextResponse.redirect(url)
  }

  if (user && isAuthPath) {
    const url = request.nextUrl.clone()
    url.pathname = url.pathname.replace(path, "/dashboard")
    return NextResponse.redirect(url)
  }

  return response
}
