const Usuario = require('../models/Usuario');

// GET /usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ activo: true }).select('-__v');
    res.json({ ok: true, total: usuarios.length, usuarios });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// GET /usuarios/:id
const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    }
    res.json({ ok: true, usuario });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// PUT /usuarios/:id
const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, email, rol } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, email, rol },
      { new: true, runValidators: true }
    );
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    }
    res.json({ ok: true, usuario });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// DELETE /usuarios/:id  (soft delete)
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    }
    res.json({ ok: true, mensaje: 'Usuario desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

module.exports = { obtenerUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario };
