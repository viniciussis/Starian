# ============================================================
# Dockerfile — Orquestrador Single-SPA (root-config)
# Build multi-estágio: Webpack build + Nginx serving
# ============================================================

# Estágio 1: Dependências
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY root-config/package.json ./root-config/
RUN npm ci --workspace=root-config --ignore-scripts

# Estágio 2: Build com Webpack
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY root-config/ ./root-config/
WORKDIR /app/root-config
RUN npm run build

# Estágio 3: Servidor estático com Nginx (Porta 9000)
FROM nginx:alpine AS runner

# Remove configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Configuração customizada para o Orquestrador
COPY root-config/nginx.conf /etc/nginx/conf.d/default.conf

# Copia os assets buildados (index.html e starian-root-config.js)
COPY --from=builder /app/root-config/dist /usr/share/nginx/html

EXPOSE 9000

CMD ["nginx", "-g", "daemon off;"]
