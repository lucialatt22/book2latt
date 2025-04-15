import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentUser } from '@/lib/auth/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const authenticated = isAuthenticated();
    const user = getCurrentUser();
    
    // Return authentication status
    return NextResponse.json({ 
      authenticated, 
      user: authenticated ? user : null 
    });
  } catch (error) {
    console.error('Authentication check error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}
