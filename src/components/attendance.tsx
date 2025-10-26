import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Plus,
  Search,
  FileText,
  Calendar,
  User,
  Clock,
  Stethoscope,
  FileSignature,
  Save,
  X
} from 'lucide-react';

// Mock data para pacientes
const mockPatients = [
  { id: 1, name: 'Maria Silva', phone: '(11) 99999-1234', age: 38 },
  { id: 2, name: 'João Santos', phone: '(11) 88888-5678', age: 31 },
  { id: 3, name: 'Ana Costa', phone: '(11) 77777-9012', age: 45 },
];

// Mock data para atendimentos
const mockAttendances = [
  {
    id: 1,
    patient: 'Maria Silva',
    date: '2024-01-20',
    time: '14:00',
    type: 'Consulta',
    status: 'completed',
    professional: 'Dr. Carlos Mendes',
    complaint: 'Dor de dente',
  },
  {
    id: 2,
    patient: 'João Santos',
    date: '2024-01-20',
    time: '15:30',
    type: 'Limpeza',
    status: 'completed',
    professional: 'Dra. Ana Beatriz',
    complaint: 'Limpeza preventiva',
  },
];

export function Attendance() {
  const [attendances, setAttendances] = useState(mockAttendances);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewAttendanceOpen, setIsNewAttendanceOpen] = useState(false);
  const [isViewAttendanceOpen, setIsViewAttendanceOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);

  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    type: '',
    professional: '',
    complaint: '',
    diagnosis: '',
    treatment: '',
    prescriptions: '',
    observations: '',
    nextAppointment: '',
  });

  const filteredAttendances = attendances.filter(attendance =>
    attendance.patient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveAttendance = () => {
    const patient = mockPatients.find(p => p.id === parseInt(formData.patientId));
    const newAttendance = {
      id: Date.now(),
      patient: patient?.name || '',
      date: formData.date,
      time: formData.time,
      type: formData.type,
      status: 'completed',
      professional: formData.professional,
      complaint: formData.complaint,
      diagnosis: formData.diagnosis,
      treatment: formData.treatment,
      prescriptions: formData.prescriptions,
      observations: formData.observations,
    };

    setAttendances([newAttendance, ...attendances]);
    setFormData({
      patientId: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      type: '',
      professional: '',
      complaint: '',
      diagnosis: '',
      treatment: '',
      prescriptions: '',
      observations: '',
      nextAppointment: '',
    });
    setIsNewAttendanceOpen(false);
  };

  const handleViewAttendance = (attendance: any) => {
    setSelectedAttendance(attendance);
    setIsViewAttendanceOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Registro de Atendimentos</h1>
          <p className="text-muted-foreground mt-1">
            Registre e acompanhe todos os atendimentos realizados
          </p>
        </div>
        <Button onClick={() => setIsNewAttendanceOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Atendimento
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar atendimentos por paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 desde ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Atendimentos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <FileSignature className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9</div>
            <p className="text-xs text-muted-foreground mt-1">
              Hoje
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attendances Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Atendimentos</CardTitle>
          <CardDescription>
            Lista completa de todos os atendimentos registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Queixa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {attendance.patient}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(attendance.date).toLocaleDateString('pt-BR')}</div>
                      <div className="text-muted-foreground">{attendance.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>{attendance.type}</TableCell>
                  <TableCell className="text-sm">{attendance.professional}</TableCell>
                  <TableCell className="text-sm">{attendance.complaint}</TableCell>
                  <TableCell>
                    <Badge variant={attendance.status === 'completed' ? 'default' : 'secondary'}>
                      {attendance.status === 'completed' ? 'Concluído' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewAttendance(attendance)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Attendance Dialog */}
      <Dialog open={isNewAttendanceOpen} onOpenChange={setIsNewAttendanceOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Novo Atendimento</DialogTitle>
            <DialogDescription>
              Preencha os dados do atendimento realizado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Patient Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dados do Paciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient">Paciente</Label>
                    <Select
                      value={formData.patientId}
                      onValueChange={(value) => setFormData({ ...formData, patientId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPatients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id.toString()}>
                            {patient.name} - {patient.age} anos
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="professional">Profissional</Label>
                    <Select
                      value={formData.professional}
                      onValueChange={(value) => setFormData({ ...formData, professional: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o profissional" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. Carlos Mendes">Dr. Carlos Mendes</SelectItem>
                        <SelectItem value="Dra. Ana Beatriz">Dra. Ana Beatriz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                    <Label htmlFor="time">Hora</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Tipo de Atendimento</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consulta">Consulta</SelectItem>
                        <SelectItem value="Limpeza">Limpeza</SelectItem>
                        <SelectItem value="Tratamento">Tratamento</SelectItem>
                        <SelectItem value="Emergência">Emergência</SelectItem>
                        <SelectItem value="Retorno">Retorno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dados Clínicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="complaint">Queixa Principal</Label>
                  <Textarea
                    id="complaint"
                    value={formData.complaint}
                    onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                    placeholder="Descreva a queixa principal do paciente..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="diagnosis">Diagnóstico</Label>
                  <Textarea
                    id="diagnosis"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    placeholder="Diagnóstico clínico..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="treatment">Tratamento Realizado</Label>
                  <Textarea
                    id="treatment"
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    placeholder="Descreva o tratamento realizado..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="prescriptions">Prescrições</Label>
                  <Textarea
                    id="prescriptions"
                    value={formData.prescriptions}
                    onChange={(e) => setFormData({ ...formData, prescriptions: e.target.value })}
                    placeholder="Medicamentos prescritos, orientações, etc..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="observations">Observações</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="Observações adicionais..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="nextAppointment">Próxima Consulta</Label>
                  <Input
                    id="nextAppointment"
                    type="date"
                    value={formData.nextAppointment}
                    onChange={(e) => setFormData({ ...formData, nextAppointment: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsNewAttendanceOpen(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSaveAttendance}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Atendimento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Attendance Dialog */}
      <Dialog open={isViewAttendanceOpen} onOpenChange={setIsViewAttendanceOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Atendimento</DialogTitle>
            <DialogDescription>
              Informações completas do atendimento realizado
            </DialogDescription>
          </DialogHeader>

          {selectedAttendance && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Paciente</Label>
                  <p className="font-medium">{selectedAttendance.patient}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Profissional</Label>
                  <p className="font-medium">{selectedAttendance.professional}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Data</Label>
                  <p className="text-sm">{new Date(selectedAttendance.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Hora</Label>
                  <p className="text-sm">{selectedAttendance.time}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tipo</Label>
                  <p className="text-sm">{selectedAttendance.type}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Queixa Principal</Label>
                <p className="text-sm mt-1">{selectedAttendance.complaint}</p>
              </div>

              {selectedAttendance.diagnosis && (
                <div>
                  <Label className="text-muted-foreground">Diagnóstico</Label>
                  <p className="text-sm mt-1">{selectedAttendance.diagnosis}</p>
                </div>
              )}

              {selectedAttendance.treatment && (
                <div>
                  <Label className="text-muted-foreground">Tratamento Realizado</Label>
                  <p className="text-sm mt-1">{selectedAttendance.treatment}</p>
                </div>
              )}

              <div className="pt-4">
                <Badge variant={selectedAttendance.status === 'completed' ? 'default' : 'secondary'}>
                  {selectedAttendance.status === 'completed' ? 'Atendimento Concluído' : 'Pendente'}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
