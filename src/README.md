# DentalSaaS

Sistema completo para gestão de clínicas odontológicas desenvolvido em React + TypeScript + Vite.

## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 3. Configurar banco de dados (opcional para frontend)
npx prisma generate

# 4. Executar em desenvolvimento
npm run dev
```

A aplicação estará disponível em: `http://localhost:3000`

## 📋 Status Atual

✅ **Frontend Completo**
- Interface moderna com Shadcn/UI
- Sistema de autenticação (UI)
- Gestão de pacientes, agendamentos, profissionais
- Odontograma interativo
- Dashboard com estatísticas
- Modo escuro/claro

🔧 **Backend em Desenvolvimento**
- Schema Prisma completo
- Serviços de API estruturados
- Integração com Stripe preparada
- Sistema de uploads configurado

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** + **Shadcn/UI**
- **Prisma** (ORM)
- **React Hook Form**
- **Recharts** (gráficos)
- **Lucide React** (ícones)

## 📁 Estrutura

```
/
├── components/          # Componentes React
├── hooks/              # Hooks customizados
├── lib/                # Utilitários e configurações
├── services/           # Serviços de API
├── styles/             # Estilos globais (Tailwind)
├── prisma/             # Schema do banco de dados
└── App.tsx             # Componente principal
```

## 📚 Documentação Completa

Para instruções detalhadas de instalação, configuração e deploy, consulte o arquivo [SETUP.md](SETUP.md).

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ para profissionais da odontologia**