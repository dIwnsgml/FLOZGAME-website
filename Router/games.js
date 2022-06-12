const express = require("express");
const conn = require("../model/db");
const app = express();
const Router = express.Router();

var count = 0;
var score = 0;

Router.get('/cube', (req, res) => {
  conn.query('SELECT * FROM comments', function (err, rows, fields) {
    if(typeof rows != 'undefined'){
      for (var i = 0; typeof rows[i] != 'undefined'; i++) {
        count++;
        score += rows[i].rate;
      }
    }
    console.log(count)
    if (req.session.loggedin) {
      res.render('games/cube', {
        path: '/account/logout',
        button: 'LOGOUT',
        comment: '',
        ong: { rows },
        n: count,
        avg_score: Math.round(score / count * 100) / 100,
        list: "LOGOUT",
      });
    } else {
      res.render('games/cube', {
        path: '/account/login',
        button: 'SIGN IN',
        comment: 'Login to leave a comment',
        ong: { rows },
        n: count,
        avg_score: Math.round(score / count * 100) / 100,
        list: "",
      });
      console.log()
    }
  })
  count = 0;
  score = 0;
})
Router.post('/cube/comment', (req, res) => {
  let today = new Date();
  var co = {
    name: req.cookies['names'],
    comment: req.body.comment,
    time: today.toLocaleDateString('en-US'),
    rate: req.body.rate,
    type: "cube",
  }
  console.log(co.comment)

  var filtering = function (word) {
    return co.comment.indexOf(word)
  }
  //console.log(filter.indexOf('씨'), filter.indexOf('병신'), filter.indexOf('장애'), filter.indexOf('좆'), filtering('fuck'))
  var name = req.session.userId;
  console.log(co);
  //console.log(req.cookies['names'], req.body.comment, req.body.rate, today.toLocaleDateString('en-US'));
  if ((filtering('fuck') + filtering('씨') + filtering('병신') + filtering('장애') + filtering('좆') + filtering('mom') + filtering('느금') + filtering('애미') + filtering('애비')) != -9) {
    console.log("o");
    res.write("<script>alert('Invalid word detected.')</script>");
    res.write("<script>window.location=\"/games/cube\"</script>");
  }
  conn.query('SELECT * FROM comments where name = ?', name, function (err, rows, fields) {
    console.log("ong")
    if (typeof rows[0] == 'undefined') {
      conn.query('INSERT INTO comments SET ?', co, function (err, rows, fields) {
        console.log(co);
        res.redirect('/games/cube');
      })
    } else {
      res.write("<script>alert('you have comment already')</script>");
      res.write("<script>window.location=\"/games/cube\"</script>");
    }
  })
});

Router.get("/makeyourgame", (req, res) => {
  if (req.session.loggedin) {
    res.render('games/yourgame', {
      path: '/games/logout',
      button: 'LOGOUT',
      list: "LOGOUT",
    });
  } else {
    res.render('games/yourgame', {
      path: '/account/login',
      button: 'SIGN IN',
      list: "",
    });
  }
})
module.exports = Router;