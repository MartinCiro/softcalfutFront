# --- Fase de construcción ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# 1. Copia archivos esenciales primero (mejor caché de Docker)
COPY package.json package-lock.json vite.config.js jsconfig.json ./
COPY public ./public
COPY src ./src
COPY index.html .

# 2. Instala dependencias (incluyendo FontAwesome)
RUN npm install --legacy-peer-deps && \
    npm install @fortawesome/fontawesome-free --legacy-peer-deps

# 3. Build de producción de React
RUN npm run build

# --- Fase de producción ---
FROM node:20-alpine

WORKDIR /usr/src/app

# 1. Copia solo lo necesario desde el builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json .

# 2. Instala vite globalmente (ligero)
RUN npm install -g vite && \
    npm cache clean --force

# 3. Configuración para React
ENV NODE_ENV=production
EXPOSE 5173

# 4. Health check para React
HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl -f http://localhost:5173 || exit 1

# 5. Comando optimizado para React + Vite
CMD ["vite", "preview", "--host", "--port", "5173"]

# --- Dockerfile para softcalfut_front ---