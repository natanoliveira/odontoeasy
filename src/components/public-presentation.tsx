import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Smile, 
  Calendar, 
  Users, 
  FileText, 
  CreditCard, 
  Shield, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Building2,
  BarChart3,
  Zap,
  Heart,
  Award,
  Phone,
  Mail
} from 'lucide-react';

export function PublicPresentation() {
  const features = [
    {
      icon: Users,
      title: 'Gestão de Pacientes',
      description: 'Cadastro completo de pacientes com histórico médico, dados de contato e acompanhamento personalizado.'
    },
    {
      icon: Calendar,
      title: 'Agendamento Online',
      description: 'Sistema de agendamento online 24/7 para seus pacientes, com confirmações automáticas por email e SMS.'
    },
    {
      icon: Smile,
      title: 'Odontograma Digital',
      description: 'Odontograma interativo para registrar tratamentos, procedimentos e acompanhar a evolução dos pacientes.'
    },
    {
      icon: CreditCard,
      title: 'Controle Financeiro',
      description: 'Gestão completa de pagamentos, parcelamentos, inadimplência e relatórios financeiros detalhados.'
    },
    {
      icon: FileText,
      title: 'Documentos Seguros',
      description: 'Armazenamento seguro de documentos, exames, receitas e laudos com backup automático na nuvem.'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Inteligentes',
      description: 'Dashboards e relatórios gerenciais para acompanhar performance, receita e indicadores da clínica.'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Economia de Tempo',
      description: 'Automatize tarefas repetitivas e foque no que realmente importa: o atendimento aos pacientes.'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Dados protegidos com criptografia de ponta e backup automático. Conformidade com LGPD.'
    },
    {
      icon: Zap,
      title: 'Fácil de Usar',
      description: 'Interface intuitiva que não requer treinamento complexo. Comece a usar em minutos.'
    },
    {
      icon: Heart,
      title: 'Suporte Dedicado',
      description: 'Equipe especializada pronta para ajudar você a tirar máximo proveito da plataforma.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Carlos Mendes',
      specialty: 'Ortodontista',
      text: 'O DentalSaaS revolucionou minha clínica. Aumentei 40% na eficiência dos agendamentos e meus pacientes adoram a facilidade.',
      rating: 5,
      location: 'São Paulo, SP'
    },
    {
      name: 'Dra. Ana Beatriz',
      specialty: 'Implantodontista',
      text: 'Finalmente encontrei uma solução completa. O odontograma digital e o controle financeiro são excepcionais.',
      rating: 5,
      location: 'Rio de Janeiro, RJ'
    },
    {
      name: 'Dr. Roberto Silva',
      specialty: 'Clínico Geral',
      text: 'Plataforma muito intuitiva e o suporte é fantástico. Recomendo para qualquer dentista que quer modernizar sua clínica.',
      rating: 5,
      location: 'Brasília, DF'
    }
  ];

  const plans = [
    {
      name: 'Básico',
      price: 'R$ 97',
      period: '/mês',
      description: 'Ideal para clínicas pequenas',
      features: [
        'Até 100 pacientes',
        'Agendamento online',
        'Odontograma básico',
        'Controle financeiro',
        'Suporte por email'
      ],
      highlighted: false
    },
    {
      name: 'Avançado',
      price: 'R$ 197',
      period: '/mês',
      description: 'Para clínicas em crescimento',
      features: [
        'Pacientes ilimitados',
        'Agendamento avançado',
        'Odontograma completo',
        'Relatórios detalhados',
        'Backup automático',
        'Suporte prioritário',
        'Integração WhatsApp'
      ],
      highlighted: true
    }
  ];

  const stats = [
    { number: '500+', label: 'Clínicas Atendidas' },
    { number: '50K+', label: 'Pacientes Cadastrados' },
    { number: '99.9%', label: 'Uptime Garantido' },
    { number: '4.9/5', label: 'Avaliação dos Usuários' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Smile className="h-8 w-8 text-dental-ocean-blue" />
              <span className="text-xl font-semibold">DentalSaaS</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">
                Benefícios
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Depoimentos
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </a>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                Sobre Nós
              </Link>
            </nav>
            <div className="flex space-x-3">
              <Link to="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link to="/plans">
                <Button>Teste Grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-dental-light-blue/20 via-background to-dental-ocean-blue/10">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-dental-ocean-blue/10 text-dental-ocean-blue hover:bg-dental-ocean-blue/20">
            ✨ Mais de 500 clínicas já confiam em nós
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-dental-navy-blue to-dental-ocean-blue bg-clip-text text-transparent">
            O Software Completo para sua Clínica Odontológica
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Gerencie pacientes, agendamentos, tratamentos e finanças em uma única plataforma. 
            Modernize sua clínica e ofereça uma experiência excepcional aos seus pacientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/plans">
              <Button size="lg" className="px-8">
                Começar Teste Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8">
              Ver Demonstração
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-dental-navy-blue">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todas as Funcionalidades que sua Clínica Precisa
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa e integrada para otimizar todos os processos da sua clínica odontológica.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-dental-ocean-blue/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-dental-ocean-blue" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que Escolher o DentalSaaS?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Desenvolvido especificamente para dentistas, com foco na facilidade de uso e resultados práticos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="p-4 bg-background rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-sm">
                  <benefit.icon className="h-8 w-8 text-dental-ocean-blue" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que Nossos Clientes Dizem
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Depoimentos reais de dentistas que transformaram suas clínicas com o DentalSaaS.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-dental-ocean-blue/10 rounded-full">
                      <Award className="h-6 w-6 text-dental-ocean-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.specialty}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">"{testimonial.text}"</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planos Flexíveis para Todas as Clínicas
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comece com 7 dias grátis. Sem compromisso, sem taxa de instalação.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.highlighted ? 'border-dental-ocean-blue shadow-lg scale-105' : ''}`}>
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-dental-ocean-blue">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold text-dental-navy-blue">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/plans">
                    <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                      Começar Teste Grátis
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-dental-navy-blue to-dental-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Transformar sua Clínica?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a centenas de dentistas que já modernizaram suas clínicas com o DentalSaaS.
            Comece seu teste gratuito agora mesmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/plans">
              <Button size="lg" className="px-8 bg-white text-dental-navy-blue hover:bg-gray-100">
                Teste Grátis por 7 Dias
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-dental-navy-blue">
              Agendar Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Smile className="h-8 w-8 text-dental-ocean-blue" />
                <span className="text-xl font-semibold">DentalSaaS</span>
              </div>
              <p className="text-gray-400 mb-4">
                A plataforma completa para gestão de clínicas odontológicas.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>(11) 9999-9999</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400 mt-2">
                <Mail className="h-4 w-4" />
                <span>contato@dentalsaas.com</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">Sobre</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 DentalSaaS. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}