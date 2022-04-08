const express = require("express");
const Router = express.Router();
const connection = require('../model/db');

Router.get('/', (req, res) => {
  var name = req.cookies['names'];
  console.log(name);
  connection.query("SELECT * FROM users WHERE name = ?", name, (err, rows, fields) => {
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
          all: room
        })
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