const path = require('path');

const definicionSwagger = {
  openapi: '3.0.0',
  info: {
    title: 'API de Usuarios de ISRAEL',
    version: '1.0.0',
    description: `
## API REST de Gestión de Usuarios

Esta API permite realizar operaciones **CRUD** sobre usuarios y cuenta con autenticación mediante **JWT**.

### Flujo de uso recomendado:
1. Registra un usuario con \`POST /api/usuarios\`
2. Inicia sesión con \`POST /api/auth/login\` para obtener el **token JWT**
3. Usa el token en el botón **Authorize** (formato: \`Bearer <token>\`)
4. Ya puedes usar los endpoints protegidos

### Credenciales de prueba:
- **Email:** \`admin@api.com\`
- **Password:** \`admin123\`
    `,
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    },
    contact: {
      name: 'Soporte API',
      url: 'https://github.com'
    }
  },
  servers: [
    {
      url: 'https://api-usuarios.vercel.app',
      description: 'Servidor de Producción (Vercel)'
    },
    {
      url: 'http://localhost:3000',
      description: 'Servidor de Desarrollo Local'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa tu token JWT. Obtenlo en POST /api/auth/login'
      }
    },
    schemas: {
      Usuario: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
          },
          nombre: {
            type: 'string',
            example: 'Juan'
          },
          ap_paterno: {
            type: 'string',
            example: 'Pérez'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'juan@ejemplo.com'
          },
          rol: {
            type: 'string',
            enum: ['admin', 'usuario'],
            example: 'usuario'
          },
          activo: {
            type: 'boolean',
            example: true
          },
          fecha_registro: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z'
          }
        }
      },
      UsuarioInput: {
        type: 'object',
        required: ['nombre', 'ap_paterno', 'email', 'password'],
        properties: {
          nombre: {
            type: 'string',
            example: 'María'
          },
          ap_paterno: {
            type: 'string',
            example: 'González'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'maria@ejemplo.com'
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'mipassword123'
          },
          rol: {
            type: 'string',
            enum: ['admin', 'usuario'],
            example: 'usuario'
          }
        }
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'admin@api.com'
          },
          password: {
            type: 'string',
            example: 'admin123'
          }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: true },
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          },
          usuario: {
            $ref: '#/components/schemas/Usuario'
          }
        }
      },
      Respuesta: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: true },
          mensaje: { type: 'string', example: 'Operación exitosa' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: false },
          mensaje: { type: 'string', example: 'Error en la operación' }
        }
      }
    }
  }
};

module.exports = definicionSwagger;
