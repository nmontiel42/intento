import sqlite3 from "sqlite3";

const db = new sqlite3.Database("database.db", (err) => {
    if (err) {
        return console.error("Error opening the database: ", err.message);
    }
    console.log("Connected to the SQLite database.");
});

db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS verification_codes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              session_info TEXT NOT NULL,
              code TEXT NOT NULL,
              email TEXT NOT NULL,
              expires_at DATETIME NOT NULL,
              created_at DATETIME NOT NULL
            )`,
            (err) => {
                if (err) console.error('Error recreating verification_codes table:', err);
                else console.log('Successfully recreated verification_codes table');
            }
        );

    db.run(
        `
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_online BOOLEAN DEFAULT 0,
        has2FA BOOLEAN DEFAULT 0,
        phone_number VARCHAR(20)
        )`,
        (err) => {
            if (err) {
            return console.error("Error creating the users table: ", err.message);
            }
            console.log("Created the users table.");
        },
    );
    db.run(`
        CREATE TABLE IF NOT EXISTS user_2fa_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          session_info TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) {
            console.error("Error creating user_2fa_sessions table:", err);
        } else {
            console.log("Created user_2fa_sessions table");
        }
    });
});

export default db;
        