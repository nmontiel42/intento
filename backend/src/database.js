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

    // Crear tabla de torneos
    db.run(
        `
        CREATE TABLE IF NOT EXISTS tournament (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        num_players INTEGER NOT NULL,
        winner VARCHAR(255),
        created_by INTEGER,
        FOREIGN KEY (created_by) REFERENCES users(id)
        )`,
        (err) => {
            if (err) {
            return console.error("Error creating the tournament table: ", err.message);
            }
            console.log("Created the tournament table.");
        },
    );
    
    // Crear tabla de partidos
    db.run(
        `
        CREATE TABLE IF NOT EXISTS t_match (
        match_id INTEGER PRIMARY KEY AUTOINCREMENT,
        tournament_id INTEGER NOT NULL,
        player1 VARCHAR(255) NOT NULL,
        player2 VARCHAR(255) NOT NULL,
        player1_score INTEGER DEFAULT 0,
        player2_score INTEGER DEFAULT 0,
        winner VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        FOREIGN KEY (tournament_id) REFERENCES tournament(id)
        )`,
        (err) => {
            if (err) {
            return console.error("Error creating the t_match table: ", err.message);
            }
            console.log("Created the t_match table.");
        },
    );
});

export default db;
        