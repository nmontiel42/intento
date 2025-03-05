import db from '../src/database.js';  // Asegúrate de que la ruta sea correcta
import bcrypt from 'bcryptjs';

export const createUser = async ({ username, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Realiza la inserción en la base de datos
  const result = await db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );

  return { username, email };  // Devuelve un objeto con los datos insertados
};