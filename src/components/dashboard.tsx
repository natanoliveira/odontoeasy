import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Users,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
  UserCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useDashboardStats } from '../hooks/use-dashboard-stats';
import { useTodayAppointments } from '../hooks/use-appointments';

// Alerts remain static for now
const alerts = [
  { id: 1, message: 'Bem-vindo ao OdontoGestor!', type: 'info' },
  { id: 2, message: 'Sistema integrado com banco de dados', type: 'info' },
];

export function Dashboard() {
  const { statsDash, loading: statsLoading, error: statsError } = useDashboardStats();
  const { appointments, loading: appointmentsLoading, error: appointmentsError } = useTodayAppointments();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return { variant: 'default' as const, text: 'Confirmado' };
      case 'SCHEDULED':
        return { variant: 'secondary' as const, text: 'Agendado' };
      case 'IN_PROGRESS':
        return { variant: 'default' as const, text: 'Em Andamento' };
      case 'COMPLETED':
        return { variant: 'secondary' as const, text: 'Concluído' };
      case 'CANCELLED':
        return { variant: 'destructive' as const, text: 'Cancelado' };
      case 'NO_SHOW':
        return { variant: 'destructive' as const, text: 'Não Compareceu' };
      default:
        return { variant: 'secondary' as const, text: status };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Dashboard</h1>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Ver Agenda Completa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-dental-ocean-blue" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : statsError ? (
              <div className="text-sm text-destructive">Erro ao carregar</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{statsDash?.stats.patients.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {statsDash?.stats.patients.active || 0} ativos
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <Clock className="h-4 w-4 text-dental-ocean-blue" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : statsError ? (
              <div className="text-sm text-destructive">Erro ao carregar</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{statsDash?.stats.appointments.today || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {statsDash?.stats.appointments.pending || 0} pendentes
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-dental-ocean-blue" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : statsError ? (
              <div className="text-sm text-destructive">Erro ao carregar</div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  R$ {(statsDash?.stats.revenue.thisMonth || 0).toLocaleString('pt-BR')}
                </div>
                <p className="text-xs text-muted-foreground">
                  R$ {(statsDash?.stats.revenue.today || 0).toLocaleString('pt-BR')} hoje
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tratamentos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-dental-ocean-blue" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : statsError ? (
              <div className="text-sm text-destructive">Erro ao carregar</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{statsDash?.stats.treatments.active || 0}</div>
                <p className="text-xs text-muted-foreground">
                  De {statsDash?.stats.treatments.total || 0} totais
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Consultas</CardTitle>
            <CardDescription>Agendamentos para hoje</CardDescription>
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : appointmentsError ? (
              <div className="text-sm text-destructive">Erro ao carregar agendamentos</div>
            ) : appointments.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                Nenhum agendamento para hoje
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => {
                  const statusBadge = getStatusBadge(appointment.status);
                  return (
                    <div key={appointment.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{appointment.patient.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {appointment.startTime} - {appointment.professional?.name || 'Não atribuído'}
                          </span>
                        </div>
                      </div>
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.text}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas e Notificações</CardTitle>
            <CardDescription>Itens que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${alert.type === 'info' ? 'text-blue-500' :
                    alert.type === 'warning' ? 'text-yellow-500' :
                      'text-red-500'
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesso rápido às funcionalidades principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col space-y-2">
              <UserCheck className="h-6 w-6" />
              <span>Novo Paciente</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Agendar Consulta</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}