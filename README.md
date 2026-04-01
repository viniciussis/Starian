# Starian — Microfrontend Orchestration & Semantic AI Search

O **Starian** é um portal mestre de arquitetura avançada que utiliza o padrão de **Microfrontends** para orquestrar múltiplos ecossistemas de forma modular e resiliente. O projeto foca em escalabilidade, utilizando tecnologias modernas de frontend e backend para entregar uma experiência de busca semântica baseada em inteligência artificial.

## 🏗️ Arquitetura do Sistema

O ecossistema é dividido em três pilares fundamentais, cada um operando em seu próprio ciclo de vida:

1.  **Orquestrador (Root Config)**: Desenvolvido com **Webpack 5** e **Single-SPA**, atua como o portal mestre, gerenciando o roteamento e a montagem dinâmica dos microfrontends.
2.  **Microfrontend People (spa-people)**: Aplicação **Vue 3** (Vite 8) modularizada que consome a API REST e oferece uma interface de gestão fluida.
3.  **Backend API (NestJS)**: Servidor enterprise-grade integrando **TypeORM** e **PgVector** para busca vetorial de alta performance.

## 🧠 Recursos de IA e Busca Semântica

O diferencial técnico do projeto reside na sua camada de **Inteligência Artificial**:
-   **Embeddings Vetoriais**: Utilizamos a **Google Gemini API** para converter descrições bio-bibliográficas em vetores matemáticos.
-   **Busca Híbrida**: O sistema realiza buscas semânticas (pelo significado das palavras) combinadas com buscas de texto convencionais no PostgreSQL, permitindo encontrar pessoas por "conceitos" e não apenas por palavras-chave exatas.

## 🛠️ Stack Tecnológica

-   **Frontend**: Vue 3 (Composition API), Vite, Single-SPA, Tailwind CSS.
-   **Backend**: NestJS, TypeScript, TypeORM, PostgreSQL + PgVector.
-   **IA**: Gemini Pro / Flash (Modelos de Embedding).
-   **Infraestrutura**: Docker & Docker Compose, Nginx.

## 🚀 Como Executar

### Pré-requisitos
-   Node.js 20+
-   Docker e Docker Compose
-   Chave de API do Google Gemini (GEMINI_API_KEY)

### Configuração de Ambiente
1.  Clone o repositório.
2.  Crie um arquivo `.env` na raiz (e na pasta `api/`) seguindo o modelo `.env.example`:
    ```env
    DATABASE_URL=postgres://user:pass@localhost:5432/starian
    GEMINI_API_KEY=sua_chave_aqui
    ```

### Rodando via Docker (Recomendado)
```bash
docker-compose up -d --build
```
Acesse o portal em: [http://localhost:9000](http://localhost:9000)

### Rodando em Desenvolvimento (Local)
1.  Suba o banco de dados: `docker-compose up -d db`
2.  Instale as dependências: `npm install`
3.  Inicie a API: `npm run start:dev -w api`
4.  Inicie o Microfrontend: `npm run dev -w spa-people`
5.  Inicie o Orquestrador: `npm run start -w root-config`

---

## 💎 Qualidade de Código e Padrões
-   **S.O.L.I.D**: Princípios aplicados nos serviços NestJS.
-   **Repository Pattern**: Isolação de dados na API.
-   **Componentização Modular**: UI reutilizável no Vue 3.
-   **Clean Architecture**: Divisão clara de responsabilidades entre orquestração, lógica e dados.

---
Desenvolvido com maestria técnica focado em escalabilidade e modernidade.🌌🛰️
