# 🦷 DentalSaaS - Sistema de Gestão de Clínicas Odontológicas

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**Sistema completo de gestão para clínicas odontológicas com suporte multi-tenant**

[Demo](#) • [Documentação](./DIAGNOSTICO.md) • [Figma](https://www.figma.com/design/b0QBGuEMPgPfaUu9M1UUgU/SaaS-Dental-Clinic-Management)

</div>

---

## 📋 Sobre o Projeto

**DentalSaaS** é uma plataforma completa de gestão para clínicas odontológicas desenvolvida com as mais modernas tecnologias web. O sistema oferece uma solução SaaS (Software as a Service) robusta para gerenciar todos os aspectos de uma clínica dental, desde agendamentos até faturamento.

### 🎯 Principais Funcionalidades

- 📅 **Gestão de Agendamentos** - Sistema completo de agendamento com calendário visual
- 👥 **Gestão de Pacientes** - Cadastro completo com histórico e prontuário eletrônico
- 👨‍⚕️ **Gestão de Profissionais** - Controle de dentistas, especialidades e agendas
- 🦷 **Odontograma Interativo** - Canvas digital para registro de tratamentos dentários
- 💰 **Gestão Financeira** - Controle de pagamentos, planos e assinaturas
- 📄 **Gestão de Documentos** - Upload e organização de documentos da clínica
- 🏥 **Multi-Clínica** - Suporte para múltiplas clínicas em uma única instância
- 🔐 **Controle de Acesso** - 4 níveis de permissão (Super Admin, Admin, Dentista, Assistente)
- 🌙 **Dark Mode** - Tema escuro para conforto visual
- 📱 **Responsivo** - Interface otimizada para desktop, tablet e mobile

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** 20.x ou superior
- **PostgreSQL** 14.x ou superior
- **npm** ou **yarn**
- **Git**

### 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/natanoliveira/odontoeasy.git
   cd odontoeasy
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` com suas configurações:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dentalsaas"
   NEXT_PUBLIC_API_URL="http://localhost:3000/api"
   JWT_SECRET="seu-secret-aqui"
   ```

4. **Configure o banco de dados**
   ```bash
   # Gerar o Prisma Client
   npm run prisma:generate

   # Executar migrations
   npm run prisma:migrate

   # (Opcional) Popular com dados de teste
   npm run prisma:seed
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

6. **Acesse a aplicação**

   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

---

## 🛠️ Stack Tecnológico

### **Frontend**

- **[Next.js 14](https://nextjs.org/)** - Framework React com SSR/SSG
- **[React 18](https://react.dev/)** - Biblioteca UI
- **[TypeScript 5.7](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - 58 componentes UI pré-construídos
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos acessíveis e sem estilo
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones

### **Formulários & Validação**

- **[React Hook Form 7.55](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[React Day Picker 8.10](https://react-day-picker.js.org/)** - Seletor de datas

### **Visualização de Dados**

- **[Recharts 2.15](https://recharts.org/)** - Gráficos e dashboards

### **Backend & Banco de Dados**

- **[Prisma ORM 5.20](https://www.prisma.io/)** - ORM TypeScript-first
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Hash de senhas

### **Utilidades**

- **[date-fns](https://date-fns.org/)** - Manipulação de datas
- **[clsx](https://www.npmjs.com/package/clsx)** - Utilitário de classes CSS
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Gerenciamento de temas

---

## 📁 Estrutura do Projeto

```
odontoeasy/
├── src/
│   ├── pages/                   # Páginas Next.js (18 rotas)
│   │   ├── _app.tsx            # App wrapper principal
│   │   ├── _document.tsx       # Document customizado
│   │   ├── index.tsx           # Página inicial
│   │   ├── landing.tsx         # Landing page pública
│   │   ├── login.tsx           # Autenticação
│   │   ├── dashboard.tsx       # Dashboard principal
│   │   ├── appointments.tsx    # Gestão de consultas
│   │   ├── patients.tsx        # Gestão de pacientes
│   │   ├── professionals.tsx   # Gestão de profissionais
│   │   ├── odontogram.tsx      # Odontograma interativo
│   │   ├── documents.tsx       # Gestão de documentos
│   │   ├── payments.tsx        # Gestão de pagamentos
│   │   ├── plans.tsx           # Planos e assinaturas
│   │   ├── profile.tsx         # Perfil do usuário
│   │   ├── clinic.tsx          # Configurações da clínica
│   │   ├── about.tsx           # Sobre o sistema
│   │   └── booking/            # Agendamento público
│   │       ├── index.tsx
│   │       └── [clinicId].tsx
│   │
│   ├── components/              # Componentes React (69 arquivos)
│   │   ├── features/           # 11 componentes de features
│   │   │   ├── dashboard.tsx
│   │   │   ├── dashboard-stats.tsx
│   │   │   ├── appointments.tsx
│   │   │   ├── patients.tsx
│   │   │   ├── professionals.tsx
│   │   │   ├── odontogram.tsx
│   │   │   └── ...
│   │   ├── page/               # 5 componentes de página
│   │   │   ├── landing-page.tsx
│   │   │   ├── login-page.tsx
│   │   │   └── ...
│   │   ├── layout/             # Layouts
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── dashboard-layout.tsx
│   │   └── ui/                 # 58 componentes shadcn/ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ...
│   │
│   ├── services/               # Lógica de negócio (8 arquivos)
│   │   ├── auth.service.ts
│   │   ├── patient.service.ts
│   │   ├── appointment.service.ts
│   │   ├── professional.service.ts
│   │   ├── clinic.service.ts
│   │   ├── payment.service.ts
│   │   ├── document.service.ts
│   │   └── odontogram.service.ts
│   │
│   ├── hooks/                  # Hooks customizados
│   │   ├── useAuth.ts         # Hook de autenticação
│   │   └── useApi.ts          # Hook para chamadas API
│   │
│   ├── lib/                    # Utilitários
│   │   ├── types.ts           # Interfaces TypeScript (80+ tipos)
│   │   ├── api.ts             # Cliente HTTP
│   │   └── utils.ts           # Funções utilitárias
│   │
│   ├── styles/                 # Estilos globais
│   │   └── globals.css
│   │
│   └── prisma/                 # Configuração do banco
│       ├── schema.prisma      # Schema do banco (15+ modelos)
│       ├── seed.ts            # Script de seed
│       └── seed-readme.md
│
├── public/                     # Arquivos estáticos
├── UNUSED/                     # Arquivos legados (Vite)
├── DIAGNOSTICO.md             # Análise completa do projeto
├── next.config.js             # Configuração Next.js
├── tsconfig.json              # Configuração TypeScript
├── tailwind.config.js         # Configuração Tailwind
├── package.json               # Dependências e scripts
├── .env.example               # Exemplo de variáveis de ambiente
└── README.md                  # Este arquivo

```

---

## 📊 Modelo de Dados (Prisma)

### Entidades Principais

#### **User** - Usuários do Sistema
- Roles: `SUPER_ADMIN`, `CLINIC_ADMIN`, `DENTIST`, `ASSISTANT`
- Relacionamentos: Clínicas (many-to-many via ClinicUser)

#### **Clinic** - Clínicas Odontológicas
- Multi-tenant: Suporte para múltiplas clínicas
- Status: `ACTIVE`, `INACTIVE`, `SUSPENDED`, `TRIAL`

#### **Patient** - Pacientes
- Dados completos: CPF, RG, endereço, contato
- Relacionamentos: Appointments, Odontogram, Notes

#### **Professional** - Dentistas e Profissionais
- CRO, especialidade, horários de trabalho
- Relacionamentos: Schedules, Appointments

#### **Appointment** - Consultas
- Status: `SCHEDULED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`
- Relacionamentos: Patient, Professional, Room, Treatments

#### **Odontogram** - Odontogramas
- Armazena mapeamento dental (JSONB)
- Histórico completo de tratamentos

#### **Payment** - Pagamentos
- Métodos: Cartão, dinheiro, PIX, etc.
- Status: `PENDING`, `PAID`, `CANCELLED`

#### **Subscription** - Assinaturas
- Planos: `BASIC`, `PROFESSIONAL`, `ENTERPRISE`
- Features customizáveis (JSONB)

### Diagrama ER

```
User ──┬── ClinicUser ──── Clinic
       │
       └── Appointment ──┬── Patient ──┬── Odontogram
                         │             └── Note
                         │
                         ├── Professional ──── Schedule
                         │
                         ├── Room ──── Equipment
                         │
                         └── Treatment

Clinic ──┬── Subscription
         │
         ├── Document
         │
         └── Payment
```

---

## 🎨 Componentes UI (shadcn/ui)

O projeto utiliza **58 componentes** pré-construídos do shadcn/ui:

<details>
<summary>Ver lista completa de componentes</summary>

- Accordion
- Alert / Alert Dialog
- Aspect Ratio
- Avatar
- Badge
- Breadcrumb
- Button
- Calendar
- Card
- Carousel
- Chart
- Checkbox
- Collapsible
- Command
- Context Menu
- Dialog
- Drawer
- Dropdown Menu
- Form
- Hover Card
- Input / Input OTP
- Label
- Menubar
- Navigation Menu
- Pagination
- Popover
- Progress
- Radio Group
- Resizable
- Scroll Area
- Select
- Separator
- Sheet
- Sidebar
- Skeleton
- Slider
- Sonner (Toast)
- Switch
- Table
- Tabs
- Textarea
- Toggle / Toggle Group
- Tooltip

</details>

---

## 🔐 Autenticação e Segurança

### Níveis de Permissão

1. **SUPER_ADMIN** - Acesso total ao sistema
2. **CLINIC_ADMIN** - Gerencia uma clínica específica
3. **DENTIST** - Acessa pacientes e consultas da sua agenda
4. **ASSISTANT** - Acesso limitado para agendamentos e cadastros

### Segurança Implementada

- ✅ Hash de senhas com bcryptjs
- ✅ Validação de formulários com React Hook Form
- ✅ TypeScript para type safety
- ✅ Role-based access control (RBAC)
- 🚧 JWT para autenticação (backend a implementar)
- 🚧 Refresh tokens (backend a implementar)
- 🚧 Rate limiting (backend a implementar)

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento (localhost:3000)

# Build & Produção
npm run build            # Cria build otimizado para produção
npm run start            # Inicia servidor de produção

# Linting
npm run lint             # Executa ESLint

# Prisma
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Executa migrations do banco
npm run prisma:seed      # Popula banco com dados de teste
npm run prisma:studio    # Abre interface visual do banco
```

---

## 🌐 Rotas da Aplicação

### Rotas Públicas

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial / Landing |
| `/landing` | Landing page alternativa |
| `/about` | Sobre o sistema |
| `/login` | Página de login |
| `/booking` | Seleção de clínica para agendamento |
| `/booking/[clinicId]` | Agendamento por clínica específica |

### Rotas Protegidas (Requer Autenticação)

| Rota | Descrição | Permissão Mínima |
|------|-----------|------------------|
| `/dashboard` | Dashboard principal | ASSISTANT |
| `/appointments` | Gestão de consultas | ASSISTANT |
| `/patients` | Gestão de pacientes | ASSISTANT |
| `/professionals` | Gestão de profissionais | CLINIC_ADMIN |
| `/odontogram` | Odontograma interativo | DENTIST |
| `/documents` | Gestão de documentos | ASSISTANT |
| `/payments` | Gestão de pagamentos | CLINIC_ADMIN |
| `/plans` | Planos e assinaturas | CLINIC_ADMIN |
| `/clinic` | Configurações da clínica | CLINIC_ADMIN |
| `/profile` | Perfil do usuário | ASSISTANT |

---

## 🚧 Roadmap

### ✅ Concluído (v0.1.0)

- [x] Estrutura completa do frontend
- [x] 18 páginas implementadas
- [x] 69 componentes React
- [x] 8 services de lógica de negócio
- [x] Schema Prisma completo (15+ modelos)
- [x] Design system com Tailwind + shadcn/ui
- [x] Dark mode
- [x] Layout responsivo
- [x] Migração de Vite para Next.js
- [x] TypeScript type-safe

### 🚧 Em Desenvolvimento (v0.2.0)

- [ ] Implementar API Routes (`/pages/api/`)
- [ ] Conectar frontend com backend via Prisma
- [ ] Implementar autenticação JWT
- [ ] CRUD completo de todas entidades
- [ ] Proteção de rotas server-side
- [ ] Validação server-side
- [ ] Testes unitários (Jest + React Testing Library)

### 📅 Planejado (v0.3.0)

- [ ] Integração com gateway de pagamento (Stripe)
- [ ] Sistema de notificações (email/SMS)
- [ ] Geração de relatórios em PDF
- [ ] Dashboard analytics avançado
- [ ] Upload de arquivos para AWS S3
- [ ] Testes E2E (Cypress/Playwright)

### 🔮 Futuro (v1.0.0+)

- [ ] Multi-idioma (i18n)
- [ ] Aplicativo mobile (React Native)
- [ ] Integração com sistemas de terceiros
- [ ] Telemedicina/videochamadas
- [ ] AI para agendamento inteligente
- [ ] Marketplace de serviços odontológicos

---

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige um bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração de código
test: adiciona ou atualiza testes
chore: tarefas de manutenção
```

---

## 📄 Licença

Este projeto é privado e todos os direitos são reservados.

---

## 👨‍💻 Autor

**Natan Oliveira**

- GitHub: [@natanoliveira](https://github.com/natanoliveira)
- Projeto: [odontoeasy](https://github.com/natanoliveira/odontoeasy)

---

## 🙏 Agradecimentos

- Design baseado no projeto [Figma SaaS Dental Clinic Management](https://www.figma.com/design/b0QBGuEMPgPfaUu9M1UUgU/SaaS-Dental-Clinic-Management)
- Componentes UI por [shadcn/ui](https://ui.shadcn.com/)
- Ícones por [Lucide](https://lucide.dev/)

---

## 📚 Documentação Adicional

- [DIAGNOSTICO.md](./DIAGNOSTICO.md) - Análise completa do projeto (700+ linhas)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

<div align="center">

**Desenvolvido com ❤️ por Natan Oliveira**

**Migrado de Vite para Next.js com auxílio de [Claude Code](https://claude.com/claude-code)**

</div>
