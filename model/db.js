const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "database-1.c23sr7las3xg.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "junjason0228!!",
  database: "myapp",
  port: "3306",
  dialect: "mysql",
})

conn.connect(function(error){
  if(error){
    console.log(error);
  }else{
    console.log("connected");
  }
})

module.exports = conn;