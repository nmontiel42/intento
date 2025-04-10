import db from '../src/database.js';

// Crear un nuevo partido
export function createMatch({ tournament_id, player1, player2 }) {
    return new Promise((resolve, reject) => {
        let sql;
        let params;
        if (player2 === null) {
            sql = `INSERT INTO t_match
                        (tournament_id, player1, player2, winner, status) 
                        VALUES (?, ?, NULL, ?, 'completed')`;
            params = [tournament_id, player1, player1]; // player1 como ganador
        } else {
            sql = `INSERT INTO t_match 
                        (tournament_id, player1, player2, status) 
                        VALUES (?, ?, ?, 'pending')`;
            params = [tournament_id, player1, player2];
        }
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
                return;
            }
            
            // Obtener el partido recién creado
            db.get(`SELECT * FROM t_match WHERE match_id = ?`, [this.lastID], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    });
}

// Obtener un partido por su ID
export function getMatchById(match_id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM t_match WHERE match_id = ?`, [match_id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// Obtener todos los partidos de un torneo
export function getMatchesByTournament(tournament_id) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM t_match WHERE tournament_id = ?`, 
            [tournament_id], 
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

// Obtener todos los partidos de un torneo
export function getAllMatches() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM t_match`,
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

// Actualizar el resultado de un partido
export function updateMatchResult(match_id, player1_score, player2_score, winner) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE t_match 
                    SET player1_score = ?, player2_score = ?, winner = ?, 
                    status = 'completed'
                    WHERE match_id = ?`;
        
        db.run(sql, [player1_score, player2_score, winner, match_id], function(err) {
            if (err) reject(err);
            else resolve({ match_id, changes: this.changes });
        });
    });
}

// Actualizar el estado de un partido
export function updateMatchStatus(match_id, status) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE t_match SET status = ? WHERE match_id = ?`, 
            [status, match_id], 
            function(err) {
                if (err) reject(err);
                else resolve({ match_id, changes: this.changes });
            }
        );
    });
}

// Obtener partidos pendientes de un torneo
export function getPendingMatches(tournament_id) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM t_match WHERE tournament_id = ? AND status = 'pending'`, 
            [tournament_id], 
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

export function countPendingMatches(tournament_id) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(*) as count FROM t_match WHERE tournament_id = ? AND status = 'pending'`, 
            [tournament_id], 
            (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            }
        );
    });
}

// Obtener partidos completados de un torneo
export function getCompletedMatches(tournament_id) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM t_match WHERE tournament_id = ? AND status = 'completed'`, 
            [tournament_id], 
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

// Eliminar un partido
export function deleteMatch(match_id) {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM t_match WHERE match_id = ?`, [match_id], function(err) {
            if (err) reject(err);
            else resolve({ match_id, changes: this.changes });
        });
    });
}

// Eliminar todos los partidos de un torneo
export function deleteMatchesByTournament(tournament_id) {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM t_match WHERE tournament_id = ?`, [tournament_id], function(err) {
            if (err) reject(err);
            else resolve({ tournament_id, changes: this.changes });
        });
    });
}

export function checkWinners(tournament_id) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM t_match WHERE tournament_id = ? AND winner IS NOT NULL`, 
            [tournament_id], 
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}