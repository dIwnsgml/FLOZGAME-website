const express = require("express");
const Router = express.Router();
const connection = require('../model/db');


Router.get('/', (req, res) => {
  var io = req.app.get('socketio');
  io.on('connection', (socket) => {

    socket.join('a');

    socket.on('discconect', () => {
      console.log("disconnected");
    })

    socket.emit('usercount', io.engine.clientsCount);

    socket.on('message', (id, msg) => {
      socket.to(id).emit('message', socket.id, msg);
      console.log(msg, socket.id);
    });
  });
  if (req.session.loggedin) {
    var name = req.session.name;
    res.render('support/support', {
      path: '/account/logout',
      button: 'Logout',
      name: name,
    });
  } else {
    res.render('support/support', {
      path: '/account/login',
      button: 'Login',
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