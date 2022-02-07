const pool = require("../databases/database");
const md5 = require("md5");


const getUser = async (user, pass) => {
    const query = "SELECT * FROM users WHERE usuarios = ? AND contraseña = ?"
    const row = await pool.query(query,[user, md5(pass)])
    return row[0]
  };

module.exports = {getUser};