const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ongchoong",
  database: "myapp",
  acquireTimeout :  100000,
  connectTimeout :  100000,
})

conn.connect(function(error){
  if(error){
    console.log(error);
  }else{
    console.log("connected");
  }
})

module.exports = conn;