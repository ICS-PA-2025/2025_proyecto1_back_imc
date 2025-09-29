# IMC Backend Core 🏥

Backend del sistema de cálculo de IMC desarrollado con NestJS y MongoDB.

## 🚀 Ejecutar con Docker Compose

### Prerequisitos
- Docker y Docker Compose instalados
- El servicio de autenticación corriendo (puerto 3001)

### Pasos:

1. **Crear archivo de configuración**
```bash
cp .env.example .env
```

2. **Configurar variables en .env**
Editar el archivo `.env` con las variables de MongoDB detalladas arriba

3. **Ejecutar**
```bash
docker compose up -d
```

**✅ Backend disponible en:** `http://localhost:3000`
**✅ MongoDB disponible en:** `mongodb://localhost:27017`

## � Variables de entorno requeridas

Las siguientes variables deben configurarse en el archivo `.env`:

### MongoDB Configuration
```bash
MONGO_URI=mongodb://localhost:27017/imc_db
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=imc_db
MONGO_TEST_DATABASE=imc_test
```

### Application Settings
```bash
PORT=3000
AUTH_API_URL=http://localhost:3001
```

### Configuración alternativa: MongoDB Atlas
Para usar MongoDB Atlas en la nube, descomenta y configura:
```bash
# MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/imc_db?retryWrites=true&w=majority
```

## 🧪 Testing

### Ejecutar tests dentro del contenedor

```bash
# Todos los tests
docker exec -it imc-service npm test

# Tests unitarios específicos
docker exec -it imc-service npm run test:unit

# Tests de integración
docker exec -it imc-service npm run test:int

# Tests end-to-end
docker exec -it imc-service npm run test:e2e

# Coverage report
docker exec -it imc-service npm run test:cov
```

## 🔧 Comandos útiles

```bash
# Parar servicios
docker compose down

# Parar y limpiar volúmenes (resetea MongoDB)
docker compose down -v

# Ver logs
docker compose logs imc-service
docker compose logs mongodb-imc

# Reconstruir si hay problemas
docker compose build --no-cache
docker compose up -d

# Acceder al contenedor del backend
docker exec -it imc-service bash

# Acceder a MongoDB
docker exec -it mongodb-imc mongosh imc_db

# Ver bases de datos en MongoDB
docker exec -it mongodb-imc mongosh --eval "show dbs"

# Ver colecciones en la BD
docker exec -it mongodb-imc mongosh imc_db --eval "show collections"
```
