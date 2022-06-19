const express = require("express");
const Router = express.Router();
const connection = require('../model/db');


module.exports = io => {
  Router.get('/', (req, res) => {
    if(!req.session.loggedin){
      res.redirect('/');
      return 0;
    }
    let name = req.session.userId;
    connection.query("SELECT * FROM users WHERE name = ?", name, (err, rows, fields) => {
      if(rows[0].role == 'admin') {
        io.use((socket, next) => {
          socket.id = rows[0].chat;
          socket.userId = name;
          console.log("admin", socket.id)
          next();
        })
        connection.query("SELECT * FROM users WHERE chat <> 'NULL'", (err, rows, fields) => {
          res.render('admin/index', {
            all: JSON.stringify(rows)
          })
        })
      } else {
        res.redirect('/');
      }
    })
  })

  return Router

}