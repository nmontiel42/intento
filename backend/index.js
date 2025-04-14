// index.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import authRoutes from './auth.js';
import fastifyWebsocket from '@fastify/websocket';
import https from 'https';
import fs from 'fs';
import tournamentRoutes from './tournament.js';


dotenv.config();
//console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Creamos el servidor Fastify
const fastify = Fastify({
	https: {
	  key: fs.readFileSync('/app/certs/nginx-selfsigned.key'),
	  cert: fs.readFileSync('/app/certs/nginx-selfsigned.crt'),
	}
});

// Registro de plugins
fastify.register(cors, {
  origin: true, //temporalmente true para pruebas, cambiar a la URL de producción
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

// Añadir hook para establecer cabeceras de seguridad
fastify.addHook('onSend', (request, reply, payload, done) => {
  // Configurar Content-Security-Policy para permitir Google Sign-In
  reply.header('Cross-Origin-Opener-Policy', 'same-origin');  // Cambiar a same-origin si no usas popups
  reply.header('Cross-Origin-Resource-Policy', 'same-origin');  // Cambiar a same-origin o eliminar
  reply.header('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' https://accounts.google.com https://*.googleusercontent.com 'unsafe-inline'; " +
    "frame-src https://accounts.google.com; " +
    "connect-src 'self' https://accounts.google.com https://localhost:3000; " +
    "img-src 'self' https://accounts.google.com data:; " +
    "style-src 'self' 'unsafe-inline' https://accounts.google.com;"
  );
  // Otras cabeceras de seguridad útiles
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-Frame-Options', 'DENY');
  reply.header('X-XSS-Protection', '1; mode=block');
  
  done();
});


fastify.register(authRoutes);

fastify.register(tournamentRoutes);

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

/*-------------------LIVE CHAT-------------------*/

/*-------------------LIVE CHAT END-------------------*/

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