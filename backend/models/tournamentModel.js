import db from '../src/database.js';

// Crear un nuevo torneo
export function createTournament({ name, num_players, created_by }) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO tournament 
                    (name, num_players, created_by) 
                    VALUES (?, ?, ?)`;
        
        db.run(sql, [name, num_players, created_by], function(err) {
            if (err) {
                reject(err);
                return;
            }
            
            // Obtener el torneo recién creado
            db.get(`SELECT * FROM tournament WHERE id = ?`, [this.lastID], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    });
}

// Obtener un torneo por su ID
export function getTournamentById(id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM tournament WHERE id = ?`, [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// Obtener todos los torneos
export function getAllTournaments() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM tournament`, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Obtener torneos creados por un usuario específico
export function getTournamentsByUser(userId) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM tournament WHERE created_by = ?`, 
            [userId], 
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

// Actualizar el ganador de un torneo
export function updateTournamentWinner(id, winner) {
    return new Promise((resolve, reject) => {
        const now = new Date().toISOString();
        db.run(`UPDATE tournament SET winner = ? WHERE id = ?`, 
            [winner, now, id], 
            function(err) {
                if (err) reject(err);
                else resolve({ id, changes: this.changes });
            }
        );
    });
}

// Eliminar un torneo y sus partidos asociados
export function deleteTournament(id) {
    return new Promise((resolve, reject) => {
        // Primero eliminamos los partidos asociados
        db.run(`DELETE FROM t_match WHERE tournament_id = ?`, [id], (err) => {
            if (err) {
                reject(err);
                return;
            }
            
            // Luego eliminamos el torneo
            db.run(`DELETE FROM tournament WHERE id = ?`, [id], function(err) {
                if (err) reject(err);
                else resolve({ id, changes: this.changes });
            });
        });
    });
}