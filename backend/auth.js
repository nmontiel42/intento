// auth.js
import db from './src/database.js';  // Importamos la base de datos
import { createUser } from './models/userModel.js';  // Importamos las funciones de la base de datos
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default async function (fastify, options) {
    // Ruta para registrar un nuevo usuario
    fastify.post('/register', async (request, reply) => {
        const { username, email, password } = request.body;

        //console.log('Datos del cuerpo:', request.body);

        if (!username || !email || !password) {
            return reply.status(400).send({ error: 'Faltan datos obligatorios' });
        }

        try {
            // Cifrado de la contraseña con bcrypt antes de guardar
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await createUser({ username, email, password: hashedPassword });

            //console.log('Usuario creado:', newUser); // 👀 Verificar que `username` está presente

            const token = fastify.jwt.sign({ userId: newUser.id });

            reply.send({
                message: 'Usuario registrado exitosamente',
                token,
                user: newUser // Asegurar que `user` es lo que enviamos
            });
        } catch (error) {
            console.error('Error en el registro:', error);
            reply.status(500).send({ error: 'Error al registrar el usuario' });
        }
    });

    // Ruta de Login
    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body;

        try {
            // Buscar el usuario por correo electrónico
            const user = await getUserByEmail(email);

            if (!user) {
                return reply.status(400).send({ error: 'Usuario no encontrado' });
            }

            // Verificar la contraseña con bcrypt
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return reply.status(400).send({ error: 'Contraseña incorrecta' });
            }

            // Generar un JWT
            const token = fastify.jwt.sign({ user: user.username });

            return reply.send({ username: user.username, token });
        } catch (error) {
            console.error('Error en el login:', error);
            return reply.status(500).send({ error: 'Error al iniciar sesión' });
        }
    });


    fastify.get('/users', async (request, reply) => {
        try {
            // Obtener todos los usuarios
            const users = await getAllUsers();
            reply.send(users); // Devuelve la lista de usuarios
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            reply.status(500).send({ error: 'Error al obtener los usuarios' });
        }
    });

    const client = new OAuth2Client(process.env.GOOGLE_ID); // Reemplaza con tu client_id

    fastify.post('/google-login', async (request, reply) => {
        const { token } = request.body;

        try {
            // Verificar el token con Google
            const googleResponse = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_ID // Debe ser el mismo que tu client_id
            });

            const googleData = googleResponse.getPayload();

            if (!googleData.email) {
                return reply.code(401).send({ error: "Invalid Google token" });
            }

            const existingUser = await getUserByEmail(googleData.email);

            if (existingUser) {
                const jwtToken = jwt.sign(
                    { id: googleData.sub, email: googleData.email },
                    process.env.JWT_SECRET, // Reemplázalo con una clave segura
                    { expiresIn: '1h' }
                );

                return reply.send({
                    token: jwtToken,
                    userExists: true,
                    user: {
                        email: googleData.email,
                        name: googleData.name,
                        picture: googleData.picture,
                        locale: googleData.locale,
                        username: existingUser.username
                    }
                });
            } else {
                const jwtToken = jwt.sign(
                    { id: googleData.sub, email: googleData.email },
                    process.env.JWT_SECRET, // Reemplázalo con una clave segura
                    { expiresIn: '1h' }
                );

                return reply.send({
                    token: jwtToken,
                    userExists: false,
                    user: {
                        email: googleData.email,
                        name: googleData.name,
                        picture: googleData.picture,
                        locale: googleData.locale
                    }
                });
            }

        } catch (error) {
            console.error("Google Auth Error:", error);
            return reply.code(500).send({ error: "Server error" });
        }
    });

    fastify.post('/google-username', async (request, reply) => {

        console.log('HE LLEGADOOOOOOOOOOOO');

        const { token, username } = request.body; // Desestructurar el username recibido

        console.log('Usuario recibido:', username);
        try {
            const googleResponse = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_ID
            });

            const googleData = googleResponse.getPayload();

            if (!googleData.email) {
                return reply.code(401).send({ error: "Invalid Google token" });
            }

            let user = await getUserByEmail(googleData.email);
            let isNewUser = false;

            if (!user) {
                isNewUser = true;
                const email = googleData.email;
                const password = generateRandomPassword(); // Se puede usar otro valor si se desea
                console.log('Contraseña generada:', password);
                const hashedPassword = await bcrypt.hash(password, 10);
                console.log('hashedPassword: ', hashedPassword);

                // Usar el username recibido del frontend
                user = await createUser({ username, email, password: hashedPassword });
            }
            // Aquí generamos un token JWT para la sesión del usuario
            const jwtToken = jwt.sign(
                { id: googleData.sub, email: googleData.email },
                process.env.JWT_SECRET, // Reemplaza con tu clave secreta
                { expiresIn: '1h' } // Opcional: la duración del token
            );

            return reply.send({
                message: isNewUser ? 'Usuario registrado exitosamente' : 'Iniciado de sesion exitoso',
                token: jwtToken,
                picture: googleData.picture,
                user: user
            });
        } catch (error) {
            console.error("Google Auth Error:", error);
            return reply.code(500).send({ error: "Server error" });
        }
    });


    fastify.delete('/delete-account', { preHandler: fastify.authenticate }, async (req, reply) => {
        const { username } = req.body; // Obtener el username del body
        console.log('Intentando eliminar usuario con username:', username);

        if (!username) {
            return reply.status(400).send({ error: 'Username no proporcionado' });
        }

        db.run('DELETE FROM users WHERE username = ?', [username], function (err) {
            if (err) {
                console.error('Error al eliminar la cuenta:', err);
                return reply.status(500).send({ error: 'Error al eliminar la cuenta' });
            }
            if (this.changes === 0) {
                console.log('No se encontró el usuario:', username);
                return reply.status(404).send({ error: 'No se encontró el usuario' });
            }
            console.log(`Usuario con username ${username} eliminado correctamente.`);
            reply.send({ message: 'Cuenta eliminada correctamente' });
        });
    });

}

function generateRandomPassword(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Función para obtener un usuario por su correo electrónico
async function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM users WHERE email = ?`,
            [email],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
    });
}

async function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM users`, // Se obtienen solo los campos relevantes
            [],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}