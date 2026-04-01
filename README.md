# Starian AI Force — Gestão de Profissionais com Busca Vetorial

> **Desafio Técnico Starian (Projuris Acordos)** — Sistema de gestão de profissionais com arquitetura de **Microfrontends**, BFF em **NestJS** e busca semântica via **IA Vetorial (Google Gemini)**.

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│  Root Config (Single-SPA) — Porta 9000                          │
│  Orquestrador de Microfrontends via SystemJS + Import Maps      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  spa-people (Vue 3 + Vite) — Porta 8080                  │   │
│  │  Microfrontend de Gestão de Profissionais                 │   │
│  └────────────────────────┬─────────────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────────┘
                            │ REST (Axios)
                ┌───────────▼──────────────┐
                │  BFF NestJS — Porta 3000  │
                │  CRUD + Busca Semântica   │
                └───────────┬──────────────┘
                            │
              ┌─────────────▼─────────────────┐
              │  PostgreSQL + pgvector          │
              │  (Docker Compose — Porta 5432) │
              └────────────────────────────────┘
```

### Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Orquestrador** | Single-SPA 6 + Webpack 5 + SystemJS |
| **Microfrontend** | Vue 3 (Composition API + `<script setup>`) + Vite 8 |
| **Estado** | Pinia |
| **Estilo** | Tailwind CSS v4 (tema Dark — Starian Brand) |
| **BFF** | NestJS + TypeORM |
| **Banco de Dados** | PostgreSQL 15 + extensão `pgvector` |
| **IA** | Google Gemini API (`gemini-embedding-001`) |
| **Infra** | Docker Compose |

---

## ✨ Funcionalidades

### CRUD de Profissionais
- **Criar** profissional com validação completa de CPF (algoritmo manual), e-mail, telefone com máscara e data de nascimento.
- **Listar** todos os profissionais cadastrados.
- **Editar** e **remover** profissionais.
- Respostas padronizadas globalmente via `TransformInterceptor`.

### Busca Semântica Híbrida com IA
- A `bio` de cada profissional é convertida em um **vetor de embedding** pelo Gemini (`text-embedding-001`) e armazenada no PostgreSQL via `pgvector`.
- A busca usa **similaridade de cosseno** (`<=>`) para encontrar profissionais por conceito, não só por palavra-chave.
- **Re-ranking manual**: resultados com o termo exato na bio ou nome são promovidos ao topo, garantindo precisão cirúrgica.
- **Fallback resiliente**: se `GEMINI_API_KEY` estiver ausente ou inválida, a busca degrada graciosamente para `ILIKE` (texto convencional). O CRUD nunca é afetado.

### Design System Starian
- Tema **Ultra Dark** baseado na paleta oficial da Starian (`#000000`, `#0C0C0C`, `#0C2232`).
- Banner Hero e logotipo oficiais integrados.
- Glassmorphism, micro-animações e `cursor-pointer` em todos os elementos interativos.
- Validação de formulário reativa com erros por campo.

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 20+, NPM 10+
- Docker e Docker Compose

### 1. Clone e instale as dependências

```bash
git clone <repo-url>
cd starian
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` na raiz do projeto:

```env
# Banco de Dados (Docker)
DB_HOST=localhost
DB_PORT=5432
DB_USER=starian
DB_PASSWORD=starian123
DB_NAME=starian_db

# Google Gemini (opcional — sem ele, a busca usa texto puro)
GEMINI_API_KEY=YOUR_KEY_HERE
```

### 3. Suba o banco de dados

```bash
docker-compose up -d
```

### 4. Inicie os servidores (3 terminais)

**Terminal 1 — Backend (BFF NestJS):**
```bash
npm run start:dev -w api
```
> API disponível em `http://localhost:3000`

**Terminal 2 — Microfrontend (Vue 3):**
```bash
npm run dev -w spa-people
```
> App disponível em `http://localhost:8080`

**Terminal 3 — Orquestrador (Root Config):** *(opcional)*
```bash
npm run start -w root-config
```
> Portal em `http://localhost:9000`

---

## 🧠 Decisões Técnicas

### Por que `pgvector`?
Armazenar o vetor diretamente no PostgreSQL evita uma dependência de banco de dados vetorial externo (ex: Pinecone, Weaviate). Para o escopo deste desafio, o `pgvector` oferece a operação de **similaridade de cosseno** (`<=>`) nativamente, com queries expressivas via TypeORM `createQueryBuilder`.

### Por que Busca Híbrida?
A busca puramente semântica pode retornar resultados imprecisos quando o usuário busca por termos exatos (e.g., "Advogado"). O re-ranking manual combina o poder analógico do embedding (entende sinônimos e contexto) com a precisão cirúrgica do matching de texto.

### Por que Microfrontends?
A arquitetura Single-SPA permite que diferentes times desenvolvam e façam deploy de partes da aplicação de forma independente. O `root-config` age como orquestrador, carregando o `spa-people` via **Import Maps** e **SystemJS** sem acoplamento de build.

### Por que Vue 3 com Composition API?
A Composition API com `<script setup>` favorece a coesão de lógica de negócio (estado + efeitos + computed no mesmo lugar), melhor reusabilidade via composables (`useMasks`) e tipagem TypeScript mais natural do que o Options API.

---

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/people` | Cria um novo profissional |
| `GET` | `/people` | Lista todos os profissionais |
| `GET` | `/people/:id` | Busca profissional por ID |
| `PATCH` | `/people/:id` | Atualiza um profissional |
| `DELETE` | `/people/:id` | Remove um profissional |
| `GET` | `/people/semantic-search?q=` | Busca semântica/híbrida |

### Exemplo de criação:

```json
POST /people
{
  "fullName": "Ada Lovelace",
  "email": "ada@starian.dev",
  "cpf": "52998224725",
  "birthDate": "1990-12-10",
  "phone": "11999999999",
  "bio": "Engenheira de software com foco em IA e algoritmos matemáticos."
}
```

---

## 🧪 Testes

```bash
# Testes unitários do BFF
npm run test -w api

# Testes com cobertura
npm run test:cov -w api
```

Cobertura inclui: `PeopleService` (CRUD, conflito de duplicata, busca semântica e fallback), validação de CPF e `AiService` (mock de embedding).

---

## 📁 Estrutura do Monorepo

```
starian/
├── api/                    # BFF NestJS
│   └── src/
│       ├── ai/             # Módulo de IA (Gemini)
│       ├── common/         # Interceptors e Filters globais
│       └── people/         # Módulo principal (Entity, DTO, Service, Controller)
├── spa-people/             # Microfrontend Vue 3
│   └── src/
│       ├── components/     # Componentes UI (PersonForm, PersonList, BaseInput...)
│       ├── composables/    # useMasks, etc.
│       └── stores/         # Pinia (people.store.ts)
├── root-config/            # Orquestrador Single-SPA
│   └── src/
│       ├── index.ejs       # Template HTML com Import Maps
│       └── starian-root-config.ts  # Registro dos Microfrontends
├── docker-compose.yml      # PostgreSQL + pgvector
└── .env                    # Variáveis de ambiente
```
