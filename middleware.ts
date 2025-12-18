import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession()

  // Public routes that don't require auth
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password']
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // Dashboard routes that need protection
  const dashboardRoutes = ['/fan', '/creator', '/admin']
  const isDashboardRoute = dashboardRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // If no session and trying to access dashboard route, redirect to login
  if (!session && isDashboardRoute) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is logged in and trying to access auth pages, redirect to dashboard based on role
  if (session && isPublicRoute) {
    // Fetch user role to redirect to appropriate dashboard
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (user?.role === 'creator') {
      return NextResponse.redirect(new URL('/creator', req.url))
    } else if (user?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url))
    } else {
      return NextResponse.redirect(new URL('/fan', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
