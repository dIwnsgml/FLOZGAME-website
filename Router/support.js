const express = require("express");
const Router = express.Router();
const connection = require('../model/db');


module.exports = function(io) {


  Router.get('/', (req, res) => {
    global.name = req.session.userId;
    console.log(global.name)
    //console.log(name)
    connection.query("SELECT * FROM users WHERE name = ?", global.name, async (err, rows, fields) => {
      if(typeof global.name != 'undefined') {
        if (rows[0].chat != null) {
          io.use((socket, next) => {
            socket.id = rows[0].chat;
            next()
          });
        } else {
          io.use((socket, next) => {
            connection.query("UPDATE users SET chat = ? where name = ?", [socket.id, global.name]);
            next()
          });
        }
      }
    })
  
    if (req.session.loggedin) {
      res.render('support/support', {
        path: '/account/logout',
        button: 'Logout',
        name: global.name,
      });
    } else {
      res.render('support/support', {
        path: '/account/login',
        button: 'Login',
        name: 0,
      })
    }
  });


  io.sockets.on('connection', async (socket) => {

    socket.on('bring_msg', () => {
      connection.query("SELECT * FROM chat WHERE user = ?", global.name, (err, rows, fields) => {
        connection.query("SELECT * FROM chat WHERE room = ?", rows[0].room, (err, rows, fields) => {
          for(var i = 0; typeof rows[i] != 'undefined'; i++){
            io.to(rows[0].room).emit('bring_msg')
            console.log(rows[i].msg)
          }
        })
      })
    })

    connection.query("SELECT * FROM chat WHERE user = ?", global.name, (err, rows, fields) => {
      connection.query("SELECT * FROM chat WHERE room = ?", rows[0].room, (err, rows, fields) => {
        for(var i = 0; typeof rows[i] != 'undefined'; i++){
          //io.to(rows[0].room).sockets.emit('bring_msg')
          io.sockets.emit('bring_msg', rows[i].msg)
          console.log(rows[i].msg)
        }
      })
    })
    
    socket.onAny((event, args) => {
      console.log(event, args, io.sockets.adapter.rooms);
    });
    socket.on('Fdisconnect', () => {
      console.log('disconnected');
      socket.disconnect();
    })
  
    socket.on("message", (room, msg) => {
      var info = {
        user: global.name,
        room: room,
        msg: msg,
      }
      connection.query("INSERT INTO chat SET ?", info);
      io.to(room).emit('message', room, msg)
      console.log(msg, room)
    })
  });

  return Router
}