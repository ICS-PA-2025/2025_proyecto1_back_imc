# =========================
# Etapa 1: Build
# =========================
FROM node:18 AS build-stage

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación (Nest compila a JS en /dist)
RUN npm run build

# =========================
# Etapa 2: Producción
# =========================
FROM node:18-alpine AS production-stage

# Establecer directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios de la etapa de build
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm install --only=production

# Copiar los archivos compilados desde la etapa anterior
COPY --from=build-stage /app/dist ./dist

# Exponer el puerto (Nest usa 3000 por defecto)
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main.js"]
