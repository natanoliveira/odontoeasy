import { DashboardLayout } from '../components/dashboard-layout';
import { Patients } from '../components/patients';

export default function PatientsPage() {
  return (
    <DashboardLayout>
      <Patients />
    </DashboardLayout>
  );
}