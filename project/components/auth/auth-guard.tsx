'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      try {
        const adminUser = localStorage.getItem('adminUser');
        if (adminUser) {
          const userData = JSON.parse(adminUser);
          // Check if login is still valid (optional: add expiry check)
          const loginTime = new Date(userData.loginTime);
          const now = new Date();
          const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
          
          // Session expires after 24 hours
          if (hoursSinceLogin < 24) {
            setIsAuthenticated(true);
            return;
          } else {
            // Session expired, remove from localStorage
            localStorage.removeItem('adminUser');
          }
        }
        
        // Not authenticated, store current path for redirect after login
        localStorage.setItem('redirectAfterLogin', pathname);
        setIsAuthenticated(false);
        router.push('/admin');
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('adminUser');
        setIsAuthenticated(false);
        router.push('/admin');
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EC6546] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, the redirect will happen in useEffect
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}