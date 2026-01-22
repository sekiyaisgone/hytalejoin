import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Do NOT run auth checks on static assets or API routes
  // This prevents unnecessary auth calls and potential issues
  const pathname = request.nextUrl.pathname;

  // Skip auth for API routes (they handle their own auth)
  if (pathname.startsWith('/api/')) {
    return supabaseResponse;
  }

  // Refreshing the auth token - this is crucial for session persistence
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Helper function to create redirect with preserved cookies
  const createRedirectResponse = (url: URL) => {
    const redirectResponse = NextResponse.redirect(url);
    // Copy all cookies from supabaseResponse to preserve session refresh
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, {
        ...cookie,
        // Ensure secure settings for production
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    });
    return redirectResponse;
  };

  // Protected routes - require authentication
  const protectedPaths = ['/dashboard', '/admin', '/servers/new', '/servers/edit'];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return createRedirectResponse(url);
  }

  // Admin routes - require admin role
  if (pathname.startsWith('/admin') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return createRedirectResponse(url);
    }
  }

  // Auth pages - redirect authenticated users away
  const authPaths = ['/login', '/signup', '/forgot-password'];
  const isAuthPath = authPaths.some((path) => pathname === path);

  if (isAuthPath && user) {
    const url = request.nextUrl.clone();
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    url.pathname = redirectParam || '/dashboard';
    url.search = ''; // Clear search params
    return createRedirectResponse(url);
  }

  return supabaseResponse;
}
