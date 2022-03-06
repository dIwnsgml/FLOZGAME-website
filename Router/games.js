const express = require("express");
const app = express();
const Router = express.Router();

Router.get('/cube', (req, res) => {
  if(req.session.loggedin){
    res.render('games/cube', {
      path: 'exit/logout',
      button: 'Logout',
    });
  } else {
    res.render('games/cube', {
      path: 'exit/login',
      button: 'Login',
    });
  }
})

Router.get('/exit/login', (req, res) => {
  res.redirect('/account/login');
})

Router.get('/exit/logout', (req, res) => {
  res.redirect('/account/logout');
})

/* Router.get('/cube', (req,res)=>{
  res.render('test');
}) */

/* Router.post('/cube/download', (req, res) => {
  res.send(200);
  res.redirect('/games/cube');
  res.setHeader('Content-Disposition', `attachment; filename=${test.txt}`); // 이게 핵심 
  res.sendFile('/app/test.txt');
  if(req.session.loggedin){
    res.download('/app/test.txt')
    res.redirect('/games/cube');
  } else {
    res.download('/app/test.txt')
    res.redirect('/games/cube');
  }
}) */

module.exports = Router;