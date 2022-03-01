const express = require("express");
const app= express();
const port = 3000;
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

const mainRouter = require("./Router/main");
const accountRouter = require("./Router/account");
const gameRouter = require("./Router/game");

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 
app.use(session({ 
    secret: '123456cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
 
app.use(flash());
app.use(expressValidator());

app.use('/', mainRouter);
app.use('/account', accountRouter);
app.use('/games', gameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
 
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
 
  // render the error page
  res.status(err.status || 500);
  res.render(err);
});
// port must be set to 3000 because incoming http requests are routed from port 80 to port 8080


app.listen(port, "127.0.0.1", () => {
  console.log(`Server running ${port}`);
});

module.exports = app;