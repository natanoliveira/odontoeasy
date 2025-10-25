import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Shield,
  Edit3,
  Save,
  X,
  Camera
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ProfileProps {
  userRole: 'clinic' | 'admin' | null;
}

export function Profile({ userRole }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userRole === 'admin' ? 'Administrador' : 'Clínica Demo',
    email: userRole === 'admin' ? 'admin@dentalsaas.com' : 'clinica@demo.com',
    phone: userRole === 'admin' ? '+55 11 99999-9999' : '+55 11 88888-8888',
    address: userRole === 'admin' ? 'São Paulo, SP' : 'Rua das Flores, 123 - Centro',
    description: userRole === 'admin' 
      ? 'Administrador do sistema DentalSaaS com acesso completo às funcionalidades da plataforma.'
      : 'Clínica odontológica especializada em tratamentos gerais e estéticos.'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Simular salvamento
    toast.success('Perfil atualizado com sucesso!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Restaurar dados originais
    setFormData({
      name: userRole === 'admin' ? 'Administrador' : 'Clínica Demo',
      email: userRole === 'admin' ? 'admin@dentalsaas.com' : 'clinica@demo.com',
      phone: userRole === 'admin' ? '+55 11 99999-9999' : '+55 11 88888-8888',
      address: userRole === 'admin' ? 'São Paulo, SP' : 'Rua das Flores, 123 - Centro',
      description: userRole === 'admin' 
        ? 'Administrador do sistema DentalSaaS com acesso completo às funcionalidades da plataforma.'
        : 'Clínica odontológica especializada em tratamentos gerais e estéticos.'
    });
    setIsEditing(false);
  };

  const getUserInfo = () => {
    if (userRole === 'admin') {
      return {
        avatar: 'AD',
        role: 'Administrador',
        roleIcon: Shield,
        roleBadgeVariant: 'destructive' as const
      };
    }
    return {
      avatar: 'CD',
      role: 'Clínica',
      roleIcon: Building2,
      roleBadgeVariant: 'secondary' as const
    };
  };

  const userInfo = getUserInfo();
  const RoleIcon = userInfo.roleIcon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e configurações da conta
          </p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit3 className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card do Avatar e Informações Básicas */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                  <AvatarFallback className="bg-dental-ocean-blue text-white text-2xl">
                    {userInfo.avatar}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="font-semibold">{formData.name}</h3>
                <Badge variant={userInfo.roleBadgeVariant} className="flex items-center gap-1">
                  <RoleIcon className="h-3 w-3" />
                  {userInfo.role}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{formData.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{formData.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{formData.address}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card de Informações Detalhadas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais e de contato
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.address}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  placeholder="Descreva um pouco sobre você ou sua clínica..."
                />
              ) : (
                <p className="text-sm text-muted-foreground">{formData.description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card de Configurações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Conta</CardTitle>
          <CardDescription>
            Gerencie as configurações de segurança e preferências da sua conta
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Alterar Senha</h4>
              <p className="text-sm text-muted-foreground">
                Atualize sua senha para manter sua conta segura
              </p>
            </div>
            <Button variant="outline">
              Alterar Senha
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Notificações por Email</h4>
              <p className="text-sm text-muted-foreground">
                Receba notificações sobre agendamentos e atualizações
              </p>
            </div>
            <Button variant="outline">
              Configurar
            </Button>
          </div>

          {userRole === 'clinic' && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Configurações da Clínica</h4>
                <p className="text-sm text-muted-foreground">
                  Gerencie horários de funcionamento e informações da clínica
                </p>
              </div>
              <Button variant="outline">
                Configurar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}