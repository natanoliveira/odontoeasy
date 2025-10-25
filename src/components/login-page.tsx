import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Smile, Mail, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'clinic' | 'admin') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role: 'clinic' | 'admin') => {
    // Simulação de login - em produção, validar credenciais
    onLogin(role);
  };

  const handleDemoLogin = (role: 'clinic' | 'admin') => {
    setEmail(role === 'clinic' ? 'clinica@demo.com' : 'admin@demo.com');
    setPassword('demo123');
    setTimeout(() => onLogin(role), 500);
  };

  const handleGoogleLogin = (role: 'clinic' | 'admin') => {
    // Mock Google OAuth flow
    setTimeout(() => {
      alert(`Login com Google realizado com sucesso! (${role})`);
      onLogin(role);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dental-light-blue to-dental-ocean-blue p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Smile className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">DentalSaaS</CardTitle>
          <CardDescription>
            Sistema de Gestão para Clínicas Odontológicas
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="w-full mb-4" 
              onClick={() => handleGoogleLogin('clinic')}
            >
              <Mail className="mr-2 h-4 w-4" />
              Continuar com Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continue com email
                </span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="clinic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="clinic">Clínica</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clinic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinic-email">Email</Label>
                <Input 
                  id="clinic-email"
                  type="email" 
                  placeholder="clinica@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinic-password">Senha</Label>
                <Input 
                  id="clinic-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleLogin('clinic')}
              >
                Entrar como Clínica
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => handleDemoLogin('clinic')}
                >
                  Demo Clínica
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => handleGoogleLogin('clinic')}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input 
                  id="admin-email"
                  type="email" 
                  placeholder="admin@dentalsaas.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Senha</Label>
                <Input 
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleLogin('admin')}
              >
                Entrar como Admin
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => handleDemoLogin('admin')}
                >
                  Demo Admin
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => handleGoogleLogin('admin')}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <a 
                  href="/plans" 
                  className="text-primary hover:underline"
                >
                  Assine um plano
                </a>
              </p>
            </div>
            
            <div className="text-center">
              <Button variant="ghost" size="sm" asChild>
                <a href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao início
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}