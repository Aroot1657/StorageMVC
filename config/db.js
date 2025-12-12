const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Republic_C207",
  database: "storage_store"
});

db.connect(err => {
  if (err) throw err;
  console.log("Database connected ✅");
});

module.exports = db;
