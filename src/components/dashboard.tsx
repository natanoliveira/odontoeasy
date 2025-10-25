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
  AlertCircle
} from 'lucide-react';

// Mock data
const dashboardStats = {
  totalPatients: 247,
  todayAppointments: 12,
  monthlyRevenue: 15420,
  pendingDocuments: 5
};

const recentAppointments = [
  { id: 1, patient: 'Maria Silva', time: '09:00', type: 'Limpeza', status: 'confirmed' },
  { id: 2, patient: 'João Santos', time: '10:30', type: 'Consulta', status: 'pending' },
  { id: 3, patient: 'Ana Costa', time: '14:00', type: 'Tratamento', status: 'confirmed' },
  { id: 4, patient: 'Pedro Lima', time: '15:30', type: 'Emergência', status: 'urgent' },
];

const alerts = [
  { id: 1, message: 'Lembrete: Consulta com Maria Silva em 30 minutos', type: 'info' },
  { id: 2, message: '3 documentos pendentes de aprovação', type: 'warning' },
  { id: 3, message: 'Pagamento em atraso: João Santos', type: 'error' },
];

export function Dashboard() {
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
            <div className="text-2xl font-bold">{dashboardStats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <Clock className="h-4 w-4 text-dental-ocean-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              3 confirmadas, 2 pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-dental-ocean-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {dashboardStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-dental-ocean-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingDocuments}</div>
            <p className="text-xs text-muted-foreground">
              Para revisão
            </p>
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
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{appointment.patient}</span>
                      <span className="text-sm text-muted-foreground">
                        {appointment.time} - {appointment.type}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      appointment.status === 'confirmed' ? 'default' :
                      appointment.status === 'pending' ? 'secondary' :
                      'destructive'
                    }
                  >
                    {appointment.status === 'confirmed' ? 'Confirmado' :
                     appointment.status === 'pending' ? 'Pendente' :
                     'Urgente'}
                  </Badge>
                </div>
              ))}
            </div>
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
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
                    alert.type === 'info' ? 'text-blue-500' :
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