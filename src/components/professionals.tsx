import React, { useState } from 'react';
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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Plus, 
  Search,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  User,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const specialties = [
  'Clínico Geral',
  'Ortodontista',
  'Endodontista',
  'Periodontista',
  'Cirurgião Oral',
  'Implantodontista',
  'Odontopediatra',
  'Protesista',
  'Radiologista',
  'Patologista Oral'
];

const workDays = [
  { id: 'monday', label: 'Segunda-feira' },
  { id: 'tuesday', label: 'Terça-feira' },
  { id: 'wednesday', label: 'Quarta-feira' },
  { id: 'thursday', label: 'Quinta-feira' },
  { id: 'friday', label: 'Sexta-feira' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' }
];

// Mock data
const mockProfessionals = [
  {
    id: 1,
    name: 'Dr. João Silva',
    email: 'joao.silva@clinica.com',
    phone: '(11) 99999-9999',
    cro: 'CRO-SP 12345',
    specialty: 'Clínico Geral',
    status: 'active',
    color: '#3b82f6',
    startDate: '2024-01-15',
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workHours: { start: '08:00', end: '18:00' },
    notes: 'Especialista em tratamentos preventivos e restauradores',
    avatar: null
  },
  {
    id: 2,
    name: 'Dra. Maria Santos',
    email: 'maria.santos@clinica.com',
    phone: '(11) 88888-8888',
    cro: 'CRO-SP 67890',
    specialty: 'Ortodontista',
    status: 'active',
    color: '#10b981',
    startDate: '2023-06-10',
    workDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    workHours: { start: '09:00', end: '17:00' },
    notes: 'Especialista em aparelhos ortodônticos e alinhadores',
    avatar: null
  },
  {
    id: 3,
    name: 'Dr. Carlos Lima',
    email: 'carlos.lima@clinica.com',
    phone: '(11) 77777-7777',
    cro: 'CRO-SP 54321',
    specialty: 'Cirurgião Oral',
    status: 'active',
    color: '#f59e0b',
    startDate: '2023-03-20',
    workDays: ['monday', 'wednesday', 'friday'],
    workHours: { start: '07:00', end: '15:00' },
    notes: 'Especialista em extrações e cirurgias orais complexas',
    avatar: null
  },
  {
    id: 4,
    name: 'Dra. Ana Costa',
    email: 'ana.costa@clinica.com',
    phone: '(11) 66666-6666',
    cro: 'CRO-SP 98765',
    specialty: 'Endodontista',
    status: 'inactive',
    color: '#ef4444',
    startDate: '2023-08-05',
    workDays: ['monday', 'tuesday', 'thursday'],
    workHours: { start: '13:00', end: '19:00' },
    notes: 'Especialista em tratamentos de canal',
    avatar: null
  }
];

export function Professionals() {
  const [professionals, setProfessionals] = useState(mockProfessionals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [professionalToDelete, setProfessionalToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cro: '',
    specialty: '',
    status: 'active',
    color: '#3b82f6',
    startDate: '',
    workDays: [] as string[],
    workHours: { start: '08:00', end: '18:00' },
    notes: ''
  });

  // Filter professionals
  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.cro.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || prof.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddProfessional = () => {
    if (!formData.name || !formData.email || !formData.cro || !formData.specialty) {
      return;
    }

    const newProfessional = {
      id: Date.now(),
      ...formData,
      workDays: formData.workDays || []
    };
    
    setProfessionals([...professionals, newProfessional]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditProfessional = () => {
    if (!editingProfessional || !formData.name || !formData.email || !formData.cro || !formData.specialty) {
      return;
    }

    const updatedProfessional = {
      ...editingProfessional,
      ...formData,
      workDays: formData.workDays || []
    };

    setProfessionals(professionals.map(prof => 
      prof.id === editingProfessional.id ? updatedProfessional : prof
    ));
    
    resetForm();
    setIsEditDialogOpen(false);
    setEditingProfessional(null);
  };

  const handleDeleteProfessional = () => {
    if (professionalToDelete) {
      setProfessionals(professionals.filter(prof => prof.id !== professionalToDelete));
      setDeleteConfirmOpen(false);
      setProfessionalToDelete(null);
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setProfessionals(professionals.map(prof => 
      prof.id === id ? { ...prof, status: newStatus } : prof
    ));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      cro: '',
      specialty: '',
      status: 'active',
      color: '#3b82f6',
      startDate: '',
      workDays: [],
      workHours: { start: '08:00', end: '18:00' },
      notes: ''
    });
  };

  const openEditDialog = (professional: any) => {
    setEditingProfessional(professional);
    setFormData({
      name: professional.name,
      email: professional.email,
      phone: professional.phone,
      cro: professional.cro,
      specialty: professional.specialty,
      status: professional.status,
      color: professional.color,
      startDate: professional.startDate,
      workDays: professional.workDays || [],
      workHours: professional.workHours,
      notes: professional.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (professionalId: number) => {
    setProfessionalToDelete(professionalId);
    setDeleteConfirmOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'vacation':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'destructive',
      vacation: 'secondary'
    } as const;

    const labels = {
      active: 'Ativo',
      inactive: 'Inativo',
      vacation: 'Férias'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const handleWorkDayToggle = (dayId: string) => {
    const currentDays = formData.workDays || [];
    if (currentDays.includes(dayId)) {
      setFormData({
        ...formData,
        workDays: currentDays.filter(d => d !== dayId)
      });
    } else {
      setFormData({
        ...formData,
        workDays: [...currentDays, dayId]
      });
    }
  };

  const renderProfessionalForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Dr. João Silva"
          />
        </div>
        <div>
          <Label htmlFor="cro">CRO *</Label>
          <Input
            id="cro"
            value={formData.cro}
            onChange={(e) => setFormData({ ...formData, cro: e.target.value })}
            placeholder="CRO-SP 12345"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="dentista@clinica.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="specialty">Especialidade *</Label>
          <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a especialidade" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="startDate">Data de Início</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
              <SelectItem value="vacation">Férias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="startTime">Início do Expediente</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.workHours.start}
            onChange={(e) => setFormData({ 
              ...formData, 
              workHours: { ...formData.workHours, start: e.target.value } 
            })}
          />
        </div>
        <div>
          <Label htmlFor="endTime">Fim do Expediente</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.workHours.end}
            onChange={(e) => setFormData({ 
              ...formData, 
              workHours: { ...formData.workHours, end: e.target.value } 
            })}
          />
        </div>
      </div>

      <div>
        <Label>Cor de Identificação</Label>
        <div className="flex space-x-2 mt-2">
          {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'].map(color => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-gray-800' : 'border-gray-300'}`}
              style={{ backgroundColor: color }}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
        </div>
      </div>

      <div>
        <Label>Dias de Trabalho</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {workDays.map(day => (
            <label key={day.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.workDays.includes(day.id)}
                onChange={() => handleWorkDayToggle(day.id)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{day.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Informações adicionais sobre o profissional"
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Gestão de Profissionais</h1>
          <p className="text-muted-foreground">Gerencie dentistas e profissionais da clínica</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Profissional
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Profissional</DialogTitle>
              <DialogDescription>
                Adicione um novo dentista ou profissional à sua clínica
              </DialogDescription>
            </DialogHeader>
            {renderProfessionalForm()}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button onClick={handleAddProfessional}>
                Cadastrar Profissional
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, especialidade ou CRO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="vacation">Férias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professionals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessionals.map((professional) => (
          <Card key={professional.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12" style={{ backgroundColor: professional.color + '20' }}>
                    <AvatarImage src={professional.avatar} />
                    <AvatarFallback 
                      className="text-white" 
                      style={{ backgroundColor: professional.color }}
                    >
                      {professional.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{professional.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{professional.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(professional.status)}
                  {getStatusBadge(professional.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{professional.email}</span>
                </div>
                {professional.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{professional.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{professional.cro}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{professional.workHours.start} - {professional.workHours.end}</span>
                </div>
              </div>

              {professional.notes && (
                <div className="p-2 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">{professional.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <div className="text-xs text-muted-foreground">
                  {professional.workDays.length} dias de trabalho
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(professional)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openDeleteDialog(professional.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {professional.status === 'active' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(professional.id, 'inactive')}
                    >
                      Desativar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(professional.id, 'active')}
                    >
                      Ativar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProfessionals.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum profissional encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Cadastre o primeiro profissional da sua clínica'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Profissional
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Profissional</DialogTitle>
            <DialogDescription>
              Altere as informações do profissional
            </DialogDescription>
          </DialogHeader>
          {renderProfessionalForm()}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingProfessional(null);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={handleEditProfessional}>
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
              Tem certeza que deseja excluir este profissional? Esta ação não pode ser desfeita e todos os agendamentos vinculados a este profissional poderão ser afetados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProfessional}>
              Excluir Profissional
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}