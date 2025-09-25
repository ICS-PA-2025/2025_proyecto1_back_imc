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

## 🔧 Comandos útiles

```bash
# Parar servicios
docker compose down

# Ver logs
docker compose logs imc-backend
```
