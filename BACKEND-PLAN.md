# Backend Development Plan - OdontoGestor

## Table of Contents
1. [Google OAuth Implementation](#google-oauth-implementation)
2. [Backend Architecture](#backend-architecture)
3. [Database Setup](#database-setup)
4. [API Routes Structure](#api-routes-structure)
5. [Authentication Strategy](#authentication-strategy)
6. [Environment Variables](#environment-variables)
7. [Development Workflow](#development-workflow)
8. [API Endpoints Reference](#api-endpoints-reference)

---

## Google OAuth Implementation

### Current Status
- Login page has a placeholder Google OAuth button (src/pages/login.tsx:196-221)
- Button currently only logs to console: `console.log('Google login clicked');`
- Mock authentication using localStorage (authToken and userRole)

### Implementation Steps

#### 1. Install NextAuth.js
```bash
npm install next-auth @next-auth/prisma-adapter
```

#### 2. Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized JavaScript origins: `http://localhost:3000`
7. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
8. Save Client ID and Client Secret

#### 3. Create NextAuth Configuration
**File: `src/pages/api/auth/[...nextauth].ts`**
```typescript
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

export default NextAuth(authOptions);
```

#### 4. Update Prisma Schema for NextAuth
The current schema.prisma already has User model, but NextAuth requires additional tables:

**Add to `src/prisma/schema.prisma`:**
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

**Update User model to include:**
```prisma
model User {
  // ... existing fields ...

  // Add these relationships for NextAuth
  accounts Account[]
  sessions Session[]
}
```

#### 5. Update Login Page
**File: `src/pages/login.tsx`**

Replace the `handleGoogleLogin` function:
```typescript
import { signIn } from 'next-auth/react';

const handleGoogleLogin = async () => {
  try {
    await signIn('google', { callbackUrl: '/dashboard' });
  } catch (error) {
    console.error('Google login error:', error);
  }
};
```

#### 6. Create Session Provider Wrapper
**File: `src/pages/_app.tsx`** (create if doesn't exist)
```typescript
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
```

#### 7. Update AuthGuard Component
**File: `src/components/auth-guard.tsx`**
```typescript
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      router.push('/unauthorized');
    }
  }, [session, status, router, allowedRoles]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
```

---

## Backend Architecture

### Technology Stack
- **Framework**: Next.js 14 (API Routes)
- **ORM**: Prisma 5.x
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **File Upload**: AWS S3 or Cloudinary

### Directory Structure
```
src/
├── pages/
│   └── api/
│       ├── auth/
│       │   └── [...nextauth].ts
│       ├── clinics/
│       │   ├── index.ts
│       │   ├── [id].ts
│       │   └── [id]/
│       │       ├── patients.ts
│       │       ├── professionals.ts
│       │       └── appointments.ts
│       ├── patients/
│       │   ├── index.ts
│       │   └── [id].ts
│       ├── appointments/
│       │   ├── index.ts
│       │   └── [id].ts
│       ├── professionals/
│       │   ├── index.ts
│       │   └── [id].ts
│       ├── treatments/
│       │   ├── index.ts
│       │   └── [id].ts
│       ├── documents/
│       │   ├── index.ts
│       │   ├── [id].ts
│       │   └── upload.ts
│       ├── payments/
│       │   ├── index.ts
│       │   └── [id].ts
│       ├── odontograms/
│       │   ├── index.ts
│       │   └── [id].ts
│       └── subscriptions/
│           ├── index.ts
│           └── webhook.ts
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── auth.ts           # Auth helpers
│   ├── validation.ts     # Zod schemas
│   └── utils.ts          # Utility functions
├── middleware/
│   ├── auth.ts           # Auth middleware
│   ├── errorHandler.ts   # Error handling
│   └── rateLimit.ts      # Rate limiting
└── types/
    └── api.ts            # API type definitions
```

---

## Database Setup

### 1. Install Prisma
```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Initialize Prisma
```bash
npx prisma generate
```

### 3. Create Prisma Client Singleton
**File: `src/lib/prisma.ts`**
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

### 4. Run Migrations
```bash
# Create initial migration
npx prisma migrate dev --name init

# Apply migrations to production
npx prisma migrate deploy
```

### 5. Seed Database (Optional)
**File: `src/prisma/seed.ts`**
```typescript
import { PrismaClient, UserRole, ClinicStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dentalsaas.com',
      name: 'Admin User',
      role: UserRole.SUPER_ADMIN,
    },
  });

  // Create demo clinic
  const clinic = await prisma.clinic.create({
    data: {
      name: 'Clínica Dental Demo',
      email: 'contato@clinicademo.com',
      phone: '(11) 98765-4321',
      status: ClinicStatus.TRIAL,
    },
  });

  console.log({ admin, clinic });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} src/prisma/seed.ts"
  }
}
```

---

## API Routes Structure

### Authentication Middleware
**File: `src/middleware/auth.ts`**
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';

export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedRoles?: string[]
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  return session;
}
```

### Error Handler
**File: `src/middleware/errorHandler.ts`**
```typescript
import { NextApiResponse } from 'next';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export function handleError(error: unknown, res: NextApiResponse) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  console.error('Unhandled error:', error);
  return res.status(500).json({ error: 'Internal server error' });
}
```

### Validation Schemas
**File: `src/lib/validation.ts`**
```typescript
import { z } from 'zod';

// Patient validation
export const createPatientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  cpf: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
});

// Appointment validation
export const createAppointmentSchema = z.object({
  patientId: z.string().cuid(),
  professionalId: z.string().cuid(),
  date: z.string().datetime(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  duration: z.number().min(15).max(480),
  type: z.string().min(3),
  description: z.string().optional(),
  notes: z.string().optional(),
});

// Professional validation
export const createProfessionalSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  cro: z.string().min(3, 'CRO é obrigatório'),
  specialty: z.string().min(3),
  workDays: z.array(z.string()),
  workStart: z.string().optional(),
  workEnd: z.string().optional(),
});

// Treatment validation
export const createTreatmentSchema = z.object({
  patientId: z.string().cuid(),
  appointmentId: z.string().cuid().optional(),
  name: z.string().min(3),
  description: z.string().optional(),
  tooth: z.string().optional(),
  value: z.number().positive().optional(),
  notes: z.string().optional(),
});
```

---

## API Endpoints Reference

### Patients API

#### GET /api/patients
Get all patients for clinic
```typescript
// Query params: page, limit, search, status
// Returns: { patients: Patient[], total: number, page: number, limit: number }
```

#### POST /api/patients
Create new patient
```typescript
// Body: createPatientSchema
// Returns: { patient: Patient }
```

#### GET /api/patients/[id]
Get patient by ID
```typescript
// Returns: { patient: Patient }
```

#### PUT /api/patients/[id]
Update patient
```typescript
// Body: Partial<createPatientSchema>
// Returns: { patient: Patient }
```

#### DELETE /api/patients/[id]
Delete patient (soft delete - set status to ARCHIVED)
```typescript
// Returns: { success: true }
```

### Appointments API

#### GET /api/appointments
Get all appointments
```typescript
// Query params: date, professionalId, patientId, status
// Returns: { appointments: Appointment[] }
```

#### POST /api/appointments
Create appointment
```typescript
// Body: createAppointmentSchema
// Returns: { appointment: Appointment }
```

#### PUT /api/appointments/[id]
Update appointment
```typescript
// Body: Partial<createAppointmentSchema> & { status?: AppointmentStatus }
// Returns: { appointment: Appointment }
```

#### DELETE /api/appointments/[id]
Cancel appointment
```typescript
// Returns: { success: true }
```

### Professionals API

#### GET /api/professionals
Get all professionals for clinic
```typescript
// Query params: status, specialty
// Returns: { professionals: Professional[] }
```

#### POST /api/professionals
Create professional
```typescript
// Body: createProfessionalSchema
// Returns: { professional: Professional }
```

#### PUT /api/professionals/[id]
Update professional
```typescript
// Body: Partial<createProfessionalSchema>
// Returns: { professional: Professional }
```

### Treatments API

#### GET /api/treatments
Get treatments
```typescript
// Query params: patientId, status
// Returns: { treatments: Treatment[] }
```

#### POST /api/treatments
Create treatment
```typescript
// Body: createTreatmentSchema
// Returns: { treatment: Treatment }
```

#### PUT /api/treatments/[id]
Update treatment
```typescript
// Body: Partial<createTreatmentSchema> & { status?: TreatmentStatus }
// Returns: { treatment: Treatment }
```

### Documents API

#### POST /api/documents/upload
Upload document
```typescript
// FormData: file, patientId?, type, name, description?
// Returns: { document: Document }
```

#### GET /api/documents
Get documents
```typescript
// Query params: patientId, type
// Returns: { documents: Document[] }
```

#### DELETE /api/documents/[id]
Delete document
```typescript
// Returns: { success: true }
```

### Odontogram API

#### GET /api/odontograms
Get odontogram for patient
```typescript
// Query params: patientId (required)
// Returns: { odontogram: Odontogram | null }
```

#### POST /api/odontograms
Create or update odontogram
```typescript
// Body: { patientId: string, data: Json, notes?: string }
// Returns: { odontogram: Odontogram }
```

---

## Authentication Strategy

### Session Management
1. **JWT-based sessions** - Stateless, stored in HTTP-only cookies
2. **Session duration** - 30 days
3. **Refresh strategy** - Automatic token refresh on activity

### Role-Based Access Control (RBAC)

#### User Roles (from schema.prisma)
1. **SUPER_ADMIN** - Platform administrator
   - Access to all clinics
   - Manage subscriptions
   - View analytics across all clinics

2. **CLINIC_ADMIN** - Clinic owner/administrator
   - Full access to their clinic
   - Manage professionals and staff
   - Configure clinic settings

3. **DENTIST** - Professional dentist
   - View/edit own appointments
   - Access patient records
   - Create treatments and odontograms

4. **ASSISTANT** - Clinic assistant
   - Schedule appointments
   - View patient information
   - Limited edit permissions

### Clinic Context
Users can belong to multiple clinics via `ClinicUser` junction table. Each session should include:
- Current clinic ID
- User's role in that clinic
- Specific permissions (stored in `permissions` JSON field)

### Middleware Chain
```typescript
// Example protected route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. Authenticate user
    const session = await requireAuth(req, res, ['CLINIC_ADMIN', 'DENTIST']);

    // 2. Get clinic context
    const clinicId = req.query.clinicId as string;
    const userClinic = await prisma.clinicUser.findFirst({
      where: {
        userId: session.user.id,
        clinicId: clinicId,
      },
    });

    if (!userClinic) {
      return res.status(403).json({ error: 'No access to this clinic' });
    }

    // 3. Handle request
    // ...
  } catch (error) {
    handleError(error, res);
  }
}
```

---

## Environment Variables

Create `.env` file in project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/odontogestor?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AWS S3 (for document storage)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="odontogestor-documents"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email (SendGrid or similar)
SENDGRID_API_KEY="your-sendgrid-key"
EMAIL_FROM="noreply@odontogestor.com"

# Application
NODE_ENV="development"
```

---

## Development Workflow

### Phase 1: Setup (Week 1)
1. ✅ Setup PostgreSQL database
2. ✅ Configure Prisma and run migrations
3. ✅ Implement Google OAuth with NextAuth
4. ✅ Create authentication middleware
5. ✅ Setup error handling

### Phase 2: Core APIs (Week 2-3)
1. ✅ Patients CRUD API
2. ✅ Professionals CRUD API
3. ✅ Appointments CRUD API
4. ✅ Treatments CRUD API
5. ✅ Connect frontend to backend

### Phase 3: Advanced Features (Week 4)
1. ✅ Document upload/management
2. ✅ Odontogram API
3. ✅ Payment integration (Stripe)
4. ✅ Email notifications
5. ✅ Audit logging

### Phase 4: Testing & Optimization (Week 5)
1. ✅ Unit tests for critical paths
2. ✅ Integration tests for APIs
3. ✅ Performance optimization
4. ✅ Security audit
5. ✅ Documentation

### Commands Reference
```bash
# Database
npx prisma migrate dev          # Create and apply migration
npx prisma migrate deploy       # Apply migrations (production)
npx prisma generate            # Generate Prisma Client
npx prisma studio              # Open database GUI
npx prisma db seed             # Run seed script

# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm start                      # Start production server

# Testing
npm run test                   # Run tests
npm run test:watch            # Run tests in watch mode
```

---

## Next Steps Checklist

### Immediate Actions
- [ ] Create `.env` file with all required variables
- [ ] Setup PostgreSQL database (local or cloud)
- [ ] Install required dependencies (next-auth, zod, etc.)
- [ ] Add NextAuth tables to schema.prisma
- [ ] Run Prisma migrations
- [ ] Create Google OAuth credentials
- [ ] Implement NextAuth configuration
- [ ] Update login page with real Google OAuth

### Backend Development
- [ ] Create API route structure
- [ ] Implement Patients API (all CRUD endpoints)
- [ ] Implement Appointments API
- [ ] Implement Professionals API
- [ ] Implement Treatments API (for attendance)
- [ ] Setup file upload for documents
- [ ] Implement Odontogram API

### Frontend Integration
- [ ] Replace mock data in patients.tsx with API calls
- [ ] Replace mock data in appointments.tsx with API calls
- [ ] Replace mock data in attendance.tsx with API calls
- [ ] Replace mock data in professionals.tsx with API calls
- [ ] Add loading states and error handling
- [ ] Implement optimistic updates

### Testing & Deployment
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test role-based access control
- [ ] Setup staging environment
- [ ] Deploy to production

---

## Additional Resources

### Documentation Links
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Validation](https://github.com/colinhacks/zod)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

### Best Practices
1. Always validate input with Zod schemas
2. Use transactions for multi-step database operations
3. Implement proper error handling and logging
4. Rate limit public endpoints
5. Sanitize user input to prevent SQL injection
6. Use prepared statements (Prisma does this automatically)
7. Implement audit logging for sensitive operations
8. Use environment variables for all secrets
9. Keep API responses consistent
10. Document all endpoints

---

**Last Updated**: 2025-10-25
**Version**: 1.0
**Author**: Claude Code Assistant
