const express = require("express");
const app = express();
var Router = express.Router();

Router.get('/', (req, res) => {
  res.render("index");
});

Router.get('/community', function(req, res, next) {
  if (req.session.loggedin) {
  res.render('/community/main', {
  name: req.session.name,     
  });
  } else {
  res.write("<script>alert('Login First')</script>");
  res.write("<script>window.location=\"/account/login\"</script>");
  }
});

module.exports = Router;