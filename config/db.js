const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Republic_C207",
  database: "c372_StorageApp"
});

db.connect(err => {
  if (err) throw err;
  console.log("Database connected ✅");
});

module.exports = db;
