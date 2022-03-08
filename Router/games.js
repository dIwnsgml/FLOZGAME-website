const express = require("express");
const conn = require("../model/db");
const app = express();
const Router = express.Router();
var a;
var count = 0;
Router.get('/cube', (req, res) => {
  conn.query('SELECT * FROM comments', function(err, rows, fields) {
    for(var i = 0; rows[i] != a; i++){
      count++;
    }
    console.log(count)
    if(req.session.loggedin){
      res.render('games/cube', {
        path: 'exit/logout',
        button: 'Logout',
        comment: '',
        ong: {rows},
        n: count,
      });
    } else {
      res.render('games/cube', {
        path: 'exit/login',
        button: 'Login',
        comment: 'Login to leave a comment',
        ong: {rows},
        n: count,
      });
      console.log()
    }
  })
  count = 0;
})
Router.post('/cube/comment', (req, res) => {
  let today = new Date();
  var co = {
    name: req.cookies['names'],
    comment: req.body.comment,
    time: today.toLocaleDateString('en-US'),
    rate: req.body.rate
  }
  console.log(co);
  //console.log(req.cookies['names'], req.body.comment, req.body.rate, today.toLocaleDateString('en-US'));
  conn.query('INSERT INTO comments SET ?', co, function(err, rows, fields) {
    console.log(co);
    res.redirect('/games/cube');
  })
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