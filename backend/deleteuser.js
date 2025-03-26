import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./database.db');  // Ruta a tu base de datos

// Función para borrar un usuario
function deleteUser() {
  const query = "DELETE FROM users";
  db.run(query, function(err) {
    if (err) {
      console.error("Error al borrar el usuario:", err.message);
    } else {
      console.log(`Borrado correctamente.`);
    }
  });
}
function delete2fa() {
  const query = "DELETE FROM user_2fa_sessions";
  db.run(query, function(err) {
    if (err) {
      console.error("Error al borrar el usuario:", err.message);
    } else {
      console.log(`Borrado correctamente.`);
    }
  });
}

function deleteverification() {
  const query = "DELETE FROM verification_codes";
  db.run(query, function(err) {
    if (err) {
      console.error("Error al borrar el usuario:", err.message);
    } else {
      console.log(`Borrado correctamente.`);
    }
  });
}

// Llamada para borrar un usuario (por ejemplo, con el email "usuario@example.com")
deleteUser();
delete2fa();
deleteverification();