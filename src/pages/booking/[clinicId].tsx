import { useRouter } from 'next/router';
import { PublicBooking } from '../../components/public-booking';

export default function ClinicBookingPage() {
  const router = useRouter();
  const { clinicId } = router.query;

  return <PublicBooking clinicId={clinicId as string} />;
}