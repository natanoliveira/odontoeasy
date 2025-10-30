import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // ================================
  // LIMPEZA INICIAL (DEVELOPMENT ONLY)
  // ================================

  console.log('🧹 Limpando dados existentes...')
  await prisma.auditLog.deleteMany()
  await prisma.note.deleteMany()
  await prisma.odontogram.deleteMany()
  await prisma.document.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.treatment.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.room.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.professional.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.clinicUser.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.clinic.deleteMany()
  await prisma.user.deleteMany()

  // ================================
  // USUÁRIOS
  // ================================

  console.log('👥 Criando usuários...')

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@denticare.com.br',
      name: 'Administrador Sistema',
      role: 'SUPER_ADMIN',
      provider: 'email',
    },
  })

  const clinicAdmin = await prisma.user.create({
    data: {
      email: 'admin@clinicasorriso.com.br',
      name: 'Dr. Carlos Roberto Silva',
      role: 'CLINIC_ADMIN',
      provider: 'email',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    },
  })

  const dentist1 = await prisma.user.create({
    data: {
      email: 'dra.ana@clinicasorriso.com.br',
      name: 'Dra. Ana Paula Santos',
      role: 'DENTIST',
      provider: 'email',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    },
  })

  const dentist2 = await prisma.user.create({
    data: {
      email: 'dr.ricardo@clinicasorriso.com.br',
      name: 'Dr. Ricardo Mendes',
      role: 'DENTIST',
      provider: 'email',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    },
  })

  const assistant = await prisma.user.create({
    data: {
      email: 'maria@clinicasorriso.com.br',
      name: 'Maria Fernanda Costa',
      role: 'ASSISTANT',
      provider: 'email',
      avatar: 'https://images.unsplash.com/photo-1594824694996-6bf2e5b09b54?w=150&h=150&fit=crop&crop=face',
    },
  })

  // ================================
  // ASSINATURA E CLÍNICA
  // ================================

  console.log('🏥 Criando assinatura e clínica...')

  const subscription = await prisma.subscription.create({
    data: {
      plan: 'PREMIUM',
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      features: {
        maxProfessionals: 10,
        maxPatients: 1000,
        maxAppointments: 500,
        odontogramEnabled: true,
        documentsEnabled: true,
        paymentsEnabled: true,
        customBranding: true
      }
    },
  })

  const clinic = await prisma.clinic.create({
    data: {
      name: 'Clínica Sorriso Perfeito',
      cnpj: '12.345.678/0001-90',
      phone: '(11) 3456-7890',
      email: 'contato@clinicasorriso.com.br',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      website: 'https://clinicasorriso.com.br',
      description: 'Clínica odontológica especializada em tratamentos estéticos e preventivos, com mais de 15 anos de experiência no mercado.',
      status: 'ACTIVE',
      subscriptionId: subscription.id,
      settings: {
        workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        workStart: '08:00',
        workEnd: '18:00',
        appointmentDuration: 60,
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        language: 'pt-BR'
      }
    },
  })

  // ================================
  // ASSOCIAÇÕES USUÁRIO-CLÍNICA
  // ================================

  console.log('🔗 Criando associações usuário-clínica...')

  await prisma.clinicUser.createMany({
    data: [
      {
        userId: clinicAdmin.id,
        clinicId: clinic.id,
        role: 'CLINIC_ADMIN',
        permissions: {
          canManageUsers: true,
          canManageSchedules: true,
          canViewReports: true,
          canManagePayments: true
        }
      },
      {
        userId: dentist1.id,
        clinicId: clinic.id,
        role: 'DENTIST',
        permissions: {
          canManagePatients: true,
          canManageAppointments: true,
          canViewOdontograms: true
        }
      },
      {
        userId: dentist2.id,
        clinicId: clinic.id,
        role: 'DENTIST',
        permissions: {
          canManagePatients: true,
          canManageAppointments: true,
          canViewOdontograms: true
        }
      },
      {
        userId: assistant.id,
        clinicId: clinic.id,
        role: 'ASSISTANT',
        permissions: {
          canManageAppointments: true,
          canViewPatients: true
        }
      }
    ],
  })

  // ================================
  // PROFISSIONAIS
  // ================================

  console.log('👨‍⚕️ Criando profissionais...')

  const professional1 = await prisma.professional.create({
    data: {
      clinicId: clinic.id,
      name: 'Dra. Ana Paula Santos',
      email: 'dra.ana@clinicasorriso.com.br',
      phone: '(11) 98765-4321',
      cro: 'CRO-SP 98765',
      specialty: 'Ortodontia',
      color: '#3b82f6',
      status: 'ACTIVE',
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      workStart: '08:00',
      workEnd: '17:00',
      notes: 'Especialista em ortodontia com 10 anos de experiência. Atende crianças e adultos.',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    },
  })

  const professional2 = await prisma.professional.create({
    data: {
      clinicId: clinic.id,
      name: 'Dr. Ricardo Mendes',
      email: 'dr.ricardo@clinicasorriso.com.br',
      phone: '(11) 91234-5678',
      cro: 'CRO-SP 54321',
      specialty: 'Implantodontia',
      color: '#059669',
      status: 'ACTIVE',
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      workStart: '09:00',
      workEnd: '18:00',
      notes: 'Especialista em implantes dentários e cirurgia oral. Mais de 15 anos de experiência.',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    },
  })

  const professional3 = await prisma.professional.create({
    data: {
      clinicId: clinic.id,
      name: 'Dr. Carlos Roberto Silva',
      email: 'admin@clinicasorriso.com.br',
      phone: '(11) 3456-7890',
      cro: 'CRO-SP 12345',
      specialty: 'Clínica Geral',
      color: '#dc2626',
      status: 'ACTIVE',
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      workStart: '08:00',
      workEnd: '18:00',
      notes: 'Diretor da clínica. Especialista em clínica geral e estética dental.',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    },
  })

  // ================================
  // SALAS/CONSULTÓRIOS
  // ================================

  console.log('🏢 Criando salas...')

  const room1 = await prisma.room.create({
    data: {
      clinicId: clinic.id,
      name: 'Consultório 1',
      description: 'Sala principal para consultas e procedimentos gerais',
      color: '#3b82f6',
      equipment: ['Cadeira odontológica', 'Compressor', 'Sugador', 'Refletor LED', 'Autoclave'],
      status: 'AVAILABLE',
    },
  })

  const room2 = await prisma.room.create({
    data: {
      clinicId: clinic.id,
      name: 'Consultório 2',
      description: 'Sala equipada para ortodontia e procedimentos estéticos',
      color: '#059669',
      equipment: ['Cadeira odontológica', 'Compressor', 'Sugador', 'Refletor LED', 'Aparelho de raio-X'],
      status: 'AVAILABLE',
    },
  })

  const room3 = await prisma.room.create({
    data: {
      clinicId: clinic.id,
      name: 'Sala de Cirurgia',
      description: 'Sala especializada para procedimentos cirúrgicos',
      color: '#dc2626',
      equipment: ['Cadeira odontológica cirúrgica', 'Compressor', 'Sugador duplo', 'Refletor LED cirúrgico', 'Monitor de sinais vitais', 'Aparelho de raio-X'],
      status: 'AVAILABLE',
    },
  })

  // ================================
  // PACIENTES
  // ================================

  console.log('🤝 Criando pacientes...')

  const patients = await prisma.patient.createMany({
    data: [
      {
        clinicId: clinic.id,
        name: 'João Silva Santos',
        email: 'joao.santos@email.com',
        phone: '(11) 99999-1111',
        cpf: '123.456.789-01',
        birthDate: new Date('1985-03-15'),
        gender: 'MALE',
        address: 'Rua das Palmeiras, 456',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '02345-678',
        emergencyContact: 'Maria Santos - (11) 88888-1111',
        medicalHistory: {
          allergies: ['Penicilina'],
          medications: [],
          conditions: ['Hipertensão'],
          notes: 'Paciente hipertenso controlado com medicação.'
        },
        notes: 'Paciente regular, sempre pontual nas consultas.',
        status: 'ACTIVE',
      },
      {
        clinicId: clinic.id,
        name: 'Maria Oliveira Costa',
        email: 'maria.costa@email.com',
        phone: '(11) 99999-2222',
        cpf: '234.567.890-12',
        birthDate: new Date('1990-07-22'),
        gender: 'FEMALE',
        address: 'Avenida Paulista, 1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        emergencyContact: 'Carlos Costa - (11) 88888-2222',
        medicalHistory: {
          allergies: [],
          medications: ['Anticoncepcional'],
          conditions: [],
          notes: 'Paciente saudável, faz uso de anticoncepcional.'
        },
        notes: 'Interessada em tratamento ortodôntico.',
        status: 'ACTIVE',
      },
      {
        clinicId: clinic.id,
        name: 'Pedro Rodrigues Lima',
        email: 'pedro.lima@email.com',
        phone: '(11) 99999-3333',
        cpf: '345.678.901-23',
        birthDate: new Date('1975-11-08'),
        gender: 'MALE',
        address: 'Rua Augusta, 2500',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01412-100',
        emergencyContact: 'Ana Lima - (11) 88888-3333',
        medicalHistory: {
          allergies: ['Látex'],
          medications: ['Losartana'],
          conditions: ['Diabetes tipo 2'],
          notes: 'Diabético tipo 2, necessita cuidados especiais em procedimentos.'
        },
        notes: 'Precisa de implantes na região posterior.',
        status: 'ACTIVE',
      },
      {
        clinicId: clinic.id,
        name: 'Ana Carolina Ferreira',
        email: 'ana.ferreira@email.com',
        phone: '(11) 99999-4444',
        cpf: '456.789.012-34',
        birthDate: new Date('1995-05-12'),
        gender: 'FEMALE',
        address: 'Rua dos Jardins, 789',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        emergencyContact: 'Roberto Ferreira - (11) 88888-4444',
        medicalHistory: {
          allergies: [],
          medications: [],
          conditions: [],
          notes: 'Paciente jovem e saudável.'
        },
        notes: 'Interessada em clareamento dental.',
        status: 'ACTIVE',
      },
      {
        clinicId: clinic.id,
        name: 'Roberto Almeida Souza',
        email: 'roberto.souza@email.com',
        phone: '(11) 99999-5555',
        cpf: '567.890.123-45',
        birthDate: new Date('1980-09-30'),
        gender: 'MALE',
        address: 'Alameda Santos, 1500',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01418-200',
        emergencyContact: 'Claudia Souza - (11) 88888-5555',
        medicalHistory: {
          allergies: [],
          medications: ['Omeprazol'],
          conditions: ['Refluxo gastroesofágico'],
          notes: 'Paciente com refluxo, cuidado com erosão dental.'
        },
        notes: 'Consultas de manutenção regulares.',
        status: 'ACTIVE',
      },
      {
        clinicId: clinic.id,
        name: 'Fernanda Ribeiro Silva',
        email: 'fernanda.silva@email.com',
        phone: '(11) 99999-6666',
        cpf: '678.901.234-56',
        birthDate: new Date('1988-12-25'),
        gender: 'FEMALE',
        address: 'Rua Oscar Freire, 300',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01426-000',
        emergencyContact: 'Marcos Silva - (11) 88888-6666',
        medicalHistory: {
          allergies: ['Ibuprofeno'],
          medications: [],
          conditions: [],
          notes: 'Alergia a anti-inflamatórios.'
        },
        notes: 'Paciente ansiosa, requer abordagem cuidadosa.',
        status: 'ACTIVE',
      }
    ],
  })

  // Buscar pacientes criados para usar nos agendamentos
  const allPatients = await prisma.patient.findMany({
    where: { clinicId: clinic.id }
  })

  // ================================
  // HORÁRIOS DISPONÍVEIS
  // ================================

  console.log('📅 Criando horários disponíveis...')

  const schedules = []
  const today = new Date()

  // Criar horários para os próximos 30 dias
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // Pular fins de semana (0 = domingo, 6 = sábado)
    if (date.getDay() === 0 || date.getDay() === 6) continue

    // Horários da manhã (8:00 às 12:00)
    for (let hour = 8; hour < 12; hour++) {
      schedules.push({
        clinicId: clinic.id,
        professionalId: professional1.id,
        date: date,
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        available: Math.random() > 0.3, // 70% disponível
        type: 'WORK',
      })

      schedules.push({
        clinicId: clinic.id,
        professionalId: professional2.id,
        date: date,
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        available: Math.random() > 0.3,
        type: 'WORK',
      })
    }

    // Horários da tarde (14:00 às 18:00)
    for (let hour = 14; hour < 18; hour++) {
      schedules.push({
        clinicId: clinic.id,
        professionalId: professional1.id,
        date: date,
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        available: Math.random() > 0.3,
        type: 'WORK',
      })

      schedules.push({
        clinicId: clinic.id,
        professionalId: professional2.id,
        date: date,
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        available: Math.random() > 0.3,
        type: 'WORK',
      })
    }
  }

  await prisma.schedule.createMany({
    data: schedules,
  })

  // ================================
  // AGENDAMENTOS
  // ================================

  console.log('📋 Criando agendamentos...')

  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const dayAfterTomorrow = new Date()
  dayAfterTomorrow.setDate(today.getDate() + 2)

  const nextWeek = new Date()
  nextWeek.setDate(today.getDate() + 7)

  const appointment1 = await prisma.appointment.create({
    data: {
      clinicId: clinic.id,
      patientId: allPatients[0].id,
      professionalId: professional1.id,
      userId: clinicAdmin.id,
      roomId: room1.id,
      title: 'Consulta de Rotina',
      description: 'Limpeza e avaliação geral',
      date: tomorrow,
      startTime: '09:00',
      endTime: '10:00',
      duration: 60,
      type: 'Consulta',
      status: 'CONFIRMED',
      value: 150.00,
      notes: 'Paciente com histórico de hipertensão.',
    },
  })

  const appointment2 = await prisma.appointment.create({
    data: {
      clinicId: clinic.id,
      patientId: allPatients[1].id,
      professionalId: professional1.id,
      userId: clinicAdmin.id,
      roomId: room2.id,
      title: 'Avaliação Ortodôntica',
      description: 'Primeira consulta para tratamento ortodôntico',
      date: tomorrow,
      startTime: '14:00',
      endTime: '15:00',
      duration: 60,
      type: 'Avaliação',
      status: 'CONFIRMED',
      value: 200.00,
      notes: 'Paciente interessada em aparelho fixo.',
    },
  })

  const appointment3 = await prisma.appointment.create({
    data: {
      clinicId: clinic.id,
      patientId: allPatients[2].id,
      professionalId: professional2.id,
      userId: clinicAdmin.id,
      roomId: room3.id,
      title: 'Consulta para Implante',
      description: 'Avaliação para implante dentário',
      date: dayAfterTomorrow,
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      type: 'Consulta',
      status: 'CONFIRMED',
      value: 300.00,
      notes: 'Paciente diabético, necessita cuidados especiais.',
    },
  })

  const appointment4 = await prisma.appointment.create({
    data: {
      clinicId: clinic.id,
      patientId: allPatients[3].id,
      professionalId: professional3.id,
      userId: assistant.id,
      roomId: room1.id,
      title: 'Clareamento Dental',
      description: 'Sessão de clareamento a laser',
      date: nextWeek,
      startTime: '15:00',
      endTime: '16:30',
      duration: 90,
      type: 'Estético',
      status: 'PENDING',
      value: 400.00,
      notes: 'Primeira sessão de clareamento.',
    },
  })

  // ================================
  // TRATAMENTOS
  // ================================

  console.log('🦷 Criando tratamentos...')

  const treatment1 = await prisma.treatment.create({
    data: {
      clinicId: clinic.id,
      patientId: allPatients[0].id,
      appointmentId: appointment1.id,
      name: 'Limpeza Dental',
      description: 'Profilaxia e remoção de tártaro',
      status: 'PLANNED',
      startDate: tomorrow,
      value: 150.00,
      notes: 'Paciente com acúmulo moderado de tártaro.',
    },
  })

  const treatment2 = await prisma.treatment.create({
    data: {
      clinicId: clinic.id,
      patientId: allPatients[1].id,
      appointmentId: appointment2.id,
      name: 'Tratamento Ortodôntico',
      description: 'Aparelho fixo metálico',
      status: 'PLANNED',
      startDate: dayAfterTomorrow,
      value: 2500.00,
      notes: 'Tratamento estimado em 24 meses.',
    },
  })

  const treatment3 = await prisma.treatment.create({
    data: {
      clinicId: clinic.id,
      patientId: allPatients[2].id,
      appointmentId: appointment3.id,
      name: 'Implante Dentário',
      description: 'Implante unitário região posterior',
      tooth: '36',
      status: 'PLANNED',
      startDate: dayAfterTomorrow,
      value: 1800.00,
      notes: 'Implante na região do primeiro molar inferior esquerdo.',
    },
  })

  // ================================
  // DOCUMENTOS
  // ================================

  console.log('📄 Criando documentos...')

  await prisma.document.createMany({
    data: [
      {
        clinicId: clinic.id,
        patientId: allPatients[0].id,
        userId: dentist1.id,
        name: 'Radiografia Panorâmica - João Silva',
        description: 'Radiografia panorâmica realizada em consulta inicial',
        type: 'XRAY',
        url: '/documents/xray-joao-silva-001.jpg',
        size: 2048576,
        mimeType: 'image/jpeg',
        tags: ['radiografia', 'panoramica', 'inicial'],
      },
      {
        clinicId: clinic.id,
        patientId: allPatients[1].id,
        userId: dentist1.id,
        name: 'Foto Intraoral - Maria Costa',
        description: 'Fotografia intraoral para planejamento ortodôntico',
        type: 'PHOTO',
        url: '/documents/photo-maria-costa-001.jpg',
        size: 1536000,
        mimeType: 'image/jpeg',
        tags: ['foto', 'intraoral', 'ortodontia'],
      },
      {
        clinicId: clinic.id,
        patientId: allPatients[2].id,
        userId: dentist2.id,
        name: 'Tomografia - Pedro Lima',
        description: 'Tomografia computadorizada para planejamento de implante',
        type: 'XRAY',
        url: '/documents/ct-pedro-lima-001.dcm',
        size: 5242880,
        mimeType: 'application/dicom',
        tags: ['tomografia', 'implante', 'planejamento'],
      },
      {
        clinicId: clinic.id,
        patientId: allPatients[0].id,
        userId: clinicAdmin.id,
        name: 'Termo de Consentimento - Limpeza',
        description: 'Termo de consentimento para procedimento de limpeza',
        type: 'CONSENT',
        url: '/documents/consent-joao-silva-001.pdf',
        size: 204800,
        mimeType: 'application/pdf',
        tags: ['consentimento', 'limpeza'],
      }
    ],
  })

  // ================================
  // ODONTOGRAMAS
  // ================================

  console.log('🦷 Criando odontogramas...')

  const basicOdontogramData = {
    teeth: {
      // Dentes permanentes superiores
      '18': { conditions: [], treatments: [], notes: '' },
      '17': { conditions: [], treatments: [], notes: '' },
      '16': { conditions: ['carie'], treatments: ['restauracao'], notes: 'Cárie oclusal' },
      '15': { conditions: [], treatments: [], notes: '' },
      '14': { conditions: [], treatments: [], notes: '' },
      '13': { conditions: [], treatments: [], notes: '' },
      '12': { conditions: [], treatments: [], notes: '' },
      '11': { conditions: [], treatments: [], notes: '' },
      '21': { conditions: [], treatments: [], notes: '' },
      '22': { conditions: [], treatments: [], notes: '' },
      '23': { conditions: [], treatments: [], notes: '' },
      '24': { conditions: [], treatments: [], notes: '' },
      '25': { conditions: [], treatments: [], notes: '' },
      '26': { conditions: [], treatments: [], notes: '' },
      '27': { conditions: [], treatments: [], notes: '' },
      '28': { conditions: [], treatments: [], notes: '' },
      // Dentes permanentes inferiores
      '48': { conditions: [], treatments: [], notes: '' },
      '47': { conditions: [], treatments: [], notes: '' },
      '46': { conditions: [], treatments: [], notes: '' },
      '45': { conditions: [], treatments: [], notes: '' },
      '44': { conditions: [], treatments: [], notes: '' },
      '43': { conditions: [], treatments: [], notes: '' },
      '42': { conditions: [], treatments: [], notes: '' },
      '41': { conditions: [], treatments: [], notes: '' },
      '31': { conditions: [], treatments: [], notes: '' },
      '32': { conditions: [], treatments: [], notes: '' },
      '33': { conditions: [], treatments: [], notes: '' },
      '34': { conditions: [], treatments: [], notes: '' },
      '35': { conditions: [], treatments: [], notes: '' },
      '36': { conditions: ['ausente'], treatments: ['implante_planejado'], notes: 'Dente extraído, implante planejado' },
      '37': { conditions: [], treatments: [], notes: '' },
      '38': { conditions: [], treatments: [], notes: '' }
    },
    lastUpdated: new Date().toISOString(),
    version: '1.0'
  }

  await prisma.odontogram.createMany({
    data: [
      {
        clinicId: clinic.id,
        patientId: allPatients[0].id,
        data: basicOdontogramData,
        notes: 'Odontograma inicial - paciente com boa saúde bucal geral.',
      },
      {
        clinicId: clinic.id,
        patientId: allPatients[1].id,
        data: {
          ...basicOdontogramData,
          teeth: {
            ...basicOdontogramData.teeth,
            '11': { conditions: ['apinhamento'], treatments: ['ortodontia_planejada'], notes: 'Apinhamento anterior' },
            '21': { conditions: ['apinhamento'], treatments: ['ortodontia_planejada'], notes: 'Apinhamento anterior' },
            '31': { conditions: ['apinhamento'], treatments: ['ortodontia_planejada'], notes: 'Apinhamento anterior' },
            '41': { conditions: ['apinhamento'], treatments: ['ortodontia_planejada'], notes: 'Apinhamento anterior' }
          }
        },
        notes: 'Paciente candidata a tratamento ortodôntico - apinhamento anterior.',
      },
      {
        clinicId: clinic.id,
        patientId: allPatients[2].id,
        data: {
          ...basicOdontogramData,
          teeth: {
            ...basicOdontogramData.teeth,
            '36': { conditions: ['ausente'], treatments: ['implante_planejado'], notes: 'Extração antiga, osso adequado para implante' }
          }
        },
        notes: 'Paciente necessita implante na região do 36.',
      }
    ],
  })

  // ================================
  // NOTAS
  // ================================

  console.log('📝 Criando notas...')

  await prisma.note.createMany({
    data: [
      {
        userId: clinicAdmin.id,
        content: 'Reunião de equipe agendada para próxima segunda-feira às 8h para discutir novos protocolos.',
        type: 'GENERAL',
      },
      {
        userId: dentist1.id,
        content: 'Paciente João Silva apresentou sensibilidade após o procedimento. Acompanhar evolução.',
        type: 'PATIENT',
        entityId: allPatients[0].id,
        entityType: 'Patient',
      },
      {
        userId: dentist2.id,
        content: 'Lembrar de solicitar tomografia antes do próximo atendimento do Pedro Lima.',
        type: 'REMINDER',
        entityId: allPatients[2].id,
        entityType: 'Patient',
      },
      {
        userId: assistant.id,
        content: 'Confirmar agendamento da Maria Costa para próxima semana.',
        type: 'APPOINTMENT',
        entityId: appointment2.id,
        entityType: 'Appointment',
      }
    ],
  })

  // ================================
  // PAGAMENTOS
  // ================================

  console.log('💳 Criando pagamentos...')

  await prisma.payment.createMany({
    data: [
      {
        clinicId: clinic.id,
        subscriptionId: subscription.id,
        amount: 299.90,
        currency: 'BRL',
        status: 'PAID',
        description: 'Mensalidade Plano Premium - Janeiro 2024',
        paidAt: new Date('2024-01-05'),
      },
      {
        clinicId: clinic.id,
        subscriptionId: subscription.id,
        amount: 299.90,
        currency: 'BRL',
        status: 'PAID',
        description: 'Mensalidade Plano Premium - Fevereiro 2024',
        paidAt: new Date('2024-02-05'),
      },
      {
        clinicId: clinic.id,
        subscriptionId: subscription.id,
        amount: 299.90,
        currency: 'BRL',
        status: 'PENDING',
        description: 'Mensalidade Plano Premium - Março 2024',
      }
    ],
  })

  // ================================
  // LOGS DE AUDITORIA
  // ================================

  console.log('📊 Criando logs de auditoria...')

  await prisma.auditLog.createMany({
    data: [
      {
        userId: clinicAdmin.id,
        action: 'CREATE',
        entity: 'Patient',
        entityId: allPatients[0].id,
        newData: { name: 'João Silva Santos', email: 'joao.santos@email.com' },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        userId: dentist1.id,
        action: 'CREATE',
        entity: 'Appointment',
        entityId: appointment1.id,
        newData: { patientName: 'João Silva Santos', date: tomorrow.toISOString() },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        userId: assistant.id,
        action: 'UPDATE',
        entity: 'Appointment',
        entityId: appointment2.id,
        oldData: { status: 'PENDING' },
        newData: { status: 'CONFIRMED' },
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    ],
  })

  console.log('✅ Seed concluído com sucesso!')
  console.log(`
📊 Dados criados:
- 👥 5 usuários (1 super admin, 1 admin da clínica, 2 dentistas, 1 assistente)
- 🏥 1 clínica com assinatura Premium
- 👨‍⚕️3 profissionais dentistas
- 🏢 3 salas/consultórios
- 🤝 6 pacientes
- 📅 ${schedules.length} horários disponíveis (30 dias)
- 📋 4 agendamentos
- 🦷 3 tratamentos
- 📄 4 documentos
- 🦷 3 odontogramas
- 📝 4 notas
- 💳 3 pagamentos
- 📊 3 logs de auditoria
  `)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })