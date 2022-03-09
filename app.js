const express = require("express");
const app = express();
const port = 80;
const ejs = require("ejs");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressValidator = require('express-validator');
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const connection = require("./model/db");
const helmet = require("helmet");
const secret = '123456cat';

app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
//app.use(helmet.noSniff());
//app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());


const mainRouter = require("./Router/main");
const accountRouter = require("./Router/account");
const gameRouter = require("./Router/games");

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 20 }
}))

app.use(flash());
app.use(expressValidator());

app.use('/', mainRouter);
app.use('/account', accountRouter);
app.use('/games', gameRouter);

// catch 404
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // 로컬에서만 에러
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 에러 보여줌
  res.status(err.status || 500);
  res.render(err);
});


app.listen(port, "127.0.0.1", () => {
  console.log(`Server running ${port}`);
});
app.use(helmet());

module.exports = app;