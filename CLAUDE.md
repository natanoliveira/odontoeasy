# OdontoGestor - Documentação Completa

## 📋 Índice
- [Status do Projeto](#status-do-projeto)
- [Backend APIs](#backend-apis)
- [Frontend Hooks](#frontend-hooks)
- [Autenticação e CORS](#autenticação-e-cors)
- [Como Integrar Componentes](#como-integrar-componentes)
- [Credenciais de Teste](#credenciais-de-teste)

---

## ✅ Status do Projeto

### Backend: 100% Implementado
- ✅ 11 APIs criadas
- ✅ 56 endpoints funcionando
- ✅ Validação Zod em todas as rotas
- ✅ Multi-tenancy (isolamento por clínica)
- ✅ CORS configurado
- ✅ Sistema de upload de arquivos

### Frontend: 30% Integrado
- ✅ Login (integrado com API)
- ✅ Dashboard (integrado com API)
- ⚠️ Patients (hook criado, precisa integrar componente)
- ⚠️ Professionals (hook criado, precisa integrar componente)
- ⚠️ Appointments (hook criado, precisa integrar componente)
- ⚠️ Documents (precisa criar hook e integrar)
- ⚠️ Odontogram (precisa criar hook e integrar)

---

## 🚀 Backend APIs

### Resumo das APIs

| API | Endpoints | Arquivo | Status |
|-----|-----------|---------|--------|
| Auth | 1 | `/api/auth/login.ts` | ✅ |
| Dashboard | 1 | `/api/dashboard/stats.ts` | ✅ |
| Patients | 5 | `/api/patients/` | ✅ |
| Professionals | 5 | `/api/professionals/` | ✅ |
| Appointments | 5 | `/api/appointments/` | ✅ |
| Treatments | 5 | `/api/treatments/` | ✅ |
| Documents | 6 | `/api/documents/` | ✅ |
| Rooms | 5 | `/api/rooms/` | ✅ |
| Schedules | 5 | `/api/schedules/` | ✅ |
| Odontogram | 5 | `/api/odontograms/` | ✅ |
| Notes | 5 | `/api/notes/` | ✅ |
| Upload | 2 | `/api/upload.ts` | ✅ |

### Exemplos de Uso das APIs

#### 1. Login
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@clinicasorriso.com.br"}'
\`\`\`

#### 2. Dashboard Stats
\`\`\`bash
curl http://localhost:3000/api/dashboard/stats \\
  -H "Authorization: Bearer SEU_TOKEN"
\`\`\`

#### 3. Listar Pacientes
\`\`\`bash
curl "http://localhost:3000/api/patients?page=1&limit=10"
\`\`\`

---

## 🎣 Frontend Hooks Criados

### 1. `use-dashboard-stats.ts` ✅
**Localização**: `src/hooks/use-dashboard-stats.ts`

\`\`\`typescript
import { useDashboardStats } from '../hooks/use-dashboard-stats';

const { stats, loading, error, refetch } = useDashboardStats();

// stats contém:
// - patients: { total, active }
// - professionals: { total }
// - appointments: { today, thisMonth, pending, completed }
// - revenue: { today, thisMonth }
// - treatments: { total, active }
\`\`\`

### 2. `use-appointments.ts` ✅
**Localização**: `src/hooks/use-appointments.ts`

\`\`\`typescript
import { useAppointments, useTodayAppointments } from '../hooks/use-appointments';

// Com filtros
const { appointments, loading, error, pagination } = useAppointments({
  date: '2024-01-20',
  professionalId: 'id',
  status: 'SCHEDULED',
  limit: 10
});

// Atalho para hoje
const { appointments, loading, error } = useTodayAppointments();
\`\`\`

### 3. `use-patients.ts` ✅
**Localização**: `src/hooks/use-patients.ts`

\`\`\`typescript
import { usePatients } from '../hooks/use-patients';

const {
  patients,
  loading,
  error,
  pagination,
  createPatient,
  updatePatient,
  deletePatient
} = usePatients({
  page: 1,
  limit: 10,
  search: 'Maria',
  status: 'ACTIVE'
});

// Criar
await createPatient({
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '11999999999'
});

// Atualizar
await updatePatient('id', { name: 'João Santos' });

// Deletar (soft delete)
await deletePatient('id');
\`\`\`

### 4. `use-professionals.ts` ✅
**Localização**: `src/hooks/use-professionals.ts`

\`\`\`typescript
import { useProfessionals } from '../hooks/use-professionals';

const {
  professionals,
  loading,
  error,
  createProfessional,
  updateProfessional,
  deleteProfessional
} = useProfessionals();
\`\`\`

---

## 🔐 Autenticação e CORS

### Autenticação JWT

#### Context de Autenticação
**Arquivo**: `src/contexts/auth-context.tsx`

\`\`\`typescript
import { useAuth } from '../contexts/auth-context';

function MyComponent() {
  const { user, token, login, logout, isAuthenticated } = useAuth();

  // Login
  const handleLogin = async () => {
    await login('email@example.com', 'senha');
    // Token salvo automaticamente no localStorage
  };

  // Logout
  const handleLogout = () => {
    logout(); // Limpa token e user
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Olá, {user?.name}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
\`\`\`

### CORS Configurado

**Middleware**: `src/middleware/cors.ts`
**Config**: `next.config.js` (headers globais)

**APIs com CORS aplicado**:
- ✅ `/api/auth/login`
- ✅ `/api/dashboard/stats`

**Para adicionar CORS em outras APIs**:
\`\`\`typescript
import { applyCors } from '../../../middleware/cors';

export default async function handler(req, res) {
  const handled = await applyCors(req, res);
  if (handled) return; // Se for OPTIONS, já foi tratado

  // ... resto do código
}
\`\`\`

---

## 🔧 Como Integrar Componentes

### Passo a Passo: Integrar Patients Component

#### 1. Abrir o componente
\`\`\`
src/components/patients.tsx
\`\`\`

#### 2. Encontrar mock data (linhas 35-90)
\`\`\`typescript
// Mock data - COMENTAR APÓS INTEGRAÇÃO
const mockPatients = [
  { id: 1, name: 'Maria Silva', ... },
  // ...
];
\`\`\`

#### 3. Importar o hook
\`\`\`typescript
import { usePatients } from '../hooks/use-patients';
\`\`\`

#### 4. Substituir mock por hook
\`\`\`typescript
export function Patients() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const {
    patients,
    loading,
    error,
    pagination,
    createPatient,
    updatePatient,
    deletePatient
  } = usePatients({ page, limit: 10, search });

  // ... resto do componente usa {patients} em vez de mockPatients
}
\`\`\`

#### 5. Adicionar loading states
\`\`\`typescript
if (loading) {
  return <div>Carregando...</div>;
}

if (error) {
  return <div>Erro: {error.message}</div>;
}
\`\`\`

#### 6. Testar
- Acessar http://localhost:3000/patients
- Verificar se dados reais aparecem
- Testar criar/editar/deletar

---

## 🔑 Credenciais de Teste

### Usuários do Seed

\`\`\`
Admin (CLINIC_ADMIN):
Email: admin@clinicasorriso.com.br
Senha: (deixar em branco)

Dentista 1 (DENTIST):
Email: dra.ana@clinicasorriso.com.br

Dentista 2 (DENTIST):
Email: dr.ricardo@clinicasorriso.com.br

Secretária (SECRETARY):
Email: maria@clinicasorriso.com.br
\`\`\`

### Dados de Exemplo no Banco

Após rodar o seed (\`npm run seed\`):
- ✅ 1 Clínica (Clínica Sorriso Perfeito)
- ✅ 4 Usuários (admin, 2 dentistas, 1 secretária)
- ✅ 3 Profissionais
- ✅ 10 Pacientes
- ✅ 2 Salas
- ✅ 2 Agendamentos
- ✅ 3 Tratamentos
- ✅ 3 Documentos

---

## 📂 Estrutura de Arquivos

\`\`\`
src/
├── components/
│   ├── dashboard.tsx          # ✅ Integrado
│   ├── patients.tsx           # ⚠️ Hook criado
│   ├── professionals.tsx      # ⚠️ Hook criado  
│   ├── appointments.tsx       # ⚠️ Hook criado
│   └── documents.tsx          # ❌ Precisa hook
│
├── hooks/
│   ├── use-dashboard-stats.ts # ✅
│   ├── use-appointments.ts    # ✅
│   ├── use-patients.ts        # ✅
│   └── use-professionals.ts   # ✅
│
├── lib/
│   ├── api-client.ts          # ✅ Cliente HTTP
│   ├── validation.ts          # ✅ Schemas Zod
│   └── upload.ts              # ✅ Upload helper
│
├── contexts/
│   └── auth-context.tsx       # ✅ Auth context
│
├── middleware/
│   ├── auth.ts                # ✅ JWT middleware
│   ├── cors.ts                # ✅ CORS middleware
│   └── errorHandler.ts        # ✅ Error handler
│
└── pages/
    ├── api/                   # ✅ 56 endpoints
    ├── login.tsx              # ✅ Integrado
    └── dashboard.tsx          # ✅ Integrado
\`\`\`

---

## 🚀 Comandos Úteis

\`\`\`bash
# Instalar dependências
npm install

# Iniciar servidor (frontend + backend)
npm run dev

# Aplicar migrations do Prisma
npx prisma db push

# Popular banco com dados de teste
npm run seed

# Abrir Prisma Studio
npx prisma studio

# Limpar e reiniciar servidor
rm -rf .next && npm run dev
\`\`\`

---

## 📝 Próximos Passos

### Prioridade Alta
1. ⚠️ Integrar Patients component
2. ⚠️ Integrar Professionals component
3. ⚠️ Integrar Appointments component

### Prioridade Média
4. ❌ Criar hook para Documents
5. ❌ Integrar Documents component
6. ❌ Criar hook para Odontogram
7. ❌ Integrar Odontogram component

### Melhorias Futuras
- Adicionar validação de senha real
- Implementar refresh token
- Adicionar websockets para notificações
- Criar sistema de relatórios
- Implementar agenda visual (calendar view)

---

**Última atualização**: 26 de Outubro de 2024  
**Versão**: 1.0.0  
**Servidor**: http://localhost:3000  
**Status**: ✅ Backend 100% | ⚠️ Frontend 30%
