import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { PatientAutocomplete } from './ui/patient-autocomplete';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  Plus, 
  DollarSign, 
  CreditCard, 
  Calendar,
  User,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';

// Mock patient data
const mockPatients = [
  { id: '1', name: 'Maria Silva', email: 'maria.silva@email.com', phone: '(11) 99999-1111' },
  { id: '2', name: 'João Santos', email: 'joao.santos@email.com', phone: '(11) 99999-2222' },
  { id: '3', name: 'Ana Costa', email: 'ana.costa@email.com', phone: '(11) 99999-3333' },
  { id: '4', name: 'Pedro Lima', email: 'pedro.lima@email.com', phone: '(11) 99999-4444' },
  { id: '5', name: 'Carla Oliveira', email: 'carla.oliveira@email.com', phone: '(11) 99999-5555' },
  { id: '6', name: 'Roberto Ferreira', email: 'roberto.ferreira@email.com', phone: '(11) 99999-6666' },
];

// Mock data
const mockPayments = [
  {
    id: 1,
    patientId: '1',
    patientName: 'Maria Silva',
    service: 'Limpeza',
    amount: 120.00,
    paymentMethod: 'Cartão de Crédito',
    installments: 1,
    status: 'paid',
    date: '2024-01-15',
    dueDate: '2024-01-15'
  },
  {
    id: 2,
    patientId: '2',
    patientName: 'João Santos',
    service: 'Tratamento Canal',
    amount: 800.00,
    paymentMethod: 'Cartão de Crédito',
    installments: 4,
    status: 'partial',
    date: '2024-01-10',
    dueDate: '2024-02-10'
  },
  {
    id: 3,
    patientId: '3',
    patientName: 'Ana Costa',
    service: 'Implante',
    amount: 2500.00,
    paymentMethod: 'PIX',
    installments: 1,
    status: 'pending',
    date: '2024-01-12',
    dueDate: '2024-01-20'
  },
  {
    id: 4,
    patientId: '4',
    patientName: 'Pedro Lima',
    service: 'Ortodontia',
    amount: 300.00,
    paymentMethod: 'Dinheiro',
    installments: 1,
    status: 'overdue',
    date: '2024-01-05',
    dueDate: '2024-01-18'
  },
];

const paymentMethods = [
  'Dinheiro',
  'Cartão de Débito',
  'Cartão de Crédito',
  'PIX',
  'Transferência',
  'Boleto'
];

export function Payments() {
  const [payments, setPayments] = useState(mockPayments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    patientId: '',
    service: '',
    amount: '',
    paymentMethod: '',
    installments: '1',
    dueDate: ''
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddPayment = () => {
    const selectedPatient = mockPatients.find(p => p.id === formData.patientId);
    if (!selectedPatient) return;
    
    const newPayment = {
      id: Date.now(),
      patientId: formData.patientId,
      patientName: selectedPatient.name,
      service: formData.service,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      installments: parseInt(formData.installments),
      status: 'pending' as const,
      date: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate
    };
    
    setPayments([newPayment, ...payments]);
    setFormData({ patientId: '', service: '', amount: '', paymentMethod: '', installments: '1', dueDate: '' });
    setIsAddDialogOpen(false);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setPayments(payments.map(payment => 
      payment.id === id ? { ...payment, status: newStatus as any } : payment
    ));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'default',
      partial: 'secondary',
      pending: 'outline',
      overdue: 'destructive'
    } as const;

    const labels = {
      paid: 'Pago',
      partial: 'Parcial',
      pending: 'Pendente',
      overdue: 'Vencido'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'overdue':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Calculate statistics
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
  const partialAmount = payments.filter(p => p.status === 'partial').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Gestão de Pagamentos</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Pagamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Pagamento</DialogTitle>
              <DialogDescription>
                Adicione um novo pagamento ao sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="patient">Paciente</Label>
                <PatientAutocomplete
                  patients={mockPatients}
                  selectedPatientId={formData.patientId}
                  onPatientSelect={(patientId) => setFormData({ ...formData, patientId: patientId || '' })}
                  placeholder="Pesquisar e selecionar paciente..."
                />
              </div>
              
              <div>
                <Label htmlFor="service">Serviço</Label>
                <Input
                  id="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  placeholder="Tipo de tratamento"
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="installments">Parcelas</Label>
                <Select value={formData.installments} onValueChange={(value) => setFormData({ ...formData, installments: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,12].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}x {num > 1 ? `de R$ ${(parseFloat(formData.amount || '0') / num).toFixed(2)}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dueDate">Data de Vencimento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              
              <Button onClick={handleAddPayment} className="w-full">
                Registrar Pagamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  R$ {pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Atraso</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {overdueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Parcial</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {partialAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="partial">Parcial</SelectItem>
                <SelectItem value="overdue">Em Atraso</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
                <TableHead>Parcelas</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{payment.patientName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{payment.service}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>{payment.paymentMethod}</span>
                    </div>
                  </TableCell>
                  <TableCell>{payment.installments}x</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.status)}
                      {getStatusBadge(payment.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {payment.status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusChange(payment.id, 'paid')}
                        >
                          Marcar como Pago
                        </Button>
                      )}
                      {payment.status === 'overdue' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(payment.id, 'paid')}
                        >
                          Receber
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}