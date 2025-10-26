import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError } from '../../../middleware/errorHandler';
import { applyCors } from '../../../middleware/cors';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/dashboard/stats
 *
 * GET - Get dashboard statistics
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  const handled = await applyCors(req, res);
  if (handled) return;

  try {
    const clinicId = await getClinicId(req);

    if (req.method === 'GET') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

      // Execute all queries in parallel
      const [
        totalPatients,
        activePatients,
        totalProfessionals,
        todayAppointments,
        monthAppointments,
        pendingAppointments,
        completedAppointments,
        todayRevenue,
        monthRevenue,
        totalTreatments,
        activeTreatments,
      ] = await Promise.all([
        // Total patients
        prisma.patient.count({ where: { clinicId } }),
        // Active patients (with appointments in last 6 months)
        prisma.patient.count({
          where: {
            clinicId,
            appointments: {
              some: {
                date: {
                  gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
                },
              },
            },
          },
        }),
        // Total professionals
        prisma.professional.count({ where: { clinicId, status: 'ACTIVE' } }),
        // Today's appointments
        prisma.appointment.count({
          where: {
            clinicId,
            date: { gte: today, lt: tomorrow },
          },
        }),
        // This month's appointments
        prisma.appointment.count({
          where: {
            clinicId,
            date: { gte: firstDayOfMonth, lt: firstDayOfNextMonth },
          },
        }),
        // Pending appointments
        prisma.appointment.count({
          where: {
            clinicId,
            status: { in: ['PENDING', 'CONFIRMED'] },
            date: { gte: today },
          },
        }),
        // Completed appointments this month
        prisma.appointment.count({
          where: {
            clinicId,
            status: 'COMPLETED',
            date: { gte: firstDayOfMonth, lt: firstDayOfNextMonth },
          },
        }),
        // Today's revenue (completed appointments)
        prisma.appointment.aggregate({
          where: {
            clinicId,
            status: 'COMPLETED',
            date: { gte: today, lt: tomorrow },
          },
          _sum: { value: true },
        }),
        // This month's revenue
        prisma.appointment.aggregate({
          where: {
            clinicId,
            status: 'COMPLETED',
            date: { gte: firstDayOfMonth, lt: firstDayOfNextMonth },
          },
          _sum: { value: true },
        }),
        // Total treatments
        prisma.treatment.count({ where: { clinicId } }),
        // Active treatments
        prisma.treatment.count({
          where: { clinicId, status: { in: ['PLANNED', 'IN_PROGRESS'] } },
        }),
      ]);

      const stats = {
        patients: {
          total: totalPatients,
          active: activePatients,
        },
        professionals: {
          total: totalProfessionals,
        },
        appointments: {
          today: todayAppointments,
          thisMonth: monthAppointments,
          pending: pendingAppointments,
          completed: completedAppointments,
        },
        revenue: {
          today: todayRevenue._sum.value || 0,
          thisMonth: monthRevenue._sum.value || 0,
        },
        treatments: {
          total: totalTreatments,
          active: activeTreatments,
        },
      };

      console.log('\n\n', stats);
      return res.status(200).json({ stats });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
