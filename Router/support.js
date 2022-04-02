const express = require("express");
const app = express();
const Router = express.Router();
Router.get('/', (req, res) => {
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