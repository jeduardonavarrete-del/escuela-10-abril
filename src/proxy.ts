import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_ROUTES = {
  admin: ['/admin'],
  trabajo_social: ['/trabajo-social'],
  staff: ['/admin', '/trabajo-social'],
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  const isStaffRoute = PROTECTED_ROUTES.staff.some(r => pathname.startsWith(r))

  if (isStaffRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isStaffRoute) {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('rol')
      .eq('user_id', user.id)
      .single()

    const rol = roleData?.rol

    if (pathname.startsWith('/admin') && rol !== 'admin') {
      return NextResponse.redirect(new URL('/no-autorizado', request.url))
    }

    if (pathname.startsWith('/trabajo-social') && rol !== 'trabajo_social' && rol !== 'admin') {
      return NextResponse.redirect(new URL('/no-autorizado', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/trabajo-social/:path*', '/login'],
}
