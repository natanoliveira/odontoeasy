# 🧠 CONTEXTO DO PROJETO - DentalSaaS (OdontoGestor)

**Data:** 25 de Outubro de 2025
**Versão:** 0.1.0
**Status:** Em desenvolvimento - Frontend completo, Backend pendente

---

## 📌 RESUMO EXECUTIVO

**DentalSaaS** é um sistema SaaS multi-tenant para gestão de clínicas odontológicas, desenvolvido com Next.js 14, React 18, TypeScript e Prisma. O projeto foi migrado de Vite para Next.js e está com frontend 100% implementado, aguardando desenvolvimento do backend.

---

## 🎯 PROPÓSITO DO PROJETO

Sistema completo de gestão para clínicas odontológicas que permite:
- Gerenciar múltiplas clínicas em uma única instância (multi-tenant)
- Controlar agendamentos, pacientes, profissionais e tratamentos
- Registrar odontogramas digitais interativos
- Gerenciar pagamentos e assinaturas
- Controlar documentos e prontuários eletrônicos
- 4 níveis de acesso (Super Admin, Admin Clínica, Dentista, Assistente)

---

## 📊 NÚMEROS DO PROJETO

- **18 páginas** Next.js implementadas
- **69 componentes** React (11 features + 58 shadcn/ui)
- **8 services** de lógica de negócio
- **15+ modelos** de dados no Prisma Schema
- **80+ tipos** TypeScript definidos
- **4 níveis** de permissão de usuário
- **512 pacotes** npm instalados
- **2 hooks** customizados (useAuth, useApi)

---

## 🏗️ ARQUITETURA

### **Padrão Arquitetural**
- **Frontend:** Pages Router do Next.js (src/pages/)
- **Componentes:** Atomic Design (UI → Features → Pages)
- **Lógica de Negócio:** Services Layer pattern
- **Estado:** React Hooks + localStorage (temporário)
- **Styling:** Tailwind CSS + shadcn/ui
- **Banco de Dados:** PostgreSQL via Prisma ORM

### **Fluxo de Dados**
```
User Interaction
    ↓
Pages (Next.js)
    ↓
Components (React)
    ↓
Hooks (useAuth, useApi)
    ↓
Services (Business Logic)
    ↓
API Client (lib/api.ts)
    ↓
[Backend a implementar]
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

---

## 📁 ESTRUTURA COMPLETA

```
odontogestor/
├── DIAGNOSTICO.md          # Análise detalhada (700+ linhas)
├── CONTEXTO.md            # Este arquivo (resumo executivo)
├── README.md              # Documentação principal
├── .env.example           # Template de variáveis de ambiente
├── .gitignore             # Configurado para Next.js
├── next.config.js         # Config Next.js (raiz)
├── tsconfig.json          # Config TypeScript (raiz)
├── tailwind.config.js     # Config Tailwind
├── postcss.config.js      # Config PostCSS
├── package.json           # Dependências e scripts
├── package-lock.json
│
├── UNUSED/                # Arquivos legados do Vite
│   ├── index.html
│   ├── vite.config.ts
│   ├── main.tsx
│   ├── App.tsx
│   └── index.css
│
├── public/                # Estáticos
│
└── src/
    ├── pages/             # 18 páginas Next.js
    │   ├── _app.tsx       # Entry point Next.js
    │   ├── _document.tsx  # Document customizado
    │   ├── index.tsx      # Home (landing)
    │   ├── landing.tsx
    │   ├── login.tsx
    │   ├── dashboard.tsx
    │   ├── appointments.tsx
    │   ├── patients.tsx
    │   ├── professionals.tsx
    │   ├── odontogram.tsx
    │   ├── documents.tsx
    │   ├── payments.tsx
    │   ├── plans.tsx
    │   ├── clinic.tsx
    │   ├── profile.tsx
    │   ├── about.tsx
    │   └── booking/
    │       ├── index.tsx
    │       └── [clinicId].tsx
    │
    ├── components/
    │   ├── features/      # 11 componentes de features
    │   ├── page/          # 5 componentes de página
    │   ├── layout/        # Header, Sidebar, DashboardLayout
    │   └── ui/            # 58 componentes shadcn/ui
    │
    ├── services/          # 8 arquivos
    │   ├── auth.service.ts
    │   ├── patient.service.ts
    │   ├── appointment.service.ts
    │   ├── professional.service.ts
    │   ├── clinic.service.ts
    │   ├── payment.service.ts
    │   ├── document.service.ts
    │   └── odontogram.service.ts
    │
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useApi.ts
    │
    ├── lib/
    │   ├── types.ts       # 80+ interfaces TypeScript
    │   ├── api.ts         # HTTP client
    │   └── utils.ts       # Helpers
    │
    ├── styles/
    │   └── globals.css
    │
    └── prisma/
        ├── schema.prisma  # 15+ modelos
        ├── seed.ts
        └── seed-readme.md
```

---

## 🗄️ MODELO DE DADOS (PRISMA)

### **Entidades Core**
1. **User** - Usuários do sistema (SUPER_ADMIN, CLINIC_ADMIN, DENTIST, ASSISTANT)
2. **Clinic** - Clínicas (multi-tenant, status: ACTIVE/INACTIVE/SUSPENDED/TRIAL)
3. **ClinicUser** - Relacionamento many-to-many User ↔ Clinic

### **Gestão de Profissionais**
4. **Professional** - Dentistas (CRO, especialidade)
5. **Schedule** - Agendas dos profissionais

### **Gestão de Pacientes**
6. **Patient** - Pacientes (dados completos)
7. **Odontogram** - Odontogramas (JSONB para mapeamento dental)

### **Operações**
8. **Appointment** - Consultas (SCHEDULED/CONFIRMED/COMPLETED/CANCELLED)
9. **Treatment** - Tratamentos realizados
10. **Room** - Salas/Consultórios
11. **Equipment** - Equipamentos

### **Financeiro**
12. **Subscription** - Assinaturas (BASIC/PROFESSIONAL/ENTERPRISE)
13. **Payment** - Pagamentos (PENDING/PAID/CANCELLED)
14. **Document** - Documentos
15. **Note** - Anotações/Prontuários

---

## 🔧 STACK TECNOLÓGICO

### **Frontend (100% implementado)**
- Next.js 14.2.33 (Pages Router)
- React 18.3.1
- TypeScript 5.7.2
- Tailwind CSS 3.4.18
- shadcn/ui (58 componentes)
- Radix UI (30+ primitivos)
- Lucide React 0.487.0 (ícones)
- React Hook Form 7.55.0
- Recharts 2.15.4 (gráficos)
- date-fns 4.1.0
- next-themes 0.4.6 (dark mode)

### **Backend (0% implementado - a fazer)**
- Prisma ORM 5.20.0
- PostgreSQL
- bcryptjs 2.4.3
- JWT (a implementar)
- API Routes do Next.js (a implementar)

### **Dev Tools**
- ESLint 8.57.1
- Autoprefixer 10.4.20
- PostCSS 8.4.49

---

## 🚀 COMANDOS PRINCIPAIS

```bash
# Desenvolvimento
npm run dev                  # Porta 3000

# Build & Produção
npm run build
npm run start

# Prisma
npm run prisma:generate      # Gerar client
npm run prisma:migrate       # Rodar migrations
npm run prisma:seed          # Popular banco
npm run prisma:studio        # Interface visual

# Lint
npm run lint
```

---

## ✅ STATUS DE IMPLEMENTAÇÃO

### **Frontend - 100%**
- ✅ Todas as 18 páginas criadas
- ✅ Todos os 69 componentes funcionais
- ✅ Todos os 8 services estruturados
- ✅ Design system completo (Tailwind + shadcn/ui)
- ✅ Dark mode implementado
- ✅ Layout responsivo
- ✅ TypeScript type-safe
- ✅ Rotas configuradas
- ✅ Hooks customizados (useAuth, useApi)

### **Backend - 0%**
- ❌ API Routes não criadas
- ❌ Prisma não conectado
- ❌ Autenticação JWT não implementada
- ❌ CRUD não implementado
- ❌ Validação server-side não implementada
- ❌ Proteção de rotas server-side não implementada
- ❌ Upload de arquivos não implementado

### **Banco de Dados - 50%**
- ✅ Schema Prisma completo (15+ modelos)
- ✅ Relacionamentos definidos
- ✅ Enums e tipos configurados
- ❌ Migrations não executadas
- ❌ Seed não populado
- ❌ Banco de dados não criado

---

## 🎨 DESIGN SYSTEM

### **Cores Principais**
- **Primary:** Blue (#3b82f6)
- **Destructive:** Red
- **Secondary:** Gray
- **Success:** Green
- **Warning:** Yellow

### **Componentes UI (shadcn/ui)**
58 componentes implementados:
- Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar
- Badge, Breadcrumb, Button, Calendar, Card, Carousel, Chart
- Checkbox, Collapsible, Command, Context Menu, Dialog, Drawer
- Dropdown Menu, Form, Hover Card, Input, Input OTP, Label
- Menubar, Navigation Menu, Pagination, Popover, Progress
- Radio Group, Resizable, Scroll Area, Select, Separator
- Sheet, Sidebar, Skeleton, Slider, Sonner, Switch
- Table, Tabs, Textarea, Toggle, Toggle Group, Tooltip

### **Layout**
- Header fixo com navegação
- Sidebar colapsável com menu
- Dashboard layout com grid responsivo
- Cards para conteúdo
- Modals/Dialogs para formulários

---

## 🔐 AUTENTICAÇÃO E PERMISSÕES

### **4 Níveis de Acesso**

1. **SUPER_ADMIN**
   - Acesso total ao sistema
   - Gerencia todas as clínicas
   - Configura planos e assinaturas
   - Visualiza analytics global

2. **CLINIC_ADMIN**
   - Gerencia UMA clínica específica
   - Cadastra profissionais
   - Configura salas e equipamentos
   - Visualiza pagamentos e relatórios

3. **DENTIST**
   - Acessa sua agenda
   - Visualiza/edita pacientes
   - Registra odontogramas
   - Visualiza histórico de tratamentos

4. **ASSISTANT**
   - Agenda consultas
   - Cadastra pacientes
   - Visualiza calendário
   - Acesso limitado a dados

### **Implementação Atual**
- ✅ Tipos definidos no TypeScript
- ✅ Hook useAuth estruturado
- ❌ Validação server-side não implementada
- ❌ JWT não implementado
- ❌ Middleware de proteção não criado

---

## 📋 PÁGINAS E ROTAS

### **Públicas (6 rotas)**
- `/` - Home/Landing
- `/landing` - Landing alternativa
- `/about` - Sobre
- `/login` - Login
- `/booking` - Seleção de clínica
- `/booking/[clinicId]` - Agendamento por clínica

### **Protegidas (12 rotas)**
- `/dashboard` - Dashboard principal (ASSISTANT+)
- `/appointments` - Gestão de consultas (ASSISTANT+)
- `/patients` - Gestão de pacientes (ASSISTANT+)
- `/professionals` - Gestão de profissionais (ADMIN+)
- `/odontogram` - Odontograma (DENTIST+)
- `/documents` - Documentos (ASSISTANT+)
- `/payments` - Pagamentos (ADMIN+)
- `/plans` - Planos (ADMIN+)
- `/clinic` - Config clínica (ADMIN+)
- `/profile` - Perfil usuário (ASSISTANT+)

---

## 🔄 HISTÓRICO DO PROJETO

### **Origem**
- Criado originalmente com **Vite + React**
- Design baseado em Figma
- Arquitetura SPA pura

### **Migração para Next.js (25/10/2025)**
- ✅ Migrado de Vite para Next.js 14
- ✅ Reorganizados arquivos de configuração
- ✅ Corrigidas 64 arquivos (importações, tipos)
- ✅ Removidas versões dos pacotes nas importações
- ✅ Atualizados paths TypeScript
- ✅ Criada documentação completa
- ✅ Arquivos legados movidos para UNUSED/

---

## 🚧 PRÓXIMAS ETAPAS (ROADMAP)

### **Prioridade 1 - Backend Essencial**
1. Criar API Routes em `/pages/api/`
2. Conectar Prisma com PostgreSQL
3. Implementar CRUD de User, Clinic, Patient
4. Implementar autenticação JWT
5. Criar middleware de proteção de rotas

### **Prioridade 2 - Features Core**
6. CRUD de Appointments
7. CRUD de Professionals
8. CRUD de Odontogram
9. Sistema de upload de arquivos (Documents)
10. Gestão de Payments

### **Prioridade 3 - Integrações**
11. Integração com Stripe (pagamentos)
12. Sistema de notificações (email/SMS)
13. Geração de relatórios PDF
14. Dashboard analytics avançado

### **Prioridade 4 - Qualidade**
15. Testes unitários (Jest)
16. Testes E2E (Cypress/Playwright)
17. Documentação de API (Swagger)
18. Deploy em produção (Vercel)

---

## ⚠️ PONTOS DE ATENÇÃO

### **Warnings Atuais (Não Bloqueantes)**
1. **Prerendering errors** em build
   - Páginas tentam acessar browser APIs (localStorage)
   - Solução: Adicionar checks `typeof window !== 'undefined'`
   - Não impede funcionamento em dev mode

2. **Dependências desatualizadas**
   - Next.js: 14.2.33 → 16.0.0 (major)
   - React: 18.3.1 → 19.2.0 (major)
   - Não urgente, pode quebrar compatibilidade

3. **GitHub Dependabot**
   - 3 vulnerabilidades reportadas (1 moderate, 2 low)
   - npm audit local: 0 vulnerabilidades
   - Revisar manualmente no GitHub

### **Limitações Atuais**
- Sem backend funcional (apenas frontend)
- Dados mockados (não persistem)
- Autenticação simulada (localStorage)
- Sem validação server-side
- Sem tratamento de erros robusto

---

## 💡 DECISÕES ARQUITETURAIS

### **Por que Next.js?**
1. SEO essencial para landing pages
2. SSR para melhor performance
3. API Routes integradas (backend no mesmo projeto)
4. File-based routing (mais simples)
5. Otimizações automáticas (imagens, fonts, etc)
6. Deploy fácil na Vercel
7. Melhor para aplicações comerciais/enterprise

### **Por que Prisma?**
1. Type-safety com TypeScript
2. Migrations automáticas
3. Query builder intuitivo
4. Suporte a PostgreSQL
5. Prisma Studio (GUI)
6. Schema declarativo

### **Por que shadcn/ui?**
1. Componentes acessíveis (Radix UI)
2. Customizáveis (código-fonte no projeto)
3. Sem dependência de biblioteca pesada
4. Tailwind CSS integrado
5. Dark mode nativo
6. Comunidade ativa

---

## 📈 MÉTRICAS DO PROJETO

- **Linhas de código:** ~15.000+ (estimado)
- **Arquivos TypeScript:** 90+
- **Componentes React:** 69
- **Páginas:** 18
- **Services:** 8
- **Hooks:** 2
- **Modelos Prisma:** 15+
- **Tipos TypeScript:** 80+
- **Dependências:** 512 pacotes

---

## 🔗 LINKS IMPORTANTES

- **Repositório:** https://github.com/natanoliveira/odontogestor
- **Figma:** https://www.figma.com/design/b0QBGuEMPgPfaUu9M1UUgU/
- **shadcn/ui:** https://ui.shadcn.com/
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

## 📝 NOTAS TÉCNICAS

### **TypeScript**
- Strict mode habilitado
- BaseURL configurado para imports relativos
- Paths alias: `@/*` → `./src/*`
- 80+ interfaces e tipos definidos

### **Tailwind CSS**
- JIT compiler habilitado
- Dark mode: class strategy
- Custom colors definidas
- Plugins: forms, typography, animate

### **Next.js**
- Pages Router (não App Router)
- SWC compiler habilitado
- Image optimization configurado
- Experimental: optimizeCss

### **Git**
- Main branch: `main`
- Último commit: Migração Vite → Next.js
- Arquivos ignorados: node_modules, .next, .env

---

## 🎓 CONCEITOS-CHAVE DO PROJETO

1. **Multi-tenant:** Uma instância, múltiplas clínicas
2. **RBAC:** Role-Based Access Control (4 níveis)
3. **SaaS:** Software as a Service (assinaturas)
4. **ORM:** Prisma para abstração do banco
5. **SSR:** Server-Side Rendering com Next.js
6. **Type-safety:** TypeScript em todo código
7. **Design System:** shadcn/ui + Tailwind
8. **Service Layer:** Lógica de negócio separada

---

## ✨ DIFERENCIAIS DO PROJETO

1. ✅ **Odontograma Digital Interativo** - Canvas para mapeamento dental
2. ✅ **Multi-clínica** - Suporte nativo para várias clínicas
3. ✅ **4 níveis de permissão** - RBAC completo
4. ✅ **Design System robusto** - 58 componentes UI
5. ✅ **Type-safe completo** - TypeScript em 100% do código
6. ✅ **Dark Mode** - Tema claro/escuro
7. ✅ **Responsivo** - Mobile-first design
8. ✅ **Documentação completa** - README + DIAGNOSTICO + CONTEXTO

---

## 🎯 OBJETIVO FINAL

Criar um sistema SaaS completo e profissional para gestão de clínicas odontológicas que:
- Seja escalável (multi-tenant)
- Seja seguro (autenticação robusta)
- Seja rápido (Next.js SSR)
- Seja bonito (shadcn/ui)
- Seja fácil de usar (UX intuitiva)
- Seja lucrativo (modelo de assinaturas)

---

**Este documento serve como memória do projeto para referência futura e onboarding de novos desenvolvedores.**

**Última atualização:** 25/10/2025
**Autor:** Claude Code (Anthropic) em colaboração com Natan Oliveira
