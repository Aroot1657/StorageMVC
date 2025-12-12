const db = require("../config/db");

module.exports = {
    createUser: (data, callback) => {
        db.query(
            `INSERT INTO users (name, email, password_hash, role)
             VALUES (?, ?, SHA1(?), ?)`,
            [data.name, data.email, data.password, data.role],
            callback
        );
    },

    findByEmail: (email, callback) => {
        db.query(
            `SELECT * FROM users WHERE email = ?`,
            [email],
            callback
        );
    }
};
