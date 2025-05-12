# Usar una imagen oficial de Node.js como base
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./
COPY vite.config.js /usr/src/app/

# Instalar las dependencias
RUN npm install --legacy-peer-deps


# Copiar el resto del proyecto
COPY . . 

# Exponer el puerto que Vite usa por defecto
EXPOSE 3000
EXPOSE 5173
