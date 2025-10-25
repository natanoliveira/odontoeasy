# Seed do Banco de Dados - DentalSaaS

Este arquivo contém instruções para popular o banco de dados com dados de teste para a aplicação DentalSaaS.

## 📋 Pré-requisitos

1. Banco de dados PostgreSQL configurado
2. Variável de ambiente `DATABASE_URL` definida
3. Dependências instaladas (`npm install`)
4. Migrations executadas (`npm run db:migrate`)

## 🌱 Executando o Seed

Para popular o banco de dados com dados de teste, execute:

```bash
npm run db:seed
```

## 📊 Dados Incluídos no Seed

### 👥 Usuários (5)
- **Super Admin**: admin@denticare.com.br
- **Admin da Clínica**: admin@clinicasorriso.com.br (Dr. Carlos Roberto Silva)
- **Dentista 1**: dra.ana@clinicasorriso.com.br (Dra. Ana Paula Santos - Ortodontia)
- **Dentista 2**: dr.ricardo@clinicasorriso.com.br (Dr. Ricardo Mendes - Implantodontia)
- **Assistente**: maria@clinicasorriso.com.br (Maria Fernanda Costa)

### 🏥 Clínica
- **Nome**: Clínica Sorriso Perfeito
- **Localização**: São Paulo, SP
- **Plano**: Premium (ativo)
- **Configurações**: Horário comercial, múltiplos profissionais

### 👨‍⚕️ Profissionais (3)
- Dra. Ana Paula Santos (Ortodontia)
- Dr. Ricardo Mendes (Implantodontia)
- Dr. Carlos Roberto Silva (Clínica Geral)

### 🏢 Salas/Consultórios (3)
- Consultório 1 (Consultas gerais)
- Consultório 2 (Ortodontia e estética)
- Sala de Cirurgia (Procedimentos cirúrgicos)

### 🤝 Pacientes (6)
Pacientes diversos com diferentes perfis:
- João Silva Santos (Hipertenso)
- Maria Oliveira Costa (Interessada em ortodontia)
- Pedro Rodrigues Lima (Diabético, necessita implante)
- Ana Carolina Ferreira (Interessada em clareamento)
- Roberto Almeida Souza (Refluxo gastroesofágico)
- Fernanda Ribeiro Silva (Paciente ansiosa)

### 📅 Horários
- 30 dias de horários disponíveis
- Horários de segunda a sexta
- Manhã: 8h às 12h
- Tarde: 14h às 18h
- 70% dos horários disponíveis

### 📋 Agendamentos (4)
- Consultas de rotina
- Avaliação ortodôntica
- Consulta para implante
- Sessão de clareamento

### 🦷 Tratamentos (3)
- Limpeza dental
- Tratamento ortodôntico
- Implante dentário

### 📄 Documentos (4)
- Radiografias
- Fotos intraorais
- Tomografias
- Termos de consentimento

### 🦷 Odontogramas (3)
- Odontogramas completos com condições dentárias
- Tratamentos planejados
- Histórico de procedimentos

### 📝 Notas (4)
- Notas gerais da clínica
- Observações de pacientes
- Lembretes
- Notas de agendamentos

### 💳 Pagamentos (3)
- Histórico de pagamentos da assinatura
- Status variados (pago/pendente)

### 📊 Logs de Auditoria (3)
- Registros de criação de pacientes
- Criação de agendamentos
- Atualizações de status

## 🛠️ Comandos Úteis

```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrations
npm run db:migrate

# Popular banco com dados de teste
npm run db:seed

# Resetar banco (cuidado em produção!)
npm run db:reset

# Abrir Prisma Studio
npm run db:studio

# Sincronizar schema sem migrations (desenvolvimento)
npm run db:push
```

## ⚠️ Importante

- **Desenvolvimento apenas**: Este seed é destinado apenas para ambientes de desenvolvimento e teste
- **Não execute em produção**: Os dados são fictícios e incluem uma limpeza completa do banco
- **Backup**: Sempre faça backup antes de executar operações de seed em dados importantes
- **Senhas**: As senhas dos usuários não são definidas no seed - será necessário implementar um sistema de recuperação/definição de senhas

## 🔧 Customização

Para personalizar os dados do seed:

1. Edite o arquivo `prisma/seed.ts`
2. Modifique os dados conforme necessário
3. Execute `npm run db:seed` novamente

## 📱 Dados de Teste Realísticos

Todos os dados foram criados para simular uma clínica odontológica real brasileira:

- **CPFs**: Fictícios mas no formato correto
- **Endereços**: Endereços reais de São Paulo
- **Especialidades**: Especialidades odontológicas reconhecidas
- **CROs**: Números fictícios mas no formato correto
- **Tratamentos**: Procedimentos odontológicos comuns
- **Valores**: Preços realísticos do mercado brasileiro

## 🎯 Próximos Passos

Após executar o seed, você pode:

1. Fazer login com qualquer usuário criado
2. Navegar pelas diferentes funcionalidades
3. Testar agendamentos e tratamentos
4. Verificar os relatórios e documentos
5. Experimentar o sistema de odontogramas