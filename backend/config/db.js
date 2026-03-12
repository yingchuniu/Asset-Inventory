const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',   
  database: 'asset_inventory'
});

db.connect((err) => {
  if (err) {
    console.log('MySQL connection error:', err);
    return;
  }
  console.log('MySQL Connected');
});

module.exports = db;