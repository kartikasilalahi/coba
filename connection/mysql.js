const mysql = require('mysql')

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysqlrootpasswordhere",
    database: "coba",
    port: "3306"
});

module.exports=db