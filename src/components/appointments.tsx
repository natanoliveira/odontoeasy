import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Calendar } from './ui/calendar';
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
  Plus,
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  MapPin,
  Phone,
  Mail,
  FileText,
  Loader2
} from 'lucide-react';
import { useAppointments } from '@/hooks/use-appointments';
import { useProfessionals } from '@/hooks/use-professionals';
import { usePatients } from '@/hooks/use-patients';
import { toast } from 'sonner';

// Mock data - COMENTADO APÓS INTEGRAÇÃO COM API
// const mockDentists = [
//   { id: 1, name: 'Dr. João Silva', speciality: 'Clínico Geral', color: '#3b82f6', status: 'active' },
//   { id: 2, name: 'Dra. Maria Santos', speciality: 'Ortodontista', color: '#10b981', status: 'active' },
//   { id: 3, name: 'Dr. Carlos Lima', speciality: 'Cirurgião Oral', color: '#f59e0b', status: 'active' },
//   { id: 4, name: 'Dra. Ana Costa', speciality: 'Endodontista', color: '#ef4444', status: 'inactive' },
// ];

// const mockPatients = [
//   { id: 1, name: 'Maria Silva', phone: '(11) 99999-9999', email: 'maria@email.com' },
//   { id: 2, name: 'João Santos', phone: '(11) 88888-8888', email: 'joao@email.com' },
//   { id: 3, name: 'Ana Costa', phone: '(11) 77777-7777', email: 'ana@email.com' },
//   { id: 4, name: 'Pedro Lima', phone: '(11) 66666-6666', email: 'pedro@email.com' },
//   { id: 5, name: 'Lucia Ferreira', phone: '(11) 55555-5555', email: 'lucia@email.com' },
//   { id: 6, name: 'Roberto Alves', phone: '(11) 44444-4444', email: 'roberto@email.com' },
// ];

// const mockAppointments = [
//   {
//     id: 1,
//     patientId: 1,
//     patientName: 'Maria Silva',
//     dentistId: 1,
//     dentistName: 'Dr. João Silva',
//     date: '2025-01-22',
//     time: '09:00',
//     endTime: '10:00',
//     type: 'Limpeza e Profilaxia',
//     status: 'confirmed',
//     duration: 60,
//     notes: 'Primeira consulta, paciente com sensibilidade',
//     room: 'Sala 1',
//     value: 150.00
//   },
//   {
//     id: 2,
//     patientId: 2,
//     patientName: 'João Santos',
//     dentistId: 1,
//     dentistName: 'Dr. João Silva',
//     date: '2025-01-22',
//     time: '10:30',
//     endTime: '11:00',
//     type: 'Consulta de Rotina',
//     status: 'pending',
//     duration: 30,
//     notes: 'Verificação de dor no dente 36',
//     room: 'Sala 1',
//     value: 80.00
//   },
//   {
//     id: 3,
//     patientId: 3,
//     patientName: 'Ana Costa',
//     dentistId: 4,
//     dentistName: 'Dra. Ana Costa',
//     date: '2025-01-22',
//     time: '14:00',
//     endTime: '15:30',
//     type: 'Tratamento de Canal',
//     status: 'confirmed',
//     duration: 90,
//     notes: 'Segunda sessão do tratamento endodôntico',
//     room: 'Sala 3',
//     value: 350.00
//   },
//   {
//     id: 4,
//     patientId: 4,
//     patientName: 'Pedro Lima',
//     dentistId: 2,
//     dentistName: 'Dra. Maria Santos',
//     date: '2025-01-22',
//     time: '15:30',
//     endTime: '16:15',
//     type: 'Emergência Ortodôntica',
//     status: 'urgent',
//     duration: 45,
//     notes: 'Quebra de aparelho ortodôntico',
//     room: 'Sala 2',
//     value: 120.00
//   },
//   {
//     id: 5,
//     patientId: 5,
//     patientName: 'Lucia Ferreira',
//     dentistId: 3,
//     dentistName: 'Dr. Carlos Lima',
//     date: '2025-01-23',
//     time: '08:00',
//     endTime: '09:00',
//     type: 'Extração Simples',
//     status: 'confirmed',
//     duration: 60,
//     notes: 'Extração do dente 48',
//     room: 'Sala 4',
//     value: 200.00
//   },
//   {
//     id: 6,
//     patientId: 6,
//     patientName: 'Roberto Alves',
//     dentistId: 2,
//     dentistName: 'Dra. Maria Santos',
//     date: '2025-01-23',
//     time: '10:00',
//     endTime: '11:00',
//     type: 'Manutenção Ortodôntica',
//     status: 'confirmed',
//     duration: 60,
//     notes: 'Troca de elásticos e ajustes',
//     room: 'Sala 2',
//     value: 180.00
//   },
// ];

const treatmentTypes = [
  'Consulta de Rotina',
  'Limpeza e Profilaxia',
  'Obturação',
  'Tratamento de Canal',
  'Extração Simples',
  'Extração Complexa',
  'Prótese Dentária',
  'Ortodontia - Consulta',
  'Manutenção Ortodôntica',
  'Emergência',
  'Emergência Ortodôntica',
  'Cirurgia Oral',
  'Implante Dentário',
  'Clareamento'
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
];

export function Appointments() {
  // Integração com API
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const dateStr = selectedDate?.toISOString().split('T')[0];

  const {
    appointments: apiAppointments,
    loading: appointmentsLoading,
    error: appointmentsError,
    createAppointment,
    updateAppointment,
    deleteAppointment
  } = useAppointments({ date: dateStr });

  const { professionals, loading: professionalsLoading } = useProfessionals();
  const { patients, loading: patientsLoading } = usePatients();

  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDentist, setFilterDentist] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Adaptar appointments da API para o formato do componente
  const appointments = apiAppointments.map(apt => ({
    id: apt.id,
    patientId: apt.patient.id,
    patientName: apt.patient.name,
    dentistId: apt.professional?.id || '',
    dentistName: apt.professional?.name || 'Sem profissional',
    date: apt.date,
    time: apt.startTime,
    endTime: apt.endTime,
    type: apt.treatment?.name || 'Consulta',
    status: apt.status.toLowerCase(),
    duration: 60, // calcular depois
    notes: apt.notes || '',
    room: apt.room?.name || '',
    value: 0 // não disponível na API
  }));

  // Adaptar profissionais para dentists
  const mockDentists = professionals.map(prof => ({
    id: prof.id,
    name: prof.name,
    speciality: prof.specialty,
    color: prof.color,
    status: prof.status.toLowerCase()
  }));

  // Adaptar pacientes
  const mockPatients = patients.map(pat => ({
    id: pat.id,
    name: pat.name,
    phone: pat.phone,
    email: pat.email
  }));

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    dentistId: '',
    date: '',
    time: '',
    endTime: '',
    type: '',
    duration: '60',
    notes: '',
    room: '',
    value: ''
  });

  // Função para calcular horário de fim baseado na duração
  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  // Filtrar agendamentos
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.dentistName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDentist = filterDentist === 'all' || apt.dentistId.toString() === filterDentist;
      const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;

      let matchesDate = true;
      if (selectedDate && viewMode === 'day') {
        matchesDate = apt.date === selectedDate.toISOString().split('T')[0];
      } else if (selectedDate && viewMode === 'week') {
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const aptDate = new Date(apt.date);
        matchesDate = aptDate >= startOfWeek && aptDate <= endOfWeek;
      }

      return matchesSearch && matchesDentist && matchesStatus && matchesDate;
    });
  }, [appointments, searchTerm, filterDentist, filterStatus, selectedDate, viewMode]);

  const handleAddAppointment = () => {
    if (!formData.patientName || !formData.date || !formData.time || !formData.type || !formData.dentistId) {
      return;
    }

    const selectedPatient = mockPatients.find(p => p.id.toString() === formData.patientId);
    const selectedDentist = mockDentists.find(d => d.id.toString() === formData.dentistId);
    const endTime = calculateEndTime(formData.time, parseInt(formData.duration));

    const newAppointment = {
      id: Date.now(),
      patientId: parseInt(formData.patientId) || 0,
      patientName: selectedPatient?.name || formData.patientName,
      dentistId: parseInt(formData.dentistId),
      dentistName: selectedDentist?.name || '',
      date: formData.date,
      time: formData.time,
      endTime: endTime,
      type: formData.type,
      duration: parseInt(formData.duration),
      status: 'pending' as const,
      notes: formData.notes,
      room: formData.room,
      value: parseFloat(formData.value) || 0
    };

    setAppointments([...appointments, newAppointment]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditAppointment = () => {
    if (!editingAppointment) return;

    const selectedPatient = mockPatients.find(p => p.id.toString() === formData.patientId);
    const selectedDentist = mockDentists.find(d => d.id.toString() === formData.dentistId);
    const endTime = calculateEndTime(formData.time, parseInt(formData.duration));

    const updatedAppointment = {
      ...editingAppointment,
      patientId: parseInt(formData.patientId) || editingAppointment.patientId,
      patientName: selectedPatient?.name || formData.patientName,
      dentistId: parseInt(formData.dentistId),
      dentistName: selectedDentist?.name || '',
      date: formData.date,
      time: formData.time,
      endTime: endTime,
      type: formData.type,
      duration: parseInt(formData.duration),
      notes: formData.notes,
      room: formData.room,
      value: parseFloat(formData.value) || 0
    };

    setAppointments(appointments.map(apt =>
      apt.id === editingAppointment.id ? updatedAppointment : apt
    ));

    resetForm();
    setIsEditDialogOpen(false);
    setEditingAppointment(null);
  };

  const handleDeleteAppointment = () => {
    if (appointmentToDelete) {
      setAppointments(appointments.filter(apt => apt.id !== appointmentToDelete));
      setDeleteConfirmOpen(false);
      setAppointmentToDelete(null);
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, status: newStatus as any } : apt
    ));
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      patientName: '',
      dentistId: '',
      date: '',
      time: '',
      endTime: '',
      type: '',
      duration: '60',
      notes: '',
      room: '',
      value: ''
    });
  };

  const openEditDialog = (appointment: any) => {
    setEditingAppointment(appointment);
    setFormData({
      patientId: appointment.patientId?.toString() || '',
      patientName: appointment.patientName,
      dentistId: appointment.dentistId.toString(),
      date: appointment.date,
      time: appointment.time,
      endTime: appointment.endTime,
      type: appointment.type,
      duration: appointment.duration.toString(),
      notes: appointment.notes || '',
      room: appointment.room || '',
      value: appointment.value?.toString() || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (appointmentId: number) => {
    setAppointmentToDelete(appointmentId);
    setDeleteConfirmOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'default',
      pending: 'secondary',
      cancelled: 'destructive',
      urgent: 'destructive',
      completed: 'outline'
    } as const;

    const labels = {
      confirmed: 'Confirmado',
      pending: 'Pendente',
      cancelled: 'Cancelado',
      urgent: 'Urgente',
      completed: 'Concluído'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getDentistColor = (dentistId: number) => {
    const dentist = mockDentists.find(d => d.id === dentistId);
    return dentist?.color || '#6b7280';
  };

  const renderAppointmentForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientSelect">Paciente</Label>
          <Select value={formData.patientId} onValueChange={(value) => {
            const patient = mockPatients.find(p => p.id.toString() === value);
            setFormData({
              ...formData,
              patientId: value,
              patientName: patient?.name || ''
            });
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o paciente" />
            </SelectTrigger>
            <SelectContent>
              {mockPatients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id.toString()}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dentistSelect">Dentista</Label>
          <Select value={formData.dentistId} onValueChange={(value) => setFormData({ ...formData, dentistId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o dentista" />
            </SelectTrigger>
            <SelectContent>
              {mockDentists.filter(d => d.status === 'active').map((dentist) => (
                <SelectItem key={dentist.id} value={dentist.id.toString()}>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dentist.color }}
                    />
                    <span>{dentist.name} - {dentist.speciality}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="time">Horário</Label>
          <Select value={formData.time} onValueChange={(value) => {
            const endTime = calculateEndTime(value, parseInt(formData.duration));
            setFormData({ ...formData, time: value, endTime });
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o horário" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo de Tratamento</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {treatmentTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration">Duração (minutos)</Label>
          <Select value={formData.duration} onValueChange={(value) => {
            const endTime = formData.time ? calculateEndTime(formData.time, parseInt(value)) : '';
            setFormData({ ...formData, duration: value, endTime });
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutos</SelectItem>
              <SelectItem value="60">60 minutos</SelectItem>
              <SelectItem value="90">90 minutos</SelectItem>
              <SelectItem value="120">120 minutos</SelectItem>
              <SelectItem value="150">150 minutos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="room">Sala</Label>
          <Select value={formData.room} onValueChange={(value) => setFormData({ ...formData, room: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a sala" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sala 1">Sala 1</SelectItem>
              <SelectItem value="Sala 2">Sala 2</SelectItem>
              <SelectItem value="Sala 3">Sala 3</SelectItem>
              <SelectItem value="Sala 4">Sala 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="value">Valor (R$)</Label>
          <Input
            id="value"
            type="number"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder="0,00"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Observações sobre a consulta"
          rows={3}
        />
      </div>

      {formData.time && formData.duration && (
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm">
            <strong>Horário:</strong> {formData.time} - {calculateEndTime(formData.time, parseInt(formData.duration))}
          </p>
        </div>
      )}
    </div>
  );

  // Loading state
  if (appointmentsLoading || professionalsLoading || patientsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (appointmentsError) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-sm text-destructive">
            Erro ao carregar agendamentos: {appointmentsError.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Agenda Completa</h1>
          <p className="text-muted-foreground">Gerencie todos os agendamentos da clínica</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
              <DialogDescription>
                Agende uma nova consulta para um paciente
              </DialogDescription>
            </DialogHeader>
            {renderAppointmentForm()}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button onClick={handleAddAppointment}>
                Agendar Consulta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente, tipo ou dentista..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterDentist} onValueChange={setFilterDentist}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos os dentistas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os dentistas</SelectItem>
                  {mockDentists.map((dentist) => (
                    <SelectItem key={dentist.id} value={dentist.id.toString()}>
                      {dentist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="day">Visualização Diária</TabsTrigger>
          <TabsTrigger value="week">Visualização Semanal</TabsTrigger>
          <TabsTrigger value="month">Visualização Mensal</TabsTrigger>
        </TabsList>

        <TabsContent value="day" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Daily View */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-5 w-5" />
                      <span>
                        {selectedDate?.toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) || 'Selecione uma data'}
                      </span>
                    </div>
                    <Badge variant="outline">
                      {filteredAppointments.length} agendamento(s)
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum agendamento encontrado</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredAppointments
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((appointment) => (
                          <div
                            key={appointment.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            style={{ borderLeftColor: getDentistColor(appointment.dentistId), borderLeftWidth: '4px' }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                {getStatusIcon(appointment.status)}
                                <div>
                                  <h3 className="font-semibold">{appointment.patientName}</h3>
                                  <p className="text-sm text-muted-foreground">{appointment.dentistName}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(appointment.status)}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openEditDialog(appointment)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openDeleteDialog(appointment.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.time} - {appointment.endTime}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.type}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.room}</span>
                              </div>
                            </div>

                            {appointment.notes && (
                              <div className="mt-3 p-2 bg-muted rounded-md">
                                <div className="flex items-start space-x-2">
                                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                  <p className="text-sm">{appointment.notes}</p>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-between items-center mt-4">
                              <div className="text-sm">
                                <strong>Valor: R$ {appointment.value?.toFixed(2) || '0,00'}</strong>
                              </div>
                              <div className="flex space-x-2">
                                {appointment.status === 'pending' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                  >
                                    Confirmar
                                  </Button>
                                )}
                                {appointment.status === 'confirmed' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'completed')}
                                  >
                                    Concluir
                                  </Button>
                                )}
                                {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                  >
                                    Cancelar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visualização Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Visualização semanal em desenvolvimento</p>
                <p className="text-sm">Em breve você poderá ver a agenda semanal completa</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Agendamentos do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Dentista</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Duração</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments
                      .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                      .map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">{appointment.patientName}</TableCell>
                          <TableCell>{appointment.dentistName}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div>{new Date(appointment.date).toLocaleDateString('pt-BR')}</div>
                              <div className="text-sm text-muted-foreground">{appointment.time} - {appointment.endTime}</div>
                            </div>
                          </TableCell>
                          <TableCell>{appointment.type}</TableCell>
                          <TableCell>{appointment.duration}min</TableCell>
                          <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                          <TableCell>R$ {appointment.value?.toFixed(2) || '0,00'}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditDialog(appointment)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openDeleteDialog(appointment.id)}
                              >
                                <Trash2 className="h-4 w-4" />
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
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
            <DialogDescription>
              Altere as informações do agendamento
            </DialogDescription>
          </DialogHeader>
          {renderAppointmentForm()}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingAppointment(null);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={handleEditAppointment}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAppointment}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}