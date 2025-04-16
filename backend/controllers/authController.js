import fastify from '../index.js'; // Asegúrate de que tu archivo principal de Fastify esté correctamente importado
import { createUser } from '../models/userModel.js'; // Importa la función para crear usuarios

/**
 * Registra un nuevo usuario y devuelve el JWT
 * @param {Object} data - Información del usuario (username, email, password)
 * @returns {Object} - Usuario creado y JWT
 */
/* export async function registerUser(data) {
  // Llama a la función que crea el usuario en la base de datos
  const user = await createUser(data);

  // Genera un JWT para el nuevo usuario
  const token = fastify.jwt.sign({ user: user.id });

  // Devuelve el usuario creado junto con el token
  const result = Object.assign({}, user, { token });

  return result; // Retorna el usuario con el token
}

  
   */