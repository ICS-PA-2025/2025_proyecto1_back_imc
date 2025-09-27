-- Crear la base de datos de test si no existe
CREATE DATABASE test;

-- Conectar a la base de datos principal para crear la tabla de usuarios
\c imc_db;

-- Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario de prueba con UUID fijo para los tests
INSERT INTO users (id, email, password) 
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'test@example.com', 'hashed_password')
ON CONFLICT (id) DO NOTHING;

-- También crear el mismo usuario en la base de datos de test
\c test;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, email, password) 
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'test@example.com', 'hashed_password')
ON CONFLICT (id) DO NOTHING;