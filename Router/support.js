const express = require("express");
const app = express();
const Router = express.Router();
const socket = require("socket.io");
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

io.sockets.on('connection', (socket) => {
  console.log(socket);
})

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
})

Router.get('/exit/login', (req, res) => {
  res.redirect('/account/login');
})

Router.get('/exit/logout', (req, res) => {
  res.redirect('/account/logout');
})

module.exports = Router;