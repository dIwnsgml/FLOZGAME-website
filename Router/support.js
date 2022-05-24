const express = require("express");
const Router = express.Router();
const connection = require('../model/db');

Router.get('/', (req, res) => {

  var io = req.app.get('socketio');
  var name = req.session.userId;
  console.log(name)
  connection.query("SELECT * FROM users WHERE name = ?", name, async (err, rows, fields) => {
    if (rows[0].chat != null) {
      io.use((socket, next) => {
        socket.id = rows[0].chat;
        next()
      });
    } else {
      io.use((socket, next) => {
        connection.query("UPDATE users SET chat = ? where name = ?", [socket.id, name]);
        next()
      });
    }
  })

  io.on('connection', async (socket) => {
    socket.onAny((event, args) => {
      console.log(event, args, io.sockets.adapter.rooms);
    });
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('Fdisconnect', () => {
      console.log('disconnected');
      socket.disconnect();
    })

    socket.on("message", (room, msg) => {
      var info = {
        user: name,
        room: room,
        msg: msg,
      }
      connection.query("INSERT INTO chat SET ?", info);
      io.to(room).emit('message', msg)
      console.log(msg, room)
    })
  });
  if (req.session.loggedin) {
    res.render('support/support', {
      path: '/account/logout',
      button: 'Logout',
      name: name,
    });
  } else {
    res.render('support/support', {
      path: '/account/login',
      button: 'Login',
      name: 0,
    })
  }
  //io.to(socket.id).emit("message", data);
})

//app.io = require('socket.io')();
/*** Socket.IO 추가 ***/

/* app.io.on('connection', function(socket){
   
  console.log("a user connected");
  socket.broadcast.emit('hi');
   
  socket.on('disconnect', function(){
      console.log('user disconnected');
  });
   
  socket.on('chatMessage', function(msg){
      console.log('message: ' + msg);
      app.io.emit('chatMessage', msg);
  }); 

});
 */

module.exports = Router;