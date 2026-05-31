const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /auth/registro
const registro = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ ok: false, mensaje: 'El email ya está registrado' });
    }

    const usuario = await Usuario.create({ nombre, email, password, rol });

    res.status(201).json({
      ok: true,
      token: generarToken(usuario._id),
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario || !(await usuario.compararPassword(password))) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
    }

    if (!usuario.activo) {
      return res.status(403).json({ ok: false, mensaje: 'Cuenta desactivada' });
    }

    res.json({
      ok: true,
      token: generarToken(usuario._id),
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// GET /auth/perfil  (ruta protegida)
const perfil = async (req, res) => {
  res.json({ ok: true, usuario: req.usuario });
};

module.exports = { registro, login, perfil };
