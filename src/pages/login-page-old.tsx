import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LoginPage } from '../components/login-page';

export default function Login() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = (role: 'clinic' | 'admin') => {
    // For now, just set a simple token - will be replaced with proper auth
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('userRole', role);
    }
    router.push('/dashboard');
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental-ocean-blue mb-4"></div>
          <p className="text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return <LoginPage onLogin={handleLogin} />;
}