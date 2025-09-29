# IMC Backend Core 🏥

Back## 📋 Variables de entorno requeridasnd del sistema de cálculo de IMC desarrollado con NestJS y PostgreSQL.

## 🚀 Ejecutar con Docker Compose

### Prerequisitos
- Docker y Docker Compose instalados
- El servicio de autenticación corriendo (puerto 3001)

### Pasos:

1. **Crear archivo de configuración**
```bash
cp .env.dist .env
```

2. **Configurar variables en .env**
Editar el archivo `.env` con las variables detalladas en `.env.dist`

3. **Ejecutar**
```bash
docker compose up -d
```

**✅ Backend disponible en:** `http://localhost:3000`

## 📨 Variables de entorno requeridas

Revisar `.env.dist` para las variables necesarias:
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`: Configuración de PostgreSQL
- `AUTH_API_URL`: URL del servicio de autenticación

## 🧪 Testing

### Ejecutar tests dentro del contenedor

```bash
# Todos los tests
docker exec -it imc-backend npm test

# Tests unitarios específicos
docker exec -it imc-backend npm run test:unit

# Tests de integración
docker exec -it imc-backend npm run test:int

# Tests end-to-end
docker exec -it imc-backend npm run test:e2e

# Coverage report
docker exec -it imc-backend npm run test:cov
```

## 🔧 Comandos útiles

```bash
# Parar servicios
docker compose down

# Parar y limpiar volúmenes (resetea BD)
docker compose down -v

# Ver logs
docker compose logs imc-backend

# Reconstruir si hay problemas
docker compose build --no-cache
docker compose up -d

# Acceder al contenedor
docker exec -it imc-backend bash

# Acceder a PostgreSQL
docker exec -it postgres-imc psql -U neondb_owner -d imc_db
```
