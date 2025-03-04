import sqlite3 from "sqlite3";

const db = new sqlite3.Database("database.db", (err) => {
    if (err) {
        return console.error("Error opening the database: ", err.message);
    }
    console.log("Connected to the SQLite database.");
});

db.serialize(() => {
    db.run(
        `
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_online BOOLEAN DEFAULT 0
        )`,
        (err) => {
            if (err) {
            return console.error("Error creating the users table: ", err.message);
            }
            console.log("Created the users table.");
        },
    );
});

export function createUser(data) {
    const { username, email, password } = data;
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        [username, email, password],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, username, email });
        }
      );
    });
  }
  
  // Obtener un usuario por nombre de usuario
  export function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

export default db;
        