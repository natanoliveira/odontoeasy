import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Check, 
  Smile, 
  Calendar,
  Users,
  FileText,
  CreditCard,
  Heart,
  Shield,
  Zap,
  Clock,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ChevronRight
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Gestão de Pacientes',
    description: 'Cadastro completo, histórico médico e acompanhamento personalizado'
  },
  {
    icon: Calendar,
    title: 'Agendamento Inteligente',
    description: 'Sistema de agendamento online com confirmação automática e lembretes'
  },
  {
    icon: Heart,
    title: 'Odontograma Digital',
    description: 'Mapeamento visual completo da boca com histórico de procedimentos'
  },
  {
    icon: FileText,
    title: 'Documentos Digitais',
    description: 'Upload e organização de exames, laudos e documentos importantes'
  },
  {
    icon: CreditCard,
    title: 'Gestão Financeira',
    description: 'Controle de pagamentos, planos de tratamento e relatórios financeiros'
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Criptografia avançada e backup automático dos seus dados'
  }
];

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 'R$ 97',
    period: '/mês',
    description: 'Ideal para clínicas pequenas',
    color: 'text-blue-500',
    features: [
      'Até 100 pacientes',
      'Agendamento online',
      'Gestão básica de consultas',
      'Relatórios simples',
      'Suporte por email',
      'Upload de documentos (1GB)'
    ],
    highlighted: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 197',
    period: '/mês',
    description: 'Para clínicas em crescimento',
    color: 'text-yellow-500',
    features: [
      'Pacientes ilimitados',
      'Agendamento online avançado',
      'Odontograma digital',
      'Relatórios avançados',
      'Integração WhatsApp',
      'Upload ilimitado',
      'Múltiplos usuários',
      'Backup automático'
    ],
    highlighted: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'R$ 397',
    period: '/mês',
    description: 'Para grandes clínicas e redes',
    color: 'text-purple-500',
    features: [
      'Tudo do Premium',
      'Multi-clínicas',
      'API personalizada',
      'Consultoria especializada',
      'Treinamento da equipe',
      'Suporte 24/7',
      'Customizações especiais'
    ],
    highlighted: false
  }
];

const testimonials = [
  {
    name: 'Dr. Carlos Silva',
    role: 'Clínica OdontoVida',
    content: 'O sistema revolucionou nossa clínica. Conseguimos reduzir em 80% o tempo gasto com agendamentos.',
    rating: 5
  },
  {
    name: 'Dra. Ana Santos',
    role: 'Dental Care Center',
    content: 'Interface intuitiva e suporte excepcional. Nossos pacientes adoram o agendamento online.',
    rating: 5
  },
  {
    name: 'Dr. Pedro Costa',
    role: 'Sorriso Perfeito',
    content: 'Relatórios financeiros detalhados nos ajudaram a aumentar a receita em 40%.',
    rating: 5
  }
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-full">
                <Smile className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-dental-navy-blue">DentalSaaS</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <a href="#features">Recursos</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="#pricing">Preços</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="#contact">Contato</a>
              </Button>
              <Button asChild>
                <a href="/login">Entrar</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dental-light-blue to-dental-ocean-blue py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Modernize sua
              <span className="text-dental-navy-blue"> Clínica Odontológica</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Sistema completo de gestão para clínicas odontológicas. 
              Agende consultas, gerencie pacientes e aumente sua receita com nossa plataforma intuitiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-dental-navy-blue hover:bg-gray-100" asChild>
                <a href="/plans">
                  Começar Agora - 7 dias grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-dental-navy-blue">
                Ver Demonstração
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5" />
                <span>Setup gratuito</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5" />
                <span>Cancele quando quiser</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5" />
                <span>Suporte incluído</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-dental-navy-blue mb-2">500+</div>
              <div className="text-muted-foreground">Clínicas ativas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-dental-navy-blue mb-2">50k+</div>
              <div className="text-muted-foreground">Agendamentos mensais</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-dental-navy-blue mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime garantido</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-dental-navy-blue mb-2">4.8/5</div>
              <div className="text-muted-foreground">Satisfação dos clientes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dental-navy-blue mb-4">
              Tudo que sua clínica precisa
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma solução completa para modernizar sua clínica e oferecer a melhor experiência aos seus pacientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-dental-light-blue rounded-lg">
                      <feature.icon className="h-6 w-6 text-dental-navy-blue" />
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

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dental-navy-blue mb-4">
              Planos para cada tamanho de clínica
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para sua clínica. Todos incluem suporte técnico e atualizações gratuitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative ${plan.highlighted ? 'ring-2 ring-dental-ocean-blue scale-105' : ''} hover:shadow-lg transition-all`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-dental-ocean-blue text-white px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-dental-navy-blue">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    variant={plan.highlighted ? "default" : "outline"}
                    asChild
                  >
                    <a href="/plans">
                      Começar com {plan.name}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Todos os planos incluem 7 dias de teste gratuito
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="/plans">Ver comparação completa</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dental-navy-blue mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-muted-foreground">
              Mais de 500 clínicas já transformaram seus negócios com o DentalSaaS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dental-navy-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para modernizar sua clínica?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Junte-se a centenas de dentistas que já revolucionaram seus consultórios
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-dental-navy-blue hover:bg-gray-100" asChild>
              <a href="/plans">
                Começar teste gratuito
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-dental-navy-blue">
              Falar com consultor
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dental-navy-blue mb-4">
              Entre em contato
            </h2>
            <p className="text-xl text-muted-foreground">
              Nossa equipe está pronta para ajudar você a transformar sua clínica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-dental-light-blue rounded-full">
                    <Phone className="h-6 w-6 text-dental-navy-blue" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Telefone</h3>
                <p className="text-muted-foreground">(11) 3333-4444</p>
                <p className="text-sm text-muted-foreground">Segunda a sexta, 8h às 18h</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-dental-light-blue rounded-full">
                    <Mail className="h-6 w-6 text-dental-navy-blue" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground">contato@dentalsaas.com</p>
                <p className="text-sm text-muted-foreground">Resposta em até 2 horas</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-dental-light-blue rounded-full">
                    <MapPin className="h-6 w-6 text-dental-navy-blue" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Escritório</h3>
                <p className="text-muted-foreground">São Paulo, SP</p>
                <p className="text-sm text-muted-foreground">Região da Faria Lima</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dental-navy-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-dental-ocean-blue rounded-full">
                  <Smile className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">DentalSaaS</h3>
              </div>
              <p className="text-white/80">
                A solução completa para modernizar sua clínica odontológica.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <div className="space-y-2 text-white/80">
                <div><a href="#features" className="hover:text-white">Recursos</a></div>
                <div><a href="#pricing" className="hover:text-white">Preços</a></div>
                <div><a href="/plans" className="hover:text-white">Planos</a></div>
                <div><a href="#" className="hover:text-white">Demonstração</a></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <div className="space-y-2 text-white/80">
                <div><a href="#contact" className="hover:text-white">Contato</a></div>
                <div><a href="#" className="hover:text-white">Central de Ajuda</a></div>
                <div><a href="#" className="hover:text-white">Documentação</a></div>
                <div><a href="#" className="hover:text-white">Status</a></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-white/80">
                <div><a href="#" className="hover:text-white">Privacidade</a></div>
                <div><a href="#" className="hover:text-white">Termos de Uso</a></div>
                <div><a href="#" className="hover:text-white">Cookies</a></div>
                <div><a href="#" className="hover:text-white">LGPD</a></div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-dental-ocean-blue/30 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2025 DentalSaaS. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}