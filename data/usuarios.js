const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Base de datos en memoria (funciona perfectamente en Vercel)
const usuarios = [
  {
    id: uuidv4(),
    nombre: 'Admin',
    ap_paterno: 'Sistema',
    email: 'admin@api.com',
    password: bcrypt.hashSync('admin123', 10),
    rol: 'admin',
    activo: true,
    fecha_registro: new Date().toISOString()
  },
  {
    id: uuidv4(),
    nombre: 'Juan',
    ap_paterno: 'Pérez',
    email: 'juan@ejemplo.com',
    password: bcrypt.hashSync('juan123', 10),
    rol: 'usuario',
    activo: true,
    fecha_registro: new Date().toISOString()
  }
];

module.exports = usuarios;
