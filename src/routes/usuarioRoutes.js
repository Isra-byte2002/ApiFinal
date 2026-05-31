const express = require('express');
const router = express.Router();
const {
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
} = require('../controllers/usuarioController');
const { proteger, soloAdmin } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: CRUD de usuarios (requiere autenticación)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UsuarioActualizar:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: Juan Actualizado
 *         email:
 *           type: string
 *           example: nuevo@correo.com
 *         rol:
 *           type: string
 *           enum: [usuario, admin]
 *           example: admin
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener todos los usuarios activos
 *     description: Devuelve un arreglo con todos los usuarios activos. Requiere token JWT.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
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
 *                   example: 5
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UsuarioRespuesta'
 *       401:
 *         description: No autorizado
 */
router.get('/', proteger, obtenerUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener usuario por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de MongoDB del usuario
 *         schema:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioRespuesta'
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/:id', proteger, obtenerUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     tags:
 *       - Usuarios
 *     summary: Actualizar usuario (solo admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioActualizar'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 *       403:
 *         description: Acceso denegado, solo administradores
 */
router.put('/:id', proteger, soloAdmin, actualizarUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     tags:
 *       - Usuarios
 *     summary: Desactivar usuario (solo admin)
 *     description: Realiza un soft delete, el usuario queda marcado como inactivo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a desactivar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario desactivado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       403:
 *         description: Acceso denegado, solo administradores
 */
router.delete('/:id', proteger, soloAdmin, eliminarUsuario);

module.exports = router;
