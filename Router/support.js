const express = require("express");
const Router = express.Router();
const connection = require('../model/db');
const crypto = require('crypto');

module.exports = function(io) {


  Router.get('/', (req, res) => {

    if (req.session.loggedin) {
      var name = req.session.userId;
      console.log(name)
      connection.query("SELECT * FROM users WHERE name = ?", name, async (err, rows, fields) => {
        if (rows[0].chat == null || typeof rows[0].chat == 'undefined') {
          io.use((socket, next) => {
            var nsocketid = crypto.randomBytes(10).toString('hex');
            connection.query("UPDATE users SET chat = ? where name = ?", [nsocketid, name]);
            socket.id = nsocketid;
            socket.userId = name;
            next()
          });
          } else {
            console.log(rows[0].chat);
            io.use((socket, next) => {
              socket.id = rows[0].chat;
              socket.userId = name;
              console.log(socket.id);
              next()
            });
          }
      })
      res.render('support/loggedin', {
        path: '/account/logout',
        button: 'LOGOUT',
        list: "LOGOUT",
      });
    } else {
      res.render('support/notloggedin', {
        path: '/account/login',
        button: 'SIGN IN',
        list: "",
      })
    }
  });

  return Router
}