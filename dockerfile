# --- Fase de construcción ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# 1. Copia archivos esenciales primero (mejor caché de Docker)
COPY package.json package-lock.json vite.config.js jsconfig.json ecosystem.config.json ./
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
COPY --from=builder /usr/src/app/ecosystem.config.json ./ecosystem.config.json

# 2. Instala vite globalmente (ligero)
RUN npm install -g pm2@latest && \
    npm cache clean --force

# 3. Configuración para React
EXPOSE 4173
ENV __VITE_ADDITIONAL_PREVIEW_ALLOWED_HOSTS="softcalfut_front,www.softcalfut.duckdns.org"
ENV VITE_ADDITIONAL_PREVIEW_ALLOWED_HOSTS="softcalfut_front,www.softcalfut.duckdns.org"

# 4. Health check para React
HEALTHCHECK --interval=30s --timeout=5s \
CMD curl -f http://localhost:4173 || exit 1

# 5. Comando optimizado para React + Vite
CMD ["pm2-runtime", "start", "npm", "--", "run", "preview", "--", "--host", "softcalfut_front", "--port", "4173"]
#CMD ["pm2-runtime", "start", "ecosystem.config.json", "--", "--host", "softcalfut_front"]