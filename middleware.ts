import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Middleware to check authentication for API routes
export function middleware(request: NextRequest) {
  // Skip authentication check for login and logout routes
  if (
    request.nextUrl.pathname === '/api/auth/login' ||
    request.nextUrl.pathname === '/api/auth/logout' ||
    request.nextUrl.pathname === '/api/auth/check'
  ) {
    return NextResponse.next();
  }
  
  // Check if user is authenticated
  const sessionCookie = cookies().get('session');
  
  if (!sessionCookie) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  try {
    const session = JSON.parse(sessionCookie.value);
    
    // Check if session has expired
    if (new Date(session.expires) < new Date()) {
      cookies().delete('session');
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }
    
    // Continue to API route
    return NextResponse.next();
  } catch (error) {
    cookies().delete('session');
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
};
