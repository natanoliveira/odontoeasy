import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Building2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Globe,
  Save,
  Plus,
  Trash2
} from 'lucide-react';

// Mock data
const mockClinicData = {
  name: 'Clínica Dental Sorrisos',
  email: 'contato@clinicasorrisos.com',
  phone: '(11) 3333-4444',
  website: 'www.clinicasorrisos.com',
  address: 'Rua das Palmeiras, 456 - Centro',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '01234-567',
  description: 'Clínica odontológica especializada em tratamentos gerais e estéticos.',
  openingHours: [
    { day: 'Segunda-feira', start: '08:00', end: '18:00', isOpen: true },
    { day: 'Terça-feira', start: '08:00', end: '18:00', isOpen: true },
    { day: 'Quarta-feira', start: '08:00', end: '18:00', isOpen: true },
    { day: 'Quinta-feira', start: '08:00', end: '18:00', isOpen: true },
    { day: 'Sexta-feira', start: '08:00', end: '17:00', isOpen: true },
    { day: 'Sábado', start: '08:00', end: '12:00', isOpen: true },
    { day: 'Domingo', start: '08:00', end: '12:00', isOpen: false },
  ],
  services: [
    'Limpeza e Profilaxia',
    'Obturação',
    'Tratamento de Canal',
    'Extração',
    'Prótese Dentária',
    'Ortodontia',
    'Implantes',
    'Clareamento'
  ],
  plan: 'premium'
};

export function Clinic() {
  const [clinicData, setClinicData] = useState(mockClinicData);
  const [newService, setNewService] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setClinicData(prev => ({ ...prev, [field]: value }));
  };

  const handleHourChange = (index: number, field: 'start' | 'end' | 'isOpen', value: string | boolean) => {
    const updatedHours = [...clinicData.openingHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setClinicData(prev => ({ ...prev, openingHours: updatedHours }));
  };

  const addService = () => {
    if (newService.trim()) {
      setClinicData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    setClinicData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    // Simulate saving
    alert('Dados da clínica salvos com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Configurações da Clínica</h1>
        <div className="flex items-center space-x-4">
          <Badge variant={clinicData.plan === 'premium' ? 'default' : 'secondary'}>
            Plano {clinicData.plan === 'premium' ? 'Premium' : 'Básico'}
          </Badge>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Informações Básicas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Clínica</Label>
              <Input
                id="name"
                value={clinicData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={clinicData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={clinicData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  value={clinicData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={clinicData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Endereço</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={clinicData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={clinicData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="state">Estado</Label>
                <Select value={clinicData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    {/* Add more states as needed */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={clinicData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opening Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Horários de Funcionamento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clinicData.openingHours.map((schedule, index) => (
              <div key={schedule.day} className="flex items-center space-x-4">
                <div className="w-32">
                  <Label>{schedule.day}</Label>
                </div>
                
                <Switch
                  checked={schedule.isOpen}
                  onCheckedChange={(checked) => handleHourChange(index, 'isOpen', checked)}
                />
                
                {schedule.isOpen && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={schedule.start}
                        onChange={(e) => handleHourChange(index, 'start', e.target.value)}
                        className="w-32"
                      />
                      <span>às</span>
                      <Input
                        type="time"
                        value={schedule.end}
                        onChange={(e) => handleHourChange(index, 'end', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </>
                )}
                
                {!schedule.isOpen && (
                  <span className="text-muted-foreground">Fechado</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços Oferecidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Adicionar novo serviço..."
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addService()}
              />
              <Button onClick={addService}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {clinicData.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span>{service}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}