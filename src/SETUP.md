# DentalSaaS - Setup e Instalação

## Guia completo para configuração e execução do projeto

### 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18.0 ou superior)
- **npm** ou **yarn** (recomendamos npm)
- **PostgreSQL** (versão 13 ou superior)
- **Git**

### 🚀 Instalação

#### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd dentalsaas
```

#### 2. Instale as dependências

```bash
npm install
```

#### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/dentalsaas"

# API Configuration (Vite)
VITE_API_URL="http://localhost:3000/api"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-key-aqui"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"

# Stripe (para pagamentos)
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Upload de arquivos (AWS S3 ou Cloudinary)
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"

# Email (opcional - para notificações)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha"

# PIX (para pagamentos brasileiros - opcional)
PIX_CLIENT_ID="seu-pix-client-id"
PIX_CLIENT_SECRET="seu-pix-client-secret"

# WhatsApp API (opcional - para lembretes)
WHATSAPP_API_URL="https://api.whatsapp.com"
WHATSAPP_TOKEN="seu-whatsapp-token"
```

#### 4. Configure o banco de dados PostgreSQL

##### Opção A: Instalação local

1. Instale o PostgreSQL em sua máquina
2. Crie um banco de dados:

```sql
CREATE DATABASE dentalsaas;
CREATE USER dentalsaas_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE dentalsaas TO dentalsaas_user;
```

##### Opção B: Docker (recomendado)

```bash
# Execute o PostgreSQL em container Docker
docker run --name dentalsaas-postgres \
  -e POSTGRES_DB=dentalsaas \
  -e POSTGRES_USER=dentalsaas_user \
  -e POSTGRES_PASSWORD=sua_senha \
  -p 5432:5432 \
  -d postgres:15
```

#### 5. Configure o Prisma

```bash
# Gere o Prisma Client
npx prisma generate

# Execute as migrations para criar as tabelas
npx prisma migrate deploy

# (Opcional) Popule o banco com dados de exemplo
npx prisma db seed
```

#### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:3000`

### 📦 Dependências Principais

O projeto utiliza as seguintes tecnologias:

#### Frontend
- **React 18** - Biblioteca para interface
- **Vite** - Build tool e dev server
- **TypeScript** - Linguagem tipada
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de interface
- **React Hook Form** - Gerenciamento de formulários
- **React Query** - Estado e cache de dados
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações

#### Backend
- **Prisma** - ORM para banco de dados
- **NextAuth.js** - Autenticação
- **Stripe** - Processamento de pagamentos
- **Cloudinary** - Upload e processamento de imagens
- **Nodemailer** - Envio de emails

#### Desenvolvimento
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **TypeScript** - Tipagem estática

### 🗄️ Estrutura do Banco de Dados

O sistema possui as seguintes entidades principais:

- **Users** - Usuários do sistema
- **Clinics** - Clínicas odontológicas
- **Patients** - Pacientes
- **Professionals** - Dentistas e profissionais
- **Appointments** - Agendamentos
- **Treatments** - Tratamentos
- **Documents** - Documentos e arquivos
- **Payments** - Pagamentos e cobranças
- **Subscriptions** - Assinaturas dos planos
- **Odontograms** - Odontogramas digitais
- **Rooms** - Salas/consultórios
- **Schedules** - Horários e agenda

### 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa o linter
npm run type-check   # Verifica tipos TypeScript

# Banco de dados
npm run db:migrate   # Executa migrations
npm run db:reset     # Reseta o banco de dados
npm run db:seed      # Popula com dados de exemplo
npm run db:studio    # Abre Prisma Studio
```

### 🌐 Deploy em Produção

#### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. O deploy será feito automaticamente

#### Docker

```bash
# Build da imagem
docker build -t dentalsaas .

# Execute o container
docker run -p 3000:3000 --env-file .env dentalsaas
```

### 📧 Configuração de Email

Para envio de notificações e lembretes:

1. Configure um provedor SMTP (Gmail, SendGrid, etc.)
2. Adicione as credenciais no `.env`
3. Teste o envio através do painel administrativo

### 💳 Configuração do Stripe

Para processar pagamentos:

1. Crie uma conta no Stripe
2. Obtenha as chaves API (test e live)
3. Configure o webhook endpoint
4. Teste os pagamentos em modo desenvolvimento

### 🔐 Segurança

#### Configurações importantes:

- Use senhas fortes para o banco de dados
- Configure HTTPS em produção
- Mantenha as dependências atualizadas
- Use variáveis de ambiente para dados sensíveis
- Configure backups automáticos do banco

### 📱 Funcionalidades Implementadas

#### ✅ Autenticação
- Login com email/senha
- Login com Google OAuth
- Recuperação de senha
- Gerenciamento de sessões

#### ✅ Gestão de Pacientes
- CRUD completo de pacientes
- Histórico médico
- Documentos anexados
- Busca e filtros avançados

#### ✅ Agendamentos
- Calendário interativo
- Agendamento online público
- Lembretes automáticos
- Gestão de conflitos

#### ✅ Profissionais
- Cadastro de dentistas
- Especialidades
- Horários de trabalho
- Controle de férias

#### ✅ Clínica
- Configurações gerais
- Salas/consultórios
- Horários de funcionamento
- Estatísticas e relatórios

#### ✅ Documentos
- Upload de arquivos
- Organização por categorias
- Visualização e download
- Controle de acesso

#### ✅ Pagamentos
- Cobrança de consultas
- Integração com Stripe
- PIX (Brasil)
- Relatórios financeiros

#### ✅ Odontograma
- Editor visual interativo
- Histórico de tratamentos
- Templates personalizados
- Exportação em PDF

### 🚨 Solução de Problemas

#### Erro de conexão com banco
```bash
# Verifique se o PostgreSQL está rodando
sudo service postgresql status

# Teste a conexão
npx prisma db push
```

#### Erro de dependências
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

#### Erro de migração
```bash
# Resete o banco (cuidado em produção!)
npx prisma migrate reset
npx prisma db push
```

### 📞 Suporte

Para dúvidas e suporte:

- 📧 Email: suporte@dentalsaas.com
- 📞 Telefone: (11) 99999-9999
- 💬 Discord: [Link do servidor]
- 📚 Documentação: [Link da documentação]

### 📈 Roadmap

#### Próximas funcionalidades:
- [ ] App mobile (React Native)
- [ ] Integração com WhatsApp Business
- [ ] IA para análise de odontogramas
- [ ] Telemedicina/Teleconsulta
- [ ] Marketplace de produtos odontológicos
- [ ] Sistema de pontuação/gamificação

### 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ para profissionais da odontologia**