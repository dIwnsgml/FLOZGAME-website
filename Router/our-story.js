const express = require("express");
const Router = express.Router();

Router.get('/floz', (req, res) => {
  if (req.session.loggedin) {
    res.render('our-story/floz', {
      path: '/account/logout',
      button: 'LOGOUT',
      list: "LOGOUT",
    });
  } else {
    res.render('our-story/floz', {
      path: '/account/login',
      button: 'SIGN IN',
      list: "",
    })
  }
})

Router.get('/flozgame', (req, res) => {
  if (req.session.loggedin) {
    res.render('our-story/flozgame', {
      path: '/account/logout',
      button: 'LOGOUT',
      list: "LOGOUT",
    });
  } else {
    res.render('our-story/flozgame', {
      path: '/account/login',
      button: 'SIGN IN',
      list: "",
    })
  }
})

module.exports = Router;