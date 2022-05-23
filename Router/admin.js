const express = require("express");
const Router = express.Router();
const connection = require('../model/db');

Router.get('/', (req, res) => {
  var name = req.session.userId;
  var io = req.app.get('socketio');
  connection.query("SELECT * FROM users WHERE name = ?", name, (err, rows, fields) => {
    if(typeof name == 'undefined'){
      res.redirect('/');
    } else {
      if(rows[0].role == 'admin') {

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

/*connection.query("SELECT * FROM users WHERE name = ?", name, (err, rows, fields) => {
    console.log(typeof name == 'undefined', rows[0].role != 'admin');
    if(typeof name == 'undefined'){
      res.redirect('/');
    } else {
      if(rows[0].role == 'admin') {
        var io = req.app.get('socketio');
        io.on('connection', (socket) => {
          socket.id = 'admin';
        })
        var room = Array.from(io.sockets.adapter.rooms);
        console.log(room)
        res.render('admin/index', {
          all: room,
        });
      } else {
        res.redirect('/');
      }
    }
  }) */

module.exports = Router;