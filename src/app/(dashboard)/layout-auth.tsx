'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Middleware to check authentication
export default function AuthMiddleware({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (!data.authenticated) {
          // Redirect to login if not authenticated
          router.push('/login');
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Verifica autenticazione...</p>
      </div>
    );
  }

  return <>{children}</>;
}
