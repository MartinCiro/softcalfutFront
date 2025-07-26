# --- Fase de construcción ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# 1. Copia archivos esenciales primero (mejor caché de Docker)
COPY package.json package-lock.json vite.config.js jsconfig.json ecosystem.config.json webpack.config.cjs server.cjs ./
COPY public ./public
COPY src ./src
COPY index.html .

ENV VITE_API_URL=https://api.softcalfut.duckdns.org 

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
COPY --from=builder /usr/src/app/ecosystem.config.json .
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY --from=builder /usr/src/app/server.cjs .
COPY --from=builder /usr/src/app/webpack.config.cjs .

# 2. Instala vite globalmente (ligero)
RUN npm install -g pm2@latest && \
    npm cache clean --force

EXPOSE 4173
CMD ["pm2-runtime", "start", "ecosystem.config.json"]