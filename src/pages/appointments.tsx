import { DashboardLayout } from '../components/dashboard-layout';
import { AppointmentsWithTimeSlots } from '../components/appointments-with-time-slots';

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <AppointmentsWithTimeSlots />
    </DashboardLayout>
  );
}