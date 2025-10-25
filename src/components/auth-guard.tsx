import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: ('clinic' | 'admin')[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'clinic' | 'admin' | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if we're on the client side
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }
        
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('userRole') as 'clinic' | 'admin' | null;
        
        if (!token) {
          router.push('/login');
          return;
        }

        if (allowedRoles && role && !allowedRoles.includes(role)) {
          router.push('/dashboard');
          return;
        }

        setIsAuthenticated(true);
        setUserRole(role);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental-ocean-blue mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}