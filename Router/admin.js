const express = require("express");
const Router = express.Router();
const connection = require('../model/db');


module.exports = io => {
  Router.get('/', (req, res) => {
    var name = req.session.userId;
    connection.query("SELECT * FROM users WHERE name = ?", name, (err, rows, fields) => {
      if(typeof name == 'undefined'){
        res.redirect('/');
      } else {
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
          /* io.use((socket, next) => {
            socket.id = rows[0].chat;
            next()
          });
          io.on('connection', (socket) => {
  
          })
  
          var room = Array.from(io.sockets.adapter.rooms);
          console.log(room) */
        } else {
          res.redirect('/');
        }
      }
    })
  })

  return Router

}