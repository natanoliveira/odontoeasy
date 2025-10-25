import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { SidebarProvider } from './ui/sidebar';
import { AuthGuard } from './auth-guard';

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRoles?: ('clinic' | 'admin')[];
}

export function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'clinic' | 'admin' | null>(null);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return;
    
    const role = localStorage.getItem('userRole') as 'clinic' | 'admin' | null;
    setUserRole(role);
  }, []);

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
      }
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthGuard allowedRoles={allowedRoles}>
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar userRole={userRole} onLogout={handleLogout} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onLogout={handleLogout} userRole={userRole} />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-6 p-4 pt-16 md:pt-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}