const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const definicionSwagger = {
  openapi: '3.0.0',
  info: {
    title: 'API de Usuarios y Autenticación',
    version: '1.0.0',
    description: `
## API REST de Usuarios con Autenticación JWT

Permite registrar usuarios, iniciar sesión y gestionar el catálogo de usuarios.

### Autenticación
Usa **JWT Bearer Token**. Después de hacer login, copia el token y úsalo en el botón **Authorize 🔒**.

### Tecnologías
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT + Bcrypt
    `,
    contact: {
      name: 'Soporte API',
      url: 'https://github.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: 'Servidor de Desarrollo',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const opcionesSwagger = {
  definition: definicionSwagger,
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerDocs = swaggerJsDoc(opcionesSwagger);

const configurarSwagger = (app) => {
  // Ruta para la UI de documentación
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  // Ruta que devuelve el objeto OpenAPI en JSON
  app.get('/api-spec', (req, res) => {
    res.json(swaggerDocs);
  });
  console.log('📄 Documentación Swagger disponible en http://localhost:3000/api-docs');
};

module.exports = configurarSwagger;
