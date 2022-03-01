const express = require("express");
const app = express();
const mRouter = express.Router();

mRouter.get('/', (req, res) => {
  res.render("index");
});

module.exports = mRouter;