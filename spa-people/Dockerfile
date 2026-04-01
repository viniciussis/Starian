# ============================================================
# Dockerfile — Microfrontend Vue 3 (spa-people)
# Build multi-estágio: Vite build + Nginx serving
# ============================================================

# Estágio 1: Dependências
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY spa-people/package.json ./spa-people/
RUN npm ci --workspace=spa-people --ignore-scripts

# Estágio 2: Build com Vite
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY spa-people/ ./spa-people/
WORKDIR /app/spa-people
RUN npm run build

# Estágio 3: Servidor estático com Nginx (leve e performático)
FROM nginx:alpine AS runner

# Remove configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Configuração customizada para SPA (redireciona tudo para index.html)
COPY spa-people/nginx.conf /etc/nginx/conf.d/default.conf

# Copia os assets buildados
COPY --from=builder /app/spa-people/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
