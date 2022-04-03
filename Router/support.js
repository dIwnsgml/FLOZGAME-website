const express = require("express");
const Router = express.Router();
Router.get('/', (req, res) => {
  var io = req.app.get('socketio');
  io.on('connection', (socket) => {
    //var room = req.session.name;
    var room = "a";
    socket.on('discconect', () => {
      console.log("disconnected");
    })
    socket.emit('usercount', io.engine.clientsCount);
    // on 함수로 이벤트를 정의해 신호를 수신할 수 있다.
    socket.on('message', (msg) => {
        io.emit('message', msg);
        console.log(msg);
    });

    socket.on('join', (requsetData) => {
      socket.join(room)
    })
  });
  if (req.session.loggedin) {
    res.render('support/support', {
      path: 'exit/logout',
      button: 'Logout',
    });
  } else {
    res.render('support/support', {
      path: 'exit/login',
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

Router.get('/exit/login', (req, res) => {
  res.redirect('/account/login');
})

Router.get('/exit/logout', (req, res) => {
  res.redirect('/account/logout');
})

module.exports = Router;