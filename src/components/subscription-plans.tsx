import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Check, 
  X, 
  Smile, 
  Crown,
  Zap,
  ArrowLeft
} from 'lucide-react';

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 'R$ 97',
    period: '/mês',
    description: 'Ideal para clínicas pequenas',
    icon: Smile,
    color: 'text-blue-500',
    features: [
      { name: 'Até 100 pacientes', included: true },
      { name: 'Agendamento online', included: true },
      { name: 'Gestão básica de consultas', included: true },
      { name: 'Relatórios simples', included: true },
      { name: 'Suporte por email', included: true },
      { name: 'Upload de documentos (1GB)', included: true },
      { name: 'Página de agendamento personalizada', included: false },
      { name: 'Integração com WhatsApp', included: false },
      { name: 'Relatórios avançados', included: false },
      { name: 'Backup automático', included: false },
      { name: 'Suporte prioritário', included: false },
    ],
    highlighted: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 197',
    period: '/mês',
    description: 'Para clínicas em crescimento',
    icon: Crown,
    color: 'text-yellow-500',
    features: [
      { name: 'Pacientes ilimitados', included: true },
      { name: 'Agendamento online', included: true },
      { name: 'Gestão completa de consultas', included: true },
      { name: 'Relatórios avançados', included: true },
      { name: 'Suporte prioritário', included: true },
      { name: 'Upload de documentos (10GB)', included: true },
      { name: 'Página de agendamento personalizada', included: true },
      { name: 'Integração com WhatsApp', included: true },
      { name: 'Odontograma digital', included: true },
      { name: 'Backup automático', included: true },
      { name: 'Múltiplos usuários', included: true },
    ],
    highlighted: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'R$ 397',
    period: '/mês',
    description: 'Para grandes clínicas e redes',
    icon: Zap,
    color: 'text-purple-500',
    features: [
      { name: 'Tudo do Premium', included: true },
      { name: 'Multi-clínicas', included: true },
      { name: 'API personalizada', included: true },
      { name: 'Integração com sistemas externos', included: true },
      { name: 'Consultoria especializada', included: true },
      { name: 'Treinamento da equipe', included: true },
      { name: 'SLA garantido', included: true },
      { name: 'Customizações especiais', included: true },
      { name: 'Relatórios personalizados', included: true },
      { name: 'Suporte 24/7', included: true },
      { name: 'Storage ilimitado', included: true },
    ],
    highlighted: false
  }
];

export function SubscriptionPlans() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);
    
    // Simulate Stripe integration
    setTimeout(() => {
      alert(`Redirecionando para pagamento do plano ${plans.find(p => p.id === planId)?.name}...`);
      setIsProcessing(false);
      setSelectedPlan(null);
    }, 2000);
  };

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
                <h1 className="text-xl font-bold">DentalSaaS</h1>
                <p className="text-sm text-muted-foreground">Escolha seu plano</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <a href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Login
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Escolha o Plano Ideal para sua Clínica
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Modernize sua clínica odontológica com nossa solução completa de gestão. 
            Sem taxa de setup, cancele quando quiser.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.id}
                className={`relative ${plan.highlighted ? 'ring-2 ring-primary scale-105' : ''} transition-transform hover:scale-105`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-4 p-3 rounded-full bg-gray-100 w-fit`}>
                    <Icon className={`h-8 w-8 ${plan.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${!feature.included ? 'text-muted-foreground' : ''}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isProcessing && selectedPlan === plan.id}
                  >
                    {isProcessing && selectedPlan === plan.id ? 
                      'Processando...' : 
                      `Assinar ${plan.name}`
                    }
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-muted-foreground">
                Sim, você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Os dados ficam seguros?</h4>
              <p className="text-muted-foreground">
                Utilizamos criptografia de ponta e backup automático para garantir a segurança dos seus dados.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Há período de teste?</h4>
              <p className="text-muted-foreground">
                Oferecemos 7 dias grátis em qualquer plano para você testar todas as funcionalidades.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Preciso de treinamento?</h4>
              <p className="text-muted-foreground">
                O sistema é intuitivo, mas oferecemos suporte e treinamento para sua equipe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}