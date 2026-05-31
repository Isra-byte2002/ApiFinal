const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarios = require('../data/usuarios');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: Autenticación
 *     description: Endpoints para login y registro de sesión
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión
 *     description: |
 *       Autentica al usuario y devuelve un **token JWT** válido por 24 horas.
 *
 *       ### Credenciales de prueba:
 *       - **Admin:** `admin@api.com` / `admin123`
 *       - **Usuario:** `juan@ejemplo.com` / `juan123`
 *
 *       #### **Curl**
 *       ```bash
 *       curl -X POST http://localhost:3000/api/auth/login \
 *         -H "Content-Type: application/json" \
 *         -d '{"email":"admin@api.com","password":"admin123"}'
 *       ```
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login exitoso. Retorna el token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales incorrectas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Faltan campos requeridos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, mensaje: 'Email y password son requeridos.' });
    }

    const usuario = usuarios.find(u => u.email === email && u.activo);
    if (!usuario) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      ok: true,
      token,
      usuario: usuarioSinPassword
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
});

/**
 * @swagger
 * /api/auth/verificar:
 *   get:
 *     tags:
 *       - Autenticación
 *     summary: Verificar token JWT
 *     description: Valida si el token JWT enviado es válido y devuelve los datos del usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token no proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Token inválido o expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const { verificarToken } = require('../middleware/auth');
router.get('/verificar', verificarToken, (req, res) => {
  const usuario = usuarios.find(u => u.id === req.usuario.id);
  if (!usuario) {
    return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
  }
  const { password: _, ...usuarioSinPassword } = usuario;
  res.json({ ok: true, usuario: usuarioSinPassword });
});

module.exports = router;
