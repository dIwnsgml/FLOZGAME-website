var express = require('express');
var router = express.Router();
var connection = require('../model/db');
const crypto = require("crypto");
const util = require("util");
const { response } = require('express');
const { name } = require('ejs');

function hashTest(password) {
  var salt = crypto.randomBytes(32).toString('hex')
  return [salt, crypto.pbkdf2Sync(password, salt, 99097, 32, 'sha512').toString('hex')]
}

router.get('/login', function (req, res, next) {
  if (req.session.loggedin) {
    res.render('login', {
      title: 'Login',
      email: '',
      password: '',
      path: '/account/logout',
      button: 'LOGOUT',
      list: "LOGOUT",
    })
  } else {
    res.render('login', {
      title: 'Login',
      email: '',
      password: '',
      path: '/account/login',
      button: 'SIGN IN',
      list: "",
    })
  }
})

router.post('/authentication', function (req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  console.log(name, [name])
  connection.query('SELECT * FROM users WHERE name = ?', name, function (err, rows, fields) {
    if (typeof rows[0] == 'undefined') {
      res.write("<script>alert('No such user')</script>");
      res.write("<script>window.location=\"/account/login\"</script>");
    } else {
      if (crypto.pbkdf2Sync(password, rows[0].salt, 99097, 32, 'sha512').toString('hex') == rows[0].password) {
        res.cookie("names", req.body.name, {
          maxAge: 1000 * 60 * 10,
          secure: true,
          httpOnly: true,
          signed: true,
          authorized: true,
          httpOnly: true,
        });
        req.session.userId = name;
        req.session.loggedin = true;
        req.session.save(() => {
          console.log(req.session.loggedin, req.sessionID, req.session, req.session.userId)
          res.redirect('/');
        });
      }
      else {
        res.write("<script>alert('No such user')</script>");
        res.write("<script>window.location=\"/account/login\"</script>");
      }
    }
  })
})

router.get('/register', function (req, res) {
  if (req.session.loggedin) {
    res.render('register', {
      title: 'Registration Page',
      name: '',
      email: '',
      password: '',
      button: "SIGN IN",
      path: "/account/login",
      list: "",
    })
  } else {
    res.render('register', {
      title: 'Registration Page',
      name: '',
      email: '',
      password: '',
      button: "SIGN IN",
      path: "/account/login",
      list: "",
    })
  }
})


router.post('/post-register', function (req, res, next) {
  req.assert('name', 'Name is required').notEmpty()           //Validate name
  req.assert('password', 'Password is required').notEmpty()   //Validate password
  req.assert('email', 'A valid email is required').isEmail()  //Validate email
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  var errors = req.validationErrors();
  var a = hashTest(password);
  console.log(a, a[0], a[1]);
  var filtering = function (word) {
    return name.indexOf(word)
  }

  if (!errors) {   //No errors were found.  Passed Validation!
    if ((filtering('fuck') + filtering(':') + filtering('병신') + filtering('장애') + filtering('좆') + filtering('mom') + filtering('느금') + filtering('애미') + filtering('애비') + filtering(';') + filtering('}') + filtering('{') + filtering(',')) != -13) {
      console.log("o");
      res.write("<script>alert('Invalid word detected.')</script>");
      res.write("<script>window.location=\"/account/register\"</script>");
    } else {
      connection.query("SELECT * FROM users WHERE email = ?", email, function (err, rows, field) {
        if (typeof rows[0] == 'undefined') {
          connection.query("SELECT * FROM users WHERE name = ?", name, function (err, rows, field) {
            if (typeof rows[0] == 'undefined') {
              console.log("new");
              var user = {
                name: req.sanitize('name').escape().trim(),
                email: req.sanitize('email').escape().trim(),
                password: a[1],
                salt: a[0],

                //req.sanitize('password').escape().trim(),
              }

              console.log(hashTest(password));
              console.log("passwd");
              connection.query('INSERT INTO users SET ?', user);
              if (err) {
                // render to views/user/add.ejs
                res.render('register', {
                  title: 'Registration Page',
                  name: '',
                  password: '',
                  email: ''
                });
                res.write("<script>alert('error')</script>");
                res.write("<script>window.location=\"/account/register\"</script>");
              } else {
                res.write("<script>alert('success')</script>");
                res.write("<script>window.location=\"/account/login\"</script>");
              }
            } else {
              console.log("not new");
              res.write("<script>alert('already exist')</script>");
              res.write("<script>window.location=\"/account/register\"</script>");
              /* res.redirect("/account/register");
              req.flash('error', 'already exist'); */
            }
          })
        } else {
          console.log("not new");
          res.write("<script>alert('already exist')</script>");
          res.write("<script>window.location=\"/account/register\"</script>");
          /* res.redirect("/account/register");
          req.flash('error', 'already exist'); */
        }
      });
      console.log(email);
    }
  }
  else {
    var error_msg = ''
    errors.forEach(function (error) {
      error_msg += error.msg + '<br>'
    })
    res.render('register', {
      title: 'Registration Page',
      name: req.body.name,
      email: req.body.email,
      password: '',
      button: "SIGN IN",
      name: req.session.name,
      path: "/account/login"
    })
  }
})

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.cookie('names', '', { maxAge: 0 });
  res.redirect('/');
});

module.exports = router;