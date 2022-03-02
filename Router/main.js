const express = require("express");
const app = express();
var Router = express.Router();

/* Router.get('/', (req, res) => {
  res.render("index");
}); */

Router.get('/', function(req, res, next) {
  if (req.session.loggedin) {
  res.render('index', {
  button:"Logout",
  name: req.session.name,
  path:"login"     
  });
  } else {
    res.render('index', {
      button:"Login",
      name: req.session.name, 
      path:"logout"    
      });
  }
  });

Router.get('/community', function(req, res, next) {
  if (req.session.loggedin) {
  res.render('community/main');
  } else {
  res.write("<script>alert('Login First')</script>");
  res.write("<script>window.location=\"/account/login\"</script>");
  }
});

module.exports = Router;