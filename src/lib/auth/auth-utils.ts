import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { User, Session } from './auth-types';

// Function to hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Function to compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Function to create session
export function createSession(user: User): void {
  // Create session expiration date (24 hours from now)
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);
  
  // Create session object
  const session: Session = {
    user,
    expires
  };
  
  // Store session in cookie
  cookies().set('session', JSON.stringify(session), {
    expires,
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  }) ;
}

// Function to get current session
export function getSession(): Session | null {
  const sessionCookie = cookies().get('session');
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const session: Session = JSON.parse(sessionCookie.value);
    
    // Check if session has expired
    if (new Date(session.expires) < new Date()) {
      cookies().delete('session');
      return null;
    }
    
    return session;
  } catch (error) {
    cookies().delete('session');
    return null;
  }
}

// Function to get current user
export function getCurrentUser(): User | null {
  const session = getSession();
  return session?.user || null;
}

// Function to check if user is authenticated
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

// Function to check if user has required role
export function hasRole(requiredRole: 'admin' | 'production' | 'staff'): boolean {
  const user = getCurrentUser();
  
  if (!user) {
    return false;
  }
  
  // Admin has access to everything
  if (user.role === 'admin') {
    return true;
  }
  
  return user.role === requiredRole;
}

// Function to require authentication
export function requireAuth() {
  if (!isAuthenticated()) {
    redirect('/login');
  }
}

// Function to require specific role
export function requireRole(role: 'admin' | 'production' | 'staff') {
  requireAuth();
  
  if (!hasRole(role)) {
    redirect('/unauthorized');
  }
}

// Function to logout
export function logout(): void {
  cookies().delete('session');
}
