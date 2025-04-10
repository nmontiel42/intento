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
        is_online BOOLEAN DEFAULT 0
        )
        `,
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

    db.run(`ALTER TABLE users ADD COLUMN "2fa_email" TEXT;`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error("Error adding 2fa_email column:", err);
        } else {
            console.log("Column 2fa_email added or already exists");
        }
    });
    
    db.run(`ALTER TABLE users ADD COLUMN two_fa_status TEXT DEFAULT 'inactive';`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error("Error adding two_fa_status column:", err);
        } else {
            console.log("Column two_fa_status added or already exists");
        }
    });

    db.run(`ALTER TABLE users ADD COLUMN has2FA BOOLEAN DEFAULT 0;`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error("Error adding has2FA column:", err);
        } else {
            console.log("Column has2FA added or already exists");
        }
    });

    db.run(`ALTER TABLE users ADD COLUMN picture TEXT;`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error("Error adding picture column:", err);
        } else {
            console.log("Added picture column or already exists");
        }
    });

/*     db.all("PRAGMA table_info(users);", (err, rows) => {
        console.log("Users table schema:", rows);
    }); */
});

export default db;
        