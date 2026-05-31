# API de Usuarios y Autenticación

API REST con Express, MongoDB Atlas, JWT y documentación Swagger/OpenAPI.

## Instalación

```bash
npm install
```

## Configuración (.env)

Edita el archivo `.env` con tus datos reales de MongoDB Atlas:

```
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<nombre_bd>?retryWrites=true&w=majority
JWT_SECRET=una_clave_secreta_larga_y_segura
```

## Cómo obtener tu MONGO_URI en Atlas

1. Entra a [MongoDB Atlas](https://cloud.mongodb.com)
2. Ve a tu cluster → **Connect** → **Drivers**
3. Selecciona Node.js y copia la URI
4. Reemplaza `<password>` con tu contraseña

## Ejecutar

```bash
node index.js
```

## Endpoints

| Método | Ruta            | Descripción               | Auth     |
|--------|-----------------|---------------------------|----------|
| POST   | /auth/registro  | Registrar usuario         | No       |
| POST   | /auth/login     | Iniciar sesión            | No       |
| GET    | /auth/perfil    | Ver perfil propio         | JWT      |
| GET    | /usuarios       | Listar usuarios           | JWT      |
| GET    | /usuarios/:id   | Obtener usuario por ID    | JWT      |
| PUT    | /usuarios/:id   | Actualizar usuario        | JWT+Admin|
| DELETE | /usuarios/:id   | Desactivar usuario        | JWT+Admin|

## Documentación Swagger

Disponible en: `http://localhost:3000/api-docs`
