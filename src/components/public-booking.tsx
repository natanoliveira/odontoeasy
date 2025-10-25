import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Smile,
  CheckCircle
} from 'lucide-react';

// Mock clinic data
const clinicInfo = {
  name: 'Clínica Dental Sorrisos',
  address: 'Rua das Palmeiras, 456 - Centro, São Paulo',
  phone: '(11) 3333-4444',
  email: 'contato@clinicasorrisos.com',
  services: [
    { name: 'Consulta', duration: 30, price: 'R$ 80' },
    { name: 'Limpeza', duration: 60, price: 'R$ 120' },
    { name: 'Obturação', duration: 90, price: 'R$ 200' },
    { name: 'Tratamento Canal', duration: 120, price: 'R$ 400' },
  ],
  availableSlots: [
    '08:00', '09:00', '10:00', '11:00', 
    '14:00', '15:00', '16:00', '17:00'
  ]
};

interface PublicBookingProps {
  clinicId?: string;
}

export function PublicBooking({ clinicId }: PublicBookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedService, setSelectedService] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [patientData, setPatientData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleBooking = () => {
    // Simulate booking
    setIsBookingComplete(true);
  };

  if (isBookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dental-light-blue to-dental-ocean-blue flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Agendamento Confirmado!
              </h2>
              <p className="text-muted-foreground">
                Seu agendamento foi realizado com sucesso
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">Detalhes do Agendamento:</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Paciente:</strong> {patientData.name}</p>
                <p><strong>Serviço:</strong> {selectedService}</p>
                <p><strong>Data:</strong> {selectedDate?.toLocaleDateString('pt-BR')}</p>
                <p><strong>Horário:</strong> {selectedTime}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Confirmação enviada para {patientData.email}</p>
              <p>✓ Lembrete será enviado 1 dia antes</p>
              <p>✓ Em caso de cancelamento, entre em contato conosco</p>
            </div>
            
            <Button 
              className="w-full mt-6" 
              onClick={() => window.location.reload()}
            >
              Fazer Novo Agendamento
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-light-blue to-dental-ocean-blue">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-full">
                <Smile className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{clinicInfo.name}</h1>
                <p className="text-sm text-muted-foreground">Agendamento Online</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Clinic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Clínica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-dental-ocean-blue mt-0.5" />
                  <div>
                    <p className="font-medium">Endereço</p>
                    <p className="text-sm text-muted-foreground">{clinicInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-dental-ocean-blue" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{clinicInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-dental-ocean-blue" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{clinicInfo.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Serviços Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clinicInfo.services.map((service, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.duration} min</p>
                      </div>
                      <Badge variant="outline">{service.price}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Agendar Consulta</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Patient Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={patientData.name}
                      onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patientData.email}
                      onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={patientData.phone}
                      onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="service">Serviço *</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinicInfo.services.map((service) => (
                          <SelectItem key={service.name} value={service.name}>
                            {service.name} - {service.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Selecione a Data</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div>
                    <Label>Horários Disponíveis</Label>
                    {selectedDate ? (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {clinicInfo.availableSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className="justify-center"
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selecione uma data para ver os horários disponíveis
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Input
                    id="notes"
                    value={patientData.notes}
                    onChange={(e) => setPatientData({...patientData, notes: e.target.value})}
                    placeholder="Alguma observação especial?"
                  />
                </div>

                {/* Summary */}
                {selectedDate && selectedTime && selectedService && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Resumo do Agendamento:</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Serviço:</strong> {selectedService}</p>
                      <p><strong>Data:</strong> {selectedDate.toLocaleDateString('pt-BR')}</p>
                      <p><strong>Horário:</strong> {selectedTime}</p>
                      <p><strong>Paciente:</strong> {patientData.name}</p>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleBooking}
                  disabled={!patientData.name || !patientData.email || !patientData.phone || !selectedService || !selectedDate || !selectedTime}
                >
                  Confirmar Agendamento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}