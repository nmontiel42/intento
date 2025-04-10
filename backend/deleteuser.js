import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./database.db');  // Ruta a tu base de datos

// Función para borrar un usuario
function deleteUsers() {
  const query = "DELETE FROM users";
  db.run(query, function(err) {
    if (err) {
      console.error("Error al borrar el usuario:", err.message);
    } else {
      console.log(`Borrado correctamente.`);
    }
  });
}

function deleteTournament() {
  const query = "DELETE FROM tournament";
  db.run(query, function(err) {
    if (err) {
      console.error("Error al borrar el torneo:", err.message);
    } else {
      console.log(`Borrado correctamente.`);
    }
  });
}

function deleteMatches() {
  const query = "DELETE FROM t_match";
  db.run(query, function(err) {
    if (err) {
      console.error("Error al borrar el match:", err.message);
    } else {
      console.log(`Borrado correctamente.`);
    }
  });
}

// Llamada para borrar un usuario (por ejemplo, con el email "usuario@example.com")
//deleteUsers();
deleteTournament();
deleteMatches();