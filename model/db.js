const mysql = require("mysql");
const secret = require("../secret.json");

//local
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ongchoong",
  database: "myapp",
  acquireTimeout :  100000,
  connectTimeout :  100000,
  multipleStatements: true,
})

/* const conn = mysql.createConnection({
  host: secret.database.host,
  user: secret.database.user,
  password: secret.database.password,
  database: secret.database.name,
  acquireTimeout :  secret.database.acquireTimeout,
  connectTimeout :  secret.database.connectTimeout,
  multipleStatements: true,
}) */

conn.connect(function(error){
  if(error){
    console.log(error);
  }else{
    console.log("connected");
  }
})

module.exports = conn;