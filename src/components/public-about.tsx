import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Smile, 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Shield, 
  Lightbulb, 
  ArrowRight,
  Building2,
  Star,
  CheckCircle,
  Award,
  Handshake,
  Zap,
  Globe,
  Phone,
  Mail
} from 'lucide-react';

export function PublicAbout() {
  const values = [
    {
      icon: Heart,
      title: 'Cuidado em Primeiro Lugar',
      description: 'Acreditamos que a tecnologia deve facilitar o cuidado com os pacientes, não complicá-lo. Cada funcionalidade é pensada para melhorar a experiência tanto do dentista quanto do paciente.'
    },
    {
      icon: Shield,
      title: 'Segurança e Confiança',
      description: 'A proteção dos dados dos pacientes é nossa prioridade máxima. Utilizamos as melhores práticas de segurança e estamos em conformidade com a LGPD.'
    },
    {
      icon: Lightbulb,
      title: 'Inovação Contínua',
      description: 'Estamos sempre evoluindo, ouvindo nossos usuários e implementando novas funcionalidades que realmente fazem a diferença no dia a dia das clínicas.'
    },
    {
      icon: Users,
      title: 'Proximidade com o Cliente',
      description: 'Oferecemos suporte personalizado e construímos relacionamentos duradouros. Seu sucesso é o nosso sucesso.'
    },
    {
      icon: Zap,
      title: 'Simplicidade e Eficiência',
      description: 'Desenvolvemos soluções intuitivas que economizam tempo e reduzem a complexidade das tarefas administrativas.'
    },
    {
      icon: Handshake,
      title: 'Transparência Total',
      description: 'Somos transparentes sobre nossos preços, funcionalidades e limitações. Acreditamos em relações baseadas na honestidade.'
    }
  ];

  const objectives = [
    {
      icon: Target,
      title: 'Democratizar a Gestão Odontológica',
      description: 'Tornar ferramentas profissionais de gestão acessíveis para clínicas de todos os tamanhos, desde o consultório individual até grandes centros odontológicos.'
    },
    {
      icon: Globe,
      title: 'Expandir Nacionalmente',
      description: 'Estar presente em todas as regiões do Brasil, apoiando dentistas em pequenas cidades e grandes centros urbanos.'
    },
    {
      icon: Building2,
      title: 'Modernizar a Odontologia',
      description: 'Contribuir para a transformação digital da odontologia brasileira, trazendo mais eficiência e qualidade para o setor.'
    },
    {
      icon: Star,
      title: 'Excelência no Atendimento',
      description: 'Manter o mais alto padrão de satisfação do cliente, com suporte especializado e funcionalidades que realmente fazem a diferença.'
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'Fundação',
      description: 'Nascemos com o objetivo de simplificar a gestão de clínicas odontológicas.',
      icon: Lightbulb
    },
    {
      year: '2024',
      title: 'Primeiros Clientes',
      description: 'Conquistamos a confiança de centenas de dentistas em todo o Brasil.',
      icon: Users
    },
    {
      year: '2024',
      title: 'Expansão de Funcionalidades',
      description: 'Lançamos o odontograma digital e sistema de agendamento online.',
      icon: Star
    },
    {
      year: '2025',
      title: 'Futuro',
      description: 'Planejamos integração com equipamentos e IA para diagnósticos.',
      icon: Target
    }
  ];

  const team = [
    {
      name: 'Dr. João Silva',
      role: 'CEO & Fundador',
      description: 'Dentista com 15 anos de experiência, especialista em gestão de clínicas.',
      expertise: 'Gestão e Estratégia'
    },
    {
      name: 'Maria Santos',
      role: 'CTO',
      description: 'Engenheira de software especializada em sistemas de saúde.',
      expertise: 'Tecnologia e Desenvolvimento'
    },
    {
      name: 'Dr. Carlos Mendes',
      role: 'Head de Produto',
      description: 'Ortodontista e consultor em gestão odontológica.',
      expertise: 'Produto e UX'
    }
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
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Início
              </Link>
              <Link href="/about" className="text-foreground font-medium">
                Sobre Nós
              </Link>
              <Link href="/plans" className="text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </Link>
            </nav>
            <div className="flex space-x-3">
              <Link href="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/plans">
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
            ✨ Conheça nossa história
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-dental-navy-blue to-dental-ocean-blue bg-clip-text text-transparent">
            Nossa Missão é Transformar a Odontologia
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Nascemos com o propósito de simplificar a gestão de clínicas odontológicas, 
            permitindo que dentistas foquem no que realmente importa: cuidar dos seus pacientes.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Missão */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-4 bg-dental-ocean-blue/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-10 w-10 text-dental-ocean-blue" />
                </div>
                <CardTitle className="text-2xl">Nossa Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simplificar a gestão de clínicas odontológicas através de tecnologia intuitiva, 
                  permitindo que dentistas dediquem mais tempo ao cuidado dos pacientes.
                </p>
              </CardContent>
            </Card>

            {/* Visão */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-4 bg-dental-ocean-blue/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Eye className="h-10 w-10 text-dental-ocean-blue" />
                </div>
                <CardTitle className="text-2xl">Nossa Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ser a plataforma de gestão odontológica mais utilizada no Brasil, 
                  reconhecida pela excelência em suporte e inovação contínua.
                </p>
              </CardContent>
            </Card>

            {/* Propósito */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-4 bg-dental-ocean-blue/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-10 w-10 text-dental-ocean-blue" />
                </div>
                <CardTitle className="text-2xl">Nosso Propósito</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contribuir para uma odontologia mais eficiente e humanizada, 
                  onde a tecnologia potencializa o cuidado e fortalece a relação dentista-paciente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossos Valores
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Os princípios que guiam cada decisão e cada linha de código que escrevemos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-dental-ocean-blue/10 rounded-lg">
                      <value.icon className="h-6 w-6 text-dental-ocean-blue" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Objetivos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossos Objetivos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              As metas que nos motivam a evoluir constantemente e a buscar a excelência.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {objectives.map((objective, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-dental-ocean-blue/10 rounded-lg">
                      <objective.icon className="h-8 w-8 text-dental-ocean-blue" />
                    </div>
                    <CardTitle className="text-xl">{objective.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{objective.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossa Jornada
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Os marcos importantes da nossa história e o que planejamos para o futuro.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-dental-ocean-blue rounded-full">
                      <milestone.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant="outline" className="text-dental-ocean-blue border-dental-ocean-blue">
                        {milestone.year}
                      </Badge>
                      <h3 className="text-xl font-semibold">{milestone.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossa Equipe
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Profissionais apaixonados por tecnologia e odontologia, unidos pelo propósito de inovar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-4 bg-dental-ocean-blue/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-10 w-10 text-dental-ocean-blue" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-dental-ocean-blue font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{member.description}</p>
                  <Badge variant="outline" className="text-dental-ocean-blue border-dental-ocean-blue">
                    {member.expertise}
                  </Badge>
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
            Faça Parte da Nossa História
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a centenas de dentistas que já transformaram suas clínicas conosco. 
            Comece sua jornada de transformação digital hoje mesmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plans">
              <Button size="lg" className="px-8 bg-white text-dental-navy-blue hover:bg-gray-100">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-dental-navy-blue">
              Conhecer Mais
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
                <li><Link href="/" className="hover:text-white transition-colors">Funcionalidades</Link></li>
                <li><Link href="/plans" className="hover:text-white transition-colors">Preços</Link></li>
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