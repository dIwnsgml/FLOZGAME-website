var express = require('express');
var router = express.Router();
var connection = require('../model/db');
const crypto = require("crypto");
const util = require("util");
const { response } = require('express');

/* const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);

const createSalt = function(){
  const buf = randomBytesPromise(64);

  return buf.toString("base64");
}; */

/* const createHashedPassword = function(password){
  const salt = createSalt();
  const key = pbkdf2Promise(password, salt, 984316, 64, "sha512");
  const hashedPassword = key.toString("base64");

  return hashedPassword;
}; */

//console.log(createSalt());


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
    password: ''
  })
})
//authenticate user
router.post('/authentication', function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var b = hashTest(password);
  connection.query('SELECT * FROM users WHERE email = ?', [email], function (err, rows, fields, salt, results) {
    //if(err) throw err
    // if user not found
    console.log(rows[0].salt, crypto.pbkdf2Sync(password, rows[0].salt, 99097, 32, 'sha512').toString('hex'), rows[0].password);

    if (crypto.pbkdf2Sync(password, rows[0].salt, 99097, 32, 'sha512').toString('hex') == rows[0].password) {

      // if user found
      // render to views/user/edit.ejs template file
      req.session.loggedin = true;
      var name = req.session.name;
      res.redirect('/');
    }
    else {
      req.flash('error', 'Please correct enter email and Password!')
      res.redirect('/account/login')
    }
  })
})
//display login page
router.get('/register', function (req, res, next) {
  // render to views/user/add.ejs
  res.render('register', {
    title: 'Registration Page',
    name: '',
    email: '',
    password: ''
  })
})
// user registration
router.post('/post-register', function (req, res, next) {
  req.assert('name', 'Name is required').notEmpty()           //Validate name
  req.assert('password', 'Password is required').notEmpty()   //Validate password
  req.assert('email', 'A valid email is required').isEmail()  //Validate email
  var email = req.body.email;
  var password = req.body.password;
  var errors = req.validationErrors();
  var a = hashTest(password);
  console.log(a, a[0], a[1]);
  if (!errors) {   //No errors were found.  Passed Validation!
    connection.query("SELECT * FROM users WHERE email = ?", email, function (err, result, field) {
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
            })
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
    });
    console.log(email);
  }
  else {   //Display errors to user
    var error_msg = ''
    errors.forEach(function (error) {
      error_msg += error.msg + '<br>'
    })
    req.flash('error', error_msg)
    /**
    * Using req.body.name 
    * because req.param('name') is deprecated
    */
    res.render('register', {
      title: 'Registration Page',
      name: req.body.name,
      email: req.body.email,
      password: ''
    })
  }
})
//display home page
router.get('/home', function (req, res, next) {
  if (req.session.loggedin) {
    res.render('home', {
      title: "Dashboard",
      name: req.session.name,
    });
  } else {
    req.flash('success', 'Please login first!');
    res.redirect('/account/login');
  }
});
// Logout user
router.get('/logout', function (req, res) {
  req.session.destroy();
  //req.flash('success', 'Login Again Here');
  res.redirect('/');
});

module.exports = router;