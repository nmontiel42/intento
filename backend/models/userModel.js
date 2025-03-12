import db from '../src/database.js';

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

  