import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "@/lib/database.types"

const PROFILE_HOME: Record<string, string> = {
  cliente: "/cliente",
  funcionario: "/equipa",
  administrador: "/admin",
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/registo" ||
    pathname === "/" ||
    pathname.startsWith("/auth")
  const isProtectedArea =
    pathname.startsWith("/cliente") ||
    pathname.startsWith("/equipa") ||
    pathname.startsWith("/admin")

  if (!user && isProtectedArea) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (user && isPublicRoute && pathname !== "/") {
    const { data: perfil } = await supabase
      .from("utilizadores")
      .select("tipo_utilizador")
      .eq("id", user.id)
      .single()

    const destino = perfil ? PROFILE_HOME[perfil.tipo_utilizador] : "/login"
    const url = request.nextUrl.clone()
    url.pathname = destino
    return NextResponse.redirect(url)
  }

  // Route-level "does this profile belong here" checks happen in each area's
  // layout (it needs the exact tipo_utilizador anyway); this pass only
  // handles the coarse authenticated/public split so it stays cheap.

  return supabaseResponse
}
