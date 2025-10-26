import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
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
  Search,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { usePatients } from '@/hooks/use-patients';

// Mock data
// const mockPatients = [
//   {
//     id: 1,
//     name: 'Maria Silva',
//     email: 'maria.silva@email.com',
//     phone: '(11) 99999-1234',
//     birthDate: '1985-03-15',
//     address: 'Rua das Flores, 123',
//     lastVisit: '2024-01-15',
//     status: 'active'
//   },
//   {
//     id: 2,
//     name: 'João Santos',
//     email: 'joao.santos@email.com',
//     phone: '(11) 88888-5678',
//     birthDate: '1992-07-22',
//     address: 'Av. Principal, 456',
//     lastVisit: '2024-01-10',
//     status: 'active'
//   },
//   {
//     id: 3,
//     name: 'Ana Costa',
//     email: 'ana.costa@email.com',
//     phone: '(11) 77777-9012',
//     birthDate: '1978-11-08',
//     address: 'Rua do Centro, 789',
//     lastVisit: '2023-12-20',
//     status: 'inactive'
//   },
// ];

export function Patients() {
  // const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
  });

  const { patients, loading: patientsLoading, error: patientsError, pagination } = usePatients();

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = () => {
    const newPatient = {
      id: Date.now(),
      ...formData,
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    // setPatients([...patients, newPatient]);
    setFormData({ name: '', email: '', phone: '', birthDate: '', address: '' });
    setIsAddDialogOpen(false);
  };

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      birthDate: patient.birthDate,
      address: patient.address,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePatient = () => {
    // setPatients(patients.map(p =>
    //   p.id === selectedPatient.id
    //     ? { ...p, ...formData }
    //     : p
    // ));
    setFormData({ name: '', email: '', phone: '', birthDate: '', address: '' });
    setSelectedPatient(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteClick = (patient: any) => {
    setSelectedPatient(patient);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // setPatients(patients.filter(p => p.id !== selectedPatient.id));
    setSelectedPatient(null);
    setIsDeleteDialogOpen(false);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Gestão de Pacientes</h1>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Paciente</DialogTitle>
              <DialogDescription>
                Preencha os dados do paciente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do paciente"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
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
              <div>
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Endereço completo"
                />
              </div>
              <Button onClick={handleAddPatient} className="w-full">
                Adicionar Paciente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pacientes por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Última Visita</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {patient.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {patient.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{patient.birthDate ? `${calculateAge(patient.birthDate)} anos` : 'Desconhecido'}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        {patient.lastAppointment?.date ? (
                          <>
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(patient.lastAppointment?.date).toLocaleDateString('pt-BR')}
                          </>
                        ) : (
                          'Desconhecido'
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={patient.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {patient.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPatient(patient)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPatient(patient)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(patient)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum paciente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Patient Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Paciente</DialogTitle>
            <DialogDescription>
              Informações completas do paciente
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Nome Completo</Label>
                <p className="font-medium">{selectedPatient.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-sm">{selectedPatient.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="text-sm">{selectedPatient.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Data de Nascimento</Label>
                  <p className="text-sm">{new Date(selectedPatient.birthDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Idade</Label>
                  <p className="text-sm">{calculateAge(selectedPatient.birthDate)} anos</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Endereço</Label>
                <p className="text-sm">{selectedPatient.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Última Visita</Label>
                  <p className="text-sm">{new Date(selectedPatient.lastVisit).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant={selectedPatient.status === 'active' ? 'default' : 'secondary'}>
                    {selectedPatient.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogDescription>
              Atualize os dados do paciente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do paciente"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <Label htmlFor="edit-birthDate">Data de Nascimento</Label>
              <Input
                id="edit-birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Endereço</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Endereço completo"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdatePatient} className="flex-1">
                Salvar Alterações
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setFormData({ name: '', email: '', phone: '', birthDate: '', address: '' });
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este paciente?
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedPatient.name}</p>
                <p className="text-sm text-muted-foreground">{selectedPatient.email}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Esta ação não pode ser desfeita. Todos os dados do paciente serão permanentemente removidos.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  className="flex-1"
                >
                  Excluir Paciente
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedPatient(null);
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}