import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  Shield
} from 'lucide-react';

// Mock data for admin
const mockStats = {
  totalClinics: 127,
  activeClinics: 115,
  totalUsers: 1450,
  monthlyRevenue: 89650,
  growthRate: 12.5
};

const mockClinics = [
  {
    id: 1,
    name: 'Clínica OdontoVida',
    email: 'contato@odontovida.com',
    plan: 'PREMIUM',
    status: 'ACTIVE',
    monthlyRevenue: 197,
    users: 8,
    patients: 450,
    lastLogin: '2025-01-20',
    createdAt: '2023-05-15'
  },
  {
    id: 2,
    name: 'Dental Care Center',
    email: 'admin@dentalcare.com',
    plan: 'ENTERPRISE',
    status: 'ACTIVE',
    monthlyRevenue: 397,
    users: 15,
    patients: 1200,
    lastLogin: '2025-01-22',
    createdAt: '2022-11-10'
  },
  {
    id: 3,
    name: 'Sorriso Perfeito',
    email: 'contato@sorrisoperfeito.com',
    plan: 'BASIC',
    status: 'TRIAL',
    monthlyRevenue: 97,
    users: 3,
    patients: 89,
    lastLogin: '2025-01-21',
    createdAt: '2025-01-15'
  },
  {
    id: 4,
    name: 'Clínica Smile',
    email: 'info@smile.com',
    plan: 'PREMIUM',
    status: 'SUSPENDED',
    monthlyRevenue: 0,
    users: 6,
    patients: 320,
    lastLogin: '2025-01-10',
    createdAt: '2023-08-22'
  }
];

const mockRecentActivity = [
  {
    id: 1,
    type: 'NEW_CLINIC',
    description: 'Nova clínica cadastrada: Dental Fresh',
    timestamp: '2025-01-22 14:30'
  },
  {
    id: 2,
    type: 'PAYMENT_FAILED',
    description: 'Falha no pagamento: Clínica OdontoMax',
    timestamp: '2025-01-22 12:15'
  },
  {
    id: 3,
    type: 'PLAN_UPGRADE',
    description: 'Upgrade para Premium: Sorriso Feliz',
    timestamp: '2025-01-22 09:45'
  },
  {
    id: 4,
    type: 'SUPPORT_TICKET',
    description: 'Novo ticket de suporte #1245',
    timestamp: '2025-01-21 16:22'
  }
];

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredClinics = mockClinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || clinic.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'ACTIVE': 'default',
      'TRIAL': 'secondary',
      'SUSPENDED': 'destructive',
      'INACTIVE': 'outline'
    } as const;

    const colors = {
      'ACTIVE': 'text-green-600',
      'TRIAL': 'text-blue-600',
      'SUSPENDED': 'text-red-600',
      'INACTIVE': 'text-gray-600'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      'BASIC': 'bg-blue-100 text-blue-800',
      'PREMIUM': 'bg-yellow-100 text-yellow-800',
      'ENTERPRISE': 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge className={colors[plan as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {plan}
      </Badge>
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'NEW_CLINIC':
        return <Building2 className="h-4 w-4 text-green-500" />;
      case 'PAYMENT_FAILED':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'PLAN_UPGRADE':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'SUPPORT_TICKET':
        return <Shield className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Painel Administrativo</h1>
          <p className="text-muted-foreground">Visão geral da plataforma DentalSaaS</p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Shield className="h-4 w-4 mr-1" />
          Super Admin
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clínicas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalClinics}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.activeClinics} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +84 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {mockStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{mockStats.growthRate}% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.1%</div>
            <p className="text-xs text-green-600">
              +2.1% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3%</div>
            <p className="text-xs text-red-600">
              +0.4% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="clinics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="clinics">Clínicas</TabsTrigger>
          <TabsTrigger value="activity">Atividade Recente</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="clinics" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar clínicas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                  >
                    Todas
                  </Button>
                  <Button
                    variant={filterStatus === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('active')}
                  >
                    Ativas
                  </Button>
                  <Button
                    variant={filterStatus === 'trial' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('trial')}
                  >
                    Trial
                  </Button>
                  <Button
                    variant={filterStatus === 'suspended' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('suspended')}
                  >
                    Suspensas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Clínicas Cadastradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Clínica</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usuários</TableHead>
                      <TableHead>Pacientes</TableHead>
                      <TableHead>Receita Mensal</TableHead>
                      <TableHead>Último Login</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClinics.map((clinic) => (
                      <TableRow key={clinic.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{clinic.name}</div>
                            <div className="text-sm text-muted-foreground">{clinic.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getPlanBadge(clinic.plan)}</TableCell>
                        <TableCell>{getStatusBadge(clinic.status)}</TableCell>
                        <TableCell>{clinic.users}</TableCell>
                        <TableCell>{clinic.patients}</TableCell>
                        <TableCell>R$ {clinic.monthlyRevenue}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(clinic.lastLogin).toLocaleDateString('pt-BR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Shield className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente da Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Plano</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Básico</span>
                    </div>
                    <span className="text-sm font-medium">45 clínicas (35%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Premium</span>
                    </div>
                    <span className="text-sm font-medium">67 clínicas (53%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Enterprise</span>
                    </div>
                    <span className="text-sm font-medium">15 clínicas (12%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status das Clínicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Ativas</span>
                    </div>
                    <span className="text-sm font-medium">115 clínicas (90%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Trial</span>
                    </div>
                    <span className="text-sm font-medium">8 clínicas (6%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Suspensas</span>
                    </div>
                    <span className="text-sm font-medium">4 clínicas (3%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}