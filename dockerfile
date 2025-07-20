FROM node:20

WORKDIR /usr/src/app

# Copiar todos los archivos del proyecto (incluye src, vite.config.js, etc.)
COPY . .

# Instalar las dependencias incluyendo fontawesome
RUN npm install --legacy-peer-deps && \
    npm install @fortawesome/fontawesome-free --legacy-peer-deps

# Exponer puertos de desarrollo y producción
EXPOSE 3000
EXPOSE 5173

CMD ["npm", "run", "dev"] 