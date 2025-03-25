import sqlite3 from "sqlite3";

const db = new sqlite3.Database("database.db", (err) => {
    if (err) {
        return console.error("Error opening the database: ", err.message);
    }
    console.log("Connected to the SQLite database.");
});

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS verification_codes`, (err) => {
        if (err) {
            console.error('Error dropping verification_codes table:', err);
            return;
        }
        
        db.run(`
            CREATE TABLE verification_codes (
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
    });
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
    db.run(`ALTER TABLE users ADD COLUMN has2FA BOOLEAN DEFAULT 0`, err => {
        if (err && !err.message.includes('duplicate column')) {
            console.error("Error adding has2FA column:", err);
        }
    });
    
    db.run(`ALTER TABLE users ADD COLUMN "2fa_email" TEXT`, err => {
        if (err && !err.message.includes('duplicate column')) {
            console.error("Error adding 2fa_email column:", err);
        }
    });
    
    db.run(`ALTER TABLE users ADD COLUMN two_fa_status TEXT`, err => {
        if (err && !err.message.includes('duplicate column')) {
            console.error("Error adding two_fa_status column:", err);
        }
    });
    db.run(`ALTER TABLE user_2fa_sessions ADD COLUMN type TEXT DEFAULT 'enrollment'`, err => {
        if (err && !err.message.includes('duplicate column')) {
            console.error("Error adding type column to user_2fa_sessions:", err);
        }
    });
});

export default db;
        