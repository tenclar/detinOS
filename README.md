# detinOS

Sistema de Gestão de Ordens de Serviço e Suporte de TI (detinOS).

## 📁 Estrutura do Projeto

O repositório é organizado em dois módulos principais:

```
detinOS/
├── backend/                  # API Fastify + TypeScript + Prisma
│   ├── src/                  # Rotas, controllers, regras de negócio
│   ├── prisma/               # Schema e migrações do banco PostgreSQL
│   ├── Dockerfile            # Container de produção do backend
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Aplicação SPA React + Vite
│   ├── src/                  # Componentes, páginas e layouts React
│   ├── public/               # Arquivos estáticos
│   ├── nginx.conf            # Configuração do Nginx (reverse proxy para API)
│   ├── Dockerfile            # Multi-stage build Nginx + SPA
│   ├── package.json
│   └── vite.config.js
├── .env.example              # Modelo de variáveis de ambiente
├── docker-compose.yml        # Orquestração completa (PostgreSQL, Redis, Backend, Frontend)
└── README.md
```

## 🚀 Como Executar

### 1. Com Docker Compose (Ambiente Completo)

Copie o arquivo de variáveis de ambiente:
```bash
cp .env.example .env
```

Inicie todos os serviços (Banco de Dados, Redis, Backend e Frontend):
```bash
docker compose up --build -d
```

- **Frontend / Aplicação:** [http://localhost](http://localhost)
- **Backend API:** [http://localhost:3000](http://localhost:3000) (ou via `/api` pelo Nginx)
- **PostgreSQL:** `localhost:5432`
- **Redis:** `localhost:6379`

---

### 2. Desenvolvimento Local

#### Backend:
```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```
