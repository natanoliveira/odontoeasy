import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/dashboard-layout';
import { Profile } from '../components/profile';

export default function ProfilePage() {
  const [userRole, setUserRole] = useState<'clinic' | 'admin' | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole') as 'clinic' | 'admin' | null;
    setUserRole(role);
  }, []);

  return (
    <DashboardLayout>
      <Profile userRole={userRole} />
    </DashboardLayout>
  );
}