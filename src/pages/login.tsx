import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Smile, Mail, Lock, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('userRole', 'clinic');
    }

    router.push('/dashboard');
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login clicked');
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental-ocean-blue mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dental-navy-blue via-dental-ocean-blue to-dental-light-blue p-12 flex-col justify-between text-white">
        <div className="flex items-center space-x-3">
          <Smile className="h-10 w-10" />
          <h1 className="text-3xl font-bold">DentalSaaS</h1>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Gerencie sua clínica odontológica de forma inteligente
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Uma plataforma completa para gestão de pacientes, agendamentos, tratamentos e financeiro.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-5xl font-bold mb-2">500+</h3>
              <p className="text-white/80">Clínicas Atendidas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-5xl font-bold mb-2">50K+</h3>
              <p className="text-white/80">Pacientes Cadastrados</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-5xl font-bold mb-2">99.9%</h3>
              <p className="text-white/80">Uptime</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-5xl font-bold mb-2">4.9/5</h3>
              <p className="text-white/80">Avaliação</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">✓</div>
            <p className="text-white/90">Segurança de dados com criptografia de ponta</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">✓</div>
            <p className="text-white/90">Suporte especializado 24/7</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">✓</div>
            <p className="text-white/90">Atualizações constantes e gratuitas</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Smile className="h-10 w-10 text-dental-ocean-blue" />
              <h1 className="text-3xl font-bold text-dental-navy-blue">DentalSaaS</h1>
            </div>
            <p className="text-muted-foreground">Gestão Inteligente para sua Clínica</p>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">Bem-vindo de volta</h2>
            <p className="text-muted-foreground">Entre com sua conta para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base">Senha</Label>
                <a href="#" className="text-sm text-dental-ocean-blue hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 text-base"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base"
            onClick={handleGoogleLogin}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <a href="/plans" className="text-dental-ocean-blue hover:underline font-medium">
              Crie sua conta grátis
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
