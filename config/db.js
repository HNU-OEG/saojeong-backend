var mysql = require('mysql2/promise');
require('dotenv').config()
var pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  connectionLimit: process.env.DB_CONNECTIONLIMIT,
});

const dbTest = async () => {
  try {
    const row = await pool.query('select 1 + 1');
    console.log("Successfully DB Connection");
    return row;
  } catch (err) {
    console.log("Error : ", err);
    return false;
  }
}

dbTest();
// pool.getConnection(function(err, connection) {
//     if (err) throw err; // not connected!

//     // Use the connection
//     connection.query('SELECT 1', function (error, results, fields) {
//         // When done with the connection, release it.
//         connection.release();

//         // Handle error after the release.
//         if (error) throw error;

//         // Don't use the connection here, it has been returned to the pool.
//     });
// });



module.exports = pool;