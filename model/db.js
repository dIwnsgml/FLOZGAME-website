const mysql = require("mysql");
const secret = require("../config/secret.json").place[0];

//local
const conn = mysql.createConnection({
  host: secret.database.host,
  user: secret.database.user,
  password: secret.database.password,
  database: secret.database.name,
  acquireTimeout : secret.database.acquireTimeout,
  connectTimeout : secret.database.connectTimeout,
  multipleStatements: true,
})


conn.connect(function(error){
  if(error){
    console.log(error);
  }else{
    console.log("connected");
  }
})

module.exports = conn;