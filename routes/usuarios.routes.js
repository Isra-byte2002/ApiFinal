const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const usuarios = require('../data/usuarios');
const { verificarToken } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Operaciones CRUD sobre usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         nombre:
 *           type: string
 *           example: "Juan"
 *         ap_paterno:
 *           type: string
 *           example: "Pérez"
 *         email:
 *           type: string
 *           format: email
 *           example: "juan@ejemplo.com"
 *         rol:
 *           type: string
 *           enum: [admin, usuario]
 *           example: "usuario"
 *         activo:
 *           type: boolean
 *           example: true
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener todos los usuarios
 *     description: |
 *       Devuelve un arreglo con todos los usuarios activos del sistema.
 *       **Requiere autenticación JWT.**
 *
 *       #### **Curl**
 *       ```bash
 *       curl -X GET http://localhost:3000/api/usuarios \
 *         -H "Authorization: Bearer <tu_token>"
 *       ```
 *       #### **JavaScript**
 *       ```js
 *       fetch('/api/usuarios', {
 *         headers: { 'Authorization': 'Bearer ' + token }
 *       }).then(r => r.json()).then(console.log);
 *       ```
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Arreglo de usuarios obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token no proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', verificarToken, (req, res) => {
  const lista = usuarios
    .filter(u => u.activo)
    .map(({ password, ...u }) => u);

  res.json({ ok: true, total: lista.length, usuarios: lista });
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener un usuario por ID
 *     description: Devuelve los datos de un usuario específico. **Requiere autenticación JWT.**
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID del usuario a consultar
 *         schema:
 *           type: string
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *     responses:
 *       200:
 *         description: Usuario encontrado.
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
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no proporcionado.
 */
router.get('/:id', verificarToken, (req, res) => {
  const usuario = usuarios.find(u => u.id === req.params.id && u.activo);
  if (!usuario) {
    return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
  }
  const { password, ...usuarioSinPassword } = usuario;
  res.json({ ok: true, usuario: usuarioSinPassword });
});

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Registrar un nuevo usuario
 *     description: |
 *       Crea un nuevo usuario en el sistema. Este endpoint es **público** (no requiere token).
 *
 *       #### **Curl**
 *       ```bash
 *       curl -X POST http://localhost:3000/api/usuarios \
 *         -H "Content-Type: application/json" \
 *         -d '{"nombre":"María","ap_paterno":"López","email":"maria@test.com","password":"pass123"}'
 *       ```
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario registrado exitosamente."
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos incompletos o email ya registrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, ap_paterno, email, password, rol } = req.body;

    if (!nombre || !ap_paterno || !email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Los campos nombre, ap_paterno, email y password son requeridos.'
      });
    }

    const existe = usuarios.find(u => u.email === email);
    if (existe) {
      return res.status(400).json({ ok: false, mensaje: 'El email ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = {
      id: uuidv4(),
      nombre,
      ap_paterno,
      email,
      password: hashedPassword,
      rol: rol || 'usuario',
      activo: true,
      fecha_registro: new Date().toISOString()
    };

    usuarios.push(nuevoUsuario);

    const { password: _, ...usuarioSinPassword } = nuevoUsuario;
    res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado exitosamente.',
      usuario: usuarioSinPassword
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     tags:
 *       - Usuarios
 *     summary: Actualizar un usuario
 *     description: Actualiza los datos de un usuario existente. **Requiere autenticación JWT.**
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID del usuario a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Carlos"
 *               ap_paterno:
 *                 type: string
 *                 example: "Ramírez"
 *               email:
 *                 type: string
 *                 example: "carlos@ejemplo.com"
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario actualizado correctamente."
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado.
 *       401:
 *         description: Token no proporcionado.
 */
router.put('/:id', verificarToken, (req, res) => {
  const index = usuarios.findIndex(u => u.id === req.params.id && u.activo);
  if (index === -1) {
    return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
  }

  const { password, id, fecha_registro, ...campos } = req.body;
  Object.assign(usuarios[index], campos);

  const { password: _, ...usuarioSinPassword } = usuarios[index];
  res.json({
    ok: true,
    mensaje: 'Usuario actualizado correctamente.',
    usuario: usuarioSinPassword
  });
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     tags:
 *       - Usuarios
 *     summary: Eliminar un usuario (soft delete)
 *     description: |
 *       Desactiva un usuario del sistema (no lo elimina físicamente).
 *       **Requiere autenticación JWT.**
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID del usuario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Respuesta'
 *       404:
 *         description: Usuario no encontrado.
 *       401:
 *         description: Token no proporcionado.
 */
router.delete('/:id', verificarToken, (req, res) => {
  const usuario = usuarios.find(u => u.id === req.params.id && u.activo);
  if (!usuario) {
    return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
  }

  usuario.activo = false;
  res.json({ ok: true, mensaje: 'Usuario eliminado correctamente.' });
});

module.exports = router;
