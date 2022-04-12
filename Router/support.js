const express = require("express");
const Router = express.Router();
const connection = require('../model/db');

Router.get('/', (req, res) => {

  var io = req.app.get('socketio');
  var name = req.cookies['names'];
  var sessionID;
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
    console.log('asd', socket.id)

    socket.onAny((event, args) => {
      console.log(event, args);
    });

    var room = socket.id;
    socket.id = '6SkUVAPTdm2SvAWPAAAD';
    socket.join(room);
    socket.id = room;
    console.log(socket.rooms)

    socket.on('disconnect', () => {
      console.log('disconnected');
    })

    socket.on("private message", ({ content, to }) => {
      console.log(io.sockets.adapter.rooms)
      socket.to(to).emit("private message", {
        content,
        from: socket.id,
      });
    });

    socket.on("message", (msg) => {
      io.to(socket.id).emit('message', msg)
      console.log(io.sockets.adapter.rooms)
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