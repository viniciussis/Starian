# ============================================================
# Dockerfile — BFF NestJS (api)
# Build multi-estágio para imagem de produção enxuta
# ============================================================

# Estágio 1: Dependências
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY api/package.json ./api/
RUN npm ci --workspace=api --ignore-scripts

# Estágio 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -w api

# Estágio 3: Runner (imagem final leve)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiar apenas o necessário para rodar
COPY --from=builder /app/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY api/package.json .

EXPOSE 3000

CMD ["node", "dist/main"]
