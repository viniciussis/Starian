# Starian AI Force — Gestão Stelar de Talentos

Bem-vindo ao **Starian AI Force**, uma plataforma de alta performance para gestão de talentos, integrada com Busca Semântica via IA (Google Gemini) e arquitetura de Microfrontends.

---

## 🚀 Guia Rápido: Como Rodar (Modo Standalone)

Se você está em ambiente Windows ou quer apenas testar as funcionalidades sem a complexidade do orquestrador, siga estes passos para rodar o app diretamente na porta **8080**.

### 1. Requisitos
- Node.js 20+
- Docker Desktop (para o Banco de Dados)
- Chave de API do Gemini (`GEMINI_API_KEY`)

### 2. Configuração do Ambiente
Crie um arquivo `.env` na pasta `api/` com os seguintes dados:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=starian_db
GEMINI_API_KEY=SUA_CHAVE_AQUI
PORT=3000
```

### 3. Subir o Banco de Dados
Na raiz do projeto, suba apenas o serviço de banco:
```bash
docker-compose up -d db
```

### 4. Rodar o Backend (API)
Em um novo terminal, na raiz do projeto:
```bash
npm install
npm run start:dev -w api
```

### 5. Rodar o Frontend (SPA)
Em outro terminal, na raiz do projeto:
```bash
npm run dev -w spa-people
```

### 6. Acessar a Aplicação
Abra o seu navegador em:
👉 **http://localhost:8080**

---

## 🛠️ Tecnologias Utilizadas
- **Frontend**: Vue 3 (Composition API), Vite, Tailwind CSS v4, Single-SPA.
- **Backend**: NestJS, TypeORM, PostgreSQL.
- **IA**: Google Gemini Pro (Embeddings) e Busca Vetorial via `pgvector`.
- **Qualidade**: Vitest, Jest, ESLint, Prettier.

---

## 🧪 Testes
Para garantir a integridade da lógica de negócios e da IA, rode:
```bash
npm run test -w api
```

## 🐳 Docker (Produção)
Para rodar a arquitetura completa em containers:
1. Pare todos os terminais locais.
2. Rode `docker-compose up --build`.
3. Acesse via porta `9000` (Orquestrador) ou `8080` (Standalone).
