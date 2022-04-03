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

// 암호화

//console.log(createHashedPassword('as'));

router.get('/', function (req, res, next) {
  //res.write("<script>window.location=\"../login\"</script>");
  res.render("login");
})
//display login page
router.get('/login', function (req, res, next) {
  // render to views/user/add.ejs
  res.render('login', {
    title: 'Login',
    email: '',
    password: '',
    path: '/account/login',
    button: 'Login',
  })
})
//authenticate user
router.post('/authentication', function (req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  console.log(name, [name])
  connection.query('SELECT * FROM users WHERE name = ?', name, function (err, rows, fields) {
    //console.log(rows)
    //if(err) throw err
    // if user not found
    //console.log(rows[0].salt, crypto.pbkdf2Sync(password, rows[0].salt, 99097, 32, 'sha512').toString('hex'), rows[0].password);
    if (rows.length <= 0) {
      res.write("<script>alert('No such user')</script>");
      res.write("<script>window.location=\"/account/login\"</script>");
    } else {
      if (crypto.pbkdf2Sync(password, rows[0].salt, 99097, 32, 'sha512').toString('hex') == rows[0].password) {
        res.cookie("names", req.body.name);
        req.session.loggedin = true;
        res.redirect('/');
      }
      else {
        //req.flash('error', 'Please correct enter email and Password!')
        res.write("<script>alert('No such user')</script>");
        res.write("<script>window.location=\"/account/login\"</script>");
      }
    }
  })
})
router.get('/register', function (req, res, next) {
  res.render('register', {
    title: 'Registration Page',
    name: '',
    email: '',
    password: '',
    button: "Login",
    path: "/account/login"
  })
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
    if ((filtering('fuck') + filtering('씨') + filtering('병신') + filtering('장애') + filtering('좆') + filtering('mom') + filtering('느금') + filtering('애미') + filtering('애비')) != -9) {
      console.log("o");
      res.write("<script>alert('Invalid word detected.')</script>");
      res.write("<script>window.location=\"/account/register\"</script>");
    } else {
      connection.query("SELECT * FROM users WHERE email = ?", email, function (err, result, field) {
        if (result.length == 0) {
          connection.query("SELECT * FROM users WHERE name = ?", name, function (err, result, field) {
            if (result.length == 0) {
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
              connection.query('INSERT INTO users SET ?', user, function (err, result) {
                //if(err) throw err
                if (err) {
                  req.flash('error', err)
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
                  req.flash('success', 'You have successfully signup!');
                  res.write("<script>alert('success')</script>");
                  res.write("<script>window.location=\"/account/login\"</script>");
                }
              })
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
    req.flash('error', error_msg)
    res.render('register', {
      title: 'Registration Page',
      name: req.body.name,
      email: req.body.email,
      password: '',
      button: "Login",
      name: req.session.name,
      path: "/account/login"
    })
  }
})

router.get('/logout', function (req, res) {
  req.session.destroy();
  //req.flash('success', 'Login Again Here');
  res.redirect('/');
});

module.exports = router;