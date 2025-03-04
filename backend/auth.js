// auth.js
import db from './src/database.js';  // Importamos la base de datos
import { createUser } from './src/database.js';  // Importamos las funciones de la base de datos
import bcrypt from 'bcryptjs';
import { deleteUserByUsername } from './controllers/authController.js';

export default async function (fastify, options) {
    // Ruta para registrar un nuevo usuario
    fastify.post('/register', async (request, reply) => {
        const { username, email, password } = request.body;

        console.log('Datos del cuerpo:', request.body);

        if (!username || !email || !password) {
            return reply.status(400).send({ error: 'Faltan datos obligatorios' });
        }

        try {
            // Cifrado de la contraseña con bcrypt antes de guardar
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await createUser({ username, email, password: hashedPassword });
            reply.send(newUser); // Devuelve la respuesta con el usuario
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

    fastify.delete('/delete-account', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const username = request.userId; // Si usas username, usa esto
        console.log('Eliminando cuenta para el usuario:', username);

        try {
            await deleteUserByUsername(username);  // Usa deleteUserByUsername si usas username
            reply.send({ message: 'Cuenta eliminada' });
        } catch (error) {
            console.error('Error al eliminar la cuenta:', error);
            reply.status(500).send({ error: 'Error al eliminar la cuenta' });
        }
    });

}

export function checkUserExists(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM users WHERE id = ?',
            [userId],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
    });
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