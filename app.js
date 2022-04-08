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
const http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);



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
const supportRouter = require("./Router/support");
const adminRouter = require("./Router/admin");

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('socketio', io);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 10 }
}))

app.use(flash());
app.use(expressValidator());

app.use('/', mainRouter);
app.use('/account', accountRouter);
app.use('/games', gameRouter);
app.use('/support', supportRouter);
app.use('/admin', adminRouter);

/* io.on('connection', (socket) => {
  //var room = req.session.name;
  socket.on('discconect', () => {
    console.log("disconnected");
  })
  socket.emit('usercount', io.engine.clientsCount);
  // on 함수로 이벤트를 정의해 신호를 수신할 수 있다.
  socket.on('message', (msg) => {
    var room = msg.room;
      io.emit('message', msg);
      console.log(msg);
      console.log(room);
  });

  socket.on('join', (requsetData) => {
    socket.join(room)
  })
}); */

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

//172.31.13.110
server.listen(port, "127.0.0.1", () => {
  console.log(`Server running ${port}`);
});

module.exports = app;