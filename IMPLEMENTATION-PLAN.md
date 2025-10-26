# Plano de Implementação + Testes - OdontoGestor Backend

## Visão Geral
Este documento detalha o plano de implementação das APIs usando **Pages Router** (index.ts / [id].ts) e a estratégia de testes para cada endpoint.

---

## Fase 0: Setup e Preparação (ATUAL)

### Checklist de Setup
- [x] Prisma instalado (@prisma/client + prisma dev)
- [x] Schema.prisma configurado
- [x] Seed.ts completo e robusto
- [ ] Arquivo .env criado
- [ ] Package.json corrigido (path do seed)
- [ ] Dependências instaladas (zod, ts-node)
- [ ] Prisma generate executado
- [ ] Migrations criadas e aplicadas
- [ ] Seed executado com sucesso
- [ ] Prisma Studio testado

### Comandos de Setup
```bash
# 1. Instalar dependências necessárias
npm install zod ts-node

# 2. Gerar Prisma Client
npx prisma generate

# 3. Criar e aplicar migrations
npx prisma migrate dev --name init

# 4. Executar seed
npm run prisma:seed

# 5. Abrir Prisma Studio para verificar dados
npm run prisma:studio
```

### Validação do Setup
- [ ] Banco de dados criado (odontogestor)
- [ ] Todas as tabelas criadas (17 tabelas)
- [ ] Seed executado sem erros
- [ ] Prisma Studio abrindo e mostrando dados
- [ ] 5 usuários criados
- [ ] 1 clínica criada
- [ ] 6 pacientes criados
- [ ] 4 agendamentos criados

---

## Fase 1: Infraestrutura Base (Semana 1 - Dias 1-2)

### 1.1 Criar Estrutura de Diretórios
```
src/
├── lib/
│   ├── prisma.ts          # ✅ Singleton do Prisma Client
│   ├── auth.ts            # ⏳ Helpers de autenticação
│   ├── validation.ts      # ⏳ Schemas Zod
│   └── utils.ts           # ⏳ Funções utilitárias
├── middleware/
│   ├── auth.ts            # ⏳ Middleware de autenticação
│   ├── errorHandler.ts    # ⏳ Error handler global
│   └── validate.ts        # ⏳ Middleware de validação Zod
└── types/
    └── api.ts             # ⏳ Tipos TypeScript das APIs
```

**Checklist:**
- [ ] Criar diretórios
- [ ] Implementar src/lib/prisma.ts
- [ ] Implementar src/lib/validation.ts (schemas Zod)
- [ ] Implementar src/middleware/errorHandler.ts
- [ ] Implementar src/middleware/auth.ts (mock temporário)
- [ ] Implementar src/types/api.ts

### 1.2 Prisma Client Singleton
**File:** `src/lib/prisma.ts`
```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
```

### 1.3 Error Handler
**File:** `src/middleware/errorHandler.ts`
```typescript
import { NextApiResponse } from 'next';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleError(error: unknown, res: NextApiResponse) {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: error.message,
      statusCode: error.statusCode
    });
  }

  if (error instanceof Error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }

  return res.status(500).json({ error: 'Unknown error occurred' });
}
```

### 1.4 Validation Middleware
**File:** `src/middleware/validate.ts`
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error
      });
    }
  };
}
```

### 1.5 Validation Schemas
**File:** `src/lib/validation.ts`
```typescript
import { z } from 'zod';

// Patient Schemas
export const createPatientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional().nullable(),
  phone: z.string().optional().nullable(),
  cpf: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  medicalHistory: z.any().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updatePatientSchema = createPatientSchema.partial();

// Appointment Schemas
export const createAppointmentSchema = z.object({
  patientId: z.string().cuid('Patient ID inválido'),
  professionalId: z.string().cuid('Professional ID inválido'),
  roomId: z.string().cuid().optional().nullable(),
  title: z.string().min(3, 'Título muito curto').optional().nullable(),
  description: z.string().optional().nullable(),
  date: z.string().datetime('Data inválida'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  duration: z.number().min(15, 'Duração mínima 15 minutos').max(480, 'Duração máxima 8 horas'),
  type: z.string().min(3, 'Tipo deve ter no mínimo 3 caracteres'),
  value: z.number().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial().extend({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED', 'NO_SHOW', 'URGENT']).optional(),
});

// Professional Schemas
export const createProfessionalSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional().nullable(),
  phone: z.string().optional().nullable(),
  cro: z.string().min(3, 'CRO é obrigatório'),
  specialty: z.string().min(3, 'Especialidade obrigatória'),
  color: z.string().optional().default('#3b82f6'),
  workDays: z.array(z.string()),
  workStart: z.string().optional().default('08:00'),
  workEnd: z.string().optional().default('18:00'),
  notes: z.string().optional().nullable(),
});

export const updateProfessionalSchema = createProfessionalSchema.partial();

// Treatment Schemas
export const createTreatmentSchema = z.object({
  patientId: z.string().cuid(),
  appointmentId: z.string().cuid().optional().nullable(),
  name: z.string().min(3, 'Nome do tratamento obrigatório'),
  description: z.string().optional().nullable(),
  tooth: z.string().optional().nullable(),
  value: z.number().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateTreatmentSchema = createTreatmentSchema.partial().extend({
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED']).optional(),
});
```

**Checklist Fase 1:**
- [ ] Todos os arquivos criados
- [ ] Prisma Client singleton testado
- [ ] Error handler testado
- [ ] Schemas Zod validados
- [ ] TypeScript sem erros

---

## Fase 2: API de Pacientes (Semana 1 - Dias 3-4)

### 2.1 Estrutura de Arquivos
```
src/pages/api/
└── patients/
    ├── index.ts        # GET /api/patients, POST /api/patients
    └── [id].ts         # GET /api/patients/:id, PUT /api/patients/:id, DELETE /api/patients/:id
```

### 2.2 Implementação - GET /api/patients
**File:** `src/pages/api/patients/index.ts`
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { createPatientSchema } from '../../../lib/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Temporariamente sem autenticação
    const clinicId = 'mock-clinic-id'; // TODO: Pegar do contexto de autenticação

    if (req.method === 'GET') {
      const { page = '1', limit = '10', search = '', status = 'ACTIVE' } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where = {
        clinicId,
        status: status as any,
        ...(search && {
          OR: [
            { name: { contains: search as string, mode: 'insensitive' } },
            { email: { contains: search as string, mode: 'insensitive' } },
            { phone: { contains: search as string, mode: 'insensitive' } },
            { cpf: { contains: search as string, mode: 'insensitive' } },
          ],
        }),
      };

      const [patients, total] = await Promise.all([
        prisma.patient.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.patient.count({ where }),
      ]);

      return res.status(200).json({
        patients,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          pages: Math.ceil(total / take),
        },
      });
    }

    if (req.method === 'POST') {
      const validatedData = createPatientSchema.parse(req.body);

      const patient = await prisma.patient.create({
        data: {
          ...validatedData,
          clinicId,
          birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
        },
      });

      return res.status(201).json({ patient });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    handleError(error, res);
  }
}
```

### 2.3 Implementação - GET/PUT/DELETE /api/patients/[id]
**File:** `src/pages/api/patients/[id].ts`
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { updatePatientSchema } from '../../../lib/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const clinicId = 'mock-clinic-id'; // TODO: Auth

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invalid patient ID');
    }

    // Verificar se paciente existe e pertence à clínica
    const existingPatient = await prisma.patient.findFirst({
      where: { id, clinicId },
    });

    if (!existingPatient) {
      throw new ApiError(404, 'Patient not found');
    }

    if (req.method === 'GET') {
      const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
          appointments: {
            take: 5,
            orderBy: { date: 'desc' },
            include: { professional: true },
          },
          treatments: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
          documents: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return res.status(200).json({ patient });
    }

    if (req.method === 'PUT') {
      const validatedData = updatePatientSchema.parse(req.body);

      const patient = await prisma.patient.update({
        where: { id },
        data: {
          ...validatedData,
          birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : undefined,
        },
      });

      return res.status(200).json({ patient });
    }

    if (req.method === 'DELETE') {
      // Soft delete - apenas marca como ARCHIVED
      const patient = await prisma.patient.update({
        where: { id },
        data: { status: 'ARCHIVED' },
      });

      return res.status(200).json({ success: true, patient });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    handleError(error, res);
  }
}
```

### 2.4 Testes da API de Pacientes

#### Teste Manual com cURL

```bash
# 1. GET - Listar pacientes
curl -X GET "http://localhost:3000/api/patients?page=1&limit=10" \
  -H "Content-Type: application/json"

# Validação esperada:
# - Status 200
# - Array de pacientes
# - Campos de paginação (total, page, limit, pages)
# - Pacientes do seed devem aparecer

# 2. GET - Buscar paciente específico
curl -X GET "http://localhost:3000/api/patients/[ID_DO_PACIENTE]" \
  -H "Content-Type: application/json"

# Validação esperada:
# - Status 200
# - Dados completos do paciente
# - Includes: appointments, treatments, documents

# 3. POST - Criar novo paciente
curl -X POST "http://localhost:3000/api/patients" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste API Silva",
    "email": "teste@api.com",
    "phone": "(11) 99999-9999",
    "cpf": "999.999.999-99",
    "birthDate": "1990-01-01",
    "gender": "MALE",
    "address": "Rua Teste API, 123"
  }'

# Validação esperada:
# - Status 201
# - Objeto patient retornado
# - ID gerado (CUID)
# - Campos salvos corretamente

# 4. PUT - Atualizar paciente
curl -X PUT "http://localhost:3000/api/patients/[ID_DO_PACIENTE]" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nome Atualizado",
    "email": "atualizado@email.com"
  }'

# Validação esperada:
# - Status 200
# - Dados atualizados retornados
# - Outros campos não alterados permanecem

# 5. DELETE - Arquivar paciente
curl -X DELETE "http://localhost:3000/api/patients/[ID_DO_PACIENTE]" \
  -H "Content-Type: application/json"

# Validação esperada:
# - Status 200
# - success: true
# - Patient com status ARCHIVED

# 6. Testes de erro

# 6.1 - GET paciente inexistente
curl -X GET "http://localhost:3000/api/patients/cuid_invalido"
# Esperado: Status 404, error: 'Patient not found'

# 6.2 - POST com dados inválidos
curl -X POST "http://localhost:3000/api/patients" \
  -H "Content-Type: application/json" \
  -d '{ "name": "AB" }'
# Esperado: Status 400, erro de validação Zod

# 6.3 - POST com email inválido
curl -X POST "http://localhost:3000/api/patients" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Teste", "email": "email-invalido" }'
# Esperado: Status 400, erro de validação de email
```

#### Checklist de Validação - Patients API
- [ ] GET /api/patients retorna lista paginada
- [ ] GET /api/patients?search=Maria filtra corretamente
- [ ] GET /api/patients?status=ACTIVE filtra por status
- [ ] GET /api/patients/[id] retorna paciente com relacionamentos
- [ ] POST /api/patients cria novo paciente
- [ ] POST valida campos obrigatórios (name)
- [ ] POST valida formato de email
- [ ] PUT /api/patients/[id] atualiza paciente
- [ ] PUT aceita atualização parcial
- [ ] DELETE /api/patients/[id] faz soft delete (ARCHIVED)
- [ ] DELETE não remove do banco (apenas muda status)
- [ ] Erros retornam status HTTP correto
- [ ] Erros têm mensagens claras

---

## Fase 3: API de Profissionais (Semana 1 - Dia 5)

### 3.1 Estrutura
```
src/pages/api/
└── professionals/
    ├── index.ts        # GET, POST
    └── [id].ts         # GET, PUT, DELETE
```

### 3.2 Implementação Similar à de Pacientes

**Diferenças principais:**
- Não tem soft delete (pode deletar direto se não tiver appointments)
- Tem campos específicos: cro, specialty, color, workDays
- Filtro por specialty e status

### 3.3 Testes

```bash
# GET - Listar profissionais
curl -X GET "http://localhost:3000/api/professionals" \
  -H "Content-Type: application/json"

# POST - Criar profissional
curl -X POST "http://localhost:3000/api/professionals" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Teste API",
    "email": "dr.teste@api.com",
    "phone": "(11) 99999-9999",
    "cro": "CRO-SP 99999",
    "specialty": "Clínica Geral",
    "workDays": ["monday", "tuesday", "wednesday"],
    "workStart": "08:00",
    "workEnd": "17:00"
  }'

# PUT - Atualizar
curl -X PUT "http://localhost:3000/api/professionals/[ID]" \
  -H "Content-Type: application/json" \
  -d '{ "specialty": "Ortodontia" }'

# DELETE - Remover (se não tiver appointments)
curl -X DELETE "http://localhost:3000/api/professionals/[ID]"
```

#### Checklist - Professionals API
- [ ] GET retorna lista de profissionais
- [ ] GET /[id] retorna profissional com appointments
- [ ] POST cria profissional
- [ ] POST valida CRO obrigatório
- [ ] PUT atualiza profissional
- [ ] DELETE remove se não tiver appointments
- [ ] DELETE retorna erro se tiver appointments

---

## Fase 4: API de Agendamentos (Semana 2 - Dias 1-2)

### 4.1 Estrutura
```
src/pages/api/
└── appointments/
    ├── index.ts        # GET, POST
    └── [id].ts         # GET, PUT, DELETE
```

### 4.2 Features Especiais

**GET /api/appointments:**
- Filtros: date, professionalId, patientId, status, roomId
- Ordenação por data
- Include: patient, professional, room

**POST /api/appointments:**
- Validar conflito de horários (mesmo professional + mesmo horário)
- Validar duração vs horário (startTime + duration = endTime)
- Criar tratamento automaticamente se especificado

**PUT /api/appointments:**
- Permitir mudança de status
- Validar conflitos ao reagendar

### 4.3 Testes

```bash
# GET - Listar appointments de hoje
curl -X GET "http://localhost:3000/api/appointments?date=2024-01-15" \
  -H "Content-Type: application/json"

# GET - Appointments de um profissional
curl -X GET "http://localhost:3000/api/appointments?professionalId=[ID]" \
  -H "Content-Type: application/json"

# POST - Criar appointment
curl -X POST "http://localhost:3000/api/appointments" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "[PATIENT_ID]",
    "professionalId": "[PROF_ID]",
    "date": "2024-01-20T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "11:00",
    "duration": 60,
    "type": "Consulta",
    "title": "Consulta de Rotina",
    "description": "Avaliação geral"
  }'

# PUT - Confirmar appointment
curl -X PUT "http://localhost:3000/api/appointments/[ID]" \
  -H "Content-Type: application/json" \
  -d '{ "status": "CONFIRMED" }'

# DELETE - Cancelar
curl -X DELETE "http://localhost:3000/api/appointments/[ID]"
```

#### Checklist - Appointments API
- [ ] GET filtra por data
- [ ] GET filtra por professional
- [ ] GET filtra por patient
- [ ] GET filtra por status
- [ ] POST cria appointment
- [ ] POST valida conflito de horário
- [ ] POST valida IDs (patient, professional existem)
- [ ] PUT atualiza appointment
- [ ] PUT permite mudança de status
- [ ] DELETE cancela appointment (status = CANCELED)

---

## Fase 5: API de Tratamentos (Semana 2 - Dias 3-4)

### 5.1 Estrutura
```
src/pages/api/
└── treatments/
    ├── index.ts        # GET, POST
    └── [id].ts         # GET, PUT, DELETE
```

### 5.2 Features
- Associação com patient (obrigatório)
- Associação com appointment (opcional)
- Status: PLANNED, IN_PROGRESS, COMPLETED, CANCELED
- Campo tooth para localização

### 5.3 Testes

```bash
# GET - Tratamentos de um paciente
curl -X GET "http://localhost:3000/api/treatments?patientId=[ID]"

# POST - Criar tratamento
curl -X POST "http://localhost:3000/api/treatments" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "[PATIENT_ID]",
    "appointmentId": "[APPOINTMENT_ID]",
    "name": "Restauração",
    "description": "Restauração em resina composta",
    "tooth": "16",
    "value": 250.00
  }'

# PUT - Atualizar status
curl -X PUT "http://localhost:3000/api/treatments/[ID]" \
  -H "Content-Type: application/json" \
  -d '{ "status": "COMPLETED" }'
```

#### Checklist - Treatments API
- [ ] GET lista tratamentos
- [ ] GET filtra por patientId
- [ ] GET filtra por status
- [ ] POST cria tratamento
- [ ] POST valida patientId existe
- [ ] POST valida appointmentId se fornecido
- [ ] PUT atualiza tratamento
- [ ] PUT permite mudança de status
- [ ] DELETE remove tratamento

---

## Fase 6: Integração Frontend (Semana 2 - Dia 5)

### 6.1 Criar API Client
**File:** `src/lib/api-client.ts`
```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = {
  patients: {
    getAll: async (params?: {page?: number; limit?: number; search?: string}) => {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`${BASE_URL}/patients?${query}`);
      return res.json();
    },
    getOne: async (id: string) => {
      const res = await fetch(`${BASE_URL}/patients/${id}`);
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch(`${BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetch(`${BASE_URL}/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`${BASE_URL}/patients/${id}`, {
        method: 'DELETE',
      });
      return res.json();
    },
  },
  // Mesma estrutura para: appointments, professionals, treatments
};
```

### 6.2 Substituir Mock Data

**src/components/patients.tsx:**
- Trocar `mockPatients` por `apiClient.patients.getAll()`
- Usar `useEffect` para carregar dados
- Adicionar estados: loading, error
- Implementar otimistic updates

### 6.3 Checklist de Integração
- [ ] API client criado
- [ ] Patients.tsx usando API real
- [ ] Loading states implementados
- [ ] Error handling implementado
- [ ] Otimistic updates funcionando
- [ ] Appointments.tsx usando API
- [ ] Attendance.tsx usando API
- [ ] Professionals.tsx usando API

---

## Fase 7: Testes Automatizados (Semana 3)

### 7.1 Setup de Testes
```bash
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
npm install -D supertest @types/supertest
```

### 7.2 Testes de Integração (API)

**Example: `__tests__/api/patients.test.ts`**
```typescript
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/patients/index';

describe('/api/patients', () => {
  it('GET returns patients list', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('patients');
    expect(JSON.parse(res._getData())).toHaveProperty('pagination');
  });

  it('POST creates new patient', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Test Patient',
        email: 'test@example.com',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toHaveProperty('patient');
  });
});
```

### 7.3 Checklist de Testes
- [ ] Setup jest configurado
- [ ] Testes patients API (5 cenários)
- [ ] Testes appointments API (5 cenários)
- [ ] Testes professionals API (4 cenários)
- [ ] Testes treatments API (4 cenários)
- [ ] Coverage > 80%

---

## Fase 8: Documentação e Deploy (Semana 3-4)

### 8.1 Documentação de APIs
- [ ] README.md da API
- [ ] Postman Collection exportada
- [ ] Swagger/OpenAPI spec (opcional)

### 8.2 Deploy
- [ ] Variáveis de ambiente em produção
- [ ] Migrations aplicadas em produção
- [ ] Seed executado (dados demo)
- [ ] Testes end-to-end em produção

---

## Resumo de Endpoints Implementados

| Endpoint | Método | Descrição | Status |
|----------|--------|-----------|--------|
| /api/patients | GET | Listar pacientes | ⏳ |
| /api/patients | POST | Criar paciente | ⏳ |
| /api/patients/[id] | GET | Ver paciente | ⏳ |
| /api/patients/[id] | PUT | Atualizar | ⏳ |
| /api/patients/[id] | DELETE | Arquivar | ⏳ |
| /api/professionals | GET | Listar profissionais | ⏳ |
| /api/professionals | POST | Criar profissional | ⏳ |
| /api/professionals/[id] | GET | Ver profissional | ⏳ |
| /api/professionals/[id] | PUT | Atualizar | ⏳ |
| /api/professionals/[id] | DELETE | Remover | ⏳ |
| /api/appointments | GET | Listar agendamentos | ⏳ |
| /api/appointments | POST | Criar agendamento | ⏳ |
| /api/appointments/[id] | GET | Ver agendamento | ⏳ |
| /api/appointments/[id] | PUT | Atualizar | ⏳ |
| /api/appointments/[id] | DELETE | Cancelar | ⏳ |
| /api/treatments | GET | Listar tratamentos | ⏳ |
| /api/treatments | POST | Criar tratamento | ⏳ |
| /api/treatments/[id] | GET | Ver tratamento | ⏳ |
| /api/treatments/[id] | PUT | Atualizar | ⏳ |
| /api/treatments/[id] | DELETE | Remover | ⏳ |

**Legenda:**
- ✅ Implementado e testado
- ⏳ Pendente
- 🚧 Em progresso

---

## Cronograma Estimado

| Fase | Duração | Atividades | Status |
|------|---------|------------|--------|
| 0 | 2h | Setup, migrations, seed | 🚧 |
| 1 | 1 dia | Infraestrutura base | ⏳ |
| 2 | 2 dias | API Pacientes | ⏳ |
| 3 | 1 dia | API Profissionais | ⏳ |
| 4 | 2 dias | API Agendamentos | ⏳ |
| 5 | 2 dias | API Tratamentos | ⏳ |
| 6 | 1 dia | Integração Frontend | ⏳ |
| 7 | 3 dias | Testes Automatizados | ⏳ |
| 8 | 2 dias | Documentação/Deploy | ⏳ |

**Total estimado:** 14 dias úteis (~3 semanas)

---

## Comandos Úteis de Desenvolvimento

```bash
# Desenvolvimento
npm run dev                    # Iniciar dev server
npm run prisma:studio         # Abrir Prisma Studio
npm run prisma:generate       # Regenerar Prisma Client

# Database
npm run prisma:migrate        # Criar migration
npx prisma migrate dev --name <nome>  # Migration nomeada
npx prisma migrate reset      # Reset DB (DEV ONLY!)
npm run prisma:seed          # Popular banco

# Testes
npm test                      # Rodar testes
npm test -- --coverage       # Com coverage
npm test -- --watch          # Watch mode

# Build
npm run build                # Build produção
npm start                    # Iniciar produção
```

---

## Troubleshooting

### Erro: "Prisma Client not generated"
```bash
npx prisma generate
```

### Erro: "Can't reach database server"
```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Testar conexão
psql -h localhost -U admin -d odontogestor
```

### Erro: Migration failed
```bash
# Resetar database (DEV ONLY)
npx prisma migrate reset

# Criar nova migration
npx prisma migrate dev
```

---

**Última atualização:** 2025-10-25
**Versão:** 1.0
**Autor:** Claude Code Assistant
