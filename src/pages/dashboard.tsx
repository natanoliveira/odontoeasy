import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/dashboard-layout';
import { Dashboard } from '../components/dashboard';
import { AdminDashboard } from '../components/admin-dashboard';

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<'clinic' | 'admin' | null>(null);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return;
    
    const role = localStorage.getItem('userRole') as 'clinic' | 'admin' | null;
    setUserRole(role);
  }, []);

  return (
    <DashboardLayout>
      {userRole === 'admin' ? <AdminDashboard /> : <Dashboard />}
    </DashboardLayout>
  );
}