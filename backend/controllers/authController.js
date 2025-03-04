import fastify from '../index.js'; // Asegúrate de que tu archivo principal de Fastify esté correctamente importado
import { createUser } from '../models/userModels.js'; // Importa la función para crear usuarios
import db from "../src/database.js";

/**
 * Registra un nuevo usuario y devuelve el JWT
 * @param {Object} data - Información del usuario (username, email, password)
 * @returns {Object} - Usuario creado y JWT
 */
export async function registerUser(data) {
  // Llama a la función que crea el usuario en la base de datos
  const user = await createUser(data);

  // Genera un JWT para el nuevo usuario
  const token = fastify.jwt.sign({ user: user.id });

  // Devuelve el usuario creado junto con el token
  const result = Object.assign({}, user, { token });

  return result; // Retorna el usuario con el token
}

// Si usas username en lugar de userId en el JWT, busca por username en la base de datos
export function deleteUserByUsername(username) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM users WHERE username = ?',
        [username],
        function (err) {
          if (err) {
            console.error('Error al eliminar usuario:', err);
            reject(err);
          } else {
            console.log('Número de filas eliminadas:', this.changes);
            if (this.changes === 0) {
              reject(new Error('No se encontró el usuario'));
            } else {
              resolve();
            }
          }
        }
      );
    });
  }
  
  
  