// index.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import authRoutes from './auth.js';

dotenv.config();
//console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Creamos el servidor Fastify
const fastify = Fastify();

// Registro de plugins
fastify.register(cors, {
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
  sign: {
    expiresIn: '1d',
  },
});

fastify.register(authRoutes);

// Decorador para verificar el JWT
fastify.decorate('authenticate', async (req, res) => {
  try {
    await req.jwtVerify();
    const token = await req.jwtDecode();
    req.userId = token.user;  // Cambié esto a `userId`
  } catch (err) {
    res.send(err);
  }
});

// Configuración de las rutas
fastify.get('/', async (request, reply) => {
  console.log('Solicitud recibida');
  return 'Hello from Fastify';
});

// Iniciamos el servidor en el puerto 3000
fastify.listen({
  port: 3000,
  host: '0.0.0.0',
}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor Fastify corriendo en ${address}`);
});

export default fastify;
