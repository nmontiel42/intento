// index.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import authRoutes from './src/auth.js';
import fastifyWebsocket from '@fastify/websocket';
import https from 'https';
import fs from 'fs';
import WebSocket from 'ws';

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
  origin: 'https://localhost:8080',
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
  reply.header('X-Frame-Options', 'SAMEORIGIN');
  reply.header('X-XSS-Protection', '1; mode=block');
  
  done();
});


fastify.register(authRoutes);

// Decorador para verificar el JWT
fastify.decorate('authenticate', async (req, res) => {
  try {
    await req.jwtVerify();
    const token = await req.jwtDecode();
    // Incluir el email además del userId (o en lugar de él)
    req.user = { 
      userId: token.userId || token.id, // Intentar obtener userId o id
      email: token.email // Extraer el email del token
    };
  } catch (err) {
    res.send(err);
  }
});

/*-------------------LIVE CHAT-------------------*/
const clients = new Set();
const wss = new WebSocket.Server({ server: fastify.server });
const userList = [];
const userBlocks = {}; // { [username]: ["bloqueado1", "bloqueado2"] }

wss.on('connection', (ws) => {
	console.log('Cliente conectado');
	clients.add(ws);

	// Enviar mensaje como JSON cuando el cliente se conecta
	ws.send(JSON.stringify({ type: 'message', user: "chat" ,message: '¡Bienvenido al chat!' }));
  
	// Recibir mensajes del cliente
	ws.on('message', (message) => {
	  try {
		const parsedMessage = JSON.parse(message);
		console.log('Mensaje analizado:', parsedMessage);
  
		if (parsedMessage.type === 'setUsername') {
			const username = parsedMessage.username;
			const blockedUsers = userBlocks[username] || [];

			const user = {
				ws,
				username,
				picture: parsedMessage.picture,
				blockedUsers
			};

			userList.push(user);
			console.log(`${parsedMessage.username} se ha conectado`);
			broadcastUserList();
			ws.send(JSON.stringify({
				type: 'userInit',
				username,
				blockedUsers
			}));
		}
		else if (parsedMessage.type === 'blockUser') {
			const { from, to } = parsedMessage;
			const blocker = userList.find(u => u.username === from);
			if (blocker && !blocker.blockedUsers.includes(to)) {
				blocker.blockedUsers.push(to);
		
				// Persistencia
				if (!userBlocks[from]) userBlocks[from] = [];
				if (!userBlocks[from].includes(to)) userBlocks[from].push(to);
		
				console.log(`${from} ha bloqueado a ${to}`);
			}
		}
		else if (parsedMessage.type === 'unblockUser') {
			const { from, to } = parsedMessage;
			const blocker = userList.find(u => u.username === from);
			if (blocker) {
				blocker.blockedUsers = blocker.blockedUsers.filter(u => u !== to);
		
				// Persistencia
				if (userBlocks[from]) {
					userBlocks[from] = userBlocks[from].filter(u => u !== to);
				}
		
				console.log(`${from} ha desbloqueado a ${to}`);
			}
		}
		else if (parsedMessage.type === 'privateMessage'){
			const { to, from, message } = parsedMessage;
			const recipient = userList.find(user => user.username === to);
			const sender = userList.find(user => user.username === from);
			const senderBlockedRecipient = sender?.blockedUsers.includes(to);
			const recipientBlockedSender = recipient?.blockedUsers.includes(from);
		
			if (recipient && recipient.ws.readyState === WebSocket.OPEN && !senderBlockedRecipient && !recipientBlockedSender) {
				recipient.ws.send(JSON.stringify({
					type: 'privateMessage',
					from,
					message,
					to,
					openChat: true
				}));
		
				if (sender && sender.ws.readyState === WebSocket.OPEN) {
					sender.ws.send(JSON.stringify({
						type: 'messageStatus',
						status: 'delivered',
						to,
						from
					}));
				}
			} else {
				let errorMessage = "No se pudo enviar el mensaje.";
		
				if (recipientBlockedSender) {
					errorMessage = `${to} te ha bloqueado.`;
				} else if (senderBlockedRecipient) {
					errorMessage = `Tienes bloqueado a ${to}.`;
				}
		
				if (sender && sender.ws.readyState === WebSocket.OPEN) {
					sender.ws.send(JSON.stringify({
						type: 'privateMessageError',
						message: errorMessage,
						to: from,
						from: to
					}));
				}
			}
		}
		else {
			for (const client of clients) {
				const targetUser = userList.find(u => u.ws === client);
				if (targetUser &&
					!targetUser.blockedUsers.includes(parsedMessage.user) &&
					!userList.find(u => u.username === parsedMessage.user)?.blockedUsers.includes(targetUser.username)) {
					client.send(JSON.stringify({
						type: 'message',
						user: parsedMessage.user,
						message: parsedMessage.message
					}));
				}
			}
		}
	  } catch (error) {
		console.error('Error al analizar el mensaje:', error);
	  }
	});

	function broadcastUserList() {
		const userListWithPictures = userList.map(user => ({
		  username: user.username,
		  picture: user.picture // Agregar la imagen de perfil
		}));
	  
		const userListMessage = JSON.stringify({
		  type: 'userList',
		  users: userListWithPictures, // Enviar la lista de usuarios con la imagen de perfil incluida
		});
	  
		// Enviar a todos los clientes la lista de usuarios
		for (const client of clients) {
		  if (client.readyState === WebSocket.OPEN) {
			client.send(userListMessage);
		  }
		}
	}

	// Manejo de cierre de conexión
    ws.on('close', () => {
        console.log('Cliente desconectado');
        // Eliminar al usuario desconectado de la lista
        const userIndex = userList.findIndex(user => user.ws === ws);
        if (userIndex !== -1) {
            const user = userList.splice(userIndex, 1)[0];
            console.log(`${user.username} se ha desconectado`);
        }
        // Actualizar la lista de usuarios a todos los clientes conectados
        broadcastUserList();
        clients.delete(ws);
    });
  
	// Manejo de errores
	ws.on('error', (error) => {
	  console.error('Error en WebSocket:', error);
	});
});

fastify.get('/chat', { websocket: true }, (request, reply) => {
	if (!request.raw.upgrade) {
		reply.code(400).send({ error: 'This is the WebSocket not an HTTP Request' });
		return;
	}

	wss.handleUpgrade(request.raw, request.raw.socket, Buffer.alloc(0), (ws) => {
		wss.emit('connection', ws, request.raw);
	});
});

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