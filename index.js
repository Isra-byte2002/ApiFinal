const express = require('express');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const definicionSwagger = require('./data/swagger.def');

const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS para que el maestro acceda desde cualquier origen
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Configuracion Swagger (siguiendo estructura del PDF - paso 5)
const opcionesSwaggerJsDoc = {
  definition: definicionSwagger,
  apis: [
    path.join(__dirname, './routes/*.routes.js')
  ]
};

// Paso 3 del PDF: crear objeto OpenApi y montar middleware
const swaggerDocs = swaggerJsDoc(opcionesSwaggerJsDoc);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, {
  customSiteTitle: 'API Usuarios - Documentacion',
  swaggerOptions: {
    persistAuthorization: true
  }
}));

// Recomendacion del PDF: ruta que regresa el objeto OpenApi en JSON
app.get('/api-spec', (req, res) => {
  res.json(swaggerDocs);
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta raiz
app.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'API de Usuarios funcionando correctamente',
    documentacion: '/api-docs',
    especificacion: '/api-spec',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        verificar: 'GET /api/auth/verificar'
      },
      usuarios: {
        listar: 'GET /api/usuarios',
        obtener: 'GET /api/usuarios/:id',
        crear: 'POST /api/usuarios',
        actualizar: 'PUT /api/usuarios/:id',
        eliminar: 'DELETE /api/usuarios/:id'
      }
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: 'Ruta ' + req.originalUrl + ' no encontrada.' });
});

app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
  console.log('Documentacion Swagger: http://localhost:' + PORT + '/api-docs');
  console.log('Especificacion OpenAPI: http://localhost:' + PORT + '/api-spec');
});

module.exports = app;
