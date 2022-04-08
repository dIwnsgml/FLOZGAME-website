const express = require("express");
const Router = express.Router();
const connection = require('../model/db');

Router.get('/', (req, res) => {
  var io = req.app.get('socketio');
  var name = req.cookies['names'];
  io.use((socket, next) => {
    connection.query("SELECT * FROM users WHERE name = ?", name, (err, rows, fields) => {
      if(rows[0].chat != null) {
        socket.id = rows[0].chat;
        check = 1;
        console.log('ex', socket.id)
      } else {
        connection.query("UPDATE users SET chat = ? where name = ?", [socket.id, name]);
        check = 0;
      }
    })
    console.log(socket.id, name)
    next();
  });

  io.on('connection', (socket) => {
    console.log(socket.id)

    socket.onAny((event, args) => {
      console.log(event, args);
    });

    socket.emit("session", {
      sessionID: socket.sessionID,
      userID:socket.userID,
    });

    console.log(socket.userID)

    socket.on('join', (room) => {
      socket.join(room);
      //console.log('connected', socket.rooms, socket.id);
    })

    socket.on('disconnect', () => {
      console.log('disconnected');
    })

    socket.on('message', (msg) => {
      socket.to(socket.id).emit(msg);
    })
  });
  if (req.session.loggedin) {
    var name = req.cookies['names'];
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

Router.post('/chat', (req, res) => {
  res.redirect('/')
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