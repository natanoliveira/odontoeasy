import React, { useState, useEffect } from 'react';
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
  Settings,
  Save
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimeSlot {
  id: string;
  time: string;
  isOccupied: boolean;
  appointmentId?: string;
}

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  professionalName: string;
  date: Date;
  timeSlots: string[]; // Array de horários ocupados
  duration: number; // Duração em minutos
  service: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

interface ClinicTimeConfig {
  slotDuration: number; // Duração de cada slot em minutos (15, 30, 45, 60)
  startTime: string; // Horário de início (ex: "08:00")
  endTime: string; // Horário de fim (ex: "18:00")
  lunchBreakStart?: string; // Início do almoço (opcional)
  lunchBreakEnd?: string; // Fim do almoço (opcional)
}

const defaultTimeConfig: ClinicTimeConfig = {
  slotDuration: 30,
  startTime: "08:00",
  endTime: "18:00",
  lunchBreakStart: "12:00",
  lunchBreakEnd: "13:00"
};

export function AppointmentsWithTimeSlots() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeConfig, setTimeConfig] = useState<ClinicTimeConfig>(defaultTimeConfig);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);

  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    professionalName: '',
    service: '',
    duration: 30,
    notes: '',
    selectedTimeSlots: [] as string[]
  });

  // Gerar slots de horário baseado na configuração
  const generateTimeSlots = (date: Date, config: ClinicTimeConfig): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const [startHour, startMinute] = config.startTime.split(':').map(Number);
    const [endHour, endMinute] = config.endTime.split(':').map(Number);
    
    let currentTime = new Date(date);
    currentTime.setHours(startHour, startMinute, 0, 0);
    
    const endTime = new Date(date);
    endTime.setHours(endHour, endMinute, 0, 0);

    while (currentTime < endTime) {
      const timeString = format(currentTime, 'HH:mm');
      
      // Verificar se está no horário de almoço
      const isLunchTime = config.lunchBreakStart && config.lunchBreakEnd &&
        timeString >= config.lunchBreakStart && timeString < config.lunchBreakEnd;

      if (!isLunchTime) {
        // Verificar se o slot está ocupado
        const isOccupied = appointments.some(apt => 
          format(apt.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
          apt.timeSlots.includes(timeString)
        );

        const occupiedAppointment = appointments.find(apt => 
          format(apt.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
          apt.timeSlots.includes(timeString)
        );

        slots.push({
          id: `${format(date, 'yyyy-MM-dd')}-${timeString}`,
          time: timeString,
          isOccupied,
          appointmentId: occupiedAppointment?.id
        });
      }

      currentTime.setMinutes(currentTime.getMinutes() + config.slotDuration);
    }

    return slots;
  };

  // Calcular quantos slots são necessários para uma duração específica
  const calculateRequiredSlots = (duration: number): number => {
    return Math.ceil(duration / timeConfig.slotDuration);
  };

  // Verificar se slots consecutivos estão disponíveis
  const areConsecutiveSlotsAvailable = (startSlotIndex: number, requiredSlots: number): boolean => {
    for (let i = 0; i < requiredSlots; i++) {
      const slotIndex = startSlotIndex + i;
      if (slotIndex >= availableTimeSlots.length || availableTimeSlots[slotIndex].isOccupied) {
        return false;
      }
    }
    return true;
  };

  // Obter slots consecutivos a partir de um índice
  const getConsecutiveSlots = (startSlotIndex: number, requiredSlots: number): string[] => {
    const slots: string[] = [];
    for (let i = 0; i < requiredSlots; i++) {
      const slotIndex = startSlotIndex + i;
      if (slotIndex < availableTimeSlots.length) {
        slots.push(availableTimeSlots[slotIndex].time);
      }
    }
    return slots;
  };

  // Atualizar slots disponíveis quando a data ou configuração mudar
  useEffect(() => {
    const slots = generateTimeSlots(selectedDate, timeConfig);
    setAvailableTimeSlots(slots);
  }, [selectedDate, timeConfig, appointments]);

  const handleAddAppointment = () => {
    if (!formData.patientName || !formData.professionalName || formData.selectedTimeSlots.length === 0) {
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientName: formData.patientName,
      patientPhone: formData.patientPhone,
      professionalName: formData.professionalName,
      date: selectedDate,
      timeSlots: formData.selectedTimeSlots,
      duration: formData.duration,
      service: formData.service,
      status: 'scheduled',
      notes: formData.notes
    };

    setAppointments(prev => [...prev, newAppointment]);
    setFormData({
      patientName: '',
      patientPhone: '',
      professionalName: '',
      service: '',
      duration: 30,
      notes: '',
      selectedTimeSlots: []
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteAppointment = () => {
    if (selectedAppointment) {
      setAppointments(prev => prev.filter(apt => apt.id !== selectedAppointment.id));
      setSelectedAppointment(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleTimeSlotClick = (slotTime: string, slotIndex: number) => {
    const requiredSlots = calculateRequiredSlots(formData.duration);
    
    if (areConsecutiveSlotsAvailable(slotIndex, requiredSlots)) {
      const consecutiveSlots = getConsecutiveSlots(slotIndex, requiredSlots);
      setFormData(prev => ({
        ...prev,
        selectedTimeSlots: consecutiveSlots
      }));
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const updateTimeConfig = () => {
    setIsConfigDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os agendamentos da clínica com controle de horários
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configurar Horários
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Configuração de Horários</DialogTitle>
                <DialogDescription>
                  Configure os horários de funcionamento da clínica
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="slotDuration">Duração do Slot (min)</Label>
                    <Select
                      value={timeConfig.slotDuration.toString()}
                      onValueChange={(value) => setTimeConfig(prev => ({
                        ...prev,
                        slotDuration: parseInt(value)
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">60 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Horário de Início</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={timeConfig.startTime}
                      onChange={(e) => setTimeConfig(prev => ({
                        ...prev,
                        startTime: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Horário de Fim</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={timeConfig.endTime}
                      onChange={(e) => setTimeConfig(prev => ({
                        ...prev,
                        endTime: e.target.value
                      }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lunchStart">Início do Almoço</Label>
                    <Input
                      id="lunchStart"
                      type="time"
                      value={timeConfig.lunchBreakStart || ''}
                      onChange={(e) => setTimeConfig(prev => ({
                        ...prev,
                        lunchBreakStart: e.target.value || undefined
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lunchEnd">Fim do Almoço</Label>
                    <Input
                      id="lunchEnd"
                      type="time"
                      value={timeConfig.lunchBreakEnd || ''}
                      onChange={(e) => setTimeConfig(prev => ({
                        ...prev,
                        lunchBreakEnd: e.target.value || undefined
                      }))}
                    />
                  </div>
                </div>

                <Button onClick={updateTimeConfig} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configuração
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
                <DialogDescription>
                  Adicione um novo agendamento ao sistema
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="patientName">Nome do Paciente</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        patientName: e.target.value
                      }))}
                      placeholder="Digite o nome do paciente"
                    />
                  </div>

                  <div>
                    <Label htmlFor="patientPhone">Telefone</Label>
                    <Input
                      id="patientPhone"
                      value={formData.patientPhone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        patientPhone: e.target.value
                      }))}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="professionalName">Profissional</Label>
                    <Select
                      value={formData.professionalName}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        professionalName: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o profissional" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. João Silva">Dr. João Silva</SelectItem>
                        <SelectItem value="Dra. Maria Santos">Dra. Maria Santos</SelectItem>
                        <SelectItem value="Dr. Pedro Costa">Dr. Pedro Costa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="service">Serviço</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        service: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consulta">Consulta</SelectItem>
                        <SelectItem value="Limpeza">Limpeza</SelectItem>
                        <SelectItem value="Extração">Extração</SelectItem>
                        <SelectItem value="Obturação">Obturação</SelectItem>
                        <SelectItem value="Canal">Canal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duração (minutos)</Label>
                    <Select
                      value={formData.duration.toString()}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        duration: parseInt(value),
                        selectedTimeSlots: [] // Reset slots quando mudar duração
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">60 minutos</SelectItem>
                        <SelectItem value="90">90 minutos</SelectItem>
                        <SelectItem value="120">120 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        notes: e.target.value
                      }))}
                      placeholder="Observações sobre o agendamento"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Data</Label>
                    <div className="border rounded-lg p-3">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        locale={ptBR}
                        className="rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>
                      Horários Disponíveis 
                      <span className="text-sm text-muted-foreground ml-2">
                        (Duração: {formData.duration}min = {calculateRequiredSlots(formData.duration)} slots)
                      </span>
                    </Label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                      {availableTimeSlots.map((slot, index) => {
                        const requiredSlots = calculateRequiredSlots(formData.duration);
                        const isSelectable = areConsecutiveSlotsAvailable(index, requiredSlots);
                        const isSelected = formData.selectedTimeSlots.includes(slot.time);
                        
                        return (
                          <Button
                            key={slot.id}
                            variant={isSelected ? "default" : slot.isOccupied ? "secondary" : "outline"}
                            size="sm"
                            disabled={slot.isOccupied || !isSelectable}
                            onClick={() => handleTimeSlotClick(slot.time, index)}
                            className="text-xs"
                          >
                            {slot.time}
                          </Button>
                        );
                      })}
                    </div>
                    
                    {formData.selectedTimeSlots.length > 0 && (
                      <div className="mt-2 p-2 bg-muted rounded">
                        <p className="text-sm">
                          Horários selecionados: {formData.selectedTimeSlots.join(' - ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddAppointment}>
                  Salvar Agendamento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Visualização por Data</TabsTrigger>
          <TabsTrigger value="list">Lista de Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Selecionar Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ptBR}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Agenda do Dia - {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {availableTimeSlots.map((slot) => {
                    const appointment = appointments.find(apt => 
                      format(apt.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') &&
                      apt.timeSlots.includes(slot.time)
                    );

                    return (
                      <div
                        key={slot.id}
                        className={`p-2 rounded border text-center text-sm ${
                          appointment
                            ? 'bg-primary text-primary-foreground cursor-pointer hover:opacity-80'
                            : 'bg-muted text-muted-foreground'
                        }`}
                        onClick={() => appointment && setSelectedAppointment(appointment)}
                      >
                        <div className="font-medium">{slot.time}</div>
                        {appointment && (
                          <div className="text-xs truncate mt-1">
                            {appointment.patientName}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {selectedAppointment && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Detalhes do Agendamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Paciente</Label>
                          <p>{selectedAppointment.patientName}</p>
                        </div>
                        <div>
                          <Label>Telefone</Label>
                          <p>{selectedAppointment.patientPhone}</p>
                        </div>
                        <div>
                          <Label>Profissional</Label>
                          <p>{selectedAppointment.professionalName}</p>
                        </div>
                        <div>
                          <Label>Serviço</Label>
                          <p>{selectedAppointment.service}</p>
                        </div>
                        <div>
                          <Label>Horário</Label>
                          <p>{selectedAppointment.timeSlots.join(' - ')}</p>
                        </div>
                        <div>
                          <Label>Duração</Label>
                          <p>{selectedAppointment.duration} minutos</p>
                        </div>
                        <div className="col-span-2">
                          <Label>Status</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={getStatusBadgeVariant(selectedAppointment.status)}>
                              {getStatusIcon(selectedAppointment.status)}
                              <span className="ml-1 capitalize">{selectedAppointment.status}</span>
                            </Badge>
                          </div>
                        </div>
                        {selectedAppointment.notes && (
                          <div className="col-span-2">
                            <Label>Observações</Label>
                            <p className="text-sm text-muted-foreground">{selectedAppointment.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setIsDeleteDialogOpen(true)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Profissional</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {format(appointment.date, 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>{appointment.timeSlots.join(' - ')}</TableCell>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>{appointment.professionalName}</TableCell>
                      <TableCell>{appointment.service}</TableCell>
                      <TableCell>{appointment.duration}min</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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