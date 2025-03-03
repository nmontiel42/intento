// Importamos la librería Fastify
import Fastify from 'fastify';

// Creamos el servidor Fastify
const fastify = Fastify();

// Configuramos una ruta simple
fastify.get('/', async (request, reply) => {
  console.log('Solicitud recibida');
  return 'Hello from Fastify';
});

// Iniciamos el servidor en el puerto 3000
fastify.listen({
    port: 3000, 
    host: '0.0.0.0'}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor Fastify corriendo en ${address}`);
});
