const express = require("express");
const app = express();
var Router = express.Router();

Router.get('/games', (req, res) => {
  res.render('index')
});

Router.get('/games/cube', (req,res) => {
  res.render("/game/cube/cube-info");
})


module.exports = Router;