const express = require('express');
const router = express.Router();
const { registro, login, perfil } = require('../controllers/authController');
const { proteger } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   - name: Autenticación
 *     description: Registro, login y perfil de usuario
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UsuarioRegistro:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - password
 *       properties:
 *         nombre:
 *           type: string
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           example: juan@correo.com
 *         password:
 *           type: string
 *           example: "123456"
 *         rol:
 *           type: string
 *           enum: [usuario, admin]
 *           example: usuario
 *     UsuarioLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: juan@correo.com
 *         password:
 *           type: string
 *           example: "123456"
 *     RespuestaAuth:
 *       type: object
 *       properties:
 *         ok:
 *           type: boolean
 *           example: true
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         usuario:
 *           $ref: '#/components/schemas/UsuarioRespuesta'
 *     UsuarioRespuesta:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         nombre:
 *           type: string
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           example: juan@correo.com
 *         rol:
 *           type: string
 *           example: usuario
 */

/**
 * @swagger
 * /auth/registro:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Registrar nuevo usuario
 *     description: |
 *       Crea un nuevo usuario en la base de datos y devuelve un token JWT.
 *       #### **Curl**
 *       ```bash
 *       curl -X POST http://localhost:3000/auth/registro \
 *         -H "Content-Type: application/json" \
 *         -d '{"nombre":"Juan","email":"juan@correo.com","password":"123456"}'
 *       ```
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioRegistro'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaAuth'
 *       400:
 *         description: El email ya está registrado
 *       500:
 *         description: Error del servidor
 */
router.post('/registro', registro);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión
 *     description: |
 *       Autentica al usuario y devuelve un token JWT válido por 7 días.
 *       #### **Javascript**
 *       ```js
 *       fetch('/auth/login', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify({ email: 'juan@correo.com', password: '123456' })
 *       }).then(r => r.json()).then(data => console.log(data.token));
 *       ```
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioLogin'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaAuth'
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error del servidor
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     tags:
 *       - Autenticación
 *     summary: Obtener perfil del usuario autenticado
 *     description: Devuelve los datos del usuario autenticado. Requiere token JWT.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 usuario:
 *                   $ref: '#/components/schemas/UsuarioRespuesta'
 *       401:
 *         description: No autorizado
 */
router.get('/perfil', proteger, perfil);

module.exports = router;
